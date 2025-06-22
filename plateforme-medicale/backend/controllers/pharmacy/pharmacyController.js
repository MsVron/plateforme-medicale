const db = require('../../config/db');
const { searchPatients } = require('../../utils/patientSearch');

// Search patients for pharmacy (using shared search utility)
exports.searchPatients = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { prenom, nom, cne } = req.query;

    const result = await searchPatients({
      prenom,
      nom,
      cne,
      userId: req.user.id,
      institutionId: pharmacyId,
      institutionType: 'pharmacy'
    });

    // Get patient allergies for each patient (important for pharmacy)
    for (let patient of result.patients) {
      const [allergies] = await db.execute(`
        SELECT a.nom, pa.severite
        FROM patient_allergies pa
        JOIN allergies a ON pa.allergie_id = a.id
        WHERE pa.patient_id = ?
      `, [patient.id]);
      patient.allergies = allergies;
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la recherche de patients:', error);
    return res.status(500).json({ 
      message: error.message
    });
  }
};

// Get patient prescriptions for pharmacy
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Verify patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom, CNE FROM patients WHERE id = ?', 
      [patientId]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get patient prescriptions with simplified dispensing status
    const [prescriptions] = await db.execute(`
      SELECT 
        t.id as prescription_id,
        t.date_prescription,
        t.posologie,
        t.date_debut,
        t.date_fin,
        t.est_permanent,
        t.instructions,
        t.status as prescription_status,
        CONCAT(m.prenom, ' ', m.nom) as medecin_nom,
        s.nom as medecin_specialite,
        med.id as medicament_id,
        med.nom_commercial as medicament_nom,
        med.forme as medicament_forme,
        med.dosage as medicament_dosage,
        med.nom_molecule,
        -- Simplified dispensing status
        CASE 
          WHEN pd.id IS NULL THEN 'not_dispensed'
          WHEN t.est_permanent = 1 AND pd.last_purchase_date IS NOT NULL THEN 'ongoing_permanent'
          WHEN pd.is_fulfilled = 1 THEN 'completed'
          ELSE 'in_progress'
        END as dispensing_status,
        pd.last_purchase_date,
        pd.dispensing_date as last_dispensing_date,
        pd.dispensing_notes,
        pd.is_fulfilled,
        pd.is_permanent_medication
      FROM traitements t
      JOIN medicaments med ON t.medicament_id = med.id
      JOIN medecins m ON t.medecin_prescripteur_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN prescription_dispensing pd ON t.id = pd.prescription_id
      WHERE t.patient_id = ? AND t.status IN ('prescribed', 'partially_dispensed', 'fully_dispensed')
      ORDER BY t.date_prescription DESC, med.nom_commercial
    `, [patientId]);

    // Get medication history across all pharmacies
    const [medicationHistory] = await db.execute(`
      SELECT 
        pd.id,
        pd.dispensing_date,
        pd.dispensing_notes,
        pd.is_fulfilled,
        pd.is_permanent_medication,
        pd.last_purchase_date,
        i.nom as pharmacy_name,
        med.nom_commercial as medicament_nom,
        CONCAT(u.prenom, ' ', u.nom) as dispensed_by
      FROM prescription_dispensing pd
      JOIN institutions i ON pd.pharmacy_id = i.id
      JOIN medicaments med ON pd.medicament_id = med.id
      JOIN utilisateurs u ON pd.dispensed_by_user_id = u.id
      WHERE pd.patient_id = ?
      ORDER BY pd.dispensing_date DESC
      LIMIT 50
    `, [patientId]);

    return res.status(200).json({ 
      patient: patients[0],
      prescriptions,
      medicationHistory
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des prescriptions:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Dispense medication - simplified version without inventory
exports.dispenseMedication = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { prescriptionId } = req.params;
    const { notes, unit_price, total_price, patient_copay } = req.body;

    // Get prescription details
    const [prescriptions] = await db.execute(`
      SELECT 
        t.*,
        med.nom_commercial as medicament_nom,
        p.prenom as patient_prenom,
        p.nom as patient_nom
      FROM traitements t
      JOIN medicaments med ON t.medicament_id = med.id
      JOIN patients p ON t.patient_id = p.id
      WHERE t.id = ? AND t.status IN ('prescribed', 'partially_dispensed')
    `, [prescriptionId]);

    if (prescriptions.length === 0) {
      return res.status(404).json({ 
        message: 'Prescription non trouvée ou déjà complètement dispensée' 
      });
    }

    const prescription = prescriptions[0];
    
    // Check if already dispensed by this pharmacy
    const [existingDispensing] = await db.execute(`
      SELECT id, is_fulfilled, last_purchase_date 
      FROM prescription_dispensing 
      WHERE prescription_id = ? AND pharmacy_id = ?
    `, [prescriptionId, pharmacyId]);

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      let dispensingResult;

      if (existingDispensing.length > 0) {
        // Update existing dispensing record
        if (prescription.est_permanent) {
          // For permanent medication, update last purchase date
          await conn.execute(`
            UPDATE prescription_dispensing 
            SET last_purchase_date = NOW(),
                dispensing_notes = ?,
                unit_price = ?,
                total_price = ?,
                patient_copay = ?
            WHERE id = ?
          `, [notes, unit_price, total_price, patient_copay, existingDispensing[0].id]);
          
          dispensingResult = { insertId: existingDispensing[0].id };
        } else {
          // For one-time medication, mark as fulfilled if not already
          if (!existingDispensing[0].is_fulfilled) {
            await conn.execute(`
              UPDATE prescription_dispensing 
              SET is_fulfilled = TRUE,
                  dispensing_date = NOW(),
                  dispensing_notes = ?,
                  unit_price = ?,
                  total_price = ?,
                  patient_copay = ?
              WHERE id = ?
            `, [notes, unit_price, total_price, patient_copay, existingDispensing[0].id]);
            
            // Update prescription status to fully dispensed
            await conn.execute(`
              UPDATE traitements 
              SET status = 'fully_dispensed' 
              WHERE id = ?
            `, [prescriptionId]);
          }
          dispensingResult = { insertId: existingDispensing[0].id };
        }
      } else {
        // Create new dispensing record
        const [result] = await conn.execute(`
          INSERT INTO prescription_dispensing (
            prescription_id, patient_id, pharmacy_id, dispensed_by_user_id, medicament_id,
            dispensing_date, dispensing_notes, is_permanent_medication, 
            last_purchase_date, is_fulfilled, unit_price, total_price, patient_copay
          ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)
        `, [
          prescriptionId, 
          prescription.patient_id, 
          pharmacyId, 
          req.user.id, 
          prescription.medicament_id,
          notes,
          prescription.est_permanent,
          prescription.est_permanent ? new Date() : null, // Set last_purchase_date for permanent meds
          !prescription.est_permanent, // Set is_fulfilled for one-time meds
          unit_price,
          total_price,
          patient_copay
        ]);

        dispensingResult = result;

        // Update prescription status
        const newStatus = prescription.est_permanent ? 'partially_dispensed' : 'fully_dispensed';
        await conn.execute(`
          UPDATE traitements 
          SET status = ? 
          WHERE id = ?
        `, [newStatus, prescriptionId]);
      }

      // Log the dispensing action
      await conn.execute(`
        INSERT INTO historique_actions (
          utilisateur_id, action_type, table_concernee, 
          enregistrement_id, description
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        req.user.id, 
        'MEDICATION_DISPENSED', 
        'prescription_dispensing', 
        dispensingResult.insertId, 
        `Dispensation de ${prescription.medicament_nom} pour ${prescription.patient_prenom} ${prescription.patient_nom}`
      ]);

      // Commit transaction
      await conn.commit();

      const responseMessage = prescription.est_permanent 
        ? 'Médicament permanent dispensé - Date d\'achat mise à jour'
        : 'Médicament dispensé et marqué comme terminé';

      return res.status(201).json({ 
        message: responseMessage,
        dispensingId: dispensingResult.insertId,
        isPermanent: prescription.est_permanent,
        isCompleted: !prescription.est_permanent
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erreur lors de la dispensation:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Get pharmacy medication view for a patient
exports.getPharmacyPatientMedications = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { patientId } = req.params;

    const [medications] = await db.execute(`
      SELECT * FROM pharmacy_patient_medications 
      WHERE patient_id = ?
      ORDER BY prescription_date DESC
    `, [patientId]);

    return res.status(200).json({ medications });
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Check medication interactions
exports.checkMedicationInteractions = async (req, res) => {
  try {
    const { medicament_ids } = req.body;

    if (!medicament_ids || !Array.isArray(medicament_ids) || medicament_ids.length < 2) {
      return res.status(400).json({ 
        message: 'Au moins 2 médicaments requis pour vérifier les interactions' 
      });
    }

    // Get all possible interactions between the medications
    const placeholders = medicament_ids.map(() => '?').join(',');
    const [interactions] = await db.execute(`
      SELECT 
        mi.*,
        m1.nom_commercial as medicament_1_nom,
        m2.nom_commercial as medicament_2_nom
      FROM medication_interactions mi
      JOIN medicaments m1 ON mi.medicament_1_id = m1.id
      JOIN medicaments m2 ON mi.medicament_2_id = m2.id
      WHERE mi.is_active = TRUE
        AND ((mi.medicament_1_id IN (${placeholders}) AND mi.medicament_2_id IN (${placeholders}))
             OR (mi.medicament_2_id IN (${placeholders}) AND mi.medicament_1_id IN (${placeholders})))
        AND mi.medicament_1_id != mi.medicament_2_id
    `, [...medicament_ids, ...medicament_ids]);

    return res.status(200).json({ 
      interactions,
      hasInteractions: interactions.length > 0
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des interactions:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};



// Check medication interactions
exports.checkMedicationInteractions = async (req, res) => {
  try {
    const { medicament_ids } = req.body;

    if (!medicament_ids || !Array.isArray(medicament_ids) || medicament_ids.length < 2) {
      return res.status(400).json({ 
        message: 'Au moins 2 médicaments requis pour vérifier les interactions' 
      });
    }

    // Get all possible interactions between the medications
    const placeholders = medicament_ids.map(() => '?').join(',');
    const [interactions] = await db.execute(`
      SELECT 
        mi.*,
        m1.nom as medicament_1_nom,
        m2.nom as medicament_2_nom
      FROM medication_interactions mi
      JOIN medicaments m1 ON mi.medicament_1_id = m1.id
      JOIN medicaments m2 ON mi.medicament_2_id = m2.id
      WHERE mi.is_active = TRUE
        AND ((mi.medicament_1_id IN (${placeholders}) AND mi.medicament_2_id IN (${placeholders}))
             OR (mi.medicament_2_id IN (${placeholders}) AND mi.medicament_1_id IN (${placeholders})))
        AND mi.medicament_1_id != mi.medicament_2_id
    `, [...medicament_ids, ...medicament_ids]);

    return res.status(200).json({ 
      interactions,
      hasInteractions: interactions.length > 0
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des interactions:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
}; 
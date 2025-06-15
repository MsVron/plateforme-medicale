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
      'SELECT id, prenom, nom FROM patients WHERE id = ?', 
      [patientId]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get patient prescriptions with medication details
    const [prescriptions] = await db.execute(`
      SELECT 
        t.id as prescription_id,
        t.date_prescription,
        t.duree_traitement,
        t.instructions_speciales,
        t.statut,
        CONCAT(m.prenom, ' ', m.nom) as medecin_nom,
        s.nom as medecin_specialite,
        tm.medicament_id,
        med.nom as medicament_nom,
        med.forme as medicament_forme,
        med.dosage as medicament_dosage,
        tm.posologie,
        tm.quantite,
        tm.duree_jours,
        tm.instructions,
        COALESCE(SUM(md.quantity_dispensed), 0) as total_dispensed,
        tm.quantite - COALESCE(SUM(md.quantity_dispensed), 0) as remaining_quantity,
        CASE 
          WHEN tm.quantite <= COALESCE(SUM(md.quantity_dispensed), 0) THEN 'completed'
          WHEN COALESCE(SUM(md.quantity_dispensed), 0) > 0 THEN 'partial'
          ELSE 'pending'
        END as dispensing_status
      FROM traitements t
      JOIN traitement_medicaments tm ON t.id = tm.traitement_id
      JOIN medicaments med ON tm.medicament_id = med.id
      JOIN medecins m ON t.medecin_id = m.id
      JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN medication_dispensing md ON tm.id = md.prescription_medication_id
      WHERE t.patient_id = ? AND t.statut = 'actif'
      GROUP BY t.id, tm.id
      ORDER BY t.date_prescription DESC, med.nom
    `, [patientId]);

    // Get medication history across all pharmacies
    const [medicationHistory] = await db.execute(`
      SELECT 
        md.id,
        md.quantity_dispensed,
        md.dispensing_date,
        md.notes,
        i.nom as pharmacy_name,
        med.nom as medicament_nom,
        CONCAT(u.prenom, ' ', u.nom) as dispensed_by
      FROM medication_dispensing md
      JOIN institutions i ON md.pharmacy_id = i.id
      JOIN medicaments med ON md.medicament_id = med.id
      JOIN utilisateurs u ON md.dispensed_by_user_id = u.id
      WHERE md.patient_id = ?
      ORDER BY md.dispensing_date DESC
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

// Dispense medication
exports.dispenseMedication = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { prescriptionMedicationId } = req.params;
    const { quantity_dispensed, notes } = req.body;

    // Validate required fields
    if (!quantity_dispensed || quantity_dispensed <= 0) {
      return res.status(400).json({ 
        message: 'Quantité dispensée requise et doit être positive' 
      });
    }

    // Get prescription medication details
    const [prescriptionMeds] = await db.execute(`
      SELECT 
        tm.*,
        t.patient_id,
        med.nom as medicament_nom,
        COALESCE(SUM(md.quantity_dispensed), 0) as already_dispensed
      FROM traitement_medicaments tm
      JOIN traitements t ON tm.traitement_id = t.id
      JOIN medicaments med ON tm.medicament_id = med.id
      LEFT JOIN medication_dispensing md ON tm.id = md.prescription_medication_id
      WHERE tm.id = ? AND t.statut = 'actif'
      GROUP BY tm.id
    `, [prescriptionMedicationId]);

    if (prescriptionMeds.length === 0) {
      return res.status(404).json({ 
        message: 'Prescription non trouvée ou inactive' 
      });
    }

    const prescriptionMed = prescriptionMeds[0];
    const remainingQuantity = prescriptionMed.quantite - prescriptionMed.already_dispensed;

    // Validate quantity doesn't exceed remaining
    if (quantity_dispensed > remainingQuantity) {
      return res.status(400).json({ 
        message: `Quantité demandée (${quantity_dispensed}) dépasse la quantité restante (${remainingQuantity})` 
      });
    }

    // Check pharmacy inventory
    const [inventory] = await db.execute(`
      SELECT quantity_in_stock 
      FROM pharmacy_inventory 
      WHERE pharmacy_id = ? AND medicament_id = ? AND quantity_in_stock >= ?
    `, [pharmacyId, prescriptionMed.medicament_id, quantity_dispensed]);

    if (inventory.length === 0) {
      return res.status(400).json({ 
        message: 'Stock insuffisant en pharmacie' 
      });
    }

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Record medication dispensing
      const [result] = await conn.execute(`
        INSERT INTO medication_dispensing (
          patient_id, prescription_medication_id, medicament_id, pharmacy_id,
          quantity_dispensed, dispensing_date, dispensed_by_user_id, notes
        ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
      `, [
        prescriptionMed.patient_id, prescriptionMedicationId, prescriptionMed.medicament_id,
        pharmacyId, quantity_dispensed, req.user.id, notes
      ]);

      // Update pharmacy inventory
      await conn.execute(`
        UPDATE pharmacy_inventory 
        SET quantity_in_stock = quantity_in_stock - ?,
            last_updated = NOW()
        WHERE pharmacy_id = ? AND medicament_id = ?
      `, [quantity_dispensed, pharmacyId, prescriptionMed.medicament_id]);

      // Log the dispensing
      await conn.execute(`
        INSERT INTO historique_actions (
          utilisateur_id, action_type, table_concernee, 
          enregistrement_id, description
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        req.user.id, 
        'MEDICATION_DISPENSED', 
        'medication_dispensing', 
        result.insertId, 
        `Dispensation de ${prescriptionMed.medicament_nom} (${quantity_dispensed})`
      ]);

      // Commit transaction
      await conn.commit();

      return res.status(201).json({ 
        message: 'Médicament dispensé avec succès',
        dispensingId: result.insertId,
        remainingQuantity: remainingQuantity - quantity_dispensed
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

// Dispense medication
exports.dispenseMedication = async (req, res) => {
  try {
    const pharmacyId = req.user.id_specifique_role;
    const { prescriptionMedicationId } = req.params;
    const { quantity_dispensed, notes } = req.body;

    // Validate required fields
    if (!quantity_dispensed || quantity_dispensed <= 0) {
      return res.status(400).json({ 
        message: 'Quantité dispensée requise et doit être positive' 
      });
    }

    // Get prescription medication details
    const [prescriptionMeds] = await db.execute(`
      SELECT 
        tm.*,
        t.patient_id,
        med.nom as medicament_nom,
        COALESCE(SUM(md.quantity_dispensed), 0) as already_dispensed
      FROM traitement_medicaments tm
      JOIN traitements t ON tm.traitement_id = t.id
      JOIN medicaments med ON tm.medicament_id = med.id
      LEFT JOIN medication_dispensing md ON tm.id = md.prescription_medication_id
      WHERE tm.id = ? AND t.statut = 'actif'
      GROUP BY tm.id
    `, [prescriptionMedicationId]);

    if (prescriptionMeds.length === 0) {
      return res.status(404).json({ 
        message: 'Prescription non trouvée ou inactive' 
      });
    }

    const prescriptionMed = prescriptionMeds[0];
    const remainingQuantity = prescriptionMed.quantite - prescriptionMed.already_dispensed;

    // Validate quantity doesn't exceed remaining
    if (quantity_dispensed > remainingQuantity) {
      return res.status(400).json({ 
        message: `Quantité demandée (${quantity_dispensed}) dépasse la quantité restante (${remainingQuantity})` 
      });
    }

    // Check pharmacy inventory
    const [inventory] = await db.execute(`
      SELECT quantity_in_stock 
      FROM pharmacy_inventory 
      WHERE pharmacy_id = ? AND medicament_id = ? AND quantity_in_stock >= ?
    `, [pharmacyId, prescriptionMed.medicament_id, quantity_dispensed]);

    if (inventory.length === 0) {
      return res.status(400).json({ 
        message: 'Stock insuffisant en pharmacie' 
      });
    }

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Record medication dispensing
      const [result] = await conn.execute(`
        INSERT INTO medication_dispensing (
          patient_id, prescription_medication_id, medicament_id, pharmacy_id,
          quantity_dispensed, dispensing_date, dispensed_by_user_id, notes
        ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
      `, [
        prescriptionMed.patient_id, prescriptionMedicationId, prescriptionMed.medicament_id,
        pharmacyId, quantity_dispensed, req.user.id, notes
      ]);

      // Update pharmacy inventory
      await conn.execute(`
        UPDATE pharmacy_inventory 
        SET quantity_in_stock = quantity_in_stock - ?,
            last_updated = NOW()
        WHERE pharmacy_id = ? AND medicament_id = ?
      `, [quantity_dispensed, pharmacyId, prescriptionMed.medicament_id]);

      // Log the dispensing
      await conn.execute(`
        INSERT INTO historique_actions (
          utilisateur_id, action_type, table_concernee, 
          enregistrement_id, description
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        req.user.id, 
        'MEDICATION_DISPENSED', 
        'medication_dispensing', 
        result.insertId, 
        `Dispensation de ${prescriptionMed.medicament_nom} (${quantity_dispensed})`
      ]);

      // Commit transaction
      await conn.commit();

      return res.status(201).json({ 
        message: 'Médicament dispensé avec succès',
        dispensingId: result.insertId,
        remainingQuantity: remainingQuantity - quantity_dispensed
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
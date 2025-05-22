const db = require('../../config/db');

// Get patient medical record by ID (for doctors)
exports.getPatientMedicalRecord = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Check if patient exists
    const [patients] = await db.execute('SELECT id, prenom, nom, date_naissance, sexe FROM patients WHERE id = ?', [patientId]);
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get basic patient info
    const patient = patients[0];

    // Get allergies
    const [allergies] = await db.execute(`
      SELECT pa.*, a.nom, a.description
      FROM patient_allergies pa
      JOIN allergies a ON pa.allergie_id = a.id
      WHERE pa.patient_id = ?
    `, [patientId]);

    // Get medical history
    const [antecedents] = await db.execute(`
      SELECT am.*, m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM antecedents_medicaux am
      LEFT JOIN medecins m ON am.medecin_id = m.id
      WHERE am.patient_id = ?
    `, [patientId]);

    // Get current treatments
    const [traitements] = await db.execute(`
      SELECT t.*, m.nom_commercial, m.nom_molecule, m.forme,
             med.prenom as medecin_prenom, med.nom as medecin_nom
      FROM traitements t
      JOIN medicaments m ON t.medicament_id = m.id
      JOIN medecins med ON t.medecin_prescripteur_id = med.id
      WHERE t.patient_id = ? AND (t.est_permanent = 1 OR t.date_fin >= CURDATE())
    `, [patientId]);

    // Get consultations
    const [consultations] = await db.execute(`
      SELECT c.*, m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM consultations c
      JOIN medecins m ON c.medecin_id = m.id
      WHERE c.patient_id = ?
      ORDER BY c.date_consultation DESC
    `, [patientId]);

    // Get vital signs
    const [constantes] = await db.execute(`
      SELECT cv.*
      FROM constantes_vitales cv
      WHERE cv.patient_id = ?
      ORDER BY cv.date_mesure DESC
    `, [patientId]);

    // Get analysis results
    const [analyses] = await db.execute(`
      SELECT r.*, t.nom as type_analyse, 
             mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
             mi.prenom as interpreteur_prenom, mi.nom as interpreteur_nom
      FROM resultats_analyses r
      JOIN types_analyses t ON r.type_analyse_id = t.id
      JOIN medecins mp ON r.medecin_prescripteur_id = mp.id
      LEFT JOIN medecins mi ON r.medecin_interpreteur_id = mi.id
      WHERE r.patient_id = ?
      ORDER BY r.date_realisation DESC
    `, [patientId]);

    // Get imaging results
    const [imageries] = await db.execute(`
      SELECT r.*, t.nom as type_imagerie,
             mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
             mr.prenom as radiologue_prenom, mr.nom as radiologue_nom
      FROM resultats_imagerie r
      JOIN types_imagerie t ON r.type_imagerie_id = t.id
      JOIN medecins mp ON r.medecin_prescripteur_id = mp.id
      LEFT JOIN medecins mr ON r.medecin_radiologue_id = mr.id
      WHERE r.patient_id = ?
      ORDER BY r.date_realisation DESC
    `, [patientId]);

    // Get medical documents
    const [documents] = await db.execute(`
      SELECT d.*, m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM documents_medicaux d
      JOIN medecins m ON d.medecin_id = m.id
      WHERE d.patient_id = ?
      ORDER BY d.date_creation DESC
    `, [patientId]);

    // Get patient notes
    const [notes] = await db.execute(`
      SELECT n.*, m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM notes_patient n
      JOIN medecins m ON n.medecin_id = m.id
      WHERE n.patient_id = ?
      ORDER BY n.date_creation DESC
    `, [patientId]);

    // Get follow-up reminders
    const [reminders] = await db.execute(`
      SELECT r.*
      FROM rappels_suivi r
      WHERE r.patient_id = ? AND r.medecin_id = ?
      ORDER BY r.date_rappel ASC
    `, [patientId, medecinId]);

    // Get patient measurements
    const [measurements] = await db.execute(`
      SELECT m.*
      FROM mesures_patient m
      WHERE m.patient_id = ?
      ORDER BY m.date_mesure DESC
      LIMIT 20
    `, [patientId]);

    return res.status(200).json({
      patient,
      allergies,
      antecedents,
      traitements,
      consultations,
      constantes,
      analyses,
      imageries,
      documents,
      notes,
      reminders,
      measurements
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du dossier médical:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Search for patients (for doctors)
exports.searchPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'La recherche doit contenir au moins 2 caractères' });
    }

    // Search for patients by name, CNE, or email
    const [patients] = await db.execute(`
      SELECT p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, p.email, p.telephone
      FROM patients p
      LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ?
      WHERE (
        p.prenom LIKE ? OR 
        p.nom LIKE ? OR 
        p.CNE LIKE ? OR 
        p.email LIKE ? OR
        CONCAT(p.prenom, ' ', p.nom) LIKE ?
      )
      GROUP BY p.id
    `, [medecinId, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Erreur lors de la recherche de patients:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add a new consultation
exports.addConsultation = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, rendez_vous_id, motif, anamnese, examen_clinique, 
      diagnostic, conclusion, constantes 
    } = req.body;

    // Validate required fields
    if (!patient_id || !motif) {
      return res.status(400).json({ message: 'ID du patient et motif sont obligatoires' });
    }

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert consultation
      const [consultationResult] = await connection.execute(`
        INSERT INTO consultations (
          rendez_vous_id, medecin_id, patient_id, date_consultation, motif, 
          anamnese, examen_clinique, diagnostic, conclusion, est_complete
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
      `, [
        rendez_vous_id || null,
        medecinId,
        patient_id,
        motif,
        anamnese || null,
        examen_clinique || null,
        diagnostic || null,
        conclusion || null,
        anamnese && examen_clinique && diagnostic && conclusion ? true : false
      ]);

      const consultationId = consultationResult.insertId;

      // Add vital signs if provided
      if (constantes) {
        await connection.execute(`
          INSERT INTO constantes_vitales (
            consultation_id, patient_id, date_mesure, temperature, 
            tension_arterielle_systolique, tension_arterielle_diastolique, 
            frequence_cardiaque, saturation_oxygene, frequence_respiratoire, glycemie, notes,
            poids, taille, imc
          ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          consultationId,
          patient_id,
          constantes.temperature || null,
          constantes.tension_arterielle_systolique || null,
          constantes.tension_arterielle_diastolique || null,
          constantes.frequence_cardiaque || null,
          constantes.saturation_oxygene || null,
          constantes.frequence_respiratoire || null,
          constantes.glycemie || null,
          constantes.notes || null,
          constantes.poids || null,
          constantes.taille || null,
          constantes.imc || null
        ]);
      }

      // If linked to an appointment, update its status
      if (rendez_vous_id) {
        await connection.execute(`
          UPDATE rendez_vous SET statut = 'terminé' WHERE id = ?
        `, [rendez_vous_id]);
      }

      await connection.commit();
      return res.status(201).json({ 
        message: 'Consultation ajoutée avec succès', 
        consultationId 
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une consultation:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Update a consultation
exports.updateConsultation = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { consultationId } = req.params;
    const { 
      motif, anamnese, examen_clinique, diagnostic, conclusion, constantes, follow_up_date, is_teleconsultation
    } = req.body;

    // Check if consultation exists and belongs to this doctor
    const [consultations] = await db.execute(`
      SELECT id, medecin_id, patient_id FROM consultations WHERE id = ?
    `, [consultationId]);

    if (consultations.length === 0) {
      return res.status(404).json({ message: 'Consultation non trouvée' });
    }

    const consultation = consultations[0];
    if (consultation.medecin_id !== medecinId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette consultation' });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update consultation
      await connection.execute(`
        UPDATE consultations SET
          motif = ?,
          anamnese = ?,
          examen_clinique = ?,
          diagnostic = ?,
          conclusion = ?,
          est_complete = ?,
          follow_up_date = ?,
          is_teleconsultation = ?,
          date_modification = NOW()
        WHERE id = ?
      `, [
        motif,
        anamnese || null,
        examen_clinique || null,
        diagnostic || null,
        conclusion || null,
        anamnese && examen_clinique && diagnostic && conclusion ? true : false,
        follow_up_date || null,
        is_teleconsultation || false,
        consultationId
      ]);

      // Update or insert vital signs if provided
      if (constantes) {
        const [existingConstantes] = await connection.execute(`
          SELECT id FROM constantes_vitales WHERE consultation_id = ?
        `, [consultationId]);

        if (existingConstantes.length > 0) {
          await connection.execute(`
            UPDATE constantes_vitales SET
              temperature = ?,
              tension_arterielle_systolique = ?,
              tension_arterielle_diastolique = ?,
              frequence_cardiaque = ?,
              saturation_oxygene = ?,
              frequence_respiratoire = ?,
              glycemie = ?,
              notes = ?,
              poids = ?,
              taille = ?,
              imc = ?
            WHERE consultation_id = ?
          `, [
            constantes.temperature || null,
            constantes.tension_arterielle_systolique || null,
            constantes.tension_arterielle_diastolique || null,
            constantes.frequence_cardiaque || null,
            constantes.saturation_oxygene || null,
            constantes.frequence_respiratoire || null,
            constantes.glycemie || null,
            constantes.notes || null,
            constantes.poids || null,
            constantes.taille || null,
            constantes.imc || null,
            consultationId
          ]);
        } else {
          await connection.execute(`
            INSERT INTO constantes_vitales (
              consultation_id, patient_id, date_mesure, temperature, 
              tension_arterielle_systolique, tension_arterielle_diastolique, 
              frequence_cardiaque, saturation_oxygene, frequence_respiratoire, glycemie, notes,
              poids, taille, imc
            ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            consultationId,
            consultation.patient_id,
            constantes.temperature || null,
            constantes.tension_arterielle_systolique || null,
            constantes.tension_arterielle_diastolique || null,
            constantes.frequence_cardiaque || null,
            constantes.saturation_oxygene || null,
            constantes.frequence_respiratoire || null,
            constantes.glycemie || null,
            constantes.notes || null,
            constantes.poids || null,
            constantes.taille || null,
            constantes.imc || null
          ]);
        }
      }

      await connection.commit();
      return res.status(200).json({ message: 'Consultation mise à jour avec succès' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'une consultation:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add medical history
exports.addMedicalHistory = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, type, description, date_debut, date_fin, est_chronique 
    } = req.body;

    // Validate required fields
    if (!patient_id || !type || !description) {
      return res.status(400).json({ message: 'ID du patient, type et description sont obligatoires' });
    }

    // Insert medical history
    const [result] = await db.execute(`
      INSERT INTO antecedents_medicaux (
        patient_id, type, description, date_debut, date_fin, est_chronique, medecin_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      patient_id,
      type,
      description,
      date_debut || null,
      date_fin || null,
      est_chronique || false,
      medecinId
    ]);

    return res.status(201).json({ 
      message: 'Antécédent médical ajouté avec succès', 
      antecedentId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un antécédent médical:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add treatment
exports.addTreatment = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, instructions, rappel_prise, frequence_rappel
    } = req.body;

    // Validate required fields
    if (!patient_id || !medicament_id || !posologie || !date_debut) {
      return res.status(400).json({ message: 'ID du patient, ID du médicament, posologie et date de début sont obligatoires' });
    }

    // Insert treatment
    const [result] = await db.execute(`
      INSERT INTO traitements (
        patient_id, medicament_id, posologie, date_debut, date_fin, 
        est_permanent, medecin_prescripteur_id, instructions, rappel_prise, frequence_rappel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      patient_id,
      medicament_id,
      posologie,
      date_debut,
      date_fin || null,
      est_permanent || false,
      medecinId,
      instructions || null,
      rappel_prise || false,
      frequence_rappel || null
    ]);

    return res.status(201).json({ 
      message: 'Traitement ajouté avec succès', 
      traitementId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un traitement:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add medical document
exports.addMedicalDocument = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, type, titre, description, document_url, est_partage 
    } = req.body;

    // Validate required fields
    if (!patient_id || !type || !titre || !document_url) {
      return res.status(400).json({ message: 'ID du patient, type, titre et URL du document sont obligatoires' });
    }

    // Insert document
    const [result] = await db.execute(`
      INSERT INTO documents_medicaux (
        patient_id, type, titre, description, document_url, medecin_id, est_partage
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      patient_id,
      type,
      titre,
      description || null,
      document_url,
      medecinId,
      est_partage || false
    ]);

    return res.status(201).json({ 
      message: 'Document médical ajouté avec succès', 
      documentId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un document médical:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get medications list (for prescriptions)
exports.getMedications = async (req, res) => {
  try {
    const [medicaments] = await db.execute(`
      SELECT id, nom_commercial, nom_molecule, dosage, forme, description
      FROM medicaments
      ORDER BY nom_commercial
    `);

    return res.status(200).json({ medicaments });
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get allergies list
exports.getAllergies = async (req, res) => {
  try {
    const [allergies] = await db.execute(`
      SELECT id, nom, description
      FROM allergies
      ORDER BY nom
    `);

    return res.status(200).json({ allergies });
  } catch (error) {
    console.error('Erreur lors de la récupération des allergies:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add patient allergy
exports.addPatientAllergy = async (req, res) => {
  try {
    const { 
      patient_id, allergie_id, date_diagnostic, severite, notes 
    } = req.body;

    // Validate required fields
    if (!patient_id || !allergie_id || !severite) {
      return res.status(400).json({ message: 'ID du patient, ID de l\'allergie et sévérité sont obligatoires' });
    }

    // Check if this allergy is already recorded for this patient
    const [existingAllergies] = await db.execute(`
      SELECT patient_id, allergie_id FROM patient_allergies 
      WHERE patient_id = ? AND allergie_id = ?
    `, [patient_id, allergie_id]);

    if (existingAllergies.length > 0) {
      return res.status(400).json({ message: 'Cette allergie est déjà enregistrée pour ce patient' });
    }

    // Insert allergy
    await db.execute(`
      INSERT INTO patient_allergies (
        patient_id, allergie_id, date_diagnostic, severite, notes
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      patient_id,
      allergie_id,
      date_diagnostic || null,
      severite,
      notes || null
    ]);

    return res.status(201).json({ message: 'Allergie ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une allergie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add patient note
exports.addPatientNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, contenu, est_important, categorie 
    } = req.body;

    // Validate required fields
    if (!patient_id || !contenu) {
      return res.status(400).json({ message: 'ID du patient et contenu sont obligatoires' });
    }

    // Insert note
    const [result] = await db.execute(`
      INSERT INTO notes_patient (
        patient_id, medecin_id, contenu, est_important, categorie
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      patient_id,
      medecinId,
      contenu,
      est_important || false,
      categorie || 'general'
    ]);

    return res.status(201).json({ 
      message: 'Note ajoutée avec succès', 
      noteId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une note:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get patient notes
exports.getPatientNotes = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get notes
    const [notes] = await db.execute(`
      SELECT n.*, m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM notes_patient n
      JOIN medecins m ON n.medecin_id = m.id
      WHERE n.patient_id = ?
      ORDER BY n.date_creation DESC
    `, [patientId]);

    return res.status(200).json({ notes });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add follow-up reminder
exports.addFollowUpReminder = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, date_rappel, motif, description 
    } = req.body;

    // Validate required fields
    if (!patient_id || !date_rappel || !motif) {
      return res.status(400).json({ message: 'ID du patient, date de rappel et motif sont obligatoires' });
    }

    // Insert reminder
    const [result] = await db.execute(`
      INSERT INTO rappels_suivi (
        patient_id, medecin_id, date_rappel, motif, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      patient_id,
      medecinId,
      date_rappel,
      motif,
      description || null
    ]);

    return res.status(201).json({ 
      message: 'Rappel de suivi ajouté avec succès', 
      rappelId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un rappel de suivi:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get follow-up reminders
exports.getFollowUpReminders = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Get reminders
    const [reminders] = await db.execute(`
      SELECT r.*
      FROM rappels_suivi r
      WHERE r.patient_id = ? AND r.medecin_id = ?
      ORDER BY r.date_rappel ASC
    `, [patientId, medecinId]);

    return res.status(200).json({ reminders });
  } catch (error) {
    console.error('Erreur lors de la récupération des rappels de suivi:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add patient measurement
exports.addPatientMeasurement = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { 
      patient_id, type_mesure, valeur, unite, date_mesure, notes 
    } = req.body;

    // Validate required fields
    if (!patient_id || !type_mesure || !valeur || !unite) {
      return res.status(400).json({ message: 'ID du patient, type de mesure, valeur et unité sont obligatoires' });
    }

    // Insert measurement
    const [result] = await db.execute(`
      INSERT INTO mesures_patient (
        patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      patient_id,
      medecinId,
      type_mesure,
      valeur,
      unite,
      date_mesure || new Date(),
      notes || null
    ]);

    return res.status(201).json({ 
      message: 'Mesure ajoutée avec succès', 
      mesureId: result.insertId 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une mesure:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get patient measurements
exports.getPatientMeasurements = async (req, res) => {
  try {
    const { patientId, type_mesure } = req.params;

    let query = `
      SELECT m.*
      FROM mesures_patient m
      WHERE m.patient_id = ?
    `;
    
    const params = [patientId];
    
    if (type_mesure) {
      query += ` AND m.type_mesure = ?`;
      params.push(type_mesure);
    }
    
    query += ` ORDER BY m.date_mesure DESC`;

    // Get measurements
    const [measurements] = await db.execute(query, params);

    return res.status(200).json({ measurements });
  } catch (error) {
    console.error('Erreur lors de la récupération des mesures:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 
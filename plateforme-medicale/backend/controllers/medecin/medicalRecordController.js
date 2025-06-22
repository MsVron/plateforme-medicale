/**
 * MEDICAL RECORD CONTROLLER - LAB & ANALYSIS FOCUSED
 * 
 * This controller handles:
 * - Lab analysis requests and workflow
 * - Imaging requests and workflow
 * - Medical consultations
 * - Legacy medical record functionality
 * 
 * For patient dossier management, treatments, and measurements,
 * see medicalDossierController.js
 */

const db = require('../../config/db');
const { searchPatients } = require('../../utils/patientSearch');

// Get patient medical record by ID (for doctors)
exports.getPatientMedicalRecord = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Check if patient exists
    const [patients] = await db.execute(`
      SELECT id, prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, 
             code_postal, pays, groupe_sanguin, taille_cm, poids_kg, est_fumeur,
             consommation_alcool, activite_physique, profession,
             contact_urgence_nom, contact_urgence_telephone, contact_urgence_relation,
             allergies_notes, est_inscrit_par_medecin, date_inscription,
             a_handicap, type_handicap, type_handicap_autre, niveau_handicap,
             description_handicap, besoins_accessibilite, equipements_medicaux, autonomie_niveau
      FROM patients WHERE id = ?`, [patientId]);
    
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
      ORDER BY t.date_prescription DESC
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

// Enhanced search for patients (for doctors) - using shared search utility
exports.searchPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { prenom, nom, cne } = req.query;

    const result = await searchPatients({
      prenom,
      nom,
      cne,
      userId: req.user.id,
      institutionId: medecinId,
      institutionType: 'doctor',
      additionalFields: `,
        CASE 
          WHEN rv.patient_id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END as a_rendez_vous_avec_medecin`,
      additionalJoins: `
        LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ${medecinId}`,
      additionalConditions: `
        GROUP BY p.id`
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la recherche de patients:', error);
    return res.status(500).json({ 
      message: error.message
    });
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

// REMOVED: addMedicalHistory and addTreatment - moved to medicalDossierController for better service layer architecture

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

// REMOVED: getMedications and getAllergies - moved to medicalDossierController for consistency with service layer

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

// REMOVED: addPatientNote - moved to medicalDossierController for service layer consistency

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

// IMPROVED: Get analysis categories
exports.getAnalysisCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT id, nom, description, ordre_affichage
      FROM categories_analyses
      ORDER BY 
        CASE 
          WHEN LOWER(nom) = 'autre' THEN 1 
          ELSE 0 
        END,
        nom ASC
    `);

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories d\'analyses:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// IMPROVED: Get analysis types by category
exports.getAnalysisTypes = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    let query = `
      SELECT 
        ta.id, ta.nom, ta.description, ta.valeurs_normales, ta.unite,
        ta.categorie_id, ta.ordre_affichage,
        ca.nom as categorie_nom
      FROM types_analyses ta
      JOIN categories_analyses ca ON ta.categorie_id = ca.id
    `;
    
    let params = [];
    
    if (categoryId) {
      query += ' WHERE ta.categorie_id = ?';
      params.push(categoryId);
    }
    
    query += ` ORDER BY 
      CASE 
        WHEN LOWER(ca.nom) = 'autre' THEN 1 
        ELSE 0 
      END,
      ca.nom ASC, 
      ta.nom ASC`;
    
    const [types] = await db.execute(query, params);

    return res.status(200).json(types);
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'analyses:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// REQUEST ANALYSIS (Doctors can only request, not add results)
exports.requestAnalysis = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const {
      type_analyse_id,
      priority,
      clinical_indication,
      sample_type,
      special_instructions,
      preferred_laboratory_id
    } = req.body;

    // Validate required fields
    if (!type_analyse_id || !clinical_indication) {
      return res.status(400).json({ 
        message: 'Type d\'analyse et indication clinique sont obligatoires' 
      });
    }

    // Get doctor's institution for the request
    const [doctorInfo] = await db.execute(`
      SELECT institution_id FROM medecins WHERE id = ?
    `, [medecinId]);

    const requestingInstitutionId = doctorInfo.length > 0 ? doctorInfo[0].institution_id : null;

    // Insert analysis request (without results - only the request)
    const [result] = await db.execute(`
      INSERT INTO resultats_analyses (
        patient_id, type_analyse_id, medecin_prescripteur_id, date_prescription,
        request_status, priority, clinical_indication, sample_type,
        requesting_institution_id, laboratory_id
      ) VALUES (?, ?, ?, NOW(), 'requested', ?, ?, ?, ?, ?)
    `, [
      patientId, type_analyse_id, medecinId, 
      priority || 'normal', clinical_indication, sample_type || null,
      requestingInstitutionId, preferred_laboratory_id || null
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'REQUEST_ANALYSIS', 
      'resultats_analyses', 
      result.insertId, 
      `Demande d'analyse pour le patient ID ${patientId}`
    ]);

    return res.status(201).json({ 
      message: 'Demande d\'analyse envoyée avec succès',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la demande d\'analyse:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// UPDATE ANALYSIS REQUEST (Doctors can only modify their requests before lab processes them)
exports.updateAnalysisRequest = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, requestId } = req.params;
    const {
      priority,
      clinical_indication,
      sample_type,
      special_instructions,
      preferred_laboratory_id
    } = req.body;

    // Validate analysis request exists and belongs to this patient and doctor
    const [requests] = await db.execute(`
      SELECT id, medecin_prescripteur_id, request_status
      FROM resultats_analyses
      WHERE id = ? AND patient_id = ? AND medecin_prescripteur_id = ?
    `, [requestId, patientId, medecinId]);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Demande d\'analyse non trouvée' });
    }

    const request = requests[0];
    
    // Only allow modifications if request hasn't been processed yet
    if (request.request_status !== 'requested') {
      return res.status(400).json({ 
        message: 'Cette demande d\'analyse ne peut plus être modifiée car elle est déjà en cours de traitement' 
      });
    }

    // Update analysis request
    await db.execute(`
      UPDATE resultats_analyses SET
        priority = COALESCE(?, priority),
        clinical_indication = COALESCE(?, clinical_indication),
        sample_type = COALESCE(?, sample_type),
        laboratory_id = COALESCE(?, laboratory_id),
        date_status_updated = NOW()
      WHERE id = ?
    `, [
      priority, clinical_indication, sample_type, preferred_laboratory_id, requestId
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'UPDATE_ANALYSIS_REQUEST', 
      'resultats_analyses', 
      requestId, 
      `Modification de la demande d'analyse ID ${requestId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Demande d\'analyse mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification de la demande d\'analyse:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// CANCEL ANALYSIS REQUEST (Doctors can only cancel their own requests if not yet processed)
exports.cancelAnalysisRequest = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, requestId } = req.params;

    // Validate analysis request exists and belongs to this patient and doctor
    const [requests] = await db.execute(`
      SELECT id, medecin_prescripteur_id, request_status
      FROM resultats_analyses
      WHERE id = ? AND patient_id = ? AND medecin_prescripteur_id = ?
    `, [requestId, patientId, medecinId]);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Demande d\'analyse non trouvée' });
    }

    const request = requests[0];
    
    // Only allow cancellation if request hasn't been processed yet
    if (request.request_status !== 'requested') {
      return res.status(400).json({ 
        message: 'Cette demande d\'analyse ne peut plus être annulée car elle est déjà en cours de traitement' 
      });
    }

    // Update request status to cancelled instead of deleting
    await db.execute(`
      UPDATE resultats_analyses 
      SET request_status = 'cancelled', date_status_updated = NOW()
      WHERE id = ?
    `, [requestId]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'CANCEL_ANALYSIS_REQUEST', 
      'resultats_analyses', 
      requestId, 
      `Annulation de la demande d'analyse ID ${requestId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Demande d\'analyse annulée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la demande d\'analyse:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// REQUEST IMAGING (Doctors request imaging studies)
exports.requestImaging = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const {
      type_imagerie_id,
      priority,
      clinical_indication,
      patient_preparation_instructions,
      contrast_required,
      contrast_type,
      special_instructions,
      preferred_laboratory_id
    } = req.body;

    // Validate required fields
    if (!type_imagerie_id || !clinical_indication) {
      return res.status(400).json({ 
        message: 'Type d\'imagerie et indication clinique sont obligatoires' 
      });
    }

    // Get doctor's institution for the request
    const [doctorInfo] = await db.execute(`
      SELECT institution_id FROM medecins WHERE id = ?
    `, [medecinId]);

    const requestingInstitutionId = doctorInfo.length > 0 ? doctorInfo[0].institution_id : null;

    // Insert imaging request
    const [result] = await db.execute(`
      INSERT INTO resultats_imagerie (
        patient_id, type_imagerie_id, medecin_prescripteur_id, date_prescription,
        request_status, priority, clinical_indication, patient_preparation_instructions,
        contrast_required, contrast_type, special_instructions, requesting_institution_id,
        institution_realisation_id
      ) VALUES (?, ?, ?, NOW(), 'requested', ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      patientId, type_imagerie_id, medecinId,
      priority || 'routine', clinical_indication, patient_preparation_instructions || null,
      contrast_required || false, contrast_type || null, special_instructions || null,
      requestingInstitutionId, preferred_laboratory_id || null
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'REQUEST_IMAGING', 
      'resultats_imagerie', 
      result.insertId, 
      `Demande d'imagerie pour le patient ID ${patientId}`
    ]);

    return res.status(201).json({ 
      message: 'Demande d\'imagerie envoyée avec succès',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la demande d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// GET IMAGING TYPES
exports.getImagingTypes = async (req, res) => {
  try {
    const [types] = await db.execute(`
      SELECT id, nom, description
      FROM types_imagerie
      ORDER BY nom ASC
    `);

    return res.status(200).json(types);
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// UPDATE IMAGING REQUEST
exports.updateImagingRequest = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, requestId } = req.params;
    const {
      priority,
      clinical_indication,
      patient_preparation_instructions,
      contrast_required,
      contrast_type,
      special_instructions,
      preferred_laboratory_id
    } = req.body;

    // Validate imaging request exists and belongs to this patient and doctor
    const [requests] = await db.execute(`
      SELECT id, medecin_prescripteur_id, request_status
      FROM resultats_imagerie
      WHERE id = ? AND patient_id = ? AND medecin_prescripteur_id = ?
    `, [requestId, patientId, medecinId]);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Demande d\'imagerie non trouvée' });
    }

    const request = requests[0];
    
    // Only allow modifications if request hasn't been processed yet
    if (request.request_status !== 'requested') {
      return res.status(400).json({ 
        message: 'Cette demande d\'imagerie ne peut plus être modifiée car elle est déjà en cours de traitement' 
      });
    }

    // Update imaging request
    await db.execute(`
      UPDATE resultats_imagerie SET
        priority = COALESCE(?, priority),
        clinical_indication = COALESCE(?, clinical_indication),
        patient_preparation_instructions = COALESCE(?, patient_preparation_instructions),
        contrast_required = COALESCE(?, contrast_required),
        contrast_type = COALESCE(?, contrast_type),
        special_instructions = COALESCE(?, special_instructions),
        institution_realisation_id = COALESCE(?, institution_realisation_id),
        date_status_updated = NOW()
      WHERE id = ?
    `, [
      priority, clinical_indication, patient_preparation_instructions,
      contrast_required, contrast_type, special_instructions, 
      preferred_laboratory_id, requestId
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'UPDATE_IMAGING_REQUEST', 
      'resultats_imagerie', 
      requestId, 
      `Modification de la demande d'imagerie ID ${requestId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Demande d\'imagerie mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification de la demande d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// CANCEL IMAGING REQUEST
exports.cancelImagingRequest = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, requestId } = req.params;

    // Validate imaging request exists and belongs to this patient and doctor
    const [requests] = await db.execute(`
      SELECT id, medecin_prescripteur_id, request_status
      FROM resultats_imagerie
      WHERE id = ? AND patient_id = ? AND medecin_prescripteur_id = ?
    `, [requestId, patientId, medecinId]);

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Demande d\'imagerie non trouvée' });
    }

    const request = requests[0];
    
    // Only allow cancellation if request hasn't been processed yet
    if (request.request_status !== 'requested') {
      return res.status(400).json({ 
        message: 'Cette demande d\'imagerie ne peut plus être annulée car elle est déjà en cours de traitement' 
      });
    }

    // Update request status to cancelled
    await db.execute(`
      UPDATE resultats_imagerie 
      SET request_status = 'cancelled', date_status_updated = NOW()
      WHERE id = ?
    `, [requestId]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'CANCEL_IMAGING_REQUEST', 
      'resultats_imagerie', 
      requestId, 
      `Annulation de la demande d'imagerie ID ${requestId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Demande d\'imagerie annulée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la demande d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Add note to imaging result
exports.addImagingNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { imagingResultId } = req.params;
    const { 
      note_content, 
      note_type, 
      is_important, 
      is_private 
    } = req.body;

    // Validate required fields
    if (!note_content || !note_content.trim()) {
      return res.status(400).json({ message: 'Le contenu de la note est obligatoire' });
    }

    // Validate imaging result exists and get patient info
    const [imagingResults] = await db.execute(`
      SELECT ri.*, p.id as patient_id
      FROM resultats_imagerie ri
      JOIN patients p ON ri.patient_id = p.id
      WHERE ri.id = ?
    `, [imagingResultId]);

    if (imagingResults.length === 0) {
      return res.status(404).json({ message: 'Résultat d\'imagerie non trouvé' });
    }

    const imagingResult = imagingResults[0];

    // Insert the note
    const [result] = await db.execute(`
      INSERT INTO imaging_notes (
        imaging_result_id, medecin_id, patient_id, note_content, 
        note_type, is_important, is_private
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      imagingResultId, medecinId, imagingResult.patient_id, note_content.trim(),
      note_type || 'observation', is_important || false, is_private || false
    ]);

    // Log the action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ADD_IMAGING_NOTE', 
      'imaging_notes', 
      result.insertId, 
      `Note ajoutée sur résultat d'imagerie ID ${imagingResultId}`
    ]);

    return res.status(201).json({ 
      message: 'Note ajoutée avec succès',
      noteId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get notes for imaging result
exports.getImagingNotes = async (req, res) => {
  try {
    const { imagingResultId } = req.params;

    // Get notes for the imaging result
    const [notes] = await db.execute(`
      SELECT 
        in.id, in.note_content, in.note_type, in.is_important, 
        in.is_private, in.created_at, in.updated_at,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        s.nom as medecin_specialite
      FROM imaging_notes in
      JOIN medecins m ON in.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      WHERE in.imaging_result_id = ?
      ORDER BY in.created_at DESC
    `, [imagingResultId]);

    return res.status(200).json({ notes });
  } catch (error) {
    console.error('Erreur lors de la récupération des notes d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Update imaging note
exports.updateImagingNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { imagingResultId, noteId } = req.params;
    const { 
      note_content, 
      note_type, 
      is_important, 
      is_private 
    } = req.body;

    // Validate required fields
    if (!note_content || !note_content.trim()) {
      return res.status(400).json({ message: 'Le contenu de la note est obligatoire' });
    }

    // Validate note exists and belongs to this doctor
    const [notes] = await db.execute(`
      SELECT id, medecin_id 
      FROM imaging_notes 
      WHERE id = ? AND imaging_result_id = ?
    `, [noteId, imagingResultId]);

    if (notes.length === 0) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    if (notes[0].medecin_id !== medecinId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cette note' });
    }

    // Update the note
    await db.execute(`
      UPDATE imaging_notes SET
        note_content = ?,
        note_type = COALESCE(?, note_type),
        is_important = COALESCE(?, is_important),
        is_private = COALESCE(?, is_private),
        updated_at = NOW()
      WHERE id = ?
    `, [
      note_content.trim(), note_type, is_important, is_private, noteId
    ]);

    // Log the action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'UPDATE_IMAGING_NOTE', 
      'imaging_notes', 
      noteId, 
      `Note modifiée sur résultat d'imagerie ID ${imagingResultId}`
    ]);

    return res.status(200).json({ 
      message: 'Note modifiée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la note d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Delete imaging note
exports.deleteImagingNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { imagingResultId, noteId } = req.params;

    // Validate note exists and belongs to this doctor
    const [notes] = await db.execute(`
      SELECT id, medecin_id 
      FROM imaging_notes 
      WHERE id = ? AND imaging_result_id = ?
    `, [noteId, imagingResultId]);

    if (notes.length === 0) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    if (notes[0].medecin_id !== medecinId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette note' });
    }

    // Delete the note
    await db.execute(`
      DELETE FROM imaging_notes WHERE id = ?
    `, [noteId]);

    // Log the action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'DELETE_IMAGING_NOTE', 
      'imaging_notes', 
      noteId, 
      `Note supprimée sur résultat d'imagerie ID ${imagingResultId}`
    ]);

    return res.status(200).json({ 
      message: 'Note supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note d\'imagerie:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 
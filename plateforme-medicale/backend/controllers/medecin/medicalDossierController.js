const db = require('../../config/db');

// Get comprehensive medical dossier for a patient
exports.getPatientDossier = async (req, res) => {
  console.log('=== DEBUG: getPatientDossier called ===');
  console.log('Request params:', req.params);
  console.log('User info:', req.user);
  
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    
    console.log('DEBUG: medecinId:', medecinId);
    console.log('DEBUG: patientId:', patientId);

    // Validate patient exists
    console.log('DEBUG: Fetching patient info...');
    const [patients] = await db.execute(`
      SELECT 
        p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, 
        p.email, p.telephone, p.adresse, p.ville, p.code_postal, p.pays,
        p.groupe_sanguin, p.taille_cm, p.poids_kg, p.est_fumeur,
        p.consommation_alcool, p.activite_physique, p.profession,
        p.contact_urgence_nom, p.contact_urgence_telephone, p.contact_urgence_relation,
        p.allergies_notes, p.est_inscrit_par_medecin, p.date_inscription
      FROM patients p 
      WHERE p.id = ?
    `, [patientId]);
    
    console.log('DEBUG: Patient query result:', patients.length, 'patients found');
    
    if (patients.length === 0) {
      console.log('DEBUG: Patient not found, returning 404');
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const patient = patients[0];
    console.log('DEBUG: Patient found:', patient.prenom, patient.nom);

    // Get patient allergies with details
    console.log('DEBUG: Fetching allergies...');
    const [allergies] = await db.execute(`
      SELECT 
        pa.patient_id, pa.allergie_id, pa.date_diagnostic, pa.severite, pa.notes,
        a.nom as allergie_nom, a.description as allergie_description
      FROM patient_allergies pa
      JOIN allergies a ON pa.allergie_id = a.id
      WHERE pa.patient_id = ?
      ORDER BY pa.severite DESC, a.nom ASC
    `, [patientId]);
    console.log('DEBUG: Allergies found:', allergies.length);

    // Get medical history (antecedents)
    console.log('DEBUG: Fetching antecedents...');
    const [antecedents] = await db.execute(`
      SELECT 
        am.id, am.type, am.description, am.date_debut, am.date_fin, 
        am.est_chronique, am.date_enregistrement,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM antecedents_medicaux am
      LEFT JOIN medecins m ON am.medecin_id = m.id
      WHERE am.patient_id = ?
      ORDER BY am.date_enregistrement DESC
    `, [patientId]);
    console.log('DEBUG: Antecedents found:', antecedents.length);

    // Get current and recent treatments
    console.log('DEBUG: Fetching treatments...');
    const [traitements] = await db.execute(`
      SELECT 
        t.id, t.posologie, t.date_debut, t.date_fin, t.est_permanent,
        t.date_prescription, t.instructions, t.rappel_prise, t.frequence_rappel,
        med.nom_commercial, med.nom_molecule, med.dosage, med.forme,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM traitements t
      JOIN medicaments med ON t.medicament_id = med.id
      JOIN medecins m ON t.medecin_prescripteur_id = m.id
      WHERE t.patient_id = ? 
      AND (t.est_permanent = 1 OR t.date_fin IS NULL OR t.date_fin >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
      ORDER BY t.date_prescription DESC
    `, [patientId]);
    console.log('DEBUG: Treatments found:', traitements.length);

    // Get recent consultations
    console.log('DEBUG: Fetching consultations...');
    const [consultations] = await db.execute(`
      SELECT 
        c.id, c.date_consultation, c.motif, c.anamnese, c.examen_clinique,
        c.diagnostic, c.conclusion, c.est_complete, c.follow_up_date,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        s.nom as specialite_nom,
        rv.id as rendez_vous_id, rv.statut as rdv_statut
      FROM consultations c
      JOIN medecins m ON c.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN rendez_vous rv ON c.rendez_vous_id = rv.id
      WHERE c.patient_id = ?
      ORDER BY c.date_consultation DESC
      LIMIT 20
    `, [patientId]);
    console.log('DEBUG: Consultations found:', consultations.length);

    // Get recent vital signs
    console.log('DEBUG: Fetching constantes...');
    const [constantes] = await db.execute(`
      SELECT 
        cv.id, cv.date_mesure, cv.temperature, cv.tension_arterielle_systolique,
        cv.tension_arterielle_diastolique, cv.frequence_cardiaque, cv.saturation_oxygene,
        cv.frequence_respiratoire, cv.glycemie, cv.poids, cv.taille, cv.imc, cv.notes,
        c.id as consultation_id, c.date_consultation
      FROM constantes_vitales cv
      LEFT JOIN consultations c ON cv.consultation_id = c.id
      WHERE cv.patient_id = ?
      ORDER BY cv.date_mesure DESC
      LIMIT 10
    `, [patientId]);
    console.log('DEBUG: Constantes found:', constantes.length);

    // Get recent appointments (past and upcoming)
    console.log('DEBUG: Fetching appointments...');
    const [appointments] = await db.execute(`
      SELECT 
        rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif, rv.statut,
        rv.notes_patient, rv.mode, rv.date_creation,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        s.nom as specialite_nom,
        i.nom as institution_nom
      FROM rendez_vous rv
      JOIN medecins m ON rv.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON rv.institution_id = i.id
      WHERE rv.patient_id = ?
      ORDER BY rv.date_heure_debut DESC
      LIMIT 15
    `, [patientId]);
    console.log('DEBUG: Appointments found:', appointments.length);

    // Get patient notes from doctors
    console.log('DEBUG: Fetching notes...');
    const [notes] = await db.execute(`
      SELECT 
        n.id, n.contenu, n.date_creation, n.est_important, n.categorie,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM notes_patient n
      JOIN medecins m ON n.medecin_id = m.id
      WHERE n.patient_id = ?
      ORDER BY n.date_creation DESC
      LIMIT 10
    `, [patientId]);
    console.log('DEBUG: Notes found:', notes.length);

    // Get recent analysis results
    console.log('DEBUG: Fetching analyses...');
    const [analyses] = await db.execute(`
      SELECT 
        ra.id, ra.type_analyse_id, ra.date_prescription, ra.date_realisation, ra.laboratoire,
        ra.valeur_numerique, ra.valeur_texte, ra.unite, ra.valeur_normale_min,
        ra.valeur_normale_max, ra.interpretation, ra.est_normal, ra.est_critique,
        ra.document_url, ra.notes_techniques,
        ta.nom as type_analyse, ta.valeurs_normales, ta.description as type_description,
        ca.id as categorie_id, ca.nom as categorie_nom, ca.description as categorie_description,
        mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
        mi.prenom as interpreteur_prenom, mi.nom as interpreteur_nom
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN categories_analyses ca ON ta.categorie_id = ca.id
      JOIN medecins mp ON ra.medecin_prescripteur_id = mp.id
      LEFT JOIN medecins mi ON ra.medecin_interpreteur_id = mi.id
      WHERE ra.patient_id = ?
      ORDER BY ra.date_realisation DESC, ra.date_prescription DESC
      LIMIT 20
    `, [patientId]);
    console.log('DEBUG: Analyses found:', analyses.length);

    // Get recent imaging results
    console.log('DEBUG: Fetching imageries...');
    const [imageries] = await db.execute(`
      SELECT 
        ri.id, ri.date_prescription, ri.date_realisation, ri.interpretation,
        ri.conclusion, ri.image_urls,
        ti.nom as type_imagerie,
        mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
        i.nom as institution_nom
      FROM resultats_imagerie ri
      JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
      JOIN medecins mp ON ri.medecin_prescripteur_id = mp.id
      LEFT JOIN institutions i ON ri.institution_realisation_id = i.id
      WHERE ri.patient_id = ?
      ORDER BY ri.date_realisation DESC, ri.date_prescription DESC
      LIMIT 10
    `, [patientId]);
    console.log('DEBUG: Imageries found:', imageries.length);

    // Get medical documents
    console.log('DEBUG: Fetching documents...');
    const [documents] = await db.execute(`
      SELECT 
        dm.id, dm.type, dm.titre, dm.description, dm.document_url,
        dm.date_creation, dm.est_partage,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM documents_medicaux dm
      JOIN medecins m ON dm.medecin_id = m.id
      WHERE dm.patient_id = ?
      ORDER BY dm.date_creation DESC
      LIMIT 15
    `, [patientId]);
    console.log('DEBUG: Documents found:', documents.length);

    // Log access for audit
    console.log('DEBUG: Logging access...');
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'VIEW_DOSSIER', 
      'patients', 
      patientId, 
      `Consultation du dossier médical de ${patient.prenom} ${patient.nom}`
    ]);

    console.log('DEBUG: Preparing response...');
    const response = {
      patient,
      allergies,
      antecedents,
      traitements,
      consultations,
      constantes,
      appointments,
      notes,
      analyses,
      imageries,
      documents,
      summary: {
        totalConsultations: consultations.length,
        totalTreatments: traitements.length,
        totalAllergies: allergies.length,
        lastConsultation: consultations.length > 0 ? consultations[0].date_consultation : null,
        hasActiveAlerts: allergies.some(a => a.severite === 'sévère' || a.severite === 'mortelle')
      }
    };
    
    console.log('DEBUG: Response summary:', {
      patient: patient.prenom + ' ' + patient.nom,
      allergiesCount: allergies.length,
      antecedentsCount: antecedents.length,
      traitementsCount: traitements.length,
      consultationsCount: consultations.length,
      constantesCount: constantes.length,
      appointmentsCount: appointments.length,
      notesCount: notes.length,
      analysesCount: analyses.length,
      imageriesCount: imageries.length,
      documentsCount: documents.length
    });

    console.log('DEBUG: Sending successful response');
    return res.status(200).json(response);
  } catch (error) {
    console.error('=== DEBUG: ERROR in getPatientDossier ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('Error sqlState:', error.sqlState);
    console.error('Error sqlMessage:', error.sqlMessage);
    console.error('=== END ERROR DEBUG ===');
    
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération du dossier médical', 
      error: error.message,
      debug: {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      }
    });
  }
};

// Add or update treatment
exports.addTreatment = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const {
      medicament_id, nom_medicament, posologie, date_debut, date_fin,
      est_permanent, instructions, rappel_prise, frequence_rappel
    } = req.body;

    // Validate required fields
    if (!patientId || (!medicament_id && !nom_medicament) || !posologie || !date_debut) {
      return res.status(400).json({ 
        message: 'Patient ID, médicament, posologie et date de début sont obligatoires' 
      });
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // If medicament_id is not provided, try to find or create the medication
    let finalMedicamentId = medicament_id;
    if (!medicament_id && nom_medicament) {
      // Try to find existing medication
      const [existingMeds] = await db.execute(
        'SELECT id FROM medicaments WHERE nom_commercial = ? OR nom_molecule = ?',
        [nom_medicament, nom_medicament]
      );
      
      if (existingMeds.length > 0) {
        finalMedicamentId = existingMeds[0].id;
      } else {
        // Create new medication entry
        const [newMed] = await db.execute(
          'INSERT INTO medicaments (nom_commercial, nom_molecule, forme) VALUES (?, ?, ?)',
          [nom_medicament, nom_medicament, 'autre']
        );
        finalMedicamentId = newMed.insertId;
      }
    }

    // Validate dates
    const startDate = new Date(date_debut);
    const endDate = date_fin ? new Date(date_fin) : null;
    
    if (endDate && endDate <= startDate) {
      return res.status(400).json({ 
        message: 'La date de fin doit être postérieure à la date de début' 
      });
    }

    // Insert treatment
    const [result] = await db.execute(`
      INSERT INTO traitements (
        patient_id, medicament_id, posologie, date_debut, date_fin,
        est_permanent, medecin_prescripteur_id, instructions,
        rappel_prise, frequence_rappel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      patientId, finalMedicamentId, posologie, date_debut, date_fin,
      est_permanent || false, medecinId, instructions || null,
      rappel_prise || false, frequence_rappel || null
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ADD_TREATMENT', 
      'traitements', 
      result.insertId, 
      `Ajout d'un traitement pour le patient ID ${patientId}`
    ]);

    return res.status(201).json({ 
      message: 'Traitement ajouté avec succès',
      treatmentId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du traitement:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'ajout du traitement', 
      error: error.message 
    });
  }
};

// Update treatment
exports.updateTreatment = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, treatmentId } = req.params;
    const {
      posologie, date_debut, date_fin, est_permanent, 
      instructions, rappel_prise, frequence_rappel
    } = req.body;

    // Validate treatment exists and belongs to this patient
    const [treatments] = await db.execute(`
      SELECT t.id, t.medecin_prescripteur_id, p.id as patient_id
      FROM traitements t
      JOIN patients p ON t.patient_id = p.id
      WHERE t.id = ? AND t.patient_id = ?
    `, [treatmentId, patientId]);

    if (treatments.length === 0) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    // Check if doctor has permission to modify (original prescriber or treating doctor)
    const treatment = treatments[0];
    if (treatment.medecin_prescripteur_id !== medecinId) {
      // Check if current doctor is treating this patient
      const [appointments] = await db.execute(
        'SELECT id FROM rendez_vous WHERE patient_id = ? AND medecin_id = ? LIMIT 1',
        [patientId, medecinId]
      );
      
      if (appointments.length === 0) {
        return res.status(403).json({ 
          message: 'Vous n\'êtes pas autorisé à modifier ce traitement' 
        });
      }
    }

    // Validate dates if provided
    if (date_debut && date_fin) {
      const startDate = new Date(date_debut);
      const endDate = new Date(date_fin);
      
      if (endDate <= startDate) {
        return res.status(400).json({ 
          message: 'La date de fin doit être postérieure à la date de début' 
        });
      }
    }

    // Update treatment
    await db.execute(`
      UPDATE traitements SET
        posologie = COALESCE(?, posologie),
        date_debut = COALESCE(?, date_debut),
        date_fin = COALESCE(?, date_fin),
        est_permanent = COALESCE(?, est_permanent),
        instructions = COALESCE(?, instructions),
        rappel_prise = COALESCE(?, rappel_prise),
        frequence_rappel = COALESCE(?, frequence_rappel)
      WHERE id = ?
    `, [
      posologie, date_debut, date_fin, est_permanent,
      instructions, rappel_prise, frequence_rappel, treatmentId
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'UPDATE_TREATMENT', 
      'traitements', 
      treatmentId, 
      `Modification du traitement ID ${treatmentId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Traitement mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification du traitement:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la modification du traitement', 
      error: error.message 
    });
  }
};

// Delete treatment
exports.deleteTreatment = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, treatmentId } = req.params;

    // Validate treatment exists and belongs to this patient
    const [treatments] = await db.execute(`
      SELECT t.id, t.medecin_prescripteur_id
      FROM traitements t
      WHERE t.id = ? AND t.patient_id = ?
    `, [treatmentId, patientId]);

    if (treatments.length === 0) {
      return res.status(404).json({ message: 'Traitement non trouvé' });
    }

    // Check if doctor has permission to delete (original prescriber only)
    const treatment = treatments[0];
    if (treatment.medecin_prescripteur_id !== medecinId) {
      return res.status(403).json({ 
        message: 'Seul le médecin prescripteur peut supprimer ce traitement' 
      });
    }

    // Delete treatment
    await db.execute('DELETE FROM traitements WHERE id = ?', [treatmentId]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'DELETE_TREATMENT', 
      'traitements', 
      treatmentId, 
      `Suppression du traitement ID ${treatmentId} pour le patient ID ${patientId}`
    ]);

    return res.status(200).json({ message: 'Traitement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du traitement:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression du traitement', 
      error: error.message 
    });
  }
};

// Add medical history entry
exports.addMedicalHistory = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { type, description, date_debut, date_fin, est_chronique } = req.body;

    // Validate required fields
    if (!patientId || !type || !description) {
      return res.status(400).json({ 
        message: 'Patient ID, type et description sont obligatoires' 
      });
    }

    // Validate type
    if (!['medical', 'chirurgical', 'familial'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type doit être: medical, chirurgical, ou familial' 
      });
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Insert medical history
    const [result] = await db.execute(`
      INSERT INTO antecedents_medicaux (
        patient_id, type, description, date_debut, date_fin, 
        est_chronique, medecin_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      patientId, type, description, date_debut || null, date_fin || null,
      est_chronique || false, medecinId
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ADD_MEDICAL_HISTORY', 
      'antecedents_medicaux', 
      result.insertId, 
      `Ajout d'un antécédent ${type} pour le patient ID ${patientId}`
    ]);

    return res.status(201).json({ 
      message: 'Antécédent médical ajouté avec succès',
      historyId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'antécédent médical:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'ajout de l\'antécédent médical', 
      error: error.message 
    });
  }
};

// Add patient note
exports.addPatientNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { contenu, est_important, categorie, date_note } = req.body;

    // Validate required fields
    if (!patientId || !contenu) {
      return res.status(400).json({ 
        message: 'Patient ID et contenu sont obligatoires' 
      });
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Use provided date or current timestamp
    const noteDate = date_note || new Date().toISOString().split('T')[0];

    // Insert note
    const [result] = await db.execute(`
      INSERT INTO notes_patient (
        patient_id, medecin_id, contenu, est_important, categorie, date_creation
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      patientId, medecinId, contenu, 
      est_important || false, categorie || 'general', noteDate
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ADD_PATIENT_NOTE', 
      'notes_patient', 
      result.insertId, 
      `Ajout d'une note pour le patient ID ${patientId}`
    ]);

    return res.status(201).json({ 
      message: 'Note ajoutée avec succès',
      noteId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'ajout de la note', 
      error: error.message 
    });
  }
};

// Get available medications for autocomplete
exports.getMedications = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, nom_commercial, nom_molecule, dosage, forme FROM medicaments';
    let params = [];

    if (search) {
      query += ' WHERE nom_commercial LIKE ? OR nom_molecule LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    query += ' ORDER BY nom_commercial ASC LIMIT 50';

    const [medications] = await db.execute(query, params);

    return res.status(200).json({ medications });
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des médicaments', 
      error: error.message 
    });
  }
};

// Get available allergies for autocomplete
exports.getAllergies = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT id, nom, description FROM allergies';
    let params = [];

    if (search) {
      query += ' WHERE nom LIKE ? OR description LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    query += ' ORDER BY nom ASC LIMIT 50';

    const [allergies] = await db.execute(query, params);

    return res.status(200).json({ allergies });
  } catch (error) {
    console.error('Erreur lors de la récupération des allergies:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des allergies', 
      error: error.message 
    });
  }
};

// IMPROVED: Update patient profile (all fields modifiable by doctor)
exports.updatePatientProfile = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const {
      prenom,
      nom,
      date_naissance,
      sexe,
      CNE,
      adresse,
      ville,
      code_postal,
      pays,
      telephone,
      email,
      contact_urgence_nom,
      contact_urgence_telephone,
      contact_urgence_relation,
      groupe_sanguin,
      taille_cm,
      poids_kg,
      est_fumeur,
      consommation_alcool,
      activite_physique,
      profession,
      allergies_notes
    } = req.body;

    // Validate patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Check if doctor has permission to modify patient data
    const [appointments] = await db.execute(
      'SELECT id FROM rendez_vous WHERE patient_id = ? AND medecin_id = ? LIMIT 1',
      [patientId, medecinId]
    );
    
    if (appointments.length === 0) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier les informations de ce patient' 
      });
    }

    // Validate email uniqueness if provided
    if (email) {
      const [existingEmail] = await db.execute(
        'SELECT id FROM patients WHERE email = ? AND id != ?',
        [email, patientId]
      );
      
      if (existingEmail.length > 0) {
        return res.status(400).json({ 
          message: 'Cette adresse email est déjà utilisée par un autre patient' 
        });
      }
    }

    // Validate CNE uniqueness if provided
    if (CNE) {
      const [existingCNE] = await db.execute(
        'SELECT id FROM patients WHERE CNE = ? AND id != ?',
        [CNE, patientId]
      );
      
      if (existingCNE.length > 0) {
        return res.status(400).json({ 
          message: 'Ce CNE est déjà utilisé par un autre patient' 
        });
      }
    }

    // Update patient profile
    await db.execute(`
      UPDATE patients SET
        prenom = COALESCE(?, prenom),
        nom = COALESCE(?, nom),
        date_naissance = COALESCE(?, date_naissance),
        sexe = COALESCE(?, sexe),
        CNE = COALESCE(?, CNE),
        adresse = COALESCE(?, adresse),
        ville = COALESCE(?, ville),
        code_postal = COALESCE(?, code_postal),
        pays = COALESCE(?, pays),
        telephone = COALESCE(?, telephone),
        email = COALESCE(?, email),
        contact_urgence_nom = COALESCE(?, contact_urgence_nom),
        contact_urgence_telephone = COALESCE(?, contact_urgence_telephone),
        contact_urgence_relation = COALESCE(?, contact_urgence_relation),
        groupe_sanguin = COALESCE(?, groupe_sanguin),
        taille_cm = COALESCE(?, taille_cm),
        poids_kg = COALESCE(?, poids_kg),
        est_fumeur = COALESCE(?, est_fumeur),
        consommation_alcool = COALESCE(?, consommation_alcool),
        activite_physique = COALESCE(?, activite_physique),
        profession = COALESCE(?, profession),
        allergies_notes = COALESCE(?, allergies_notes)
      WHERE id = ?
    `, [
      prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal,
      pays, telephone, email, contact_urgence_nom, contact_urgence_telephone,
      contact_urgence_relation, groupe_sanguin, taille_cm, poids_kg,
      est_fumeur, consommation_alcool, activite_physique, profession,
      allergies_notes, patientId
    ]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'UPDATE_PATIENT_PROFILE', 
      'patients', 
      patientId, 
      `Modification du profil du patient ${patients[0].prenom} ${patients[0].nom}`
    ]);

    return res.status(200).json({ 
      message: 'Profil patient mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil patient:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la mise à jour du profil', 
      error: error.message 
    });
  }
};

// Weight/Height Measurements Management
exports.getPatientMeasurements = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medecinId = req.user.id_specifique_role;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get measurements from mesures_patient table
    const [measurements] = await db.execute(`
      SELECT 
        mp.id,
        mp.date_mesure,
        mp.type_mesure,
        mp.valeur,
        mp.notes
      FROM mesures_patient mp
      WHERE mp.patient_id = ? AND mp.type_mesure IN ('poids', 'taille')
      ORDER BY mp.date_mesure DESC, mp.type_mesure
    `, [patientId]);

    // Group measurements by date for display
    const measurementsByDate = {};
    
    measurements.forEach(m => {
      const dateKey = m.date_mesure.toISOString().split('T')[0];
      if (!measurementsByDate[dateKey]) {
        measurementsByDate[dateKey] = {
          date_mesure: m.date_mesure,
          poids: null,
          taille: null,
          notes: '',
          poids_id: null,
          taille_id: null
        };
      }
      
      if (m.type_mesure === 'poids') {
        measurementsByDate[dateKey].poids = m.valeur;
        measurementsByDate[dateKey].poids_id = m.id;
        measurementsByDate[dateKey].notes = m.notes || measurementsByDate[dateKey].notes;
      } else if (m.type_mesure === 'taille') {
        measurementsByDate[dateKey].taille = m.valeur;
        measurementsByDate[dateKey].taille_id = m.id;
        measurementsByDate[dateKey].notes = m.notes || measurementsByDate[dateKey].notes;
      }
    });

    // Convert to array and create a unique ID for each grouped measurement
    const allMeasurements = Object.keys(measurementsByDate)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(dateKey => {
        const measurement = measurementsByDate[dateKey];
        
        // Create a unique identifier that includes both individual IDs
        let id_parts = [];
        if (measurement.poids_id) id_parts.push(`p${measurement.poids_id}`);
        if (measurement.taille_id) id_parts.push(`t${measurement.taille_id}`);
        
        measurement.id = id_parts.join('_');
        
        return measurement;
      });

    return res.status(200).json({ measurements: allMeasurements });
  } catch (error) {
    console.error('Error fetching patient measurements:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addPatientMeasurement = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { poids, taille, date_mesure, notes } = req.body;
    const medecinId = req.user.id_specifique_role;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    if (!poids && !taille) {
      return res.status(400).json({ message: 'Au moins le poids ou la taille doit être fourni' });
    }

    const measurementDate = date_mesure || new Date().toISOString().split('T')[0];

    // Insert weight measurement if provided
    if (poids) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'poids', ?, 'kg', ?, ?)
      `, [patientId, medecinId, poids, measurementDate, notes || '']);
    }

    // Insert height measurement if provided
    if (taille) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'taille', ?, 'cm', ?, ?)
      `, [patientId, medecinId, taille, measurementDate, notes || '']);
    }

    // Update patient's current weight and height in patients table
    const updateFields = [];
    const updateValues = [];

    if (poids) {
      updateFields.push('poids_kg = ?');
      updateValues.push(poids);
    }

    if (taille) {
      updateFields.push('taille_cm = ?');
      updateValues.push(taille);
    }

    if (updateFields.length > 0) {
      updateValues.push(patientId);
      await db.execute(
        `UPDATE patients SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    return res.status(201).json({ message: 'Mesure ajoutée avec succès' });
  } catch (error) {
    console.error('Error adding patient measurement:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updatePatientMeasurement = async (req, res) => {
  try {
    const { patientId, measurementId } = req.params;
    const { poids, taille, date_mesure, notes } = req.body;
    const medecinId = req.user.id_specifique_role;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    if (!poids && !taille) {
      return res.status(400).json({ message: 'Au moins le poids ou la taille doit être fourni' });
    }

    // Check if measurementId is a numeric ID (actual database ID)
    if (/^\d+$/.test(measurementId)) {
      // Handle individual measurement update by database ID
      const [existingMeasurement] = await db.execute(
        'SELECT id, type_mesure, date_mesure FROM mesures_patient WHERE id = ? AND patient_id = ?',
        [measurementId, patientId]
      );

      if (existingMeasurement.length === 0) {
        return res.status(404).json({ message: 'Mesure non trouvée' });
      }

      const measurement = existingMeasurement[0];
      const measurementDate = date_mesure || measurement.date_mesure;

      // Update the specific measurement based on its type
      if (measurement.type_mesure === 'poids' && poids) {
        await db.execute(
          'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
          [poids, measurementDate, notes || '', measurementId]
        );
      } else if (measurement.type_mesure === 'taille' && taille) {
        await db.execute(
          'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
          [taille, measurementDate, notes || '', measurementId]
        );
      } else {
        return res.status(400).json({ 
          message: `Cette mesure est de type ${measurement.type_mesure}. Veuillez fournir la valeur correspondante.` 
        });
      }

      return res.status(200).json({ message: 'Mesure mise à jour avec succès' });
    }

    // Check if measurementId is in the new format (p1_t2)
    if (measurementId.includes('p') || measurementId.includes('t')) {
      const parts = measurementId.split('_');
      let poidsId = null;
      let tailleId = null;
      
      parts.forEach(part => {
        if (part.startsWith('p')) {
          poidsId = part.substring(1); // Remove 'p' prefix
        } else if (part.startsWith('t')) {
          tailleId = part.substring(1); // Remove 't' prefix
        }
      });

      const measurementDate = date_mesure || new Date().toISOString().split('T')[0];

      // Update weight measurement if provided and ID exists
      if (poids && poidsId) {
        const [existingPoids] = await db.execute(
          'SELECT id FROM mesures_patient WHERE id = ? AND patient_id = ? AND type_mesure = "poids"',
          [poidsId, patientId]
        );

        if (existingPoids.length > 0) {
          await db.execute(
            'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
            [poids, measurementDate, notes || '', poidsId]
          );
        }
      }

      // Update height measurement if provided and ID exists
      if (taille && tailleId) {
        const [existingTaille] = await db.execute(
          'SELECT id FROM mesures_patient WHERE id = ? AND patient_id = ? AND type_mesure = "taille"',
          [tailleId, patientId]
        );

        if (existingTaille.length > 0) {
          await db.execute(
            'UPDATE mesures_patient SET valeur = ?, date_mesure = ?, notes = ? WHERE id = ?',
            [taille, measurementDate, notes || '', tailleId]
          );
        }
      }

      // If we need to add new measurements (when only one existed before)
      if (poids && !poidsId) {
        await db.execute(`
          INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
          VALUES (?, ?, 'poids', ?, 'kg', ?, ?)
        `, [patientId, medecinId, poids, measurementDate, notes || '']);
      }

      if (taille && !tailleId) {
        await db.execute(`
          INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
          VALUES (?, ?, 'taille', ?, 'cm', ?, ?)
        `, [patientId, medecinId, taille, measurementDate, notes || '']);
      }

      return res.status(200).json({ message: 'Mesure mise à jour avec succès' });
    }

    // Handle legacy date-based IDs (mp_YYYY-MM-DD)
    let targetDate, source;
    if (measurementId.startsWith('mp_')) {
      targetDate = measurementId.substring(3); // Extract date from mp_YYYY-MM-DD
      source = 'measurements';
    } else if (measurementId.startsWith('cv_')) {
      const actualId = measurementId.substring(3);
      source = 'vital_signs';
      
      // Cannot edit vital signs measurements - they come from consultations
      return res.status(400).json({ message: 'Les mesures de consultation ne peuvent pas être modifiées ici' });
    } else {
      return res.status(400).json({ message: 'Format d\'ID de mesure invalide' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      return res.status(400).json({ message: 'Format de date invalide dans l\'ID de mesure' });
    }

    // Check if measurements exist for this date and patient
    const [existingMeasurements] = await db.execute(
      'SELECT id, type_mesure FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ?',
      [patientId, targetDate]
    );

    if (existingMeasurements.length === 0) {
      return res.status(404).json({ message: 'Mesure non trouvée pour cette date' });
    }

    // Delete existing measurements for this date
    await db.execute(
      'DELETE FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ? AND type_mesure IN ("poids", "taille")',
      [patientId, targetDate]
    );

    // Insert updated measurements
    if (poids) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'poids', ?, 'kg', ?, ?)
      `, [patientId, medecinId, poids, date_mesure, notes || '']);
    }

    if (taille) {
      await db.execute(`
        INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes)
        VALUES (?, ?, 'taille', ?, 'cm', ?, ?)
      `, [patientId, medecinId, taille, date_mesure, notes || '']);
    }

    return res.status(200).json({ message: 'Mesure mise à jour avec succès' });
  } catch (error) {
    console.error('Error updating patient measurement:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deletePatientMeasurement = async (req, res) => {
  try {
    const { patientId, measurementId } = req.params;

    // Verify patient access
    const [patientCheck] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientCheck.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Check if measurementId is a numeric ID (actual database ID)
    if (/^\d+$/.test(measurementId)) {
      // Handle individual measurement deletion by database ID
      const [existingMeasurement] = await db.execute(
        'SELECT id, type_mesure, date_mesure FROM mesures_patient WHERE id = ? AND patient_id = ?',
        [measurementId, patientId]
      );

      if (existingMeasurement.length === 0) {
        return res.status(404).json({ message: 'Mesure non trouvée' });
      }

      // Delete the specific measurement
      await db.execute(
        'DELETE FROM mesures_patient WHERE id = ? AND patient_id = ?',
        [measurementId, patientId]
      );

      return res.status(200).json({ message: 'Mesure supprimée avec succès' });
    }

    // Check if measurementId is in the new format (p1_t2)
    if (measurementId.includes('p') || measurementId.includes('t')) {
      const parts = measurementId.split('_');
      const idsToDelete = [];
      
      parts.forEach(part => {
        if (part.startsWith('p')) {
          idsToDelete.push(part.substring(1)); // Remove 'p' prefix
        } else if (part.startsWith('t')) {
          idsToDelete.push(part.substring(1)); // Remove 't' prefix
        }
      });

      if (idsToDelete.length === 0) {
        return res.status(400).json({ message: 'Format d\'ID de mesure invalide' });
      }

      // Verify all measurements exist and belong to the patient
      const placeholders = idsToDelete.map(() => '?').join(',');
      const [existingMeasurements] = await db.execute(
        `SELECT id FROM mesures_patient WHERE id IN (${placeholders}) AND patient_id = ?`,
        [...idsToDelete, patientId]
      );

      if (existingMeasurements.length !== idsToDelete.length) {
        return res.status(404).json({ message: 'Une ou plusieurs mesures non trouvées' });
      }

      // Delete all the measurements
      await db.execute(
        `DELETE FROM mesures_patient WHERE id IN (${placeholders}) AND patient_id = ?`,
        [...idsToDelete, patientId]
      );

      return res.status(200).json({ message: 'Mesure(s) supprimée(s) avec succès' });
    }

    // Handle legacy date-based IDs (mp_YYYY-MM-DD)
    let targetDate, source;
    if (measurementId.startsWith('mp_')) {
      targetDate = measurementId.substring(3); // Extract date from mp_YYYY-MM-DD
      source = 'measurements';
    } else if (measurementId.startsWith('cv_')) {
      const actualId = measurementId.substring(3);
      source = 'vital_signs';
      
      // Cannot delete vital signs measurements - they come from consultations
      return res.status(400).json({ message: 'Les mesures de consultation ne peuvent pas être supprimées ici' });
    } else {
      return res.status(400).json({ message: 'Format d\'ID de mesure invalide' });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      return res.status(400).json({ message: 'Format de date invalide dans l\'ID de mesure' });
    }

    // Check if measurements exist for this date and patient
    const [existingMeasurements] = await db.execute(
      'SELECT id, type_mesure FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ?',
      [patientId, targetDate]
    );

    if (existingMeasurements.length === 0) {
      return res.status(404).json({ message: 'Mesure non trouvée pour cette date' });
    }

    // Delete all measurements for this date (both weight and height)
    await db.execute(
      'DELETE FROM mesures_patient WHERE patient_id = ? AND DATE(date_mesure) = ? AND type_mesure IN ("poids", "taille")',
      [patientId, targetDate]
    );

    return res.status(200).json({ message: 'Mesure supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting patient measurement:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = exports; 
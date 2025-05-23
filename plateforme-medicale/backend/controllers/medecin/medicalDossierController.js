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
        ra.id, ra.date_prescription, ra.date_realisation, ra.laboratoire,
        ra.resultats, ra.interpretation, ra.est_normal, ra.document_url,
        ta.nom as type_analyse, ta.valeurs_normales,
        mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN medecins mp ON ra.medecin_prescripteur_id = mp.id
      WHERE ra.patient_id = ?
      ORDER BY ra.date_realisation DESC, ra.date_prescription DESC
      LIMIT 10
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
    const { contenu, est_important, categorie } = req.body;

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

    // Insert note
    const [result] = await db.execute(`
      INSERT INTO notes_patient (
        patient_id, medecin_id, contenu, est_important, categorie
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      patientId, medecinId, contenu, 
      est_important || false, categorie || 'general'
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
const db = require('../../../config/db');

/**
 * Service for managing patient profiles and medical history
 */
class PatientService {
  /**
   * Update patient profile
   */
  static async updatePatientProfile(patientId, medecinId, profileData, userId) {
    const {
      prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal, pays,
      telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_relation,
      groupe_sanguin, taille_cm, poids_kg, est_fumeur, consommation_alcool, activite_physique,
      profession, allergies_notes,
      // Handicap fields
      a_handicap, type_handicap, type_handicap_autre, niveau_handicap, description_handicap,
      besoins_accessibilite, equipements_medicaux, autonomie_niveau
    } = profileData;

    // Validate patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Check if doctor has permission to modify patient data
    await this.validateDoctorPatientAccess(patientId, medecinId);

    // Validate email uniqueness if provided
    if (email) {
      await this.validateEmailUniqueness(email, patientId);
    }

    // Validate CNE uniqueness if provided
    if (CNE) {
      await this.validateCNEUniqueness(CNE, patientId);
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
        allergies_notes = COALESCE(?, allergies_notes),
        a_handicap = COALESCE(?, a_handicap),
        type_handicap = COALESCE(?, type_handicap),
        type_handicap_autre = COALESCE(?, type_handicap_autre),
        niveau_handicap = COALESCE(?, niveau_handicap),
        description_handicap = COALESCE(?, description_handicap),
        besoins_accessibilite = COALESCE(?, besoins_accessibilite),
        equipements_medicaux = COALESCE(?, equipements_medicaux),
        autonomie_niveau = COALESCE(?, autonomie_niveau)
      WHERE id = ?
    `, [
      prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal,
      pays, telephone, email, contact_urgence_nom, contact_urgence_telephone,
      contact_urgence_relation, groupe_sanguin, taille_cm, poids_kg,
      est_fumeur, consommation_alcool, activite_physique, profession,
      allergies_notes, a_handicap, type_handicap, type_handicap_autre, niveau_handicap, 
      description_handicap, besoins_accessibilite, equipements_medicaux, 
      autonomie_niveau, patientId
    ]);

    // Log action
    await this.logPatientAction(
      userId, 
      'UPDATE_PATIENT_PROFILE', 
      patientId, 
      `Modification du profil du patient ${patients[0].prenom} ${patients[0].nom}`
    );
  }

  /**
   * Add medical history entry
   */
  static async addMedicalHistory(patientId, medecinId, historyData, userId) {
    const { type, description, date_debut, date_fin, est_chronique } = historyData;

    // Validate required fields
    if (!patientId || !type || !description) {
      throw new Error('Patient ID, type et description sont obligatoires');
    }

    // Validate type
    if (!['medical', 'chirurgical', 'familial'].includes(type)) {
      throw new Error('Type doit être: medical, chirurgical, ou familial');
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
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
    await this.logPatientAction(
      userId, 
      'ADD_MEDICAL_HISTORY', 
      result.insertId, 
      `Ajout d'un antécédent ${type} pour le patient ID ${patientId}`
    );

    return result.insertId;
  }

  /**
   * Add patient note
   */
  static async addPatientNote(patientId, medecinId, noteData, userId) {
    const { contenu, est_important, categorie, date_note } = noteData;

    // Validate required fields
    if (!patientId || !contenu) {
      throw new Error('Patient ID et contenu sont obligatoires');
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
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
    await this.logPatientAction(
      userId, 
      'ADD_PATIENT_NOTE', 
      result.insertId, 
      `Ajout d'une note pour le patient ID ${patientId}`
    );

    return result.insertId;
  }

  /**
   * Update patient note
   */
  static async updatePatientNote(patientId, noteId, medecinId, noteData, userId) {
    const { contenu, est_important, categorie, date_note } = noteData;

    // Validate required fields
    if (!patientId || !noteId || !contenu) {
      throw new Error('Patient ID, note ID et contenu sont obligatoires');
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Validate note exists and belongs to this doctor
    const [notes] = await db.execute(
      'SELECT id, medecin_id FROM notes_patient WHERE id = ? AND patient_id = ?',
      [noteId, patientId]
    );
    
    if (notes.length === 0) {
      throw new Error('Note non trouvée');
    }

    // Check if doctor is authorized to modify this note
    if (notes[0].medecin_id !== medecinId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier cette note');
    }

    // Use provided date or keep existing timestamp
    const noteDate = date_note || new Date().toISOString().split('T')[0];

    // Update note
    await db.execute(`
      UPDATE notes_patient 
      SET contenu = ?, est_important = ?, categorie = ?, date_creation = ?
      WHERE id = ? AND patient_id = ?
    `, [
      contenu, 
      est_important || false, 
      categorie || 'general', 
      noteDate,
      noteId,
      patientId
    ]);

    // Log action
    await this.logPatientAction(
      userId, 
      'UPDATE_PATIENT_NOTE', 
      noteId, 
      `Modification d'une note pour le patient ID ${patientId}`
    );
  }

  /**
   * Delete patient note
   */
  static async deletePatientNote(patientId, noteId, medecinId, userId) {
    // Validate required fields
    if (!patientId || !noteId) {
      throw new Error('Patient ID et note ID sont obligatoires');
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Validate note exists and belongs to this doctor
    const [notes] = await db.execute(
      'SELECT id, medecin_id FROM notes_patient WHERE id = ? AND patient_id = ?',
      [noteId, patientId]
    );
    
    if (notes.length === 0) {
      throw new Error('Note non trouvée');
    }

    // Check if doctor is authorized to delete this note
    if (notes[0].medecin_id !== medecinId) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer cette note');
    }

    // Delete note
    await db.execute(
      'DELETE FROM notes_patient WHERE id = ? AND patient_id = ?',
      [noteId, patientId]
    );

    // Log action
    await this.logPatientAction(
      userId, 
      'DELETE_PATIENT_NOTE', 
      noteId, 
      `Suppression d'une note pour le patient ID ${patientId}`
    );
  }

  /**
   * Get available medications for autocomplete
   */
  static async getMedications(searchTerm) {
    let query = 'SELECT id, nom_commercial, nom_molecule, dosage, forme FROM medicaments';
    let params = [];

    if (searchTerm) {
      query += ' WHERE nom_commercial LIKE ? OR nom_molecule LIKE ?';
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    query += ' ORDER BY nom_commercial ASC LIMIT 50';

    const [medications] = await db.execute(query, params);
    return medications;
  }

  /**
   * Get available allergies for autocomplete
   */
  static async getAllergies(searchTerm) {
    let query = 'SELECT id, nom, description FROM allergies';
    let params = [];

    if (searchTerm) {
      query += ' WHERE nom LIKE ? OR description LIKE ?';
      params = [`%${searchTerm}%`, `%${searchTerm}%`];
    }

    query += ' ORDER BY nom ASC LIMIT 50';

    const [allergies] = await db.execute(query, params);
    return allergies;
  }

  /**
   * Validate doctor has access to patient
   */
  static async validateDoctorPatientAccess(patientId, medecinId) {
    const [appointments] = await db.execute(
      'SELECT id FROM rendez_vous WHERE patient_id = ? AND medecin_id = ? LIMIT 1',
      [patientId, medecinId]
    );
    
    if (appointments.length === 0) {
      throw new Error('Vous n\'êtes pas autorisé à modifier les informations de ce patient');
    }
  }

  /**
   * Validate email uniqueness
   */
  static async validateEmailUniqueness(email, patientId) {
    const [existingEmail] = await db.execute(
      'SELECT id FROM patients WHERE email = ? AND id != ?',
      [email, patientId]
    );
    
    if (existingEmail.length > 0) {
      throw new Error('Cette adresse email est déjà utilisée par un autre patient');
    }
  }

  /**
   * Validate CNE uniqueness
   */
  static async validateCNEUniqueness(CNE, patientId) {
    const [existingCNE] = await db.execute(
      'SELECT id FROM patients WHERE CNE = ? AND id != ?',
      [CNE, patientId]
    );
    
    if (existingCNE.length > 0) {
      throw new Error('Ce CNE est déjà utilisé par un autre patient');
    }
  }

  /**
   * Log patient-related action
   */
  static async logPatientAction(userId, actionType, recordId, description) {
    const tableMap = {
      'UPDATE_PATIENT_PROFILE': 'patients',
      'ADD_MEDICAL_HISTORY': 'antecedents_medicaux',
      'ADD_PATIENT_NOTE': 'notes_patient',
      'UPDATE_PATIENT_NOTE': 'notes_patient',
      'DELETE_PATIENT_NOTE': 'notes_patient'
    };

    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      userId, 
      actionType, 
      tableMap[actionType] || 'patients', 
      recordId, 
      description
    ]);
  }
}

module.exports = PatientService; 
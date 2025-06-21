const db = require('../../../config/db');

/**
 * Service for managing patient treatments
 */
class TreatmentService {
  /**
   * Add or update treatment
   */
  static async addTreatment(patientId, medecinId, treatmentData, userId) {
    const {
      medicament_id, nom_medicament, posologie, date_debut, date_fin,
      est_permanent, instructions, rappel_prise, frequence_rappel
    } = treatmentData;

    // Validate required fields
    if (!patientId || (!medicament_id && !nom_medicament) || !posologie || !date_debut) {
      throw new Error('Patient ID, médicament, posologie et date de début sont obligatoires');
    }

    // Validate patient exists
    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [patientId]);
    if (patients.length === 0) {
      throw new Error('Patient non trouvé');
    }

    // Handle medication ID resolution
    const finalMedicamentId = await this.resolveMedicamentId(medicament_id, nom_medicament);

    // Validate dates
    this.validateTreatmentDates(date_debut, date_fin);

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
    await this.logTreatmentAction(userId, 'ADD_TREATMENT', result.insertId, patientId);

    return result.insertId;
  }

  /**
   * Update treatment
   */
  static async updateTreatment(patientId, treatmentId, medecinId, updateData, userId) {
    const {
      posologie, date_debut, date_fin, est_permanent, 
      instructions, rappel_prise, frequence_rappel
    } = updateData;

    // Validate treatment exists and permissions
    await this.validateTreatmentAccess(treatmentId, patientId, medecinId);

    // Validate dates if provided
    if (date_debut && date_fin) {
      this.validateTreatmentDates(date_debut, date_fin);
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
    await this.logTreatmentAction(userId, 'UPDATE_TREATMENT', treatmentId, patientId);
  }

  /**
   * Delete treatment
   */
  static async deleteTreatment(patientId, treatmentId, medecinId, userId) {
    // Validate treatment exists and belongs to this patient
    const [treatments] = await db.execute(`
      SELECT t.id, t.medecin_prescripteur_id
      FROM traitements t
      WHERE t.id = ? AND t.patient_id = ?
    `, [treatmentId, patientId]);

    if (treatments.length === 0) {
      throw new Error('Traitement non trouvé');
    }

    // Check if doctor has permission to delete (original prescriber only)
    const treatment = treatments[0];
    if (treatment.medecin_prescripteur_id !== medecinId) {
      throw new Error('Seul le médecin prescripteur peut supprimer ce traitement');
    }

    // Delete treatment
    await db.execute('DELETE FROM traitements WHERE id = ?', [treatmentId]);

    // Log action
    await this.logTreatmentAction(userId, 'DELETE_TREATMENT', treatmentId, patientId);
  }

  /**
   * Resolve medication ID - find existing or create new
   */
  static async resolveMedicamentId(medicament_id, nom_medicament) {
    if (medicament_id) {
      return medicament_id;
    }

    if (!nom_medicament) {
      throw new Error('Nom du médicament requis');
    }

    // Try to find existing medication
    const [existingMeds] = await db.execute(
      'SELECT id FROM medicaments WHERE nom_commercial = ? OR nom_molecule = ?',
      [nom_medicament, nom_medicament]
    );
    
    if (existingMeds.length > 0) {
      return existingMeds[0].id;
    }

    // Create new medication entry
    const [newMed] = await db.execute(
      'INSERT INTO medicaments (nom_commercial, nom_molecule, forme) VALUES (?, ?, ?)',
      [nom_medicament, nom_medicament, 'autre']
    );
    
    return newMed.insertId;
  }

  /**
   * Validate treatment dates
   */
  static validateTreatmentDates(date_debut, date_fin) {
    if (!date_debut) {
      throw new Error('Date de début requise');
    }

    const startDate = new Date(date_debut);
    const endDate = date_fin ? new Date(date_fin) : null;
    
    if (endDate && endDate <= startDate) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }
  }

  /**
   * Validate treatment access permissions
   */
  static async validateTreatmentAccess(treatmentId, patientId, medecinId) {
    const [treatments] = await db.execute(`
      SELECT t.id, t.medecin_prescripteur_id, p.id as patient_id
      FROM traitements t
      JOIN patients p ON t.patient_id = p.id
      WHERE t.id = ? AND t.patient_id = ?
    `, [treatmentId, patientId]);

    if (treatments.length === 0) {
      throw new Error('Traitement non trouvé');
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
        throw new Error('Vous n\'êtes pas autorisé à modifier ce traitement');
      }
    }

    return treatment;
  }

  /**
   * Log treatment action
   */
  static async logTreatmentAction(userId, actionType, treatmentId, patientId) {
    const descriptions = {
      'ADD_TREATMENT': `Ajout d'un traitement pour le patient ID ${patientId}`,
      'UPDATE_TREATMENT': `Modification du traitement ID ${treatmentId} pour le patient ID ${patientId}`,
      'DELETE_TREATMENT': `Suppression du traitement ID ${treatmentId} pour le patient ID ${patientId}`
    };

    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      userId, 
      actionType, 
      'traitements', 
      treatmentId, 
      descriptions[actionType]
    ]);
  }
}

module.exports = TreatmentService; 
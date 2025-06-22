/**
 * MEDICAL DOSSIER CONTROLLER - PATIENT CARE FOCUSED
 * 
 * This controller handles:
 * - Comprehensive patient dossier management
 * - Treatment management (via service layer)
 * - Patient measurements (weight/height history)
 * - Patient profile updates
 * - Medical history and notes
 * - Medications and allergies autocomplete
 * 
 * For lab analysis and imaging requests,
 * see medicalRecordController.js
 */

const DossierService = require('./services/dossierService');
const TreatmentService = require('./services/treatmentService');
const PatientService = require('./services/patientService');
const MeasurementService = require('./services/measurementService');
const db = require('../../config/db');

// Get comprehensive medical dossier for a patient
exports.getPatientDossier = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    
    const dossier = await DossierService.getPatientDossier(patientId, medecinId, req.user.id);
    
    console.log('DEBUG: Sending successful response');
    return res.status(200).json(dossier);
  } catch (error) {
    console.error('=== DEBUG: ERROR in getPatientDossier ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR DEBUG ===');
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération du dossier médical', 
      error: error.message
    });
  }
};

// Add or update treatment
exports.addTreatment = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;
    
    const treatmentId = await TreatmentService.addTreatment(
      patientId, 
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(201).json({ 
      message: 'Traitement ajouté avec succès',
      treatmentId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du traitement:', error);
    
    if (error.message.includes('obligatoires') || error.message.includes('date')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
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

    await TreatmentService.updateTreatment(
      patientId, 
      treatmentId, 
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(200).json({ message: 'Traitement mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la modification du traitement:', error);
    
    if (error.message.includes('date')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message === 'Traitement non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('autorisé')) {
      return res.status(403).json({ message: error.message });
    }
    
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

    await TreatmentService.deleteTreatment(patientId, treatmentId, medecinId, req.user.id);

    return res.status(200).json({ message: 'Traitement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du traitement:', error);
    
    if (error.message === 'Traitement non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('prescripteur')) {
      return res.status(403).json({ message: error.message });
    }
    
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

    const historyId = await PatientService.addMedicalHistory(
      patientId, 
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(201).json({ 
      message: 'Antécédent médical ajouté avec succès',
      historyId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'antécédent médical:', error);
    
    if (error.message.includes('obligatoires') || error.message.includes('Type doit être')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
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

    const noteId = await PatientService.addPatientNote(
      patientId, 
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(201).json({ 
      message: 'Note ajoutée avec succès',
      noteId
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la note:', error);
    
    if (error.message.includes('obligatoires')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Erreur serveur lors de l\'ajout de la note', 
      error: error.message 
    });
  }
};

// Update patient note
exports.updatePatientNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, noteId } = req.params;

    await PatientService.updatePatientNote(
      patientId,
      noteId,
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(200).json({ 
      message: 'Note modifiée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la note:', error);
    
    if (error.message.includes('obligatoires')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message === 'Patient non trouvé' || error.message === 'Note non trouvée') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('autorisé')) {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la modification de la note', 
      error: error.message 
    });
  }
};

// Delete patient note
exports.deletePatientNote = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId, noteId } = req.params;

    await PatientService.deletePatientNote(
      patientId,
      noteId,
      medecinId, 
      req.user.id
    );

    return res.status(200).json({ 
      message: 'Note supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    
    if (error.message === 'Patient non trouvé' || error.message === 'Note non trouvée') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('autorisé')) {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression de la note', 
      error: error.message 
    });
  }
};

// Get available medications for autocomplete
exports.getMedications = async (req, res) => {
  try {
    const { search } = req.query;
    const medications = await PatientService.getMedications(search);
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
    const allergies = await PatientService.getAllergies(search);
    return res.status(200).json({ allergies });
  } catch (error) {
    console.error('Erreur lors de la récupération des allergies:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération des allergies', 
      error: error.message 
    });
  }
};

// Update patient profile
exports.updatePatientProfile = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { patientId } = req.params;

    await PatientService.updatePatientProfile(
      patientId, 
      medecinId, 
      req.body, 
      req.user.id
    );

    return res.status(200).json({ 
      message: 'Profil patient mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil patient:', error);
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('autorisé') || error.message.includes('email') || error.message.includes('CNE')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.message.includes('autorisé')) {
      return res.status(403).json({ message: error.message });
    }
    
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
    const measurements = await MeasurementService.getPatientMeasurements(patientId);
    return res.status(200).json({ measurements });
  } catch (error) {
    console.error('Error fetching patient measurements:', error);
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addPatientMeasurement = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medecinId = req.user.id_specifique_role;

    await MeasurementService.addPatientMeasurement(patientId, medecinId, req.body);
    return res.status(201).json({ message: 'Mesure ajoutée avec succès' });
  } catch (error) {
    console.error('Error adding patient measurement:', error);
    
    if (error.message === 'Patient non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('poids ou la taille')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updatePatientMeasurement = async (req, res) => {
  try {
    const { patientId, measurementId } = req.params;
    const medecinId = req.user.id_specifique_role;

    await MeasurementService.updatePatientMeasurement(
      patientId, 
      measurementId, 
      medecinId, 
      req.body
    );
    
    return res.status(200).json({ message: 'Mesure mise à jour avec succès' });
  } catch (error) {
    console.error('Error updating patient measurement:', error);
    
    if (error.message === 'Patient non trouvé' || error.message === 'Mesure non trouvée') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('invalide') || error.message.includes('fourni')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deletePatientMeasurement = async (req, res) => {
  try {
    const { patientId, measurementId } = req.params;

    await MeasurementService.deletePatientMeasurement(patientId, measurementId);
    return res.status(200).json({ message: 'Mesure supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting patient measurement:', error);
    
    if (error.message === 'Patient non trouvé' || error.message.includes('non trouvée')) {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message.includes('invalide')) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create follow-up appointment for patient
exports.createFollowUpAppointment = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date_heure_debut, date_heure_fin, motif, notes_medecin } = req.body;
    const medecinId = req.user.id_specifique_role;

    // Validate required fields
    if (!date_heure_debut || !date_heure_fin || !motif) {
      return res.status(400).json({ 
        message: 'Date, heure et motif sont requis' 
      });
    }

    // Validate that the start time is in the future
    const appointmentDate = new Date(date_heure_debut);
    const now = new Date();
    if (appointmentDate <= now) {
      return res.status(400).json({ 
        message: 'La date du rendez-vous doit être dans le futur' 
      });
    }

    // Check if patient exists
    const [patientExists] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientExists.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get doctor's institution
    const [doctorInfo] = await db.execute(
      'SELECT institution_id FROM medecins WHERE id = ?',
      [medecinId]
    );

    if (doctorInfo.length === 0) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    const institutionId = doctorInfo[0].institution_id;

    // Check for conflicting appointments for the doctor
    const [conflictingAppointments] = await db.execute(
      `SELECT id FROM rendez_vous 
       WHERE medecin_id = ? 
       AND ((date_heure_debut <= ? AND date_heure_fin > ?) 
       OR (date_heure_debut < ? AND date_heure_fin >= ?))
       AND statut NOT IN ('annulé', 'patient absent')`,
      [medecinId, date_heure_debut, date_heure_debut, date_heure_fin, date_heure_fin]
    );

    if (conflictingAppointments.length > 0) {
      return res.status(409).json({ 
        message: 'Ce créneau est déjà occupé. Veuillez choisir un autre horaire.' 
      });
    }

    // Get the creator ID (user associated with the doctor)
    const [creatorInfo] = await db.execute(
      'SELECT id FROM utilisateurs WHERE id_specifique_role = ? AND role = ?',
      [medecinId, 'medecin']
    );

    if (creatorInfo.length === 0) {
      return res.status(404).json({ message: 'Utilisateur médecin non trouvé' });
    }

    const createurId = creatorInfo[0].id;

    // Create the follow-up appointment
    const [result] = await db.execute(
      `INSERT INTO rendez_vous (
        patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, 
        motif, statut, notes_patient, mode, createur_id
      ) VALUES (?, ?, ?, ?, ?, ?, 'planifié', ?, 'présentiel', ?)`,
      [patientId, medecinId, institutionId, date_heure_debut, date_heure_fin, motif, notes_medecin || '', createurId]
    );

    // Get patient and doctor details for notification
    const [appointmentDetails] = await db.execute(
      `SELECT 
        p.prenom as patient_prenom, p.nom as patient_nom, p.email as patient_email,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM patients p, medecins m
      WHERE p.id = ? AND m.id = ?`,
      [patientId, medecinId]
    );

    // Create notification for patient
    if (appointmentDetails.length > 0) {
      const appointment = appointmentDetails[0];
      
      // Get patient's user ID for notification
      const [patientUser] = await db.execute(
        'SELECT id FROM utilisateurs WHERE id_specifique_role = ? AND role = ?',
        [patientId, 'patient']
      );

      if (patientUser.length > 0) {
        await db.execute(
          `INSERT INTO notifications (
            utilisateur_id, titre, message, type
          ) VALUES (?, ?, ?, ?)`,
          [
            patientUser[0].id,
            'Nouveau rendez-vous de suivi',
            `Dr. ${appointment.medecin_prenom} ${appointment.medecin_nom} a programmé un rendez-vous de suivi pour le ${new Date(date_heure_debut).toLocaleDateString('fr-FR')} à ${new Date(date_heure_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            'rdv'
          ]
        );
      }
    }

    res.status(201).json({
      message: 'Rendez-vous de suivi créé avec succès',
      appointmentId: result.insertId
    });

  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous de suivi:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la création du rendez-vous de suivi',
      error: error.message 
    });
  }
};

module.exports = exports; 
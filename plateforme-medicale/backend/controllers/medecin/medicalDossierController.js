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

module.exports = exports; 
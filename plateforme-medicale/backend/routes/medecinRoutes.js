const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController');
const appointmentController = require('../controllers/medecin/appointmentController');
const medicalRecordController = require('../controllers/medecin/medicalRecordController');
const medicalDossierController = require('../controllers/medecin/medicalDossierController');
const { verifyToken, isAdmin, isSuperAdmin } = require('../middlewares/auth');

// Public routes (no authentication required)
router.get('/medecins/public', medecinController.getPublicMedecins);
router.get('/specialites/public', medecinController.getPublicSpecialites);
router.get('/medecins/public/:id', medecinController.getPublicMedecinById);

// Protected routes
router.get('/medecins', verifyToken, isAdmin, medecinController.getMedecins);
router.get('/medecins/:id', verifyToken, medecinController.getMedecinById);
router.post('/medecins', verifyToken, isAdmin, medecinController.addMedecin);
router.put('/medecins/:id', verifyToken, isAdmin, medecinController.editMedecin);
router.delete('/medecins/:id', verifyToken, isSuperAdmin, medecinController.deleteMedecin);
router.get('/specialites', verifyToken, isAdmin, medecinController.getSpecialites);
router.get('/institutions', verifyToken, isAdmin, medecinController.getInstitutions);
router.get('/medecin/dashboard', verifyToken, medecinController.getCurrentMedecin);
router.get('/medecin/institutions', verifyToken, medecinController.getDoctorInstitutions);
router.get('/medecin/disponibilites', verifyToken, medecinController.getAvailabilities);
router.post('/medecin/disponibilites', verifyToken, medecinController.addAvailability);
router.put('/medecin/disponibilites/:id', verifyToken, medecinController.updateAvailability);
router.delete('/medecin/disponibilites/:id', verifyToken, medecinController.deleteAvailability);

// Route for updating doctor's consultation fee
router.put('/medecin/profile/fee', verifyToken, medecinController.updateConsultationFee);

// Patients directs preference routes
router.get('/medecin/walk-in-preference', verifyToken, medecinController.getWalkInPreference);
router.put('/medecin/walk-in-preference', verifyToken, medecinController.updateWalkInPreference);

router.get('/medecin/absences', verifyToken, medecinController.getEmergencyAbsences);
router.post('/medecin/absences', verifyToken, medecinController.addEmergencyAbsence);
router.delete('/medecin/absences/:id', verifyToken, medecinController.deleteEmergencyAbsence);
router.post('/medecin/patients', verifyToken, medecinController.addPatient);
router.get('/medecin/patients', verifyToken, medecinController.getPatients);

// Appointment routes
router.get('/medecin/appointments', verifyToken, appointmentController.getUpcomingAppointments);
router.get('/medecin/appointments/:appointmentId', verifyToken, appointmentController.getAppointmentById);
router.put('/medecin/appointments/:appointmentId/status', verifyToken, appointmentController.updateAppointmentStatus);

// Medical records routes (legacy - keeping for backward compatibility)
router.get('/medecin/patients/search', verifyToken, medicalRecordController.searchPatients);
router.get('/medecin/patients/:patientId/medical-record', verifyToken, medicalRecordController.getPatientMedicalRecord);
router.post('/medecin/consultations', verifyToken, medicalRecordController.addConsultation);
router.put('/medecin/consultations/:consultationId', verifyToken, medicalRecordController.updateConsultation);
router.post('/medecin/documents', verifyToken, medicalRecordController.addMedicalDocument);
router.post('/medecin/patient-allergies', verifyToken, medicalRecordController.addPatientAllergy);

// Legacy routes now redirected to medicalDossierController for consistency
router.post('/medecin/medical-history', verifyToken, medicalDossierController.addMedicalHistory);
router.post('/medecin/treatments', verifyToken, medicalDossierController.addTreatment);
router.get('/medecin/medications', verifyToken, medicalDossierController.getMedications);
router.get('/medecin/allergies', verifyToken, medicalDossierController.getAllergies);
router.post('/medecin/patient-notes', verifyToken, medicalDossierController.addPatientNote);
router.get('/medecin/patients/:patientId/notes', verifyToken, medicalRecordController.getPatientNotes);
router.post('/medecin/follow-up-reminders', verifyToken, medicalRecordController.addFollowUpReminder);
router.get('/medecin/patients/:patientId/reminders', verifyToken, medicalRecordController.getFollowUpReminders);

// Patient measurements routes - Updated to use medicalDossierController
router.get('/medecin/patients/:patientId/measurements', verifyToken, medicalDossierController.getPatientMeasurements);
router.post('/medecin/patients/:patientId/measurements', verifyToken, medicalDossierController.addPatientMeasurement);
router.put('/medecin/patients/:patientId/measurements/:measurementId', verifyToken, medicalDossierController.updatePatientMeasurement);
router.delete('/medecin/patients/:patientId/measurements/:measurementId', verifyToken, medicalDossierController.deletePatientMeasurement);

// NEW MEDICAL DOSSIER ROUTES
// Main dossier access
router.get('/medecin/patients/:patientId/dossier', verifyToken, medicalDossierController.getPatientDossier);

// Treatment management routes
router.post('/medecin/patients/:patientId/treatments', verifyToken, medicalDossierController.addTreatment);
router.put('/medecin/patients/:patientId/treatments/:treatmentId', verifyToken, medicalDossierController.updateTreatment);
router.delete('/medecin/patients/:patientId/treatments/:treatmentId', verifyToken, medicalDossierController.deleteTreatment);

// IMPROVED: Analysis request management routes (doctors request, labs provide results)
router.get('/medecin/analysis-categories', verifyToken, medicalRecordController.getAnalysisCategories);
router.get('/medecin/analysis-types', verifyToken, medicalRecordController.getAnalysisTypes);
router.get('/medecin/analysis-types/:categoryId', verifyToken, medicalRecordController.getAnalysisTypes);
router.post('/medecin/patients/:patientId/analysis-requests', verifyToken, medicalRecordController.requestAnalysis);
router.put('/medecin/patients/:patientId/analysis-requests/:requestId', verifyToken, medicalRecordController.updateAnalysisRequest);
router.delete('/medecin/patients/:patientId/analysis-requests/:requestId', verifyToken, medicalRecordController.cancelAnalysisRequest);

// Imaging request management routes
router.get('/medecin/imaging-types', verifyToken, medicalRecordController.getImagingTypes);
router.post('/medecin/patients/:patientId/imaging-requests', verifyToken, medicalRecordController.requestImaging);
router.put('/medecin/patients/:patientId/imaging-requests/:requestId', verifyToken, medicalRecordController.updateImagingRequest);
router.delete('/medecin/patients/:patientId/imaging-requests/:requestId', verifyToken, medicalRecordController.cancelImagingRequest);

// Patient profile update routes (all fields modifiable by doctor)
router.put('/medecin/patients/:patientId/profile', verifyToken, medicalDossierController.updatePatientProfile);

// Medical history management
router.post('/medecin/patients/:patientId/medical-history', verifyToken, medicalDossierController.addMedicalHistory);

// Patient notes management
router.post('/medecin/patients/:patientId/notes', verifyToken, medicalDossierController.addPatientNote);

// Autocomplete/search routes for forms
router.get('/medecin/medications/search', verifyToken, medicalDossierController.getMedications);
router.get('/medecin/allergies/search', verifyToken, medicalDossierController.getAllergies);

module.exports = router;
const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController');
const appointmentController = require('../controllers/medecin/appointmentController');
const medicalRecordController = require('../controllers/medecin/medicalRecordController');
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

router.get('/medecin/absences', verifyToken, medecinController.getEmergencyAbsences);
router.post('/medecin/absences', verifyToken, medecinController.addEmergencyAbsence);
router.delete('/medecin/absences/:id', verifyToken, medecinController.deleteEmergencyAbsence);
router.post('/medecin/patients', verifyToken, medecinController.addPatient);
router.get('/medecin/patients', verifyToken, medecinController.getPatients);

// Appointment routes
router.get('/medecin/appointments', verifyToken, appointmentController.getUpcomingAppointments);
router.get('/medecin/appointments/:appointmentId', verifyToken, appointmentController.getAppointmentById);
router.put('/medecin/appointments/:appointmentId/status', verifyToken, appointmentController.updateAppointmentStatus);

// Medical records routes
router.get('/medecin/patients/search', verifyToken, medicalRecordController.searchPatients);
router.get('/medecin/patients/:patientId/medical-record', verifyToken, medicalRecordController.getPatientMedicalRecord);
router.post('/medecin/consultations', verifyToken, medicalRecordController.addConsultation);
router.put('/medecin/consultations/:consultationId', verifyToken, medicalRecordController.updateConsultation);
router.post('/medecin/medical-history', verifyToken, medicalRecordController.addMedicalHistory);
router.post('/medecin/treatments', verifyToken, medicalRecordController.addTreatment);
router.post('/medecin/documents', verifyToken, medicalRecordController.addMedicalDocument);
router.get('/medecin/medications', verifyToken, medicalRecordController.getMedications);
router.get('/medecin/allergies', verifyToken, medicalRecordController.getAllergies);
router.post('/medecin/patient-allergies', verifyToken, medicalRecordController.addPatientAllergy);

// New enhanced features routes
router.post('/medecin/patient-notes', verifyToken, medicalRecordController.addPatientNote);
router.get('/medecin/patients/:patientId/notes', verifyToken, medicalRecordController.getPatientNotes);
router.post('/medecin/follow-up-reminders', verifyToken, medicalRecordController.addFollowUpReminder);
router.get('/medecin/patients/:patientId/reminders', verifyToken, medicalRecordController.getFollowUpReminders);
router.post('/medecin/patient-measurements', verifyToken, medicalRecordController.addPatientMeasurement);
router.get('/medecin/patients/:patientId/measurements', verifyToken, medicalRecordController.getPatientMeasurements);
router.get('/medecin/patients/:patientId/measurements/:type_mesure', verifyToken, medicalRecordController.getPatientMeasurements);

module.exports = router;
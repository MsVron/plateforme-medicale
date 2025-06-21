// This file is now just a proxy to the modular structure
module.exports = require('./medecin');

// Import the controllers
const medicalRecordController = require('./medecin/medicalRecordController');
const medicalDossierController = require('./medecin/medicalDossierController');
const appointmentController = require('./medecin/appointmentController');
const doctorController = require('./medecin/doctorController');

// Re-export functions from the medical record controller (lab/analysis focused)
exports.searchPatients = medicalRecordController.searchPatients;
exports.getPatientMedicalRecord = medicalRecordController.getPatientMedicalRecord;
exports.addConsultation = medicalRecordController.addConsultation;
exports.updateConsultation = medicalRecordController.updateConsultation;
exports.addMedicalDocument = medicalRecordController.addMedicalDocument;
exports.addPatientAllergy = medicalRecordController.addPatientAllergy;
exports.getPatientNotes = medicalRecordController.getPatientNotes;
exports.addFollowUpReminder = medicalRecordController.addFollowUpReminder;
exports.getFollowUpReminders = medicalRecordController.getFollowUpReminders;

// Re-export functions from the medical dossier controller (patient care focused)
exports.addMedicalHistory = medicalDossierController.addMedicalHistory;
exports.addTreatment = medicalDossierController.addTreatment;
exports.getMedications = medicalDossierController.getMedications;
exports.getAllergies = medicalDossierController.getAllergies;
exports.addPatientNote = medicalDossierController.addPatientNote;
exports.addPatientMeasurement = medicalDossierController.addPatientMeasurement;
exports.getPatientMeasurements = medicalDossierController.getPatientMeasurements;

// Re-export functions from the appointment controller
exports.getUpcomingAppointments = appointmentController.getUpcomingAppointments;
exports.getAppointmentById = appointmentController.getAppointmentById;
exports.updateAppointmentStatus = appointmentController.updateAppointmentStatus;

// Re-export functions from the doctor controller
exports.getWalkInPreference = doctorController.getWalkInPreference;
exports.updateWalkInPreference = doctorController.updateWalkInPreference;
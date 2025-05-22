// This file is now just a proxy to the modular structure
module.exports = require('./medecin');

// Import the medical record controller
const medicalRecordController = require('./medecin/medicalRecordController');
const appointmentController = require('./medecin/appointmentController');
const doctorController = require('./medecin/doctorController');

// Re-export functions from the medical record controller
exports.searchPatients = medicalRecordController.searchPatients;
exports.getPatientMedicalRecord = medicalRecordController.getPatientMedicalRecord;
exports.addConsultation = medicalRecordController.addConsultation;
exports.updateConsultation = medicalRecordController.updateConsultation;
exports.addMedicalHistory = medicalRecordController.addMedicalHistory;
exports.addTreatment = medicalRecordController.addTreatment;
exports.addMedicalDocument = medicalRecordController.addMedicalDocument;
exports.getMedications = medicalRecordController.getMedications;
exports.getAllergies = medicalRecordController.getAllergies;
exports.addPatientAllergy = medicalRecordController.addPatientAllergy;
exports.addPatientNote = medicalRecordController.addPatientNote;
exports.getPatientNotes = medicalRecordController.getPatientNotes;
exports.addFollowUpReminder = medicalRecordController.addFollowUpReminder;
exports.getFollowUpReminders = medicalRecordController.getFollowUpReminders;
exports.addPatientMeasurement = medicalRecordController.addPatientMeasurement;
exports.getPatientMeasurements = medicalRecordController.getPatientMeasurements;

// Re-export functions from the appointment controller
exports.getUpcomingAppointments = appointmentController.getUpcomingAppointments;
exports.getAppointmentById = appointmentController.getAppointmentById;
exports.updateAppointmentStatus = appointmentController.updateAppointmentStatus;

// Re-export functions from the doctor controller
exports.getWalkInPreference = doctorController.getWalkInPreference;
exports.updateWalkInPreference = doctorController.updateWalkInPreference;
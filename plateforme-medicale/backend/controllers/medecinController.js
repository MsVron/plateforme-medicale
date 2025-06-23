// This file is now just a proxy to the modular structure

// Import the controllers
const medicalRecordController = require('./medecin/medicalRecordController');
const medicalDossierController = require('./medecin/medicalDossierController');
const appointmentController = require('./medecin/appointmentController');
const doctorController = require('./medecin/doctorController');
const availabilityController = require('./medecin/availabilityController');
const publicController = require('./medecin/publicController');
const institutionController = require('./medecin/institutionController');
const patientController = require('./medecin/patientController');
const hospitalDoctorController = require('./medecin/hospitalDoctorController');

// Re-export functions from the doctor controller
exports.getCurrentMedecin = doctorController.getCurrentMedecin;
exports.getWalkInPreference = doctorController.getWalkInPreference;
exports.updateWalkInPreference = doctorController.updateWalkInPreference;
exports.updateConsultationFee = doctorController.updateConsultationFee;
exports.getMedecins = doctorController.getMedecins;
exports.getMedecinById = doctorController.getMedecinById;
exports.addMedecin = doctorController.addMedecin;
exports.editMedecin = doctorController.editMedecin;
exports.deleteMedecin = doctorController.deleteMedecin;

// Re-export functions from the public controller
exports.getPublicMedecins = publicController.getPublicMedecins;
exports.getPublicSpecialites = publicController.getPublicSpecialites;
exports.getPublicMedecinById = publicController.getPublicMedecinById;

// Re-export functions from the institution controller
exports.getSpecialites = institutionController.getSpecialites;
exports.getInstitutions = institutionController.getInstitutions;
exports.getDoctorInstitutions = institutionController.getDoctorInstitutions;

// Re-export functions from the availability controller
exports.getAvailabilities = availabilityController.getAvailabilities;
exports.addAvailability = availabilityController.addAvailability;
exports.updateAvailability = availabilityController.updateAvailability;
exports.deleteAvailability = availabilityController.deleteAvailability;
exports.getEmergencyAbsences = availabilityController.getEmergencyAbsences;
exports.addEmergencyAbsence = availabilityController.addEmergencyAbsence;
exports.deleteEmergencyAbsence = availabilityController.deleteEmergencyAbsence;

// Re-export functions from the patient controller
exports.getPatients = patientController.getPatients;
exports.addPatient = patientController.addPatient;
exports.debugHospitalDoctor = patientController.debugHospitalDoctor;

// Re-export functions from the hospital doctor controller
exports.getCurrentHospitalMedecin = hospitalDoctorController.getCurrentHospitalMedecin;
exports.getAssignedHospitalPatients = hospitalDoctorController.getAssignedHospitalPatients;
exports.getHospitalPatientMedicalRecord = hospitalDoctorController.getHospitalPatientMedicalRecord;

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
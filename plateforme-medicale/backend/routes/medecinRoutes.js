const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController');
const appointmentController = require('../controllers/medecin/appointmentController');
const medicalRecordController = require('../controllers/medecin/medicalRecordController');
const medicalDossierController = require('../controllers/medecin/medicalDossierController');
const patientController = require('../controllers/medecin/patientController');
const hospitalDoctorController = require('../controllers/medecin/hospitalDoctorController');
const { verifyToken, isAdmin, isSuperAdmin, isMedecin } = require('../middlewares/auth');

// Public routes (no authentication required)
router.get('/medecins/public', medecinController.getPublicMedecins);
router.get('/specialites/public', medecinController.getPublicSpecialites);
router.get('/medecins/public/:id', medecinController.getPublicMedecinById);

// Protected routes
router.get('/medecins', verifyToken, isAdmin, medecinController.getMedecins);
router.get('/medecins/:id', verifyToken, medecinController.getMedecinById);
// Doctor management with approval system
router.post('/medecins', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Create approval request instead of direct creation
        const requestData = req.body;
        
        await db.query('START TRANSACTION');
        
        try {
            // Create the approval request
            const [result] = await db.execute(`
                INSERT INTO doctor_change_requests (
                    request_type, requested_by_user_id, request_data, status, date_requested
                ) VALUES (?, ?, ?, 'pending', NOW())
            `, ['create', req.user.id, JSON.stringify(requestData)]);
            
            const requestId = result.insertId;
            
            // Notify all superadmins
            const [superadmins] = await db.execute(`
                SELECT id FROM utilisateurs WHERE role = 'super_admin' AND est_actif = TRUE
            `);
            
            for (const superadmin of superadmins) {
                await db.execute(`
                    INSERT INTO notifications (utilisateur_id, titre, message, type, related_request_id, related_request_type)
                    VALUES (?, ?, ?, 'approval_request', ?, 'doctor')
                `, [
                    superadmin.id,
                    'Nouvelle demande de création de médecin',
                    `L'administrateur ${req.user.prenom} ${req.user.nom} demande la création d'un nouveau médecin: ${requestData.prenom} ${requestData.nom}`,
                    requestId
                ]);
            }
            
            await db.query('COMMIT');
            
            res.json({ 
                message: 'Demande de création de médecin soumise pour approbation',
                requestId: requestId 
            });
            
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
        
    } catch (error) {
        console.error('Error creating doctor approval request:', error);
        res.status(500).json({ message: 'Erreur lors de la soumission de la demande' });
    }
});

router.put('/medecins/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const doctorId = req.params.id;
        
        // Get current doctor data
        const [currentDoctors] = await db.execute(`
            SELECT * FROM medecins WHERE id = ?
        `, [doctorId]);
        
        if (currentDoctors.length === 0) {
            return res.status(404).json({ message: 'Médecin non trouvé' });
        }
        
        const currentData = currentDoctors[0];
        const requestData = req.body;
        
        await db.query('START TRANSACTION');
        
        try {
            // Create the approval request
            const [result] = await db.execute(`
                INSERT INTO doctor_change_requests (
                    medecin_id, request_type, requested_by_user_id, request_data, current_data, status, date_requested
                ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())
            `, [doctorId, 'modify', req.user.id, JSON.stringify(requestData), JSON.stringify(currentData)]);
            
            const requestId = result.insertId;
            
            // Notify all superadmins
            const [superadmins] = await db.execute(`
                SELECT id FROM utilisateurs WHERE role = 'super_admin' AND est_actif = TRUE
            `);
            
            for (const superadmin of superadmins) {
                await db.execute(`
                    INSERT INTO notifications (utilisateur_id, titre, message, type, related_request_id, related_request_type)
                    VALUES (?, ?, ?, 'approval_request', ?, 'doctor')
                `, [
                    superadmin.id,
                    'Demande de modification de médecin',
                    `L'administrateur ${req.user.prenom} ${req.user.nom} demande la modification du médecin: ${currentData.prenom} ${currentData.nom}`,
                    requestId
                ]);
            }
            
            await db.query('COMMIT');
            
            res.json({ 
                message: 'Demande de modification de médecin soumise pour approbation',
                requestId: requestId 
            });
            
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
        
    } catch (error) {
        console.error('Error creating doctor modification request:', error);
        res.status(500).json({ message: 'Erreur lors de la soumission de la demande' });
    }
});

router.delete('/medecins/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const doctorId = req.params.id;
        
        // Get current doctor data
        const [currentDoctors] = await db.execute(`
            SELECT * FROM medecins WHERE id = ?
        `, [doctorId]);
        
        if (currentDoctors.length === 0) {
            return res.status(404).json({ message: 'Médecin non trouvé' });
        }
        
        const currentData = currentDoctors[0];
        
        await db.query('START TRANSACTION');
        
        try {
            // Create the approval request
            const [result] = await db.execute(`
                INSERT INTO doctor_change_requests (
                    medecin_id, request_type, requested_by_user_id, current_data, status, date_requested
                ) VALUES (?, ?, ?, ?, 'pending', NOW())
            `, [doctorId, 'delete', req.user.id, JSON.stringify(currentData)]);
            
            const requestId = result.insertId;
            
            // Notify all superadmins
            const [superadmins] = await db.execute(`
                SELECT id FROM utilisateurs WHERE role = 'super_admin' AND est_actif = TRUE
            `);
            
            for (const superadmin of superadmins) {
                await db.execute(`
                    INSERT INTO notifications (utilisateur_id, titre, message, type, related_request_id, related_request_type)
                    VALUES (?, ?, ?, 'approval_request', ?, 'doctor')
                `, [
                    superadmin.id,
                    'Demande de suppression de médecin',
                    `L'administrateur ${req.user.prenom} ${req.user.nom} demande la suppression du médecin: ${currentData.prenom} ${currentData.nom}`,
                    requestId
                ]);
            }
            
            await db.query('COMMIT');
            
            res.json({ 
                message: 'Demande de suppression de médecin soumise pour approbation',
                requestId: requestId 
            });
            
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
        
    } catch (error) {
        console.error('Error creating doctor deletion request:', error);
        res.status(500).json({ message: 'Erreur lors de la soumission de la demande' });
    }
});
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

// Imaging notes management routes
router.post('/medecin/imaging-results/:imagingResultId/notes', verifyToken, medicalRecordController.addImagingNote);
router.get('/medecin/imaging-results/:imagingResultId/notes', verifyToken, medicalRecordController.getImagingNotes);
router.put('/medecin/imaging-results/:imagingResultId/notes/:noteId', verifyToken, medicalRecordController.updateImagingNote);
router.delete('/medecin/imaging-results/:imagingResultId/notes/:noteId', verifyToken, medicalRecordController.deleteImagingNote);

// Patient profile update routes (all fields modifiable by doctor)
router.put('/medecin/patients/:patientId/profile', verifyToken, medicalDossierController.updatePatientProfile);

// Medical history management
router.post('/medecin/patients/:patientId/medical-history', verifyToken, medicalDossierController.addMedicalHistory);

// Patient notes management
router.post('/medecin/patients/:patientId/notes', verifyToken, medicalDossierController.addPatientNote);
router.put('/medecin/patients/:patientId/notes/:noteId', verifyToken, medicalDossierController.updatePatientNote);
router.delete('/medecin/patients/:patientId/notes/:noteId', verifyToken, medicalDossierController.deletePatientNote);

// Autocomplete/search routes for forms
router.get('/medecin/medications/search', verifyToken, medicalDossierController.getMedications);
router.get('/medecin/allergies/search', verifyToken, medicalDossierController.getAllergies);

// Create follow-up appointment for patient
router.post('/medecin/patients/:patientId/follow-up-appointment', verifyToken, isMedecin, medicalDossierController.createFollowUpAppointment);

// Patients management routes
router.get('/medecin/patients', verifyToken, isMedecin, patientController.getPatients);
router.get('/medecin/patients/hospital', verifyToken, isMedecin, patientController.getAssignedHospitalPatients);
router.get('/medecin/patients/search', verifyToken, isMedecin, medicalRecordController.searchPatients);

// Diagnostic route for hospital doctors
router.get('/medecin/debug-hospital', verifyToken, isMedecin, patientController.debugHospitalDoctor);

// NEW HOSPITAL DOCTOR SPECIFIC ROUTES
// Alternative dashboard route for hospital doctors
router.get('/medecin/hospital/dashboard', verifyToken, isMedecin, hospitalDoctorController.getCurrentHospitalMedecin);

// Hospital doctor patients routes
router.get('/medecin/hospital/assigned-patients', verifyToken, isMedecin, hospitalDoctorController.getAssignedHospitalPatients);
router.get('/medecin/hospital/patients/:patientId/medical-record', verifyToken, isMedecin, hospitalDoctorController.getHospitalPatientMedicalRecord);

module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyToken, isPharmacy } = require('../middlewares/auth');
const pharmacyController = require('../controllers/pharmacy/pharmacyController');

// Patient search routes
router.get('/patients/search', verifyToken, isPharmacy, pharmacyController.searchPatients);

// Prescription and medication routes
router.get('/patients/:patientId/prescriptions', verifyToken, isPharmacy, pharmacyController.getPatientPrescriptions);

// Simplified medication dispensing routes
router.post('/prescriptions/:prescriptionId/dispense', verifyToken, isPharmacy, pharmacyController.dispenseMedication);

// Medication interaction checking
router.post('/medications/check-interactions', verifyToken, isPharmacy, pharmacyController.checkMedicationInteractions);

module.exports = router; 
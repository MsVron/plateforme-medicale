const express = require('express');
const router = express.Router();
const { verifyToken, isHospital } = require('../middlewares/auth');
const hospitalController = require('../controllers/hospital/hospitalController');

// Patient search routes
router.get('/patients/search', verifyToken, isHospital, hospitalController.searchPatients);
router.get('/patients', verifyToken, isHospital, hospitalController.getHospitalPatients);

// Patient admission routes
router.post('/patients/:patientId/admit', verifyToken, isHospital, hospitalController.admitPatient);
router.put('/assignments/:assignmentId/discharge', verifyToken, isHospital, hospitalController.dischargePatient);

// Walk-in patient routes
router.post('/patients/walk-in', verifyToken, isHospital, hospitalController.addWalkInPatient);

// Hospital doctors routes
router.get('/doctors', verifyToken, isHospital, hospitalController.getHospitalDoctors);

module.exports = router; 
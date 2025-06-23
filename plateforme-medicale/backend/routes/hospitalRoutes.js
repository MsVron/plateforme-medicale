const express = require('express');
const router = express.Router();
const { verifyToken, isHospital } = require('../middlewares/auth');
const hospitalController = require('../controllers/hospital/hospitalController');

// DEBUG ROUTE - Test if hospital routes are working
router.get('/debug/test', (req, res) => {
  res.json({ message: 'Hospital routes are working!', timestamp: new Date().toISOString() });
});

// Patient search routes
router.get('/patients/search', verifyToken, isHospital, hospitalController.searchPatients);
router.get('/patients', verifyToken, isHospital, hospitalController.getHospitalPatients);

// Patient assignment routes
router.post('/patients/:patientId/assign-doctors', verifyToken, isHospital, hospitalController.assignPatientToDoctors);
router.put('/patients/:patientId/discharge', verifyToken, isHospital, hospitalController.dischargePatient);

// New route for assigning doctors to existing admissions
router.post('/admissions/:admissionId/assign-doctor', verifyToken, isHospital, hospitalController.assignDoctorToAdmission);

// Walk-in patient routes
router.post('/patients/walk-in', verifyToken, isHospital, hospitalController.addWalkInPatient);

// Hospital doctors routes
// IMPORTANT: /doctors/search must come BEFORE /doctors to avoid route conflicts
router.get('/doctors/search', verifyToken, isHospital, hospitalController.searchDoctors);
router.get('/doctors', verifyToken, isHospital, hospitalController.getHospitalDoctors);

// Bed management routes
router.get('/beds/stats', verifyToken, isHospital, hospitalController.getBedStatistics);
router.get('/beds', verifyToken, isHospital, hospitalController.getBeds);
router.post('/beds', verifyToken, isHospital, hospitalController.createBed);
router.put('/beds/:bedId', verifyToken, isHospital, hospitalController.updateBed);
router.post('/beds/:bedId/assign', verifyToken, isHospital, hospitalController.assignPatientToBed);
router.post('/beds/:bedId/transfer', verifyToken, isHospital, hospitalController.transferPatient);
router.get('/wards', verifyToken, isHospital, hospitalController.getWards);

// Surgery management routes
router.get('/surgeries/stats', verifyToken, isHospital, hospitalController.getSurgeryStatistics);
router.get('/surgeries', verifyToken, isHospital, hospitalController.getSurgeries);
router.post('/surgeries', verifyToken, isHospital, hospitalController.createSurgery);
router.put('/surgeries/:surgeryId', verifyToken, isHospital, hospitalController.updateSurgery);
router.get('/operating-rooms', verifyToken, isHospital, hospitalController.getOperatingRooms);

// Doctor management routes  
router.post('/doctors/:doctorId/assign', verifyToken, isHospital, hospitalController.addDoctorToHospital);
router.delete('/doctors/:doctorId/remove', verifyToken, isHospital, hospitalController.removeDoctorFromHospital);

// Hospital admissions routes
router.get('/admissions', verifyToken, isHospital, hospitalController.getHospitalAdmissions);
router.get('/admissions/:admissionId/details', verifyToken, isHospital, hospitalController.getPatientAdmissionDetails);
router.delete('/admissions/:admissionId/doctors/:doctorId', verifyToken, isHospital, hospitalController.removeDoctorFromAdmission);
router.post('/patients/:patient_id/admit', verifyToken, isHospital, hospitalController.admitPatient);
router.put('/admissions/:admissionId/discharge', verifyToken, isHospital, hospitalController.dischargePatient);

// Statistics routes
router.get('/stats/doctors', verifyToken, isHospital, hospitalController.getDoctorStats);
router.get('/stats/admissions', verifyToken, isHospital, hospitalController.getAdmissionStats);

// Get all medical specialties
router.get('/specialties', hospitalController.getSpecialties);

// Medical record routes
router.get('/patients/:patientId/medical-record', verifyToken, isHospital, hospitalController.getPatientMedicalRecord);
router.put('/patients/:patientId/medical-record', verifyToken, isHospital, hospitalController.updatePatientMedicalRecord);

module.exports = router; 
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, isSuperAdmin, isMedecin } = require('../middlewares/auth');

router.get('/patients', verifyToken, isSuperAdmin, patientController.getPatients);
router.post('/patients', verifyToken, isSuperAdmin, patientController.addPatient);
router.put('/patients/:id', verifyToken, isSuperAdmin, patientController.editPatient);
router.delete('/patients/:id', verifyToken, isSuperAdmin, patientController.deletePatient);

// Route pour récupérer les patients (protégée)
router.get('/', verifyToken, patientController.getPatients);

// Route pour ajouter un patient walk-in (réservée aux médecins)
router.post('/walk-in', verifyToken, isMedecin, patientController.addWalkInPatient);

module.exports = router;
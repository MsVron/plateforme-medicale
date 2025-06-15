const express = require('express');
const router = express.Router();
const { verifyToken, isLaboratory } = require('../middlewares/auth');
const laboratoryController = require('../controllers/laboratory/laboratoryController');

// Patient search routes
router.get('/patients/search', verifyToken, isLaboratory, laboratoryController.searchPatients);

// Test request routes
router.get('/patients/:patientId/test-requests', verifyToken, isLaboratory, laboratoryController.getPatientTestRequests);

// Result upload routes
router.put('/test-requests/:testRequestId/results', verifyToken, isLaboratory, laboratoryController.uploadTestResults);
router.put('/imaging-requests/:imagingRequestId/results', verifyToken, isLaboratory, laboratoryController.uploadImagingResults);

// Work management routes
router.get('/pending-work', verifyToken, isLaboratory, laboratoryController.getPendingWork);

module.exports = router; 
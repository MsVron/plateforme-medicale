const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken, isLaboratory } = require('../middlewares/auth');
const laboratoryController = require('../controllers/laboratory/laboratoryController');

// Configure multer for imaging file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/imaging');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `imaging-${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per request
  },
  fileFilter: function (req, file, cb) {
    // Allow images and PDF files
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image (JPEG, PNG, GIF, WebP) et PDF sont autorisés'));
    }
  }
});

// Patient search routes
router.get('/patients/search', verifyToken, isLaboratory, laboratoryController.searchPatients);

// Test request routes
router.get('/patients/:patientId/test-requests', verifyToken, isLaboratory, laboratoryController.getPatientTestRequests);

// Request acceptance routes
router.post('/test-requests/:testRequestId/accept', verifyToken, isLaboratory, laboratoryController.acceptTestRequest);
router.post('/imaging-requests/:imagingRequestId/accept', verifyToken, isLaboratory, laboratoryController.acceptImagingRequest);

// Result upload routes
router.put('/test-requests/:testRequestId/results', verifyToken, isLaboratory, laboratoryController.uploadTestResults);
router.put('/imaging-requests/:imagingRequestId/results', verifyToken, isLaboratory, laboratoryController.uploadImagingResults);

// File upload routes
router.post('/imaging-requests/:imagingRequestId/files', verifyToken, isLaboratory, upload.array('images', 10), laboratoryController.uploadImagingFiles);

// Work management routes
router.get('/pending-work', verifyToken, isLaboratory, laboratoryController.getPendingWork);

module.exports = router; 
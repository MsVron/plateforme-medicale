const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointments/appointmentController');
const { verifyToken } = require('../middlewares/auth');

// Get available slots for a doctor
router.get('/slots', verifyToken, appointmentController.getAvailableSlots);

// Get formatted available slots for a doctor according to requirements
router.get('/formatted-slots', verifyToken, appointmentController.getFormattedAvailableSlots);

// Create a new appointment (requires patient authentication)
router.post('/', verifyToken, appointmentController.createAppointment);

module.exports = router; 
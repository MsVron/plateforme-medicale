const express = require('express');
const router = express.Router();
const { format, parse, addMinutes, isWithinInterval } = require('date-fns');
const fr = require('date-fns/locale/fr');
const pool = require('../config/database');
const auth = require('../middleware/auth');

// Get available slots for a specific doctor and date
router.get('/slots', auth, async (req, res) => {
  try {
    const { medecin_id, date } = req.query;
    if (!medecin_id || !date) {
      return res.status(400).json({ message: 'Médecin ID et date requis' });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = format(selectedDate, 'EEEE', { locale: fr }).toLowerCase();

    // Get doctor's schedule for this day
    const [schedule] = await pool.query(
      `SELECT * FROM disponibilites_medecin 
       WHERE medecin_id = ? AND jour_semaine = ? AND est_actif = TRUE`,
      [medecin_id, dayOfWeek]
    );

    if (!schedule.length) {
      return res.json({
        message: 'Le médecin n\'a pas de disponibilités ce jour',
        slots: [],
        schedule: null
      });
    }

    const doctorSchedule = schedule[0];

    // Get existing appointments for this day
    const [existingAppointments] = await pool.query(
      `SELECT date_heure_debut, date_heure_fin 
       FROM rendez_vous 
       WHERE medecin_id = ? 
       AND DATE(date_heure_debut) = ? 
       AND statut NOT IN ('annulé', 'patient absent')`,
      [medecin_id, date]
    );

    // Generate all possible time slots
    const slots = [];
    const startTime = parse(doctorSchedule.heure_debut, 'HH:mm:ss', selectedDate);
    const endTime = parse(doctorSchedule.heure_fin, 'HH:mm:ss', selectedDate);
    const interval = doctorSchedule.intervalle_minutes || 30;

    let currentTime = startTime;
    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, interval);
      
      // Check if slot is during lunch break
      let isDuringLunch = false;
      if (doctorSchedule.a_pause_dejeuner) {
        const lunchStart = parse(doctorSchedule.heure_debut_pause, 'HH:mm:ss', selectedDate);
        const lunchEnd = parse(doctorSchedule.heure_fin_pause, 'HH:mm:ss', selectedDate);
        isDuringLunch = isWithinInterval(currentTime, { start: lunchStart, end: lunchEnd }) ||
                       isWithinInterval(slotEnd, { start: lunchStart, end: lunchEnd });
      }

      // Check if slot overlaps with existing appointments
      const isOverlapping = existingAppointments.some(apt => {
        const aptStart = new Date(apt.date_heure_debut);
        const aptEnd = new Date(apt.date_heure_fin);
        return isWithinInterval(currentTime, { start: aptStart, end: aptEnd }) ||
               isWithinInterval(slotEnd, { start: aptStart, end: aptEnd });
      });

      if (!isDuringLunch && !isOverlapping) {
        slots.push({
          debut: format(currentTime, "yyyy-MM-dd'T'HH:mm:ss"),
          fin: format(slotEnd, "yyyy-MM-dd'T'HH:mm:ss")
        });
      }

      currentTime = slotEnd;
    }

    // Format schedule for frontend
    const scheduleInfo = {
      heure_debut: doctorSchedule.heure_debut,
      heure_fin: doctorSchedule.heure_fin,
      intervalle_minutes: interval,
      a_pause_dejeuner: doctorSchedule.a_pause_dejeuner,
      heure_debut_pause: doctorSchedule.heure_debut_pause,
      heure_fin_pause: doctorSchedule.heure_fin_pause
    };

    res.json({
      slots,
      schedule: scheduleInfo
    });

  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des créneaux disponibles' });
  }
});

module.exports = router; 
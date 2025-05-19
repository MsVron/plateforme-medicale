const db = require('../../config/db');
const { addDays, format, parse, isWithinInterval, addMinutes, isBefore } = require('date-fns');

exports.getAvailableSlots = async (req, res) => {
  try {
    const { medecin_id, date } = req.query;
    
    if (!medecin_id || !date) {
      return res.status(400).json({ message: "L'ID du médecin et la date sont requis" });
    }

    // Get doctor's institution first
    const [medecins] = await db.execute(
      'SELECT institution_id FROM medecins WHERE id = ?',
      [medecin_id]
    );

    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    const institution_id = medecins[0].institution_id;

    // Get doctor's regular availability for the day of week
    const dayOfWeek = format(new Date(date), 'EEEE').toLowerCase();
    const [availabilities] = await db.execute(
      `SELECT 
        heure_debut, heure_fin, intervalle_minutes,
        a_pause_dejeuner, heure_debut_pause, heure_fin_pause
       FROM disponibilites_medecin 
       WHERE medecin_id = ? AND jour_semaine = ? AND institution_id = ? AND est_actif = true`,
      [medecin_id, dayOfWeek, institution_id]
    );

    if (availabilities.length === 0) {
      return res.status(200).json({ 
        slots: [],
        message: "Le médecin n'a pas de disponibilité ce jour-là" 
      });
    }

    const availability = availabilities[0];

    // Format schedule information
    const schedule = {
      heure_debut: `${date}T${availability.heure_debut}`,
      heure_fin: `${date}T${availability.heure_fin}`,
      intervalle_minutes: availability.intervalle_minutes,
      a_pause_dejeuner: availability.a_pause_dejeuner,
      heure_debut_pause: availability.a_pause_dejeuner ? `${date}T${availability.heure_debut_pause}` : null,
      heure_fin_pause: availability.a_pause_dejeuner ? `${date}T${availability.heure_fin_pause}` : null
    };
    
    // Check for emergency absences
    const [absences] = await db.execute(
      `SELECT date_debut, date_fin 
       FROM indisponibilites_exceptionnelles 
       WHERE medecin_id = ? AND date_debut <= ? AND date_fin >= ?`,
      [medecin_id, date, date]
    );

    if (absences.length > 0) {
      return res.status(200).json({ 
        slots: [],
        schedule,
        message: "Le médecin est absent ce jour-là" 
      });
    }

    // Get existing appointments for the day
    const [existingAppointments] = await db.execute(
      `SELECT date_heure_debut, date_heure_fin 
       FROM rendez_vous 
       WHERE medecin_id = ? AND DATE(date_heure_debut) = ? 
       AND statut NOT IN ('annulé', 'patient absent')`,
      [medecin_id, date]
    );

    // Generate all possible time slots
    const slots = [];
    const startTime = parse(availability.heure_debut, 'HH:mm:ss', new Date(date));
    const endTime = parse(availability.heure_fin, 'HH:mm:ss', new Date(date));
    let currentSlot = startTime;

    while (isBefore(currentSlot, endTime)) {
      const slotEnd = addMinutes(currentSlot, availability.intervalle_minutes);
      
      // Check if slot is during lunch break
      let isDuringLunch = false;
      if (availability.a_pause_dejeuner) {
        const lunchStart = parse(availability.heure_debut_pause, 'HH:mm:ss', new Date(date));
        const lunchEnd = parse(availability.heure_fin_pause, 'HH:mm:ss', new Date(date));
        isDuringLunch = isWithinInterval(currentSlot, { start: lunchStart, end: lunchEnd });
      }

      // Check if slot conflicts with existing appointments
      const isBooked = existingAppointments.some(appointment => {
        const appointmentStart = new Date(appointment.date_heure_debut);
        const appointmentEnd = new Date(appointment.date_heure_fin);
        return isWithinInterval(currentSlot, { start: appointmentStart, end: appointmentEnd }) ||
               isWithinInterval(slotEnd, { start: appointmentStart, end: appointmentEnd });
      });

      if (!isDuringLunch && !isBooked) {
        slots.push({
          debut: format(currentSlot, 'yyyy-MM-dd\'T\'HH:mm:ss'),
          fin: format(slotEnd, 'yyyy-MM-dd\'T\'HH:mm:ss')
        });
      }

      currentSlot = slotEnd;
    }

    return res.status(200).json({ slots, schedule });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { medecin_id, date_heure_debut, date_heure_fin, motif, mode, notes_patient } = req.body;
    const patient_id = req.user.id_specifique_role;

    if (!medecin_id || !date_heure_debut || !date_heure_fin || !motif) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    // Check if slot is still available
    const [existingAppointments] = await db.execute(
      `SELECT id FROM rendez_vous 
       WHERE medecin_id = ? AND 
       ((date_heure_debut <= ? AND date_heure_fin > ?) OR
        (date_heure_debut < ? AND date_heure_fin >= ?)) AND
       statut NOT IN ('annulé', 'patient absent')`,
      [medecin_id, date_heure_debut, date_heure_debut, date_heure_fin, date_heure_fin]
    );

    if (existingAppointments.length > 0) {
      return res.status(400).json({ message: "Ce créneau n'est plus disponible" });
    }

    // Get doctor's institution
    const [medecins] = await db.execute(
      'SELECT institution_id FROM medecins WHERE id = ?',
      [medecin_id]
    );

    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    // Create appointment
    const [result] = await db.execute(
      `INSERT INTO rendez_vous (
        patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin,
        motif, mode, notes_patient, createur_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        medecin_id,
        medecins[0].institution_id,
        date_heure_debut,
        date_heure_fin,
        motif,
        mode || 'présentiel',
        notes_patient || null,
        req.user.id
      ]
    );

    // Create notification for doctor
    await db.execute(
      `INSERT INTO notifications (
        utilisateur_id, titre, message, type
      ) VALUES (
        (SELECT id FROM utilisateurs WHERE id_specifique_role = ? AND role = 'medecin'),
        'Nouveau rendez-vous',
        'Un nouveau rendez-vous a été pris pour le ' || DATE_FORMAT(?, '%d/%m/%Y à %H:%i'),
        'rdv'
      )`,
      [medecin_id, date_heure_debut]
    );

    return res.status(201).json({
      message: "Rendez-vous créé avec succès",
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}; 
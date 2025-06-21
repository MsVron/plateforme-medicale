const db = require('../../config/db');
const { addDays, format, parse, isWithinInterval, addMinutes, isBefore } = require('date-fns');
const { fr } = require('date-fns/locale');
const slotUtils = require('./slotGeneratorUtils');
const { 
  generateAppointmentToken, 
  sendAppointmentConfirmationEmail
} = require('../../utils/emailService');

// Helper function to get day of week in both French and English
function debugDayOfWeek(dateStr) {
  const date = new Date(dateStr);
  const englishDay = format(date, 'EEEE', { locale: undefined }).toLowerCase();
  const frenchDay = format(date, 'EEEE', { locale: fr }).toLowerCase();
  return { englishDay, frenchDay };
}

// Map English day names to French day names for database lookup
const dayNameMap = {
  'monday': 'lundi',
  'tuesday': 'mardi',
  'wednesday': 'mercredi',
  'thursday': 'jeudi',
  'friday': 'vendredi',
  'saturday': 'samedi',
  'sunday': 'dimanche'
};

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
    const englishDayOfWeek = format(new Date(date), 'EEEE', { locale: undefined }).toLowerCase();
    const dayOfWeek = dayNameMap[englishDayOfWeek] || englishDayOfWeek;
    
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

    // Convert existing appointments to the format expected by slot generator
    const bookedSlots = existingAppointments.map(appointment => ({
      start: appointment.date_heure_debut,
      end: appointment.date_heure_fin
    }));

    // Use the utility function to generate available slots with 24-hour format
    const availableSlots = slotUtils.generateAvailableSlots(schedule, bookedSlots, 'HH:mm');
    
    // Format slots for response
    const formattedSlots = availableSlots.map(slot => ({
      debut: format(slot.start, 'yyyy-MM-dd\'T\'HH:mm:ss'),
      fin: format(slot.end, 'yyyy-MM-dd\'T\'HH:mm:ss'),
      time: slot.time
    }));

    return res.status(200).json({ 
      slots: formattedSlots, 
      schedule,
      formattedDate: slotUtils.formatDate(date)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getFormattedAvailableSlots = async (req, res) => {
  try {
    const { medecin_id, date } = req.query;
    
    console.log('DEBUG: getFormattedAvailableSlots called with:', { medecin_id, date });
    
    if (!medecin_id || !date) {
      return res.status(400).json({ message: "L'ID du médecin et la date sont requis" });
    }

    // Get doctor's institution first
    const [medecins] = await db.execute(
      'SELECT institution_id FROM medecins WHERE id = ?',
      [medecin_id]
    );

    if (medecins.length === 0) {
      console.log('DEBUG: Médecin non trouvé:', medecin_id);
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    const institution_id = medecins[0].institution_id;
    console.log('DEBUG: Found institution_id:', institution_id);

    // Get doctor's regular availability for the day of week
    // Use the helper to find both English and French versions of the day
    const days = debugDayOfWeek(date);
    console.log('DEBUG: Day of week (English):', days.englishDay);
    console.log('DEBUG: Day of week (French):', days.frenchDay);
    
    // Map the English day name to French for database lookup
    const dayOfWeek = dayNameMap[days.englishDay] || days.englishDay;
    console.log('DEBUG: Using day of week for DB query:', dayOfWeek);
    
    // Output the SQL query to see exactly what we're searching for
    const dayQuery = `SELECT medecin_id, jour_semaine, institution_id FROM disponibilites_medecin WHERE medecin_id = ${medecin_id} AND institution_id = ${institution_id}`;
    const [allDays] = await db.execute(dayQuery);
    console.log('DEBUG: Available days from DB:', allDays.map(d => d.jour_semaine));
    
    const [availabilities] = await db.execute(
      `SELECT 
        heure_debut, heure_fin, intervalle_minutes,
        a_pause_dejeuner, heure_debut_pause, heure_fin_pause
       FROM disponibilites_medecin 
       WHERE medecin_id = ? AND jour_semaine = ? AND institution_id = ? AND est_actif = true`,
      [medecin_id, dayOfWeek, institution_id]
    );

    if (availabilities.length === 0) {
      console.log('DEBUG: No availability for this day');
      return res.status(200).json({ 
        slots: [],
        message: "Le médecin n'a pas de disponibilité ce jour-là" 
      });
    }

    const availability = availabilities[0];
    console.log('DEBUG: Found availability:', availability);

    // Format schedule information
    const schedule = {
      heure_debut: `${date}T${availability.heure_debut}`,
      heure_fin: `${date}T${availability.heure_fin}`,
      intervalle_minutes: availability.intervalle_minutes,
      a_pause_dejeuner: availability.a_pause_dejeuner,
      heure_debut_pause: availability.a_pause_dejeuner ? `${date}T${availability.heure_debut_pause}` : null,
      heure_fin_pause: availability.a_pause_dejeuner ? `${date}T${availability.heure_fin_pause}` : null
    };
    
    console.log('DEBUG: Formatted schedule:', schedule);
    
    // Check for emergency absences
    const [absences] = await db.execute(
      `SELECT date_debut, date_fin 
       FROM indisponibilites_exceptionnelles 
       WHERE medecin_id = ? AND date_debut <= ? AND date_fin >= ?`,
      [medecin_id, date, date]
    );

    if (absences.length > 0) {
      console.log('DEBUG: Doctor is absent on this day');
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

    console.log('DEBUG: Found existing appointments:', existingAppointments.length);

    // Convert existing appointments to the format expected by slot generator
    const bookedSlots = existingAppointments.map(appointment => ({
      start: appointment.date_heure_debut,
      end: appointment.date_heure_fin
    }));

    // Generate available slots using utility function with 24-hour format
    console.log('DEBUG: Generating available slots');
    const availableSlots = slotUtils.generateAvailableSlots(schedule, bookedSlots, 'HH:mm');
    console.log('DEBUG: Generated available slots:', availableSlots.length);

    // Format slots for slider display according to requirements
    const formattedSlots = slotUtils.formatSlotsForDisplay(availableSlots);
    console.log('DEBUG: Formatted slots for display:', formattedSlots.length);

    // Add debug information in the response during development
    return res.status(200).json({ 
      slots: formattedSlots.map(slot => ({
        debut: slot.debut || availableSlots.find(s => s.slotNumber === slot.slot)?.start,
        fin: slot.fin || availableSlots.find(s => s.slotNumber === slot.slot)?.end,
        time: slot.time,
        slot: slot.slot
      })),
      schedule,
      totalSlots: formattedSlots.length,
      formattedDate: slotUtils.formatDate(date),
      debug: {
        availableSlotsCount: availableSlots.length,
        formattedSlotsCount: formattedSlots.length,
        firstFewSlots: formattedSlots.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Error getting formatted available slots:', error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: error.stack 
    });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { medecin_id, date_heure_debut, date_heure_fin, motif, mode = 'présentiel', notes_patient } = req.body;
    const patientId = req.user.id_specifique_role;
    const createurId = req.user.id;

    // Validate required fields
    if (!medecin_id || !date_heure_debut || !date_heure_fin || !motif) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    // Get doctor's institution
    const [doctorInfo] = await db.execute(
      'SELECT institution_id FROM medecins WHERE id = ?',
      [medecin_id]
    );

    if (doctorInfo.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    const institution_id = doctorInfo[0].institution_id;

    // Check if the slot is still available
    const [existingAppointments] = await db.execute(
      `SELECT id FROM rendez_vous 
       WHERE medecin_id = ? 
       AND ((date_heure_debut <= ? AND date_heure_fin > ?) 
       OR (date_heure_debut < ? AND date_heure_fin >= ?))
       AND statut NOT IN ('annulé', 'patient absent')`,
      [medecin_id, date_heure_debut, date_heure_debut, date_heure_fin, date_heure_fin]
    );

    if (existingAppointments.length > 0) {
      return res.status(409).json({ message: "Ce créneau n'est plus disponible" });
    }

    // Create the appointment
    const [result] = await db.execute(
      `INSERT INTO rendez_vous (
        patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, 
        motif, statut, notes_patient, mode, createur_id
      ) VALUES (?, ?, ?, ?, ?, ?, 'planifié', ?, ?, ?)`,
      [patientId, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, notes_patient, mode, createurId]
    );

    const appointmentId = result.insertId;

    // Generate email token for confirmation only
    const confirmationToken = generateAppointmentToken();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Tokens valid for 7 days

    // Store token in database
    await db.execute(
      `INSERT INTO appointment_email_tokens (
        rendez_vous_id, token, type, date_expiration
      ) VALUES (?, ?, 'confirmation', ?)`,
      [appointmentId, confirmationToken, expirationDate]
    );

    // Get appointment details for email
    const [appointmentDetails] = await db.execute(
      `SELECT 
        rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif,
        p.prenom as patient_prenom, p.nom as patient_nom, p.email as patient_email,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        i.nom as institution_nom
      FROM rendez_vous rv
      JOIN patients p ON rv.patient_id = p.id
      JOIN medecins m ON rv.medecin_id = m.id
      JOIN institutions i ON rv.institution_id = i.id
      WHERE rv.id = ?`,
      [appointmentId]
    );

    if (appointmentDetails.length > 0) {
      const appointment = appointmentDetails[0];
      
      // Format date and time for email
      const appointmentDate = format(new Date(appointment.date_heure_debut), 'EEEE d MMMM yyyy', { locale: fr });
      const appointmentTime = format(new Date(appointment.date_heure_debut), 'HH:mm') + ' - ' + format(new Date(appointment.date_heure_fin), 'HH:mm');

      // Send confirmation email
      const emailData = {
        patientEmail: appointment.patient_email,
        patientName: `${appointment.patient_prenom} ${appointment.patient_nom}`,
        doctorName: `${appointment.medecin_prenom} ${appointment.medecin_nom}`,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        motif: appointment.motif,
        institutionName: appointment.institution_nom,
        confirmationToken: confirmationToken,
        appointmentId: appointmentId
      };

      // Send email asynchronously (don't wait for it to complete)
      sendAppointmentConfirmationEmail(emailData).catch(error => {
        console.error('Failed to send appointment confirmation email:', error);
      });
    }

    // Create notification for doctor
    await db.execute(
      `INSERT INTO notifications (
        utilisateur_id, titre, message, type
      ) VALUES (
        (SELECT id FROM utilisateurs WHERE id_specifique_role = ? AND role = 'medecin'),
        'Nouveau rendez-vous',
        CONCAT('Un nouveau rendez-vous a été pris pour le ', DATE_FORMAT(?, '%d/%m/%Y à %H:%i')),
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

// Add new controller function for checking patient appointments
exports.checkPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id_specifique_role;
    const { medecin_id } = req.query;

    if (!medecin_id) {
      return res.status(400).json({ message: "medecin_id est requis" });
    }

    // Check for existing appointment with the same doctor
    const [sameDoctorAppointment] = await db.execute(
      `SELECT rv.id, rv.date_heure_debut, rv.statut,
              CONCAT(m.prenom, ' ', m.nom) as medecin_nom
       FROM rendez_vous rv
       JOIN medecins m ON rv.medecin_id = m.id
       WHERE rv.patient_id = ? AND rv.medecin_id = ? 
       AND rv.statut NOT IN ('annulé', 'terminé', 'patient absent')
       AND rv.date_heure_debut > NOW()
       ORDER BY rv.date_heure_debut ASC
       LIMIT 1`,
      [patientId, medecin_id]
    );

    // Check for existing appointment with the same specialty
    const [sameSpecialtyAppointment] = await db.execute(
      `SELECT rv.id, rv.date_heure_debut, rv.statut,
              CONCAT(m.prenom, ' ', m.nom) as medecin_nom,
              s.nom as specialite
       FROM rendez_vous rv
       JOIN medecins m ON rv.medecin_id = m.id
       JOIN specialites s ON m.specialite_id = s.id
       WHERE rv.patient_id = ? 
       AND m.specialite_id = (SELECT specialite_id FROM medecins WHERE id = ?)
       AND rv.medecin_id != ?
       AND rv.statut NOT IN ('annulé', 'terminé', 'patient absent')
       AND rv.date_heure_debut > NOW()
       ORDER BY rv.date_heure_debut ASC
       LIMIT 1`,
      [patientId, medecin_id, medecin_id]
    );

    return res.status(200).json({
      hasSameDoctorAppointment: sameDoctorAppointment.length > 0,
      hasSameSpecialtyAppointment: sameSpecialtyAppointment.length > 0,
      sameDoctorAppointment: sameDoctorAppointment.length > 0 ? sameDoctorAppointment[0] : null,
      sameSpecialtyAppointment: sameSpecialtyAppointment.length > 0 ? sameSpecialtyAppointment[0] : null
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des rendez-vous:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Confirm appointment via email link
exports.confirmAppointmentByEmail = async (req, res) => {
  try {
    const { token, id } = req.query;

    if (!token || !id) {
      return res.status(400).json({ 
        message: "Token et ID du rendez-vous requis",
        redirect: "/error?message=Lien invalide"
      });
    }

    // Verify token and get appointment details
    const [tokenData] = await db.execute(
      `SELECT aet.*, rv.statut, rv.date_heure_debut, rv.date_heure_fin,
              p.prenom as patient_prenom, p.nom as patient_nom,
              m.prenom as medecin_prenom, m.nom as medecin_nom
       FROM appointment_email_tokens aet
       JOIN rendez_vous rv ON aet.rendez_vous_id = rv.id
       JOIN patients p ON rv.patient_id = p.id
       JOIN medecins m ON rv.medecin_id = m.id
       WHERE aet.token = ? AND aet.rendez_vous_id = ? AND aet.type = 'confirmation'
       AND aet.date_expiration > NOW() AND aet.utilise = FALSE`,
      [token, id]
    );

    if (tokenData.length === 0) {
      return res.status(404).json({ 
        message: "Token invalide ou expiré",
        redirect: "/error?message=Lien de confirmation invalide ou expiré"
      });
    }

    const appointment = tokenData[0];

    // Check if appointment is still valid for confirmation
    if (appointment.statut === 'confirmé') {
      return res.status(200).json({ 
        message: "Rendez-vous déjà confirmé",
        redirect: "/success?message=Votre rendez-vous était déjà confirmé"
      });
    }

    if (['annulé', 'terminé', 'patient absent'].includes(appointment.statut)) {
      return res.status(400).json({ 
        message: "Impossible de confirmer ce rendez-vous",
        redirect: "/error?message=Ce rendez-vous ne peut plus être confirmé"
      });
    }

    // Check if appointment is not in the past
    if (new Date(appointment.date_heure_debut) < new Date()) {
      return res.status(400).json({ 
        message: "Impossible de confirmer un rendez-vous passé",
        redirect: "/error?message=Ce rendez-vous est déjà passé"
      });
    }

    // Update appointment status to confirmed
    await db.execute(
      'UPDATE rendez_vous SET statut = ? WHERE id = ?',
      ['confirmé', id]
    );

    // Mark token as used
    await db.execute(
      `UPDATE appointment_email_tokens 
       SET utilise = TRUE 
       WHERE id = ?`,
      [appointment.id]
    );

    // Return success response with redirect
    return res.status(200).json({
      message: "Rendez-vous confirmé avec succès",
      redirect: `/success?message=Votre rendez-vous avec Dr. ${appointment.medecin_prenom} ${appointment.medecin_nom} a été confirmé`,
      appointment: {
        doctor: `${appointment.medecin_prenom} ${appointment.medecin_nom}`,
        date: format(new Date(appointment.date_heure_debut), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })
      }
    });

  } catch (error) {
    console.error('Erreur lors de la confirmation du rendez-vous:', error);
    return res.status(500).json({ 
      message: "Erreur serveur",
      redirect: "/error?message=Erreur lors de la confirmation"
    });
  }
};

 
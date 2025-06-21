const db = require('../../config/db');
const { format } = require('date-fns');
const { fr } = require('date-fns/locale');

// Get upcoming appointments for the doctor
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { limit, offset, date } = req.query;
    
    // Default pagination values
    const pageLimit = limit ? parseInt(limit) : 10;
    const pageOffset = offset ? parseInt(offset) : 0;
    
      // Base query to get appointments
  let query = `
    SELECT 
      rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif, rv.statut,
      p.id as patient_id, p.prenom as patient_prenom, p.nom as patient_nom,
      p.date_naissance, p.sexe, p.telephone, p.email,
      i.nom as institution_nom
    FROM rendez_vous rv
    JOIN patients p ON rv.patient_id = p.id
    JOIN institutions i ON rv.institution_id = i.id
    WHERE rv.medecin_id = ? 
    AND DATE(rv.date_heure_debut) >= CURDATE()
    AND rv.statut NOT IN ('annulé', 'terminé')
    ORDER BY rv.date_heure_debut ASC
  `;
  
  const params = [
    medecinId
  ];
    
    // Add pagination
    if (pageLimit) {
      query += ' LIMIT ?';
      params.push(pageLimit);
      
      if (pageOffset) {
        query += ' OFFSET ?';
        params.push(pageOffset);
      }
    }
    
    // Execute query
    const [appointments] = await db.execute(query, params);
    
    // Format dates for better readability
    const formattedAppointments = appointments.map(appointment => ({
      ...appointment,
      date_formatted: format(new Date(appointment.date_heure_debut), 'EEEE d MMMM yyyy', { locale: fr }),
      heure_debut_formatted: format(new Date(appointment.date_heure_debut), 'HH:mm'),
      heure_fin_formatted: format(new Date(appointment.date_heure_fin), 'HH:mm'),
      patient_age: calculateAge(new Date(appointment.date_naissance))
    }));
    
    // Get total count for pagination
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total 
       FROM rendez_vous rv 
       WHERE rv.medecin_id = ? 
       AND DATE(rv.date_heure_debut) >= CURDATE()
       AND rv.statut NOT IN ('annulé', 'terminé')`,
      [medecinId]
    );
    
    return res.status(200).json({
      appointments: formattedAppointments,
      total: countResult[0].total,
      limit: pageLimit,
      offset: pageOffset
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get appointment details by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { appointmentId } = req.params;
    
    // Get appointment details
    const [appointments] = await db.execute(
      `SELECT 
        rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif, rv.statut, rv.notes_patient,
        p.id as patient_id, p.prenom as patient_prenom, p.nom as patient_nom,
        p.date_naissance, p.sexe, p.telephone, p.email, p.CNE,
        i.nom as institution_nom
      FROM rendez_vous rv
      JOIN patients p ON rv.patient_id = p.id
      JOIN institutions i ON rv.institution_id = i.id
      WHERE rv.medecin_id = ? AND rv.id = ?`,
      [medecinId, appointmentId]
    );
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    
    const appointment = appointments[0];
    
    // Format dates
    appointment.date_formatted = format(new Date(appointment.date_heure_debut), 'EEEE d MMMM yyyy', { locale: fr });
    appointment.heure_debut_formatted = format(new Date(appointment.date_heure_debut), 'HH:mm');
    appointment.heure_fin_formatted = format(new Date(appointment.date_heure_fin), 'HH:mm');
    appointment.patient_age = calculateAge(new Date(appointment.date_naissance));
    
    // Check if a consultation already exists for this appointment
    const [consultations] = await db.execute(
      `SELECT id FROM consultations WHERE rendez_vous_id = ?`,
      [appointmentId]
    );
    
    appointment.has_consultation = consultations.length > 0;
    if (appointment.has_consultation) {
      appointment.consultation_id = consultations[0].id;
    }
    
    return res.status(200).json({ appointment });
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { appointmentId } = req.params;
    const { statut } = req.body;
    
    // Validate status
    const validStatuses = ['planifié', 'confirmé', 'en cours', 'terminé', 'annulé', 'patient absent'];
    if (!validStatuses.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    // Check if appointment exists and belongs to this doctor
    const [appointments] = await db.execute(
      `SELECT id FROM rendez_vous WHERE id = ? AND medecin_id = ?`,
      [appointmentId, medecinId]
    );
    
    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    
    // Update status
    await db.execute(
      `UPDATE rendez_vous SET statut = ? WHERE id = ?`,
      [statut, appointmentId]
    );
    
    return res.status(200).json({ message: 'Statut du rendez-vous mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du rendez-vous:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth) {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
} 
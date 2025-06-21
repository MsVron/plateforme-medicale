const db = require('../config/db');
const { format, addDays, subDays, isAfter, isBefore } = require('date-fns');
const { fr } = require('date-fns/locale');
const { sendAppointmentReminderEmail } = require('../utils/emailService');

class AppointmentReminderService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    // Check for reminders every hour
    this.checkInterval = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  // Start the reminder service
  start() {
    if (this.isRunning) {
      console.log('Appointment reminder service is already running');
      return;
    }

    console.log('Starting appointment reminder service...');
    this.isRunning = true;
    
    // Run immediately on start
    this.checkAndSendReminders();
    
    // Then run every hour
    this.intervalId = setInterval(() => {
      this.checkAndSendReminders();
    }, this.checkInterval);
    
    console.log('Appointment reminder service started successfully');
  }

  // Stop the reminder service
  stop() {
    if (!this.isRunning) {
      console.log('Appointment reminder service is not running');
      return;
    }

    console.log('Stopping appointment reminder service...');
    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Appointment reminder service stopped');
  }

  // Check for appointments that need reminders and send them
  async checkAndSendReminders() {
    try {
      console.log('Checking for appointment reminders...');
      
      // Send 24-hour reminders
      await this.send24HourReminders();
      
      // Send 1-hour reminders (optional - can be implemented later)
      // await this.send1HourReminders();
      
    } catch (error) {
      console.error('Error in appointment reminder service:', error);
    }
  }

  // Send 24-hour reminders
  async send24HourReminders() {
    try {
      // Calculate the time window for 24-hour reminders
      // We want appointments that are between 23 and 25 hours from now
      const now = new Date();
      const reminderStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hours from now
      const reminderEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);   // 25 hours from now

      console.log(`Looking for appointments between ${reminderStart.toISOString()} and ${reminderEnd.toISOString()}`);

      // Get appointments that need 24-hour reminders
      const [appointments] = await db.execute(
        `SELECT 
          rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif,
          p.prenom as patient_prenom, p.nom as patient_nom, p.email as patient_email,
          m.prenom as medecin_prenom, m.nom as medecin_nom,
          i.nom as institution_nom,
          aet.token as confirmation_token
        FROM rendez_vous rv
        JOIN patients p ON rv.patient_id = p.id
        JOIN medecins m ON rv.medecin_id = m.id
        JOIN institutions i ON rv.institution_id = i.id
        LEFT JOIN appointment_email_tokens aet ON rv.id = aet.rendez_vous_id AND aet.type = 'confirmation'
        WHERE rv.date_heure_debut BETWEEN ? AND ?
        AND rv.statut IN ('planifié', 'confirmé')
        AND rv.rappel_24h_envoye = FALSE
        AND p.email IS NOT NULL
        AND p.email != ''`,
        [reminderStart, reminderEnd]
      );

      console.log(`Found ${appointments.length} appointments needing 24-hour reminders`);

      for (const appointment of appointments) {
        try {
          // Format date and time for email
          const appointmentDate = format(new Date(appointment.date_heure_debut), 'EEEE d MMMM yyyy', { locale: fr });
          const appointmentTime = format(new Date(appointment.date_heure_debut), 'HH:mm') + ' - ' + format(new Date(appointment.date_heure_fin), 'HH:mm');

          // Prepare email data
          const emailData = {
            patientEmail: appointment.patient_email,
            patientName: `${appointment.patient_prenom} ${appointment.patient_nom}`,
            doctorName: `${appointment.medecin_prenom} ${appointment.medecin_nom}`,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime,
            motif: appointment.motif,
            institutionName: appointment.institution_nom,
            confirmationToken: appointment.confirmation_token,
            appointmentId: appointment.id
          };

          // Send reminder email
          const emailSent = await sendAppointmentReminderEmail(emailData);

          if (emailSent) {
            // Mark as sent in database
            await db.execute(
              'UPDATE rendez_vous SET rappel_24h_envoye = TRUE WHERE id = ?',
              [appointment.id]
            );
            
            console.log(`24-hour reminder sent for appointment ${appointment.id} to ${appointment.patient_email}`);
          } else {
            console.error(`Failed to send 24-hour reminder for appointment ${appointment.id}`);
          }

        } catch (error) {
          console.error(`Error sending 24-hour reminder for appointment ${appointment.id}:`, error);
        }
      }

    } catch (error) {
      console.error('Error in send24HourReminders:', error);
    }
  }

  // Send 1-hour reminders (optional implementation)
  async send1HourReminders() {
    try {
      // Calculate the time window for 1-hour reminders
      const now = new Date();
      const reminderStart = new Date(now.getTime() + 50 * 60 * 1000); // 50 minutes from now
      const reminderEnd = new Date(now.getTime() + 70 * 60 * 1000);   // 70 minutes from now

      console.log(`Looking for 1-hour reminders between ${reminderStart.toISOString()} and ${reminderEnd.toISOString()}`);

      // Get appointments that need 1-hour reminders
      const [appointments] = await db.execute(
        `SELECT 
          rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif,
          p.prenom as patient_prenom, p.nom as patient_nom, p.email as patient_email,
          m.prenom as medecin_prenom, m.nom as medecin_nom,
          i.nom as institution_nom
        FROM rendez_vous rv
        JOIN patients p ON rv.patient_id = p.id
        JOIN medecins m ON rv.medecin_id = m.id
        JOIN institutions i ON rv.institution_id = i.id
        WHERE rv.date_heure_debut BETWEEN ? AND ?
        AND rv.statut IN ('planifié', 'confirmé')
        AND rv.rappel_1h_envoye = FALSE
        AND p.email IS NOT NULL
        AND p.email != ''`,
        [reminderStart, reminderEnd]
      );

      console.log(`Found ${appointments.length} appointments needing 1-hour reminders`);

      for (const appointment of appointments) {
        try {
          // You can implement 1-hour reminder email here
          // For now, just mark as sent
          await db.execute(
            'UPDATE rendez_vous SET rappel_1h_envoye = TRUE WHERE id = ?',
            [appointment.id]
          );
          
          console.log(`1-hour reminder processed for appointment ${appointment.id}`);

        } catch (error) {
          console.error(`Error processing 1-hour reminder for appointment ${appointment.id}:`, error);
        }
      }

    } catch (error) {
      console.error('Error in send1HourReminders:', error);
    }
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      nextCheck: this.intervalId ? new Date(Date.now() + this.checkInterval) : null
    };
  }
}

// Create singleton instance
const appointmentReminderService = new AppointmentReminderService();

module.exports = appointmentReminderService; 
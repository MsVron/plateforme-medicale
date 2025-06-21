const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Keep a single transporter instance
let transporter = null;

// Initialize the transporter based on environment
const initTransporter = () => {
  // Use environment variables for email configuration
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    console.warn('Email credentials not set. Email functionality will not work.');
    return null;
  }

  // Create Gmail transporter with settings that worked in our test
  const gmailTransporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  
  return gmailTransporter;
};

// Send a verification email
const sendVerificationEmail = async (to, token) => {
  try {
    console.log(`Sending verification email to ${to}`);
    
    // Initialize transporter if needed
    if (!transporter) {
      transporter = initTransporter();
      if (!transporter) {
        console.error('Email transporter not configured');
        return false;
      }
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"BluePulse" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Vérification de votre compte - BluePulse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4ca1af;">BluePulse - Vérification de votre compte</h1>
          <p>Merci de vous être inscrit sur BluePulse. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4ca1af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Vérifier mon compte</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>Ce lien expirera dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur notre plateforme, veuillez ignorer cet email.</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé automatiquement. Merci de ne pas y répondre.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

const sendPasswordResetEmail = async (to, token, username) => {
  try {
    console.log(`Sending password reset email to ${to}`);
    
    // Initialize transporter if needed
    if (!transporter) {
      transporter = initTransporter();
      if (!transporter) {
        console.error('Email transporter not configured');
        return false;
      }
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"BluePulse" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Réinitialisation de votre mot de passe - BluePulse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4ca1af;">BluePulse - Réinitialisation de mot de passe</h1>
          <p>Bonjour <strong>${username}</strong>,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4ca1af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p><strong>Important :</strong> Ce lien expirera dans 1 heure pour des raisons de sécurité.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email. Votre mot de passe actuel restera inchangé.</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>Pour votre sécurité, ne partagez jamais ce lien avec d'autres personnes.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Generate a random verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a secure password reset token
const generatePasswordResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
};

// Generate appointment confirmation token using crypto for security
const generateAppointmentToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send appointment confirmation email
const sendAppointmentConfirmationEmail = async (appointmentData) => {
  try {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime, motif, institutionName, confirmationToken, appointmentId } = appointmentData;
    
    console.log(`Sending appointment confirmation email to ${patientEmail}`);
    
    // Initialize transporter if needed
    if (!transporter) {
      transporter = initTransporter();
      if (!transporter) {
        console.error('Email transporter not configured');
        return false;
      }
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/appointment/confirm?token=${confirmationToken}&id=${appointmentId}`;

    const mailOptions = {
      from: `"BluePulse" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Confirmation de votre rendez-vous médical - BluePulse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4ca1af; text-align: center; margin-bottom: 30px;">
              <span style="font-size: 24px;">🏥</span> BluePulse
            </h1>
            
            <h2 style="color: #333; margin-bottom: 20px;">Confirmation de rendez-vous</h2>
            
            <p>Bonjour <strong>${patientName}</strong>,</p>
            
            <p>Votre rendez-vous médical a été confirmé avec succès. Voici les détails :</p>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4ca1af;">
              <h3 style="color: #4ca1af; margin-top: 0;">📅 Détails du rendez-vous</h3>
              <p><strong>Médecin :</strong> Dr. ${doctorName}</p>
              <p><strong>Date :</strong> ${appointmentDate}</p>
              <p><strong>Heure :</strong> ${appointmentTime}</p>
              <p><strong>Motif :</strong> ${motif}</p>
              <p><strong>Lieu :</strong> ${institutionName}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px; color: #666;">Confirmez votre présence en cliquant sur le bouton ci-dessous :</p>
              
              <div style="margin: 20px 0;">
                <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  ✅ Confirmer ma présence
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Si vous ne pouvez pas vous présenter, veuillez annuler via notre site web ou contacter directement votre médecin.
              </p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">📋 Rappels importants</h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px;">
                <li>Arrivez 15 minutes avant votre rendez-vous</li>
                <li>Apportez votre carte d'identité et carte d'assurance</li>
                <li>Préparez la liste de vos médicaments actuels</li>
                <li>En cas d'empêchement, annulez au moins 24h à l'avance</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Vous recevrez un rappel automatique 24 heures avant votre rendez-vous.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center;">
              <p>Ce message a été envoyé automatiquement par BluePulse.</p>
              <p>Pour toute question, contactez directement votre médecin ou l'établissement.</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending appointment confirmation email:', error);
    return false;
  }
};

// Send appointment reminder email (24h before)
const sendAppointmentReminderEmail = async (appointmentData) => {
  try {
    const { patientEmail, patientName, doctorName, appointmentDate, appointmentTime, motif, institutionName, confirmationToken, appointmentId } = appointmentData;
    
    console.log(`Sending appointment reminder email to ${patientEmail}`);
    
    // Initialize transporter if needed
    if (!transporter) {
      transporter = initTransporter();
      if (!transporter) {
        console.error('Email transporter not configured');
        return false;
      }
    }

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/appointment/confirm?token=${confirmationToken}&id=${appointmentId}`;

    const mailOptions = {
      from: `"BluePulse" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: '⏰ Rappel: Votre rendez-vous médical demain - BluePulse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4ca1af; text-align: center; margin-bottom: 30px;">
              <span style="font-size: 24px;">🏥</span> BluePulse
            </h1>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107; text-align: center;">
              <h2 style="color: #856404; margin: 0;">⏰ Rappel de rendez-vous</h2>
              <p style="color: #856404; margin: 10px 0 0 0; font-size: 16px;">Votre rendez-vous médical est prévu <strong>demain</strong></p>
            </div>
            
            <p>Bonjour <strong>${patientName}</strong>,</p>
            
            <p>Nous vous rappelons que vous avez un rendez-vous médical prévu demain :</p>
            
            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4ca1af;">
              <h3 style="color: #4ca1af; margin-top: 0;">📅 Détails du rendez-vous</h3>
              <p><strong>Médecin :</strong> Dr. ${doctorName}</p>
              <p><strong>Date :</strong> ${appointmentDate}</p>
              <p><strong>Heure :</strong> ${appointmentTime}</p>
              <p><strong>Motif :</strong> ${motif}</p>
              <p><strong>Lieu :</strong> ${institutionName}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px; color: #666;">Confirmez votre présence :</p>
              
              <div style="margin: 20px 0;">
                <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                  ✅ Je serai présent(e)
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Si vous ne pouvez pas vous présenter, veuillez annuler via notre site web ou contacter directement votre médecin.
              </p>
            </div>
            
            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h4 style="color: #155724; margin-top: 0;">📋 Checklist avant votre rendez-vous</h4>
              <ul style="color: #155724; margin: 0; padding-left: 20px;">
                <li>✅ Carte d'identité</li>
                <li>✅ Carte d'assurance maladie</li>
                <li>✅ Liste des médicaments actuels</li>
                <li>✅ Anciens examens/résultats si pertinents</li>
                <li>✅ Arriver 15 minutes en avance</li>
              </ul>
            </div>
            
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545; margin: 20px 0;">
              <p style="color: #721c24; margin: 0; font-weight: bold;">
                ⚠️ En cas d'empêchement, merci d'annuler votre rendez-vous via notre site web pour permettre à un autre patient de prendre ce créneau.
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center;">
              <p>Ce rappel automatique a été envoyé par BluePulse.</p>
              <p>Pour toute urgence, contactez directement votre médecin.</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment reminder email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  generateVerificationToken,
  generatePasswordResetToken,
  generateAppointmentToken,
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail
}; 
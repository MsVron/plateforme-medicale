const nodemailer = require('nodemailer');
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
  const gmailTransporter = nodemailer.createTransport({
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

// Generate a random verification token
const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

module.exports = {
  sendVerificationEmail,
  generateVerificationToken
}; 
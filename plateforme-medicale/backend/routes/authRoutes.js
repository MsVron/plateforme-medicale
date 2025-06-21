const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const patientController = require('../controllers/patientController');

// Route de connexion
router.post('/login', authController.login);

// Route de déconnexion
router.post('/logout', authController.logout);

// Route de vérification du token JWT
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Return user role and ID
    res.json({
      role: decoded.role,
      userId: decoded.userId,
      id_specifique_role: decoded.id_specifique_role
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
});

// Route d'inscription patient
router.post('/register/patient', patientController.addPatient);

// Routes de réinitialisation de mot de passe
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Route de vérification d'email
router.get('/verify-email', async (req, res) => {
  // Get token from query params
  const { token } = req.query;
  
  console.log('Verification requested with token:', token);
  
  if (!token) {
    console.log('Token missing in request');
    return res.status(400).json({ message: 'Token de vérification manquant' });
  }
  
  // Redirect URL for both success and error
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  let redirectUrl = `${frontendUrl}/verify-email?status=error`;
  
  // Get a connection with transaction support
  const db = require('../config/db');
  const conn = await db.getConnection();
  
  try {
    // Start transaction
    await conn.beginTransaction();
    
    // Check if token exists and is valid
    console.log('Checking token in database...');
    const [verificationTokens] = await conn.execute(
      'SELECT * FROM verification_patients WHERE token = ? AND date_expiration > NOW()',
      [token]
    );
    
    console.log('Verification tokens found:', verificationTokens.length);
    
    if (verificationTokens.length === 0) {
      console.log('No valid token found in database');
      // Release connection and redirect with error
      await conn.rollback();
      conn.release();
      return res.redirect(redirectUrl);
    }
    
    const patientId = verificationTokens[0].patient_id;
    console.log('Found patient ID:', patientId);
    
    // Update user as verified
    console.log('Updating user verification status...');
    const [updateResult] = await conn.execute(
      'UPDATE utilisateurs SET est_verifie = TRUE WHERE id_specifique_role = ? AND role = "patient"',
      [patientId]
    );
    console.log('Update result:', JSON.stringify(updateResult));
    
    // Verify update was successful
    if (updateResult.affectedRows === 0) {
      console.log('No rows affected in update. Rolling back.');
      await conn.rollback();
      conn.release();
      return res.redirect(redirectUrl);
    }
    
    // Double check the update worked
    const [verifiedUser] = await conn.execute(
      'SELECT est_verifie FROM utilisateurs WHERE id_specifique_role = ? AND role = "patient"',
      [patientId]
    );
    
    if (verifiedUser.length === 0 || !verifiedUser[0].est_verifie) {
      console.log('Verification failed to apply. Rolling back.');
      await conn.rollback();
      conn.release();
      return res.redirect(redirectUrl);
    }
    
    // Mark token as used
    console.log('Marking token as used...');
    await conn.execute(
      'UPDATE verification_patients SET est_verifie = TRUE WHERE patient_id = ? AND token = ?',
      [patientId, token]
    );
    
    // Commit the transaction
    await conn.commit();
    
    // Redirect to frontend verification page with success flag
    console.log('Redirecting to frontend with success status');
    redirectUrl = `${frontendUrl}/verify-email?token=${token}&status=success`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error during verification:', error);
    // Rollback on error
    await conn.rollback();
    res.redirect(redirectUrl);
  } finally {
    // Always release the connection
    conn.release();
  }
});

// Route pour valider un token de vérification
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log('POST verification requested with token:', token);
    
    if (!token) {
      console.log('POST: Token missing in request body');
      return res.status(400).json({ message: 'Token de vérification manquant' });
    }
    
    // Get a connection with transaction support
    const db = require('../config/db');
    const conn = await db.getConnection();
    
    try {
      // Start transaction
      await conn.beginTransaction();
      
      // Check if token exists and is valid
      console.log('POST: Checking token in database...');
      const [verificationTokens] = await conn.execute(
        'SELECT * FROM verification_patients WHERE token = ? AND date_expiration > NOW()',
        [token]
      );
      
      console.log('POST: Verification tokens found:', verificationTokens.length);
      
      if (verificationTokens.length === 0) {
        console.log('POST: No valid token found in database');
        await conn.rollback();
        conn.release();
        return res.status(400).json({ 
          message: 'Token de vérification invalide ou expiré' 
        });
      }
      
      const patientId = verificationTokens[0].patient_id;
      console.log('POST: Found patient ID:', patientId);
      
      // Update user as verified
      console.log('POST: Updating user verification status...');
      const [updateResult] = await conn.execute(
        'UPDATE utilisateurs SET est_verifie = TRUE WHERE id_specifique_role = ? AND role = "patient"',
        [patientId]
      );
      console.log('POST: Update result:', JSON.stringify(updateResult));
      
      // Verify update was successful
      if (updateResult.affectedRows === 0) {
        console.log('POST: No rows affected in update. Rolling back.');
        await conn.rollback();
        conn.release();
        return res.status(500).json({ 
          message: 'Échec de la mise à jour du statut de vérification' 
        });
      }
      
      // Double check the update worked
      const [verifiedUser] = await conn.execute(
        'SELECT est_verifie FROM utilisateurs WHERE id_specifique_role = ? AND role = "patient"',
        [patientId]
      );
      
      if (verifiedUser.length === 0 || !verifiedUser[0].est_verifie) {
        console.log('POST: Verification failed to apply. Rolling back.');
        await conn.rollback();
        conn.release();
        return res.status(500).json({ 
          message: 'Échec de la mise à jour du statut de vérification' 
        });
      }
      
      // Mark token as used
      console.log('POST: Marking token as used...');
      await conn.execute(
        'UPDATE verification_patients SET est_verifie = TRUE WHERE patient_id = ? AND token = ?',
        [patientId, token]
      );
      
      // Commit the transaction
      await conn.commit();
      
      return res.status(200).json({ 
        message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.' 
      });
    } catch (error) {
      console.error('POST: Database error during verification:', error);
      await conn.rollback();
      return res.status(500).json({ 
        message: 'Erreur serveur lors de la vérification de l\'email' 
      });
    } finally {
      // Always release the connection
      conn.release();
    }
  } catch (error) {
    console.error('POST Error during verification:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur lors de la vérification de l\'email' 
    });
  }
});

// Route pour demander un renvoi d'email de vérification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }
    
    // Verify the user exists and is not already verified
    const [users] = await require('../config/db').execute(
      'SELECT id, id_specifique_role FROM utilisateurs WHERE email = ? AND role = "patient" AND est_verifie = FALSE',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'Aucun utilisateur non vérifié trouvé avec cet email' 
      });
    }
    
    const patientId = users[0].id_specifique_role;
    
    // Generate a new verification token
    const { generateVerificationToken, sendVerificationEmail } = require('../utils/emailService');
    const newToken = generateVerificationToken();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Valid for 24 hours
    
    // Delete any existing tokens for this patient
    await require('../config/db').execute(
      'DELETE FROM verification_patients WHERE patient_id = ?',
      [patientId]
    );
    
    // Create a new token
    await require('../config/db').execute(
      'INSERT INTO verification_patients (patient_id, token, date_expiration) VALUES (?, ?, ?)',
      [patientId, newToken, expirationDate]
    );
    
    // Send the verification email
    await sendVerificationEmail(email, newToken);
    
    return res.status(200).json({ 
      message: 'Un nouvel email de vérification a été envoyé à votre adresse' 
    });
  } catch (error) {
    console.error('Erreur lors du renvoi de l\'email de vérification:', error);
    return res.status(500).json({ 
      message: 'Erreur lors du renvoi de l\'email de vérification' 
    });
  }
});

module.exports = router;
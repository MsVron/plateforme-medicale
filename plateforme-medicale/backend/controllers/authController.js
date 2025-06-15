const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendPasswordResetEmail, generatePasswordResetToken } = require('../utils/emailService');
require('dotenv').config();

// -------- AUTH: LOGIN --------
exports.login = async (req, res) => {
  try {
    const { nom_utilisateur, mot_de_passe } = req.body;

    if (!nom_utilisateur || !mot_de_passe) {
      return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis" });
    }

    const [utilisateurs] = await db.execute(`
      SELECT
        u.id, u.nom_utilisateur, u.mot_de_passe, u.email, u.role, u.id_specifique_role, u.est_verifie,
        COALESCE(sa.prenom, a.prenom, m.prenom, p.prenom, i.nom) AS prenom,
        COALESCE(sa.nom, a.nom, m.nom, p.nom, '') AS nom
      FROM utilisateurs u
      LEFT JOIN super_admins sa ON u.role = 'super_admin' AND u.id_specifique_role = sa.id
      LEFT JOIN admins a ON u.role = 'admin' AND u.id_specifique_role = a.id
      LEFT JOIN medecins m ON u.role = 'medecin' AND u.id_specifique_role = m.id
      LEFT JOIN patients p ON u.role = 'patient' AND u.id_specifique_role = p.id
      LEFT JOIN institutions i ON u.role = 'institution' AND u.id_specifique_role = i.id
      WHERE u.nom_utilisateur = ?
    `, [nom_utilisateur]);

    if (utilisateurs.length === 0) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const user = utilisateurs[0];
    const isPasswordValid = await bcrypt.compare(mot_de_passe.trim(), user.mot_de_passe);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // For patient accounts, check if email is verified
    if (user.role === 'patient' && user.est_verifie === 0) {
      return res.status(403).json({ 
        message: "Votre compte n'est pas vérifié. Veuillez vérifier votre email avant de vous connecter.",
        needsVerification: true,
        email: user.email 
      });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    const token = jwt.sign(
      {
        id: user.id,
        nom_utilisateur: user.nom_utilisateur,
        role: user.role,
        prenom: user.prenom,
        nom: user.nom,
        id_specifique_role: user.id_specifique_role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        nom_utilisateur: user.nom_utilisateur,
        email: user.email,
        role: user.role,
        prenom: user.prenom,
        nom: user.nom,
        id_specifique_role: user.id_specifique_role
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

// -------- AUTH: LOGOUT --------
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return res.status(500).json({ message: "Erreur lors de la déconnexion", error: error.message });
  }
};

// -------- AUTH: FORGOT PASSWORD --------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    // Check if user exists and is a patient
    const [utilisateurs] = await db.execute(`
      SELECT u.id, u.nom_utilisateur, u.email, u.role, u.id_specifique_role, p.prenom, p.nom
      FROM utilisateurs u
      LEFT JOIN patients p ON u.role = 'patient' AND u.id_specifique_role = p.id
      WHERE u.email = ? AND u.role = 'patient'
    `, [email]);

    if (utilisateurs.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ 
        message: "Si cette adresse email est associée à un compte patient, vous recevrez un email de réinitialisation." 
      });
    }

    const user = utilisateurs[0];

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await db.execute(`
      UPDATE utilisateurs 
      SET token_reset_password = ?, date_expiration_token = ?
      WHERE id = ?
    `, [resetToken, expirationTime, user.id]);

    // Send reset email
    const emailSent = await sendPasswordResetEmail(
      user.email, 
      resetToken, 
      user.nom_utilisateur
    );

    if (!emailSent) {
      console.error('Failed to send password reset email');
      return res.status(500).json({ 
        message: "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard." 
      });
    }

    return res.status(200).json({ 
      message: "Si cette adresse email est associée à un compte patient, vous recevrez un email de réinitialisation." 
    });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    return res.status(500).json({ 
      message: "Erreur lors de la demande de réinitialisation", 
      error: error.message 
    });
  }
};

// -------- AUTH: RESET PASSWORD --------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
    }

    // Check if token is valid and not expired
    const [utilisateurs] = await db.execute(`
      SELECT id, nom_utilisateur, email, role
      FROM utilisateurs 
      WHERE token_reset_password = ? AND date_expiration_token > NOW()
    `, [token]);

    if (utilisateurs.length === 0) {
      return res.status(400).json({ 
        message: "Token de réinitialisation invalide ou expiré" 
      });
    }

    const user = utilisateurs[0];

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await db.execute(`
      UPDATE utilisateurs 
      SET mot_de_passe = ?, token_reset_password = NULL, date_expiration_token = NULL
      WHERE id = ?
    `, [hashedPassword, user.id]);

    return res.status(200).json({ 
      message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter." 
    });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return res.status(500).json({ 
      message: "Erreur lors de la réinitialisation du mot de passe", 
      error: error.message 
    });
  }
};
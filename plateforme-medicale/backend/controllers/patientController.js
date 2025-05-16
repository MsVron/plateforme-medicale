const bcrypt = require('bcrypt');
const db = require('../config/db');
const { validateUsername } = require('../utils/validation');
const { sendVerificationEmail, generateVerificationToken } = require('../utils/emailService');

exports.addPatient = async (req, res) => {
  try {
    const {
      nom_utilisateur, mot_de_passe, email, prenom, nom, date_naissance, sexe,
      telephone, adresse, ville, code_postal, pays, CNE, groupe_sanguin
    } = req.body;

    // Validate username
    const usernameValidation = validateUsername(nom_utilisateur);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ message: usernameValidation.message });
    }

    if (!nom_utilisateur || !mot_de_passe || !email || !prenom || !nom || !date_naissance || !sexe) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    // Check for existing username or email in the users table
    const [existingUsers] = await db.execute(
      'SELECT id FROM utilisateurs WHERE nom_utilisateur = ? OR email = ?',
      [nom_utilisateur, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur ou email déjà utilisé" });
    }

    // Only check for CNE duplicates if a CNE was provided
    if (CNE) {
      const [existingCNE] = await db.execute(
        'SELECT id FROM patients WHERE CNE = ?',
        [CNE]
      );
      
      if (existingCNE.length > 0) {
        return res.status(400).json({ 
          message: "CNE déjà utilisé par un autre patient",
          field: "CNE"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const [patientResult] = await db.execute(
      `INSERT INTO patients (
        prenom, nom, date_naissance, sexe, email, telephone, adresse, ville, code_postal,
        pays, CNE, groupe_sanguin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom, nom, date_naissance, sexe, email || null, telephone || null,
        adresse || null, ville || null, code_postal || null, pays || 'Maroc',
        CNE || null, groupe_sanguin || null
      ]
    );

    const patientId = patientResult.insertId;

    // Creating user account but setting est_verifie to false
    await db.execute(
      'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_actif, est_verifie) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom_utilisateur, hashedPassword, email, 'patient', patientId, true, false]
    );

    // Generate verification token and store it
    const verificationToken = generateVerificationToken();
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Token valid for 24 hours

    // Check if verification_patients table exists in the database
    try {
      await db.execute(
        `INSERT INTO verification_patients (patient_id, token, date_expiration) 
         VALUES (?, ?, ?)`,
        [patientId, verificationToken, expirationDate]
      );
    } catch (err) {
      console.error("Error creating verification token:", err);
      // If the table doesn't exist, this is not a critical error
      // We'll still proceed with account creation, but verification will be skipped
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Non-blocking error - we'll still create the account
    }

    return res.status(201).json({ 
      message: "Patient ajouté avec succès. Veuillez vérifier votre email pour activer votre compte."
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un patient:', error);
    
    // Provide more specific error messages for common database errors
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('CNE')) {
        return res.status(400).json({ 
          message: "CNE déjà utilisé par un autre patient", 
          field: "CNE" 
        });
      } else if (error.message.includes('email')) {
        return res.status(400).json({ 
          message: "Cet email est déjà utilisé", 
          field: "email" 
        });
      } else if (error.message.includes('nom_utilisateur')) {
        return res.status(400).json({ 
          message: "Ce nom d'utilisateur est déjà pris", 
          field: "nom_utilisateur"
        });
      }
    }
    
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.editPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      prenom, nom, date_naissance, sexe, email, est_actif, telephone, adresse,
      ville, code_postal, pays, CNE, groupe_sanguin
    } = req.body;

    if (!prenom || !nom || !date_naissance || !sexe || !email) {
      return res.status(400).json({ message: "Prénom, nom, date de naissance, sexe et email sont obligatoires" });
    }

    const [patients] = await db.execute('SELECT id, CNE FROM patients WHERE id = ?', [id]);
    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    if (CNE && CNE !== patients[0].CNE) {
      const [existingCNE] = await db.execute('SELECT id FROM patients WHERE CNE = ? AND id != ?', [CNE, id]);
      if (existingCNE.length > 0) {
        return res.status(400).json({ message: "CNE déjà utilisé" });
      }
    }

    await db.execute(
      `UPDATE patients SET
        prenom = ?, nom = ?, date_naissance = ?, sexe = ?, email = ?, telephone = ?,
        adresse = ?, ville = ?, code_postal = ?, pays = ?, CNE = ?, groupe_sanguin = ?
      WHERE id = ?`,
      [
        prenom, nom, date_naissance, sexe, email, telephone || null,
        adresse || null, ville || null, code_postal || null, pays || 'Maroc',
        CNE || null, groupe_sanguin || null, id
      ]
    );

    await db.execute(
      'UPDATE utilisateurs SET email = ?, est_actif = ? WHERE id_specifique_role = ? AND role = ?',
      [email, est_actif !== undefined ? est_actif : true, id, 'patient']
    );

    return res.status(200).json({ message: "Patient mis à jour avec succès" });
  } catch (error) {
    console.error('Erreur lors de la modification d\'un patient:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const [patients] = await db.execute('SELECT id FROM patients WHERE id = ?', [id]);
    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    await db.execute('DELETE FROM utilisateurs WHERE id_specifique_role = ? AND role = ?', [id, 'patient']);
    await db.execute('DELETE FROM patients WHERE id = ?', [id]);

    return res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un patient:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    if (!req.user || req.user.id_specifique_role === undefined) {
      return res.status(401).json({ message: "Utilisateur non authentifié ou informations insuffisantes" });
    }

    const [patients] = await db.execute(`
      SELECT
        p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.email, p.telephone,
        p.adresse, p.ville, p.code_postal, p.pays, p.CNE, p.groupe_sanguin,
        u.nom_utilisateur, u.est_actif
      FROM patients p
      JOIN utilisateurs u ON u.id_specifique_role = p.id AND u.role = 'patient'
    `);

    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
const db = require('../../config/db');

exports.addPatient = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const {
      prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, code_postal, pays
    } = req.body;

    // Validate required fields
    if (!prenom || !nom || !date_naissance || !sexe) {
      return res.status(400).json({ message: 'Prénom, nom, date de naissance et sexe sont obligatoires' });
    }

    // Validate sexe
    if (!['M', 'F', 'Autre'].includes(sexe)) {
      return res.status(400).json({ message: 'Sexe doit être M, F ou Autre' });
    }

    // Validate CNE uniqueness if provided
    if (CNE) {
      const [existingCNE] = await db.execute('SELECT id FROM patients WHERE CNE = ?', [CNE]);
      if (existingCNE.length > 0) {
        return res.status(400).json({ message: 'CNE déjà utilisé' });
      }
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Format d\'email invalide' });
    }

    // Insert patient
    const [result] = await db.execute(
      `INSERT INTO patients (
        prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, code_postal, pays,
        medecin_traitant_id, date_inscription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        prenom,
        nom,
        date_naissance,
        sexe,
        CNE || null,
        email || null,
        telephone || null,
        adresse || null,
        ville || null,
        code_postal || null,
        pays || 'France',
        medecinId
      ]
    );

    return res.status(201).json({ message: 'Patient ajouté avec succès', patientId: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du patient:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const [patients] = await db.execute(
      `SELECT id, prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, code_postal, pays
       FROM patients
       WHERE medecin_traitant_id = ?`,
      [medecinId]
    );
    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 
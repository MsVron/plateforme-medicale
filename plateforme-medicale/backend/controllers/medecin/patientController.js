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
    if (!['M', 'F'].includes(sexe)) {
      return res.status(400).json({ message: 'Sexe doit être M ou F' });
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
    const { search } = req.query;
    
    // Debug logging
    console.log('=== DEBUG getPatients ===');
    console.log('User object:', req.user);
    console.log('medecinId:', medecinId);
    console.log('search term:', search);
    
    let searchCondition = '';
    let searchParams = [medecinId];
    
    // Add search functionality for prenom and nom
    if (search && search.trim()) {
      searchCondition = `AND (p.prenom LIKE ? OR p.nom LIKE ? OR CONCAT(p.prenom, ' ', p.nom) LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      searchParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Simple query to get all patients who have ever had appointments with this doctor
    const query = `
      SELECT DISTINCT
        p.id, 
        p.prenom, 
        p.nom, 
        p.date_naissance, 
        p.sexe, 
        p.CNE, 
        p.email, 
        p.telephone,
        p.adresse,
        MAX(rv.date_heure_debut) as derniere_consultation,
        MIN(rv.date_heure_debut) as premiere_consultation
      FROM patients p
      INNER JOIN rendez_vous rv ON p.id = rv.patient_id
      INNER JOIN medecins m ON rv.medecin_id = m.id
      WHERE m.id = ? ${searchCondition}
      GROUP BY p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, p.email, p.telephone, p.adresse
      ORDER BY derniere_consultation DESC
    `;

    console.log('SQL Query:', query);
    console.log('Query params:', searchParams);

    const [patients] = await db.execute(query, searchParams);
    
    console.log('Found patients count:', patients.length);
    console.log('First 3 patients:', patients.slice(0, 3));

    res.json({
      success: true,
      data: patients,
      total: patients.length
    });

  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des patients',
      error: error.message
    });
  }
}; 
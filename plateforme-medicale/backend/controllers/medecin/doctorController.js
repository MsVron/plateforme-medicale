const bcrypt = require('bcrypt');
const db = require('../../config/db');
const { validateUsername } = require('../../utils/validation');

exports.addMedecin = async (req, res) => {
  try {
    const {
      nom_utilisateur, mot_de_passe, email, prenom, nom, specialite_id, numero_ordre,
      telephone, email_professionnel, photo_url, biographie, institution_id,
      adresse, ville, code_postal, pays, institution_type, institution_nom
    } = req.body;

    // Validate username
    const usernameValidation = validateUsername(nom_utilisateur);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ message: usernameValidation.message });
    }

    if (!nom_utilisateur || !mot_de_passe || !email || !prenom || !nom || !specialite_id || !numero_ordre) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être fournis" });
    }

    if (!req.user || req.user.id_specifique_role === undefined) {
      return res.status(401).json({ message: "Utilisateur non authentifié ou informations insuffisantes" });
    }

    const [existingUsers] = await db.execute(
      'SELECT id FROM utilisateurs WHERE nom_utilisateur = ? OR email = ?',
      [nom_utilisateur, email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Nom d'utilisateur ou email déjà utilisé" });
    }

    const [existingMedecins] = await db.execute(
      'SELECT id FROM medecins WHERE numero_ordre = ?',
      [numero_ordre]
    );
    if (existingMedecins.length > 0) {
      return res.status(400).json({ message: "Numéro d'ordre déjà utilisé" });
    }

    let finalInstitutionId = institution_id;
    if (institution_type === 'cabinet privé' && institution_nom) {
      const [institutionResult] = await db.execute(
        'INSERT INTO institutions (nom, type) VALUES (?, ?)',
        [institution_nom, 'cabinet privé']
      );
      finalInstitutionId = institutionResult.insertId;
    } else if (institution_id) {
      const [institutions] = await db.execute('SELECT id FROM institutions WHERE id = ?', [institution_id]);
      if (institutions.length === 0) {
        return res.status(400).json({ message: "Institution non trouvée" });
      }
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const [medecinResult] = await db.execute(
      `INSERT INTO medecins (
        prenom, nom, specialite_id, numero_ordre, telephone, email_professionnel,
        photo_url, biographie, institution_id, est_actif, adresse, ville, code_postal, pays,
        latitude, longitude, tarif_consultation, accepte_nouveaux_patients,
        temps_consultation_moyen, langues_parlees
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prenom, nom, specialite_id, numero_ordre, telephone || null, email_professionnel || null,
        photo_url || null, biographie || null, finalInstitutionId || null, true,
        adresse || null, ville || null, code_postal || null, pays || 'Maroc',
        req.body.latitude || null, req.body.longitude || null, req.body.tarif_consultation || null,
        req.body.accepte_nouveaux_patients !== undefined ? req.body.accepte_nouveaux_patients : true,
        req.body.temps_consultation_moyen || 30, req.body.langues_parlees || null
      ]
    );

    const medecinId = medecinResult.insertId;

    await db.execute(
      'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_actif) VALUES (?, ?, ?, ?, ?, ?)',
      [nom_utilisateur, hashedPassword, email, 'medecin', medecinId, true]
    );

    await db.execute(
      'UPDATE specialites SET usage_count = usage_count + 1 WHERE id = ?',
      [specialite_id]
    );

    return res.status(201).json({ message: "Médecin ajouté avec succès" });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un médecin:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.editMedecin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      prenom, nom, specialite_id, numero_ordre, telephone, email_professionnel,
      photo_url, biographie, institution_id, email, est_actif, adresse, ville,
      code_postal, pays, institution_type, institution_nom
    } = req.body;

    if (!prenom || !nom || !specialite_id || !numero_ordre || !email) {
      return res.status(400).json({ message: "Prénom, nom, spécialité, numéro d'ordre et email sont obligatoires" });
    }

    const [medecins] = await db.execute('SELECT id, numero_ordre, specialite_id, institution_id FROM medecins WHERE id = ?', [id]);
    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    if (medecins[0].numero_ordre !== numero_ordre) {
      const [existingMedecins] = await db.execute(
        'SELECT id FROM medecins WHERE numero_ordre = ? AND id != ?',
        [numero_ordre, id]
      );
      if (existingMedecins.length > 0) {
        return res.status(400).json({ message: "Numéro d'ordre déjà utilisé" });
      }
    }

    let finalInstitutionId = institution_id;
    if (institution_type === 'cabinet privé' && institution_nom) {
      const [existingCabinet] = await db.execute(
        'SELECT id FROM institutions WHERE medecin_proprietaire_id = ? AND type = ?',
        [id, 'cabinet privé']
      );
      if (existingCabinet.length > 0) {
        await db.execute(
          'UPDATE institutions SET nom = ?, adresse = ?, ville = ?, code_postal = ?, email_contact = ? WHERE id = ?',
          [
            institution_nom,
            adresse || null,
            ville || null,
            code_postal || null,
            email_professionnel || email || null,
            existingCabinet[0].id
          ]
        );
        finalInstitutionId = existingCabinet[0].id;
      } else {
        const [institutionResult] = await db.execute(
          'INSERT INTO institutions (nom, type, medecin_proprietaire_id, adresse, ville, code_postal, email_contact) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            institution_nom,
            'cabinet privé',
            id,
            adresse || null,
            ville || null,
            code_postal || null,
            email_professionnel || email || null
          ]
        );
        finalInstitutionId = institutionResult.insertId;
      }
    }

    if (medecins[0].specialite_id !== specialite_id) {
      await db.execute(
        'UPDATE specialites SET usage_count = usage_count - 1 WHERE id = ? AND usage_count > 0',
        [medecins[0].specialite_id]
      );
      await db.execute(
        'UPDATE specialites SET usage_count = usage_count + 1 WHERE id = ?',
        [specialite_id]
      );
    }

    await db.execute(
      `UPDATE medecins SET
        prenom = ?, nom = ?, specialite_id = ?, numero_ordre = ?, telephone = ?,
        email_professionnel = ?, photo_url = ?, biographie = ?, institution_id = ?,
        est_actif = ?, adresse = ?, ville = ?, code_postal = ?, pays = ?,
        latitude = ?, longitude = ?, tarif_consultation = ?, 
        accepte_nouveaux_patients = ?, temps_consultation_moyen = ?, 
        langues_parlees = ?
      WHERE id = ?`,
      [
        prenom, nom, specialite_id, numero_ordre, telephone || null,
        email_professionnel || null, photo_url || null, biographie || null, finalInstitutionId || null,
        est_actif !== undefined ? est_actif : true, adresse || null, ville || null,
        code_postal || null, pays || 'Maroc',
        req.body.latitude || null, req.body.longitude || null, req.body.tarif_consultation || null,
        req.body.accepte_nouveaux_patients !== undefined ? req.body.accepte_nouveaux_patients : true,
        req.body.temps_consultation_moyen || 30, req.body.langues_parlees || null,
        id
      ]
    );

    await db.execute(
      'UPDATE utilisateurs SET email = ?, est_actif = ? WHERE id_specifique_role = ? AND role = ?',
      [email, est_actif !== undefined ? est_actif : true, id, 'medecin']
    );

    return res.status(200).json({ message: "Médecin mis à jour avec succès" });
  } catch (error) {
    console.error('Erreur lors de la modification d\'un médecin:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteMedecin = async (req, res) => {
  try {
    const { id } = req.params;

    const [medecins] = await db.execute('SELECT id, specialite_id, institution_id FROM medecins WHERE id = ?', [id]);
    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    await db.execute(
      'UPDATE specialites SET usage_count = usage_count - 1 WHERE id = ? AND usage_count > 0',
      [medecins[0].specialite_id]
    );

    if (medecins[0].institution_id) {
      await db.execute(
        'DELETE FROM institutions WHERE id = ? AND type = ? AND medecin_proprietaire_id = ?',
        [medecins[0].institution_id, 'cabinet privé', id]
      );
    }

    await db.execute('DELETE FROM utilisateurs WHERE id_specifique_role = ? AND role = ?', [id, 'medecin']);
    await db.execute('DELETE FROM medecins WHERE id = ?', [id]);

    return res.status(200).json({ message: "Médecin supprimé avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un médecin:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getMedecins = async (req, res) => {
  try {
    if (!req.user || req.user.id_specifique_role === undefined) {
      return res.status(401).json({ message: "Utilisateur non authentifié ou informations insuffisantes" });
    }

    const includeInactive = req.query.includeInactive === 'true';
    const query = `
      SELECT
        m.id, m.prenom, m.nom, m.specialite_id, s.nom AS specialite_nom,
        m.numero_ordre, m.telephone, m.email_professionnel, m.photo_url,
        m.biographie, m.institution_id, i.nom AS institution_nom, i.type AS institution_type,
        m.est_actif, m.adresse, m.ville, m.code_postal, m.pays, u.email, u.nom_utilisateur
      FROM medecins m
      JOIN utilisateurs u ON u.id_specifique_role = m.id AND u.role = 'medecin'
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON m.institution_id = i.id
      ${includeInactive ? '' : 'WHERE m.est_actif = true'}
    `;

    const [medecins] = await db.execute(query);
    return res.status(200).json({ medecins });
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getMedecinById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('DEBUG: Getting doctor by ID:', id);
    
    if (!id) {
      return res.status(400).json({ message: "ID du médecin requis" });
    }
    
    const query = `
      SELECT 
        m.id, m.prenom, m.nom, m.specialite_id, s.nom AS specialite, 
        m.telephone, m.email_professionnel, m.photo_url, 
        m.biographie, m.institution_id, i.nom AS institution_nom, 
        m.est_actif, m.adresse, m.ville, m.code_postal, m.pays,
        m.tarif_consultation, m.latitude, m.longitude, 
        m.accepte_nouveaux_patients, m.temps_consultation_moyen
      FROM medecins m
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON m.institution_id = i.id
      WHERE m.id = ? AND m.est_actif = true
    `;
    
    const [medecins] = await db.execute(query, [id]);
    
    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    
    return res.status(200).json(medecins[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du médecin:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getCurrentMedecin = async (req, res) => {
  try {
    const [medecins] = await db.execute(
      `SELECT
        m.id, m.prenom, m.nom, m.specialite_id, s.nom AS specialite_nom,
        m.institution_id, i.nom AS institution_nom
      FROM medecins m
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON m.institution_id = i.id
      WHERE m.id = ? AND m.est_actif = true`,
      [req.user.id_specifique_role]
    );
    if (medecins.length === 0) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    return res.status(200).json({ medecin: medecins[0] });
  } catch (error) {
    console.error('Erreur lors de la récupération du médecin:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateConsultationFee = async (req, res) => {
  try {
    const { tarif_consultation } = req.body;
    const medecin_id = req.user.id_specifique_role;

    if (tarif_consultation === undefined || tarif_consultation === null) {
      return res.status(400).json({ message: "Le tarif de consultation est requis" });
    }

    // Update the consultation fee
    await db.execute(
      'UPDATE medecins SET tarif_consultation = ? WHERE id = ?',
      [tarif_consultation, medecin_id]
    );

    return res.status(200).json({ message: "Tarif de consultation mis à jour avec succès" });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tarif de consultation:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}; 
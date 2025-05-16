const db = require('../../config/db');

exports.getAvailabilities = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const [availabilities] = await db.execute(
      `SELECT dm.id, dm.medecin_id, dm.institution_id, i.nom AS institution_nom,
              dm.jour_semaine, dm.heure_debut, dm.heure_fin, dm.intervalle_minutes, dm.est_actif
       FROM disponibilites_medecin dm
       JOIN institutions i ON dm.institution_id = i.id
       WHERE dm.medecin_id = ?`,
      [medecinId]
    );
    return res.status(200).json({ availabilities });
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addAvailability = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const {
      institution_id, jours_semaine, heure_debut, heure_fin, intervalle_minutes, est_actif
    } = req.body;

    if (!institution_id || !jours_semaine || !jours_semaine.length || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis' });
    }

    // Verify doctor is affiliated with the institution
    const [affiliations] = await db.execute(
      `SELECT 1 FROM medecin_institution WHERE medecin_id = ? AND institution_id = ?
       UNION
       SELECT 1 FROM medecins WHERE id = ? AND institution_id = ?`,
      [medecinId, institution_id, medecinId, institution_id]
    );
    if (affiliations.length === 0) {
      return res.status(403).json({ message: 'Vous n\'êtes pas affilié à cette institution' });
    }

    // Validate time range
    if (heure_debut >= heure_fin) {
      return res.status(400).json({ message: 'L\'heure de début doit être inférieure à l\'heure de fin' });
    }

    // Insert availability for each selected day
    const insertedIds = [];
    for (const jour of jours_semaine) {
      const [result] = await db.execute(
        `INSERT INTO disponibilites_medecin (
          medecin_id, institution_id, jour_semaine, heure_debut, heure_fin, intervalle_minutes, est_actif
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          medecinId,
          institution_id,
          jour,
          heure_debut,
          heure_fin,
          intervalle_minutes || 30,
          est_actif !== undefined ? est_actif : true
        ]
      );
      insertedIds.push(result.insertId);
    }

    return res.status(201).json({ message: 'Disponibilités ajoutées avec succès', ids: insertedIds });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des disponibilités:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { id } = req.params;
    const {
      institution_id, jour_semaine, heure_debut, heure_fin, intervalle_minutes, est_actif
    } = req.body;

    if (!institution_id || !jour_semaine || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis' });
    }

    // Verify availability belongs to the doctor
    const [availabilities] = await db.execute(
      'SELECT id FROM disponibilites_medecin WHERE id = ? AND medecin_id = ?',
      [id, medecinId]
    );
    if (availabilities.length === 0) {
      return res.status(404).json({ message: 'Disponibilité non trouvée ou non autorisée' });
    }

    // Verify doctor is affiliated with the institution
    const [affiliations] = await db.execute(
      `SELECT 1 FROM medecin_institution WHERE medecin_id = ? AND institution_id = ?
       UNION
       SELECT 1 FROM medecins WHERE id = ? AND institution_id = ?`,
      [medecinId, institution_id, medecinId, institution_id]
    );
    if (affiliations.length === 0) {
      return res.status(403).json({ message: 'Vous n\'êtes pas affilié à cette institution' });
    }

    // Validate time range
    if (heure_debut >= heure_fin) {
      return res.status(400).json({ message: 'L\'heure de début doit être inférieure à l\'heure de fin' });
    }

    await db.execute(
      `UPDATE disponibilites_medecin SET
        institution_id = ?, jour_semaine = ?, heure_debut = ?, heure_fin = ?,
        intervalle_minutes = ?, est_actif = ?
       WHERE id = ? AND medecin_id = ?`,
      [
        institution_id,
        jour_semaine,
        heure_debut,
        heure_fin,
        intervalle_minutes || 30,
        est_actif !== undefined ? est_actif : true,
        id,
        medecinId
      ]
    );

    return res.status(200).json({ message: 'Disponibilité mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la disponibilité:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { id } = req.params;

    const [availabilities] = await db.execute(
      'SELECT id FROM disponibilites_medecin WHERE id = ? AND medecin_id = ?',
      [id, medecinId]
    );
    if (availabilities.length === 0) {
      return res.status(404).json({ message: 'Disponibilité non trouvée ou non autorisée' });
    }

    await db.execute('DELETE FROM disponibilites_medecin WHERE id = ? AND medecin_id = ?', [id, medecinId]);
    return res.status(200).json({ message: 'Disponibilité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la disponibilité:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getEmergencyAbsences = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const [absences] = await db.execute(
      `SELECT id, medecin_id, date_debut, date_fin, motif
       FROM indisponibilites_exceptionnelles
       WHERE medecin_id = ? AND date_debut >= CURDATE()`,
      [medecinId]
    );
    return res.status(200).json({ absences });
  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.addEmergencyAbsence = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { date_debut, date_fin, motif } = req.body;

    if (!date_debut || !date_fin) {
      return res.status(400).json({ message: 'Les dates de début et de fin sont obligatoires' });
    }

    if (new Date(date_debut) >= new Date(date_fin)) {
      return res.status(400).json({ message: 'La date de début doit être inférieure à la date de fin' });
    }

    const [result] = await db.execute(
      `INSERT INTO indisponibilites_exceptionnelles (medecin_id, date_debut, date_fin, motif)
       VALUES (?, ?, ?, ?)`,
      [medecinId, date_debut, date_fin, motif || null]
    );

    return res.status(201).json({ message: 'Absence ajoutée avec succès', id: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'absence:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteEmergencyAbsence = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { id } = req.params;

    const [absences] = await db.execute(
      'SELECT id FROM indisponibilites_exceptionnelles WHERE id = ? AND medecin_id = ?',
      [id, medecinId]
    );
    if (absences.length === 0) {
      return res.status(404).json({ message: 'Absence non trouvée ou non autorisée' });
    }

    await db.execute('DELETE FROM indisponibilites_exceptionnelles WHERE id = ? AND medecin_id = ?', [id, medecinId]);
    return res.status(200).json({ message: 'Absence supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'absence:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 
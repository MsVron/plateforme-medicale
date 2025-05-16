const db = require('../../config/db');

exports.getSpecialites = async (req, res) => {
  try {
    const relevanceOrder = [
      'Médecine générale', 'Cardiologie', 'Pédiatrie', 'Gynécologie-Obstétrique',
      'Dermatologie', 'Ophtalmologie', 'Orthopédie', 'Neurologie', 'Psychiatrie',
      'Radiologie', 'Pneumologie', 'Gastro-entérologie', 'Endocrinologie'
    ];

    const [specialites] = await db.execute(`
      SELECT id, nom, usage_count
      FROM specialites
      ORDER BY
        FIELD(nom, ${relevanceOrder.map(() => '?').join(',')}) DESC,
        usage_count DESC,
        nom ASC
    `, relevanceOrder);

    return res.status(200).json({ specialites });
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getInstitutions = async (req, res) => {
  try {
    const [institutions] = await db.execute(`
      SELECT id, nom, type, medecin_proprietaire_id
      FROM institutions
      ORDER BY nom
    `);
    return res.status(200).json({ institutions });
  } catch (error) {
    console.error('Erreur lors de la récupération des institutions:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getDoctorInstitutions = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const [institutions] = await db.execute(
      `SELECT DISTINCT i.id, i.nom, i.type
       FROM institutions i
       LEFT JOIN medecin_institution mi ON i.id = mi.institution_id AND mi.medecin_id = ?
       WHERE mi.medecin_id = ? OR i.id = (SELECT institution_id FROM medecins WHERE id = ?)`,
      [medecinId, medecinId, medecinId]
    );
    return res.status(200).json({ institutions });
  } catch (error) {
    console.error('Erreur lors de la récupération des institutions du médecin:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}; 
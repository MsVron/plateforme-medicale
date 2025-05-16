const db = require('../../config/db');

exports.getPublicMedecins = async (req, res) => {
  try {
    const [medecins] = await db.execute(`
      SELECT m.id, m.prenom, m.nom, m.specialite_id, m.telephone, 
      m.adresse, m.ville, m.code_postal, m.pays, m.photo_url, 
      m.biographie, m.institution_id, m.est_actif, m.accepte_nouveaux_patients,
      m.tarif_consultation, m.latitude, m.longitude, m.temps_consultation_moyen
      FROM medecins m 
      WHERE m.est_actif = true
      ORDER BY m.nom, m.prenom
    `);

    return res.json({ medecins });
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins publics:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getPublicSpecialites = async (req, res) => {
  try {
    const [specialites] = await db.execute('SELECT id, nom, description FROM specialites ORDER BY nom');
    return res.json({ specialites });
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités publiques:', error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}; 
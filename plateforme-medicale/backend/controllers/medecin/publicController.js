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

exports.getPublicMedecinById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('DEBUG: Getting public doctor by ID:', id);
    
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
    console.error('Erreur lors de la récupération du médecin public:', error);
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
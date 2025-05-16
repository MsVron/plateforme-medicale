const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get evaluations for specified doctors
router.get('/medecins', async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ message: 'IDs des médecins requis' });
    }
    
    const doctorIds = ids.split(',').map(id => parseInt(id));
    
    // Get average ratings and counts for each doctor
    const [ratingStats] = await db.query(`
      SELECT 
        medecin_id,
        AVG(note) as average_rating,
        COUNT(*) as count
      FROM evaluations_medecins
      WHERE medecin_id IN (?) AND est_approuve = TRUE
      GROUP BY medecin_id
    `, [doctorIds]);
    
    // Get the most recent reviews for each doctor (up to 3 per doctor)
    const [recentReviews] = await db.query(`
      SELECT 
        e.medecin_id,
        e.note,
        e.commentaire,
        e.date_evaluation,
        e.est_anonyme,
        CASE WHEN e.est_anonyme = 0 THEN CONCAT(p.prenom, ' ', p.nom) ELSE NULL END as patient_nom
      FROM evaluations_medecins e
      JOIN patients p ON e.patient_id = p.id
      WHERE e.medecin_id IN (?) AND e.est_approuve = TRUE
      ORDER BY e.date_evaluation DESC
      LIMIT 30
    `, [doctorIds]);
    
    // Organize the data by doctor
    const result = doctorIds.map(doctorId => {
      const stats = ratingStats.find(item => item.medecin_id === doctorId) || { average_rating: 0, count: 0 };
      const reviews = recentReviews.filter(review => review.medecin_id === doctorId).slice(0, 3);
      
      return {
        medecin_id: doctorId,
        average_rating: parseFloat(stats.average_rating || 0).toFixed(1),
        count: stats.count || 0,
        reviews: reviews || []
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error getting doctor evaluations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des évaluations' });
  }
});

// Add a new evaluation
router.post('/medecins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, note, commentaire, est_anonyme } = req.body;
    
    if (!id || !patient_id || !note) {
      return res.status(400).json({ message: 'Données d\'évaluation incomplètes' });
    }
    
    // Check if doctor exists
    const [doctors] = await db.query('SELECT id FROM medecins WHERE id = ?', [id]);
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }
    
    // Check if patient exists
    const [patients] = await db.query('SELECT id FROM patients WHERE id = ?', [patient_id]);
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    
    // Check if patient has already evaluated this doctor
    const [existingEval] = await db.query(
      'SELECT id FROM evaluations_medecins WHERE patient_id = ? AND medecin_id = ?',
      [patient_id, id]
    );
    
    if (existingEval.length > 0) {
      // Update existing evaluation
      await db.query(
        `UPDATE evaluations_medecins 
         SET note = ?, commentaire = ?, est_anonyme = ?, date_evaluation = NOW()
         WHERE patient_id = ? AND medecin_id = ?`,
        [note, commentaire || null, est_anonyme || false, patient_id, id]
      );
      
      res.json({ message: 'Évaluation mise à jour avec succès' });
    } else {
      // Create new evaluation
      await db.query(
        `INSERT INTO evaluations_medecins 
         (patient_id, medecin_id, note, commentaire, est_anonyme, est_approuve)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [patient_id, id, note, commentaire || null, est_anonyme || false, false]
      );
      
      res.status(201).json({ message: 'Évaluation ajoutée avec succès, en attente d\'approbation' });
    }
  } catch (error) {
    console.error('Error adding/updating evaluation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout/mise à jour de l\'évaluation' });
  }
});

module.exports = router; 
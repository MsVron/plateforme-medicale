const db = require('./config/db');

async function setupEvaluationData() {
  try {
    console.log('Setting up sample evaluation data...');

    // Get some doctor and patient IDs to use for evaluations
    const [doctors] = await db.query('SELECT id FROM medecins LIMIT 5');
    const [patients] = await db.query('SELECT id FROM patients LIMIT 10');
    
    if (doctors.length === 0 || patients.length === 0) {
      console.log('No doctors or patients found. Please add them first.');
      return;
    }
    
    // Delete existing evaluations for these doctors
    const doctorIds = doctors.map(d => d.id);
    await db.query('DELETE FROM evaluations_medecins WHERE medecin_id IN (?)', [doctorIds]);
    
    // Sample comments
    const comments = [
      "Excellent médecin, très à l'écoute et professionnel.",
      "Consultation efficace et diagnostic précis.",
      "Bonnes explications et conseils utiles.",
      "Un peu d'attente mais service de qualité.",
      "Médecin compétent, cabinet bien équipé.",
      "Très satisfait de la consultation.",
      "Personnel accueillant et médecin attentif.",
      "Bon suivi médical, je recommande.",
      "Explications claires sur mon traitement.",
      "Consultation rapide mais complète."
    ];
    
    // For each doctor, create 3-7 evaluations
    for (const doctor of doctors) {
      // Randomly select 3-7 patients for this doctor
      const numEvals = Math.floor(Math.random() * 5) + 3; // 3 to 7 evaluations
      const doctorPatients = [...patients].sort(() => 0.5 - Math.random()).slice(0, numEvals);
      
      for (const patient of doctorPatients) {
        // Generate random rating (3-5 stars, skewed toward higher ratings)
        const stars = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 stars
        
        // Select random comment
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        // 30% chance of being anonymous
        const isAnonymous = Math.random() < 0.3;
        
        // Insert evaluation
        await db.query(
          `INSERT INTO evaluations_medecins 
           (patient_id, medecin_id, note, commentaire, date_evaluation, est_approuve, est_anonyme)
           VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY), TRUE, ?)`,
          [patient.id, doctor.id, stars, comment, Math.floor(Math.random() * 30), isAnonymous]
        );
      }
      
      console.log(`Added ${numEvals} evaluations for doctor ID ${doctor.id}`);
    }
    
    console.log('Sample evaluation data setup complete!');
  } catch (error) {
    console.error('Error setting up evaluation data:', error);
  } finally {
    process.exit(0);
  }
}

setupEvaluationData(); 
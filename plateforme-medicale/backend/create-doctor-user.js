const db = require('./config/db');
const bcrypt = require('bcrypt');

async function createDoctorUser() {
  try {
    console.log('=== CREATING DOCTOR USER ACCOUNT ===');
    
    // Check if doctor exists
    const [doctors] = await db.execute('SELECT * FROM medecins WHERE id = 4');
    if (doctors.length === 0) {
      console.log('Doctor with ID 4 not found');
      process.exit(1);
    }
    
    const doctor = doctors[0];
    console.log('Found doctor:', doctor.prenom, doctor.nom);
    
    // Check if user already exists
    const [existingUsers] = await db.execute('SELECT * FROM utilisateurs WHERE id_specifique_role = 4 AND role = "medecin"');
    if (existingUsers.length > 0) {
      console.log('Doctor user already exists');
      process.exit(0);
    }
    
    // Create username and password
    const username = `${doctor.prenom.toLowerCase()}.${doctor.nom.toLowerCase()}`.replace(/\s+/g, '');
    const password = 'doctor123'; // Simple password for testing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user account
    const [result] = await db.execute(`
      INSERT INTO utilisateurs (
        nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_actif, est_verifie
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      username,
      hashedPassword,
      doctor.email_professionnel || `${username}@medical.com`,
      'medecin',
      doctor.id,
      true,
      true
    ]);
    
    console.log('Doctor user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('User ID:', result.insertId);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createDoctorUser(); 
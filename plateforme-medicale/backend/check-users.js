const db = require('./config/db');

async function checkUsers() {
  try {
    console.log('=== CHECKING USERS IN DATABASE ===');
    
    // Check all users
    const [users] = await db.execute('SELECT id, nom_utilisateur, role, id_specifique_role, est_actif FROM utilisateurs');
    console.log('All users:');
    users.forEach(user => {
      console.log(`  ID: ${user.id}, Username: ${user.nom_utilisateur}, Role: ${user.role}, Specific ID: ${user.id_specifique_role}, Active: ${user.est_actif}`);
    });
    
    // Check doctors specifically
    const [doctorUsers] = await db.execute('SELECT * FROM utilisateurs WHERE role = "medecin"');
    console.log('\nDoctor users:');
    doctorUsers.forEach(user => {
      console.log(`  ID: ${user.id}, Username: ${user.nom_utilisateur}, Doctor ID: ${user.id_specifique_role}`);
    });
    
    // Check patients
    const [patients] = await db.execute('SELECT id, prenom, nom FROM patients');
    console.log('\nPatients:');
    patients.forEach(patient => {
      console.log(`  ID: ${patient.id}, Name: ${patient.prenom} ${patient.nom}`);
    });
    
    // Check doctors
    const [doctors] = await db.execute('SELECT id, prenom, nom FROM medecins');
    console.log('\nDoctors:');
    doctors.forEach(doctor => {
      console.log(`  ID: ${doctor.id}, Name: ${doctor.prenom} ${doctor.nom}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers(); 
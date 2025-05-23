require('dotenv').config();
const db = require('./config/db');

async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1 as test');
    console.log('Database connection successful:', rows);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

async function inspectVerificationTables() {
  console.log('\n----- DATABASE VERIFICATION STATUS -----');
  
  try {
    // Check verification_patients table
    console.log('\n1. Checking verification_patients table:');
    const [tokens] = await db.execute('SELECT * FROM verification_patients');
    
    if (tokens.length === 0) {
      console.log('   No verification tokens found in the database.');
    } else {
      console.log(`   Found ${tokens.length} verification tokens:`);
      tokens.forEach(token => {
        console.dir(token, { depth: null, colors: true });
        console.log('     ---');
      });
    }
    
    // Check utilisateurs table for unverified patients
    console.log('\n2. Checking utilisateurs table for unverified patients:');
    const [users] = await db.execute(`
      SELECT 
        u.id, u.nom_utilisateur, u.email, u.est_verifie, 
        p.id as patient_id, p.prenom, p.nom
      FROM utilisateurs u
      JOIN patients p ON u.id_specifique_role = p.id
      WHERE u.role = 'patient'
      ORDER BY u.id DESC
      LIMIT 10
    `);
    
    if (users.length === 0) {
      console.log('   No patient users found in the database.');
    } else {
      console.log(`   Found ${users.length} recent patient users:`);
      users.forEach(user => {
        console.dir(user, { depth: null, colors: true });
        console.log('     ---');
      });
    }
    
    // Directly check the user that matches our token
    if (tokens.length > 0) {
      const tokenToCheck = tokens[0].token;
      const patientId = tokens[0].patient_id;
      
      console.log(`\n4. Directly checking user for token ${tokenToCheck}:`);
      
      const [directUser] = await db.execute(`
        SELECT * FROM utilisateurs
        WHERE id_specifique_role = ? AND role = 'patient'
      `, [patientId]);
      
      if (directUser.length > 0) {
        console.dir(directUser[0], { depth: null, colors: true });
      } else {
        console.log(`   No user found with id_specifique_role = ${patientId}`);
      }
      
      // Try updating the user directly
      console.log('\n5. Attempting manual verification update:');
      try {
        const [updateResult] = await db.execute(`
          UPDATE utilisateurs 
          SET est_verifie = TRUE 
          WHERE id_specifique_role = ? AND role = 'patient'
        `, [patientId]);
        
        console.log('   Update result:');
        console.dir(updateResult, { depth: null, colors: true });
        
        // Check if it worked
        const [afterUpdate] = await db.execute(`
          SELECT * FROM utilisateurs
          WHERE id_specifique_role = ? AND role = 'patient'
        `, [patientId]);
        
        if (afterUpdate.length > 0) {
          console.log('   User after update:');
          console.dir(afterUpdate[0], { depth: null, colors: true });
        }
      } catch (err) {
        console.error('   Error during manual update:', err);
      }
    }
    
  } catch (err) {
    console.error('Error inspecting verification tables:', err);
  }
}

async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await inspectVerificationTables();
    
    // Add doctor query here
    console.log('\n--- CHECKING DOCTORS IN DATABASE ---');
    try {
      const [doctors] = await db.execute(`
        SELECT m.id, m.prenom, m.nom, m.specialite_id, s.nom AS specialite, 
        m.telephone, m.email_professionnel, m.institution_id, m.est_actif
        FROM medecins m
        LEFT JOIN specialites s ON m.specialite_id = s.id
        ORDER BY m.id
      `);
      
      console.log('Total doctors:', doctors.length);
      for (const doctor of doctors) {
        console.log(`ID: ${doctor.id}, Name: ${doctor.prenom} ${doctor.nom}, Active: ${doctor.est_actif ? 'Yes' : 'No'}, Specialty: ${doctor.specialite}`);
      }
      
      // Check doctor 4's availability
      console.log('\n--- CHECKING AVAILABILITY FOR DOCTOR ID 4 ---');
      const [availabilities] = await db.execute(`
        SELECT id, medecin_id, institution_id, jour_semaine, heure_debut, heure_fin, 
        intervalle_minutes, a_pause_dejeuner, est_actif
        FROM disponibilites_medecin
        WHERE medecin_id = 4
      `);
      
      console.log('Number of availability records:', availabilities.length);
      for (const avail of availabilities) {
        console.log(`ID: ${avail.id}, Day: "${avail.jour_semaine}", Start: ${avail.heure_debut}, End: ${avail.heure_fin}, Active: ${avail.est_actif ? 'Yes' : 'No'}`);
      }
      
      // Test date-fns localization
      const testDate = new Date('2025-05-21');
      const { format } = require('date-fns');
      try {
        const { fr } = require('date-fns/locale');
        console.log('\n--- TESTING DATE FORMATTING ---');
        console.log('Date: 2025-05-21');
        console.log('Day of week (default):', format(testDate, 'EEEE').toLowerCase());
        console.log('Day of week (with fr locale):', format(testDate, 'EEEE', { locale: fr }).toLowerCase());
      } catch (e) {
        console.error('Error testing date formatting:', e.message);
      }
    } catch (error) {
      console.error('Failed to query doctors:', error);
    }
  }
  
  // Always close the connection when done
  process.exit(0);
}

main(); 
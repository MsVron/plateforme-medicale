const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test script to debug the appointments API
async function testAppointmentsAPI() {
  try {
    console.log('Testing appointments API...');
    
    // Create a test JWT token for a doctor (medecin with id_specifique_role = 1)
    const testToken = jwt.sign(
      {
        id: 1,
        nom_utilisateur: 'testmedecin',
        role: 'medecin',
        prenom: 'Dr. Test',
        nom: 'Medecin',
        id_specifique_role: 1
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('Generated test token for doctor ID 1');
    
    // Test the appointments endpoint
    const response = await axios.get('http://localhost:5000/api/medecin/appointments', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.appointments && response.data.appointments.length > 0) {
      console.log(`✅ Success! Found ${response.data.appointments.length} appointments`);
    } else {
      console.log('⚠️  No appointments found. This could be normal if no appointments exist.');
    }
    
  } catch (error) {
    console.error('❌ Error testing appointments API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test database connection and query directly
async function testDatabaseQuery() {
  try {
    console.log('\nTesting database query directly...');
    
    const db = require('./config/db');
    
    // Test the exact query from the controller
    const medecinId = 1;
    const query = `
      SELECT 
        rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif, rv.statut,
        p.id as patient_id, p.prenom as patient_prenom, p.nom as patient_nom,
        p.date_naissance, p.sexe, p.telephone, p.email,
        i.nom as institution_nom
      FROM rendez_vous rv
      JOIN patients p ON rv.patient_id = p.id
      JOIN institutions i ON rv.institution_id = i.id
      WHERE rv.medecin_id = ? 
      AND rv.date_heure_debut >= ?
      AND rv.statut NOT IN ('annulé', 'patient absent', 'terminé')
      ORDER BY rv.date_heure_debut ASC
    `;
    
    const [appointments] = await db.execute(query, [medecinId, new Date()]);
    
    console.log(`Database query returned ${appointments.length} appointments`);
    console.log('Raw appointments data:', JSON.stringify(appointments, null, 2));
    
  } catch (error) {
    console.error('❌ Database query error:', error.message);
  }
}

// Run the tests
async function runTests() {
  await testDatabaseQuery();
  await testAppointmentsAPI();
}

runTests(); 
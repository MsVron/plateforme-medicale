const db = require('./config/db');
const DossierService = require('./controllers/medecin/services/dossierService');

async function testHospitalAdmissions() {
  try {
    console.log('=== Testing Hospital Admissions Functionality ===');
    
    // Test with the actual patient IDs that have hospital assignments
    const testPatients = [3, 25]; // Based on the database data you provided
    
    for (const patientId of testPatients) {
      console.log(`\n--- Testing Patient ID ${patientId} ---`);
      
      // Get patient info
      const [patients] = await db.execute('SELECT id, prenom, nom FROM patients WHERE id = ?', [patientId]);
      
      if (patients.length === 0) {
        console.log(`Patient ${patientId} not found`);
        continue;
      }
      
      const patient = patients[0];
      console.log(`Patient: ${patient.prenom} ${patient.nom} (ID: ${patient.id})`);
      
      // Test the getHospitalAdmissions method directly
      const admissions = await DossierService.getHospitalAdmissions(patient.id);
      console.log('Hospital admissions found:', admissions.length);
      
      if (admissions.length > 0) {
        console.log('Sample admission data:');
        console.log(JSON.stringify(admissions[0], null, 2));
      } else {
        console.log('No hospital admissions found for this patient');
      }
      
      // Test the full dossier method
      console.log('\n--- Testing Full Dossier Method ---');
      const dossier = await DossierService.getPatientDossier(patient.id, 1, 1);
      console.log('Dossier hospitalAdmissions:', dossier.hospitalAdmissions ? dossier.hospitalAdmissions.length : 'undefined');
      
      if (dossier.hospitalAdmissions && dossier.hospitalAdmissions.length > 0) {
        console.log('Sample from dossier:', JSON.stringify(dossier.hospitalAdmissions[0], null, 2));
      }
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Error testing hospital admissions:', error);
  } finally {
    process.exit(0);
  }
}

testHospitalAdmissions(); 
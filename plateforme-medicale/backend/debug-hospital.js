const db = require('./config/db');

async function debugHospital() {
  try {
    console.log('=== Testing Hospital Admissions Query ===');
    
    // Test with patient ID 3 (discharged)
    console.log('\n--- Testing Patient ID 3 (discharged) ---');
    const [result3] = await db.execute(`
      SELECT 
        ha.id, ha.admission_date, ha.discharge_date, ha.status, ha.admission_reason,
        ha.bed_number, ha.ward_name, ha.discharge_reason, ha.date_created,
        CONCAT(m.prenom, ' ', m.nom) as primary_doctor,
        s.nom as primary_doctor_specialty,
        i.nom as hospital_name, i.ville as hospital_city,
        DATEDIFF(COALESCE(ha.discharge_date, NOW()), ha.admission_date) as duration_days
      FROM hospital_assignments ha
      JOIN institutions i ON ha.hospital_id = i.id
      LEFT JOIN medecins m ON ha.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      WHERE ha.patient_id = ?
      ORDER BY ha.admission_date DESC
      LIMIT 20
    `, [3]);
    
    console.log('Patient 3 results:', result3.length);
    if (result3.length > 0) {
      console.log('Sample result:', JSON.stringify(result3[0], null, 2));
    }
    
    // Test with patient ID 25 (active)
    console.log('\n--- Testing Patient ID 25 (active) ---');
    const [result25] = await db.execute(`
      SELECT 
        ha.id, ha.admission_date, ha.discharge_date, ha.status, ha.admission_reason,
        ha.bed_number, ha.ward_name, ha.discharge_reason, ha.date_created,
        CONCAT(m.prenom, ' ', m.nom) as primary_doctor,
        s.nom as primary_doctor_specialty,
        i.nom as hospital_name, i.ville as hospital_city,
        DATEDIFF(COALESCE(ha.discharge_date, NOW()), ha.admission_date) as duration_days
      FROM hospital_assignments ha
      JOIN institutions i ON ha.hospital_id = i.id
      LEFT JOIN medecins m ON ha.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      WHERE ha.patient_id = ?
      ORDER BY ha.admission_date DESC
      LIMIT 20
    `, [25]);
    
    console.log('Patient 25 results:', result25.length);
    if (result25.length > 0) {
      console.log('Sample result:', JSON.stringify(result25[0], null, 2));
    }
    
    // Check if the related tables have the expected data
    console.log('\n--- Checking Related Tables ---');
    
    // Check institution 116
    const [inst] = await db.execute('SELECT * FROM institutions WHERE id = 116');
    console.log('Institution 116:', inst.length > 0 ? inst[0].nom : 'NOT FOUND');
    
    // Check medecins 81 and 83
    const [med81] = await db.execute('SELECT * FROM medecins WHERE id = 81');
    const [med83] = await db.execute('SELECT * FROM medecins WHERE id = 83');
    console.log('Medecin 81:', med81.length > 0 ? `${med81[0].prenom} ${med81[0].nom}` : 'NOT FOUND');
    console.log('Medecin 83:', med83.length > 0 ? `${med83[0].prenom} ${med83[0].nom}` : 'NOT FOUND');
    
    // Check if specialites exist for these doctors
    if (med81.length > 0 && med81[0].specialite_id) {
      const [spec81] = await db.execute('SELECT * FROM specialites WHERE id = ?', [med81[0].specialite_id]);
      console.log('Medecin 81 specialty:', spec81.length > 0 ? spec81[0].nom : 'NOT FOUND');
    }
    
    if (med83.length > 0 && med83[0].specialite_id) {
      const [spec83] = await db.execute('SELECT * FROM specialites WHERE id = ?', [med83[0].specialite_id]);
      console.log('Medecin 83 specialty:', spec83.length > 0 ? spec83[0].nom : 'NOT FOUND');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

debugHospital(); 
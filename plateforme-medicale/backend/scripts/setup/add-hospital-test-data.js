const db = require('../../config/db');

async function addHospitalTestData() {
  try {
    console.log('Adding hospital test data...');
    
    // First, let's check what doctors and patients exist
    const [doctors] = await db.execute(`
      SELECT m.id, m.prenom, m.nom, m.numero_ordre, mi.institution_id, i.nom as institution_nom
      FROM medecins m
      JOIN medecin_institution mi ON m.id = mi.medecin_id
      JOIN institutions i ON mi.institution_id = i.id
      WHERE i.type_institution = 'hospital' OR i.type LIKE '%hôpital%'
      LIMIT 5
    `);
    
    console.log('Hospital doctors found:', doctors);
    
    const [patients] = await db.execute(`
      SELECT id, prenom, nom FROM patients LIMIT 10
    `);
    
    console.log('Patients found:', patients);
    
    if (doctors.length === 0 || patients.length === 0) {
      console.log('No doctors or patients found. Need to populate basic data first.');
      return;
    }
    
    // Create hospital assignments
    for (let i = 0; i < Math.min(doctors.length, 3); i++) {
      const doctor = doctors[i];
      
      for (let j = 0; j < Math.min(patients.length, 3); j++) {
        const patient = patients[j];
        
        // Check if assignment already exists
        const [existing] = await db.execute(
          'SELECT id FROM hospital_assignments WHERE patient_id = ? AND medecin_id = ? AND status = "active"',
          [patient.id, doctor.id]
        );
        
        if (existing.length === 0) {
          // Create current active admission
          await db.execute(`
            INSERT INTO hospital_assignments (
              patient_id, medecin_id, hospital_id, admission_date, 
              admission_reason, assigned_by_user_id, status, ward_name, bed_number
            ) VALUES (?, ?, ?, NOW(), ?, 1, 'active', ?, ?)
          `, [
            patient.id,
            doctor.id,
            doctor.institution_id,
            `Admission active pour ${patient.prenom} ${patient.nom} - Suivi médical en cours`,
            'Cardiologie',
            `C${j + 1}${i + 1}`
          ]);
          
          // Create some historical admissions (discharged)
          const historicalAdmissions = [
            {
              admission_date: '2024-01-15 10:30:00',
              discharge_date: '2024-01-20 14:00:00',
              reason: 'Intervention chirurgicale programmée - Cholécystectomie',
              discharge_reason: 'Guérison complète, sortie à domicile',
              ward: 'Chirurgie',
              bed: `CH${j + 1}`
            },
            {
              admission_date: '2023-11-08 08:15:00',
              discharge_date: '2023-11-12 16:30:00',
              reason: 'Surveillance post-opératoire - Appendicectomie',
              discharge_reason: 'Récupération satisfaisante',
              ward: 'Chirurgie Générale',
              bed: `CG${j + 2}`
            },
            {
              admission_date: '2023-08-22 14:45:00',
              discharge_date: '2023-08-25 09:20:00',
              reason: 'Crise cardiaque - Infarctus du myocarde',
              discharge_reason: 'Stabilisation cardiaque, transfert en cardiologie ambulatoire',
              ward: 'Cardiologie Intensive',
              bed: `CI${j + 3}`
            }
          ];

          for (const admission of historicalAdmissions) {
            await db.execute(`
              INSERT INTO hospital_assignments (
                patient_id, medecin_id, hospital_id, admission_date, discharge_date,
                admission_reason, discharge_reason, assigned_by_user_id, status, 
                ward_name, bed_number
              ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'discharged', ?, ?)
            `, [
              patient.id,
              doctor.id,
              doctor.institution_id,
              admission.admission_date,
              admission.discharge_date,
              admission.reason,
              admission.discharge_reason,
              admission.ward,
              admission.bed
            ]);
          }
          
          console.log(`Created assignments for: Patient ${patient.prenom} ${patient.nom} -> Dr. ${doctor.prenom} ${doctor.nom} at ${doctor.institution_nom}`);
        }
      }
    }
    
    // Check what we created
    const [assignments] = await db.execute(`
      SELECT ha.*, p.prenom as patient_prenom, p.nom as patient_nom,
             m.prenom as doctor_prenom, m.nom as doctor_nom,
             i.nom as hospital_nom
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      JOIN medecins m ON ha.medecin_id = m.id
      JOIN institutions i ON ha.hospital_id = i.id
      WHERE ha.status = 'active'
    `);
    
    console.log('Current active hospital assignments:', assignments);
    
    console.log('Hospital test data added successfully!');
    
  } catch (error) {
    console.error('Error adding hospital test data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  addHospitalTestData().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = addHospitalTestData; 
const db = require('../../config/db');

async function fixSalmaBennaniAssignments() {
  try {
    console.log('Fixing assignments for Dr. Salma Bennani...');
    
    // First, find the doctor
    const [doctors] = await db.execute(`
      SELECT m.id, m.prenom, m.nom, m.numero_ordre, u.nom_utilisateur
      FROM medecins m
      JOIN utilisateurs u ON u.id_specifique_role = m.id AND u.role = 'medecin'
      WHERE u.nom_utilisateur = 'salma.bennani' OR m.id = 64
    `);
    
    if (doctors.length === 0) {
      console.log('Doctor salma.bennani not found');
      return;
    }
    
    const doctor = doctors[0];
    console.log('Found doctor:', doctor);
    
    // Check doctor's hospital affiliations
    const [affiliations] = await db.execute(`
      SELECT mi.*, i.nom as institution_nom, i.type_institution
      FROM medecin_institution mi
      JOIN institutions i ON mi.institution_id = i.id
      WHERE mi.medecin_id = ?
    `, [doctor.id]);
    
    console.log('Doctor affiliations:', affiliations);
    
    if (affiliations.length === 0) {
      console.log('Doctor has no hospital affiliations. Adding one...');
      
      // Find a hospital to affiliate with
      const [hospitals] = await db.execute(`
        SELECT id, nom FROM institutions 
        WHERE type_institution = 'hospital' OR type LIKE '%hôpital%'
        LIMIT 1
      `);
      
      if (hospitals.length > 0) {
        const hospital = hospitals[0];
        await db.execute(`
          INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
          VALUES (?, ?, TRUE, CURDATE(), CURDATE())
        `, [doctor.id, hospital.id]);
        
        console.log(`Added affiliation: Dr. ${doctor.prenom} ${doctor.nom} -> ${hospital.nom}`);
      }
    }
    
    // Get some patients to assign
    const [patients] = await db.execute(`
      SELECT id, prenom, nom FROM patients 
      WHERE id NOT IN (
        SELECT patient_id FROM hospital_assignments 
        WHERE medecin_id = ? AND status = 'active'
      )
      LIMIT 3
    `, [doctor.id]);
    
    console.log('Available patients:', patients);
    
    if (patients.length === 0) {
      console.log('No available patients found. Creating test patients...');
      
      // Create test patients
      const testPatients = [
        { prenom: 'Ahmed', nom: 'Benali', sexe: 'M', date_naissance: '1985-03-15' },
        { prenom: 'Fatima', nom: 'Alami', sexe: 'F', date_naissance: '1990-07-22' },
        { prenom: 'Omar', nom: 'Tazi', sexe: 'M', date_naissance: '1978-11-08' }
      ];
      
      for (const patient of testPatients) {
        const [result] = await db.execute(`
          INSERT INTO patients (prenom, nom, sexe, date_naissance, date_inscription)
          VALUES (?, ?, ?, ?, NOW())
        `, [patient.prenom, patient.nom, patient.sexe, patient.date_naissance]);
        
        patients.push({ id: result.insertId, prenom: patient.prenom, nom: patient.nom });
        console.log(`Created test patient: ${patient.prenom} ${patient.nom}`);
      }
    }
    
    // Get doctor's hospital affiliation (after potentially creating one)
    const [updatedAffiliations] = await db.execute(`
      SELECT mi.institution_id, i.nom as institution_nom
      FROM medecin_institution mi
      JOIN institutions i ON mi.institution_id = i.id
      WHERE mi.medecin_id = ?
      LIMIT 1
    `, [doctor.id]);
    
    if (updatedAffiliations.length === 0) {
      console.log('Still no hospital affiliation found');
      return;
    }
    
    const hospitalId = updatedAffiliations[0].institution_id;
    const hospitalName = updatedAffiliations[0].institution_nom;
    
    // Create hospital assignments
    for (const patient of patients.slice(0, 3)) {
      // Check if assignment already exists
      const [existing] = await db.execute(
        'SELECT id FROM hospital_assignments WHERE patient_id = ? AND medecin_id = ? AND status = "active"',
        [patient.id, doctor.id]
      );
      
      if (existing.length === 0) {
        await db.execute(`
          INSERT INTO hospital_assignments (
            patient_id, medecin_id, hospital_id, admission_date, 
            admission_reason, assigned_by_user_id, status
          ) VALUES (?, ?, ?, NOW(), ?, 1, 'active')
        `, [
          patient.id,
          doctor.id,
          hospitalId,
          `Admission pour suivi médical - Patient ${patient.prenom} ${patient.nom}`
        ]);
        
        console.log(`Created assignment: Patient ${patient.prenom} ${patient.nom} -> Dr. ${doctor.prenom} ${doctor.nom} at ${hospitalName}`);
      } else {
        console.log(`Assignment already exists for patient ${patient.prenom} ${patient.nom}`);
      }
    }
    
    // Verify the assignments
    const [finalAssignments] = await db.execute(`
      SELECT ha.*, p.prenom as patient_prenom, p.nom as patient_nom,
             i.nom as hospital_nom
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      JOIN institutions i ON ha.hospital_id = i.id
      WHERE ha.medecin_id = ? AND ha.status = 'active'
    `, [doctor.id]);
    
    console.log(`Final assignments for Dr. ${doctor.prenom} ${doctor.nom}:`, finalAssignments);
    
    console.log('Fix completed successfully!');
    
  } catch (error) {
    console.error('Error fixing assignments:', error);
  }
}

// Run if called directly
if (require.main === module) {
  fixSalmaBennaniAssignments().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = fixSalmaBennaniAssignments; 
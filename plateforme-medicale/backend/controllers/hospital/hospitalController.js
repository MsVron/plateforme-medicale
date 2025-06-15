const db = require('../../config/db');
const { searchPatients } = require('../../utils/patientSearch');

// Search patients for hospital (using shared search utility)
exports.searchPatients = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { prenom, nom, cne } = req.query;

    const result = await searchPatients({
      prenom,
      nom,
      cne,
      userId: req.user.id,
      institutionId: hospitalId,
      institutionType: 'hospital',
      additionalFields: `,
        ha.id as current_assignment_id,
        ha.status as assignment_status,
        ha.admission_date,
        ha.bed_number,
        ha.ward_name,
        CASE 
          WHEN ha.id IS NOT NULL AND ha.status = 'active' THEN TRUE 
          ELSE FALSE 
        END as currently_admitted`,
      additionalJoins: `
        LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id 
          AND ha.hospital_id = ${hospitalId}
          AND ha.status = 'active'`
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la recherche de patients:', error);
    return res.status(500).json({ 
      message: error.message
    });
  }
};

// Get hospital patient management view
exports.getHospitalPatients = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [patients] = await db.execute(`
      SELECT * FROM hospital_patient_management 
      WHERE hospital_name = (SELECT nom FROM institutions WHERE id = ?)
      ORDER BY admission_date DESC
    `, [hospitalId]);

    return res.status(200).json({ patients });
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Admit patient to hospital
exports.admitPatient = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { 
      medecin_id, 
      admission_reason, 
      bed_number, 
      ward_name 
    } = req.body;

    // Validate required fields
    if (!medecin_id || !admission_reason) {
      return res.status(400).json({ 
        message: 'Médecin et motif d\'admission sont requis' 
      });
    }

    // Check if patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom FROM patients WHERE id = ?', 
      [patientId]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Check if doctor works at this hospital
    const [doctorCheck] = await db.execute(`
      SELECT mi.medecin_id 
      FROM medecin_institution mi 
      WHERE mi.medecin_id = ? AND mi.institution_id = ?
    `, [medecin_id, hospitalId]);

    if (doctorCheck.length === 0) {
      return res.status(400).json({ 
        message: 'Ce médecin ne travaille pas dans cet hôpital' 
      });
    }

    // Check if patient is already admitted to this hospital
    const [existingAssignment] = await db.execute(`
      SELECT id FROM hospital_assignments 
      WHERE patient_id = ? AND hospital_id = ? AND status = 'active'
    `, [patientId, hospitalId]);

    if (existingAssignment.length > 0) {
      return res.status(400).json({ 
        message: 'Patient déjà admis dans cet hôpital' 
      });
    }

    // Create hospital assignment
    const [result] = await db.execute(`
      INSERT INTO hospital_assignments (
        patient_id, medecin_id, hospital_id, admission_date, 
        admission_reason, bed_number, ward_name, assigned_by_user_id
      ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
    `, [
      patientId, medecin_id, hospitalId, admission_reason, 
      bed_number, ward_name, req.user.id
    ]);

    // Update bed occupancy if bed number provided
    if (bed_number) {
      await db.execute(`
        UPDATE hospital_beds 
        SET is_occupied = TRUE, current_patient_assignment_id = ?
        WHERE hospital_id = ? AND bed_number = ?
      `, [result.insertId, hospitalId, bed_number]);
    }

    // Log the admission
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'PATIENT_ADMISSION', 
      'hospital_assignments', 
      result.insertId, 
      `Admission de ${patients[0].prenom} ${patients[0].nom}`
    ]);

    return res.status(201).json({ 
      message: 'Patient admis avec succès',
      assignmentId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'admission:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Discharge patient from hospital
exports.dischargePatient = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { assignmentId } = req.params;
    const { discharge_reason } = req.body;

    // Validate assignment exists and belongs to this hospital
    const [assignments] = await db.execute(`
      SELECT ha.*, p.prenom, p.nom 
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      WHERE ha.id = ? AND ha.hospital_id = ? AND ha.status = 'active'
    `, [assignmentId, hospitalId]);

    if (assignments.length === 0) {
      return res.status(404).json({ 
        message: 'Assignment non trouvé ou patient déjà sorti' 
      });
    }

    const assignment = assignments[0];

    // Update assignment status
    await db.execute(`
      UPDATE hospital_assignments 
      SET status = 'discharged', discharge_date = NOW(), discharge_reason = ?
      WHERE id = ?
    `, [discharge_reason, assignmentId]);

    // Free up the bed
    if (assignment.bed_number) {
      await db.execute(`
        UPDATE hospital_beds 
        SET is_occupied = FALSE, current_patient_assignment_id = NULL
        WHERE hospital_id = ? AND bed_number = ?
      `, [hospitalId, assignment.bed_number]);
    }

    // Log the discharge
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'PATIENT_DISCHARGE', 
      'hospital_assignments', 
      assignmentId, 
      `Sortie de ${assignment.prenom} ${assignment.nom}`
    ]);

    return res.status(200).json({ 
      message: 'Patient sorti avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la sortie:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Add walk-in patient (reusing existing functionality)
exports.addWalkInPatient = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    
    const {
      prenom, nom, date_naissance, sexe, CNE, telephone, email, 
      adresse, ville, code_postal, pays, groupe_sanguin, medecin_id
    } = req.body;

    // Validate required fields
    if (!prenom || !nom || !date_naissance || !sexe || !CNE) {
      return res.status(400).json({ 
        message: "Prénom, nom, date de naissance, sexe et CNE sont obligatoires"
      });
    }

    // If no doctor specified, get a default doctor from this hospital
    let assignedMedecinId = medecin_id;
    if (!assignedMedecinId) {
      const [hospitalDoctors] = await db.execute(`
        SELECT m.id FROM medecins m
        JOIN medecin_institution mi ON m.id = mi.medecin_id
        WHERE mi.institution_id = ? AND m.est_actif = TRUE
        LIMIT 1
      `, [hospitalId]);

      if (hospitalDoctors.length === 0) {
        return res.status(400).json({ 
          message: 'Aucun médecin disponible dans cet hôpital' 
        });
      }
      assignedMedecinId = hospitalDoctors[0].id;
    }

    // Check for existing CNE
    const [existingCNE] = await db.execute(
      'SELECT id FROM patients WHERE CNE = ?',
      [CNE]
    );
    
    if (existingCNE.length > 0) {
      return res.status(400).json({ 
        message: "CNE déjà utilisé par un autre patient"
      });
    }

    // Generate unique username
    const { generateUniqueUsername } = require('../../utils/validation');
    const username = await generateUniqueUsername(prenom, nom, db);

    // Use CNE as password (hashed)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(CNE, 10);

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Insert patient
      const [patientResult] = await conn.execute(
        `INSERT INTO patients (
          prenom, nom, date_naissance, sexe, email, telephone, adresse, ville, code_postal,
          pays, CNE, groupe_sanguin, est_inscrit_par_medecin, medecin_inscripteur_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prenom.trim(), nom.trim(), date_naissance, sexe, email || null, telephone || null,
          adresse || null, ville || null, code_postal || null, pays || 'Maroc',
          CNE, groupe_sanguin || null, true, assignedMedecinId
        ]
      );

      const patientId = patientResult.insertId;

      // Create user account
      await conn.execute(
        'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_actif, est_verifie) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, hashedPassword, email || null, 'patient', patientId, true, true]
      );

      // Commit transaction
      await conn.commit();

      return res.status(201).json({ 
        message: "Patient walk-in ajouté avec succès",
        patient: {
          id: patientId,
          prenom,
          nom,
          username,
          CNE
        },
        credentials: {
          username,
          password: CNE
        }
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du patient walk-in:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Get hospital doctors
exports.getHospitalDoctors = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [doctors] = await db.execute(`
      SELECT 
        m.id, 
        m.prenom, 
        m.nom, 
        s.nom as specialite,
        m.telephone,
        m.email,
        m.est_actif
      FROM medecins m
      JOIN specialites s ON m.specialite_id = s.id
      JOIN medecin_institution mi ON m.id = mi.medecin_id
      WHERE mi.institution_id = ? AND m.est_actif = TRUE
      ORDER BY m.nom, m.prenom
    `, [hospitalId]);

    return res.status(200).json({ 
      doctors,
      totalDoctors: doctors.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

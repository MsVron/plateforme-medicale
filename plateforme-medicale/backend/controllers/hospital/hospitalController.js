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
        GROUP_CONCAT(DISTINCT CONCAT(m.prenom, ' ', m.nom, ':', s.nom) SEPARATOR ';') as assigned_doctors,
        CASE 
          WHEN ha.id IS NOT NULL AND ha.status = 'active' THEN TRUE 
          ELSE FALSE 
        END as currently_assigned`,
      additionalJoins: `
        LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id 
          AND ha.hospital_id = ${hospitalId}
          AND ha.status = 'active'
        LEFT JOIN medecins m ON ha.medecin_id = m.id
        LEFT JOIN specialites s ON m.specialite_id = s.id`,
      additionalConditions: `GROUP BY p.id`
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

// Assign patient to doctors
exports.assignPatientToDoctors = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { doctor_ids, assignment_reason, notes, assignment_date } = req.body;

    // Check if patient exists
    const [patients] = await db.execute(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé'
      });
    }

    if (!doctor_ids || doctor_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Au moins un médecin doit être sélectionné'
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Remove existing active assignments for this patient in this hospital
      await connection.execute(
        'UPDATE hospital_assignments SET status = "discharged", discharge_date = NOW() WHERE patient_id = ? AND hospital_id = ? AND status = "active"',
        [patientId, hospitalId]
      );

      // Create new assignments for each doctor
      for (const doctorId of doctor_ids) {
        await connection.execute(
          `INSERT INTO hospital_assignments 
           (patient_id, medecin_id, hospital_id, admission_date, admission_reason, assigned_by_user_id) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [patientId, doctorId, hospitalId, assignment_date || new Date(), assignment_reason, req.user.id]
        );

        // Add to medical record
        await connection.execute(
          `INSERT INTO notes_patient 
           (patient_id, medecin_id, note_type, content, created_at) 
           VALUES (?, ?, 'assignment', ?, NOW())`,
          [
            patientId, 
            doctorId, 
            `Assignation hospitalière: ${assignment_reason}${notes ? ` - Notes: ${notes}` : ''}`
          ]
        );
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Patient assigné aux médecins avec succès'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error assigning patient to doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation du patient'
    });
  }
};

// Discharge patient from hospital
exports.dischargePatient = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { discharge_reason, discharge_notes, follow_up_required, follow_up_date } = req.body;

    // Check if patient has active assignments in this hospital
    const [assignments] = await db.execute(
      'SELECT id FROM hospital_assignments WHERE patient_id = ? AND hospital_id = ? AND status = "active"',
      [patientId, hospitalId]
    );

    if (assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient non assigné à cet hôpital ou déjà sorti'
      });
    }

    // Update all active assignments to discharged
    await db.execute(
      `UPDATE hospital_assignments 
       SET status = 'discharged', discharge_date = NOW(), discharge_reason = ?, discharge_notes = ?
       WHERE patient_id = ? AND hospital_id = ? AND status = 'active'`,
      [discharge_reason, discharge_notes, patientId, hospitalId]
    );

    // Add to medical record
    await db.execute(
      `INSERT INTO notes_patient 
       (patient_id, medecin_id, note_type, content, created_at) 
       VALUES (?, ?, 'discharge', ?, NOW())`,
      [
        patientId, 
        req.user.id, 
        `Sortie hospitalière - ${discharge_reason}${discharge_notes ? ` - Notes: ${discharge_notes}` : ''}${follow_up_required ? ` - Suivi requis le ${follow_up_date}` : ''}`
      ]
    );

    res.json({
      success: true,
      message: 'Patient sorti avec succès'
    });
  } catch (error) {
    console.error('Error discharging patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la sortie du patient'
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
        m.numero_ordre,
        s.nom as specialite,
        m.telephone,
        m.email_professionnel,
        m.est_actif,
        mi.departement,
        mi.date_affectation,
        mi.notes
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

// Bed Management Methods
exports.getBedStatistics = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    // Get total beds and occupancy
    const [bedStats] = await db.execute(`
      SELECT 
        COUNT(*) as totalBeds,
        SUM(CASE WHEN is_occupied = TRUE THEN 1 ELSE 0 END) as occupiedBeds,
        SUM(CASE WHEN is_occupied = FALSE AND maintenance_status = 'available' THEN 1 ELSE 0 END) as availableBeds
      FROM hospital_beds 
      WHERE hospital_id = ?
    `, [hospitalId]);

    // Get beds by type
    const [bedsByType] = await db.execute(`
      SELECT 
        bed_type,
        COUNT(*) as total,
        SUM(CASE WHEN is_occupied = TRUE THEN 1 ELSE 0 END) as occupied
      FROM hospital_beds 
      WHERE hospital_id = ?
      GROUP BY bed_type
    `, [hospitalId]);

    // Get ward occupancy
    const [wardOccupancy] = await db.execute(`
      SELECT 
        ward_name,
        COUNT(*) as total,
        SUM(CASE WHEN is_occupied = TRUE THEN 1 ELSE 0 END) as occupied
      FROM hospital_beds 
      WHERE hospital_id = ?
      GROUP BY ward_name
    `, [hospitalId]);

    return res.status(200).json({
      totalBeds: bedStats[0]?.totalBeds || 0,
      occupiedBeds: bedStats[0]?.occupiedBeds || 0,
      availableBeds: bedStats[0]?.availableBeds || 0,
      bedsByType,
      wardOccupancy
    });
  } catch (error) {
    console.error('Error fetching bed statistics:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.getBeds = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [beds] = await db.execute(`
      SELECT 
        hb.*,
        ha.patient_id,
        p.prenom as patient_prenom,
        p.nom as patient_nom
      FROM hospital_beds hb
      LEFT JOIN hospital_assignments ha ON hb.current_patient_assignment_id = ha.id
      LEFT JOIN patients p ON ha.patient_id = p.id
      WHERE hb.hospital_id = ?
      ORDER BY hb.ward_name, hb.bed_number
    `, [hospitalId]);

    return res.status(200).json({ beds });
  } catch (error) {
    console.error('Error fetching beds:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.createBed = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { bed_number, ward_name, room_number, bed_type, maintenance_status } = req.body;

    // Check if bed number already exists in this hospital
    const [existingBed] = await db.execute(`
      SELECT id FROM hospital_beds 
      WHERE hospital_id = ? AND bed_number = ?
    `, [hospitalId, bed_number]);

    if (existingBed.length > 0) {
      return res.status(400).json({ 
        message: 'Ce numéro de lit existe déjà dans cet hôpital' 
      });
    }

    const [result] = await db.execute(`
      INSERT INTO hospital_beds (
        hospital_id, bed_number, ward_name, room_number, 
        bed_type, maintenance_status, is_occupied
      ) VALUES (?, ?, ?, ?, ?, ?, FALSE)
    `, [hospitalId, bed_number, ward_name, room_number, bed_type, maintenance_status]);

    return res.status(201).json({ 
      message: 'Lit créé avec succès',
      bedId: result.insertId
    });
  } catch (error) {
    console.error('Error creating bed:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.updateBed = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { bedId } = req.params;
    const { bed_number, ward_name, room_number, bed_type, maintenance_status } = req.body;

    // Check if bed exists and belongs to this hospital
    const [existingBed] = await db.execute(`
      SELECT id FROM hospital_beds 
      WHERE id = ? AND hospital_id = ?
    `, [bedId, hospitalId]);

    if (existingBed.length === 0) {
      return res.status(404).json({ message: 'Lit non trouvé' });
    }

    await db.execute(`
      UPDATE hospital_beds 
      SET bed_number = ?, ward_name = ?, room_number = ?, 
          bed_type = ?, maintenance_status = ?
      WHERE id = ? AND hospital_id = ?
    `, [bed_number, ward_name, room_number, bed_type, maintenance_status, bedId, hospitalId]);

    return res.status(200).json({ message: 'Lit mis à jour avec succès' });
  } catch (error) {
    console.error('Error updating bed:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.getWards = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [wards] = await db.execute(`
      SELECT DISTINCT ward_name as name
      FROM hospital_beds 
      WHERE hospital_id = ?
      ORDER BY ward_name
    `, [hospitalId]);

    return res.status(200).json({ wards });
  } catch (error) {
    console.error('Error fetching wards:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Surgery Management Methods
exports.getSurgeryStatistics = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [surgeryStats] = await db.execute(`
      SELECT 
        COUNT(*) as totalSurgeries,
        SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM hospital_surgeries 
      WHERE hospital_id = ?
    `, [hospitalId]);

    return res.status(200).json({
      totalSurgeries: surgeryStats[0]?.totalSurgeries || 0,
      scheduled: surgeryStats[0]?.scheduled || 0,
      inProgress: surgeryStats[0]?.inProgress || 0,
      completed: surgeryStats[0]?.completed || 0,
      cancelled: surgeryStats[0]?.cancelled || 0
    });
  } catch (error) {
    console.error('Error fetching surgery statistics:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.getSurgeries = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    const [surgeries] = await db.execute(`
      SELECT 
        hs.*,
        p.prenom as patient_prenom,
        p.nom as patient_nom,
        m1.prenom as surgeon_prenom,
        m1.nom as surgeon_nom,
        m2.prenom as assistant_prenom,
        m2.nom as assistant_nom,
        m3.prenom as anesthesiologist_prenom,
        m3.nom as anesthesiologist_nom
      FROM hospital_surgeries hs
      JOIN patients p ON hs.patient_id = p.id
      JOIN medecins m1 ON hs.primary_surgeon_id = m1.id
      LEFT JOIN medecins m2 ON hs.assistant_surgeon_id = m2.id
      LEFT JOIN medecins m3 ON hs.anesthesiologist_id = m3.id
      WHERE hs.hospital_id = ?
      ORDER BY hs.scheduled_date DESC
    `, [hospitalId]);

    return res.status(200).json({ surgeries });
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.createSurgery = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const surgeryData = req.body;

    const [result] = await db.execute(`
      INSERT INTO hospital_surgeries (
        hospital_id, patient_id, primary_surgeon_id, assistant_surgeon_id,
        anesthesiologist_id, scheduled_date, estimated_duration, surgery_type,
        procedure_name, operating_room, priority, pre_op_notes, 
        special_requirements, equipment_needed, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')
    `, [
      hospitalId, surgeryData.patient_id, surgeryData.primary_surgeon_id,
      surgeryData.assistant_surgeon_id, surgeryData.anesthesiologist_id,
      surgeryData.scheduled_date, surgeryData.estimated_duration,
      surgeryData.surgery_type, surgeryData.procedure_name,
      surgeryData.operating_room, surgeryData.priority,
      surgeryData.pre_op_notes, surgeryData.special_requirements,
      surgeryData.equipment_needed
    ]);

    return res.status(201).json({ 
      message: 'Chirurgie programmée avec succès',
      surgeryId: result.insertId
    });
  } catch (error) {
    console.error('Error creating surgery:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.updateSurgery = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { surgeryId } = req.params;
    const surgeryData = req.body;

    // Check if surgery exists and belongs to this hospital
    const [existingSurgery] = await db.execute(`
      SELECT id FROM hospital_surgeries 
      WHERE id = ? AND hospital_id = ?
    `, [surgeryId, hospitalId]);

    if (existingSurgery.length === 0) {
      return res.status(404).json({ message: 'Chirurgie non trouvée' });
    }

    await db.execute(`
      UPDATE hospital_surgeries 
      SET patient_id = ?, primary_surgeon_id = ?, assistant_surgeon_id = ?,
          anesthesiologist_id = ?, scheduled_date = ?, estimated_duration = ?,
          surgery_type = ?, procedure_name = ?, operating_room = ?,
          priority = ?, pre_op_notes = ?, special_requirements = ?,
          equipment_needed = ?
      WHERE id = ? AND hospital_id = ?
    `, [
      surgeryData.patient_id, surgeryData.primary_surgeon_id,
      surgeryData.assistant_surgeon_id, surgeryData.anesthesiologist_id,
      surgeryData.scheduled_date, surgeryData.estimated_duration,
      surgeryData.surgery_type, surgeryData.procedure_name,
      surgeryData.operating_room, surgeryData.priority,
      surgeryData.pre_op_notes, surgeryData.special_requirements,
      surgeryData.equipment_needed, surgeryId, hospitalId
    ]);

    return res.status(200).json({ message: 'Chirurgie mise à jour avec succès' });
  } catch (error) {
    console.error('Error updating surgery:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.getOperatingRooms = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;

    // For now, return a default set of operating rooms
    // This could be extended to a proper database table
    const operatingRooms = [
      { id: 1, name: 'Bloc 1 - Chirurgie Générale', type: 'general' },
      { id: 2, name: 'Bloc 2 - Chirurgie Cardiaque', type: 'cardiac' },
      { id: 3, name: 'Bloc 3 - Neurochirurgie', type: 'neuro' },
      { id: 4, name: 'Bloc 4 - Chirurgie Orthopédique', type: 'orthopedic' },
      { id: 5, name: 'Bloc 5 - Chirurgie d\'Urgence', type: 'emergency' }
    ];

    return res.status(200).json({ rooms: operatingRooms });
  } catch (error) {
    console.error('Error fetching operating rooms:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Patient-Bed Assignment Methods
exports.assignPatientToBed = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { bedId } = req.params;
    const { patient_id, doctor_id, admission_reason, notes } = req.body;

    // Check if bed exists and is available
    const [beds] = await db.execute(`
      SELECT id, bed_number, is_occupied, maintenance_status 
      FROM hospital_beds 
      WHERE id = ? AND hospital_id = ?
    `, [bedId, hospitalId]);

    if (beds.length === 0) {
      return res.status(404).json({ message: 'Lit non trouvé' });
    }

    const bed = beds[0];
    if (bed.is_occupied) {
      return res.status(400).json({ message: 'Ce lit est déjà occupé' });
    }

    if (bed.maintenance_status !== 'available') {
      return res.status(400).json({ message: 'Ce lit n\'est pas disponible' });
    }

    // Check if patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom FROM patients WHERE id = ?', 
      [patient_id]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Check if doctor works at this hospital
    const [doctorCheck] = await db.execute(`
      SELECT mi.medecin_id 
      FROM medecin_institution mi 
      WHERE mi.medecin_id = ? AND mi.institution_id = ?
    `, [doctor_id, hospitalId]);

    if (doctorCheck.length === 0) {
      return res.status(400).json({ 
        message: 'Ce médecin ne travaille pas dans cet hôpital' 
      });
    }

    // Create hospital assignment
    const [result] = await db.execute(`
      INSERT INTO hospital_assignments (
        patient_id, medecin_id, hospital_id, admission_date, 
        admission_reason, bed_number, ward_name, assigned_by_user_id
      ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
    `, [
      patient_id, doctor_id, hospitalId, admission_reason, 
      bed.bed_number, bed.ward_name, req.user.id
    ]);

    // Update bed occupancy
    await db.execute(`
      UPDATE hospital_beds 
      SET is_occupied = TRUE, current_patient_assignment_id = ?
      WHERE id = ?
    `, [result.insertId, bedId]);

    return res.status(200).json({ 
      message: 'Patient assigné au lit avec succès',
      assignmentId: result.insertId
    });
  } catch (error) {
    console.error('Error assigning patient to bed:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.transferPatient = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { bedId } = req.params;
    const { new_bed_id, transfer_reason, notes } = req.body;

    // Check if current bed exists and is occupied
    const [currentBeds] = await db.execute(`
      SELECT id, bed_number, is_occupied, current_patient_assignment_id 
      FROM hospital_beds 
      WHERE id = ? AND hospital_id = ?
    `, [bedId, hospitalId]);

    if (currentBeds.length === 0) {
      return res.status(404).json({ message: 'Lit actuel non trouvé' });
    }

    const currentBed = currentBeds[0];
    if (!currentBed.is_occupied) {
      return res.status(400).json({ message: 'Ce lit n\'est pas occupé' });
    }

    // Check if new bed exists and is available
    const [newBeds] = await db.execute(`
      SELECT id, bed_number, ward_name, is_occupied, maintenance_status 
      FROM hospital_beds 
      WHERE id = ? AND hospital_id = ?
    `, [new_bed_id, hospitalId]);

    if (newBeds.length === 0) {
      return res.status(404).json({ message: 'Nouveau lit non trouvé' });
    }

    const newBed = newBeds[0];
    if (newBed.is_occupied) {
      return res.status(400).json({ message: 'Le nouveau lit est déjà occupé' });
    }

    if (newBed.maintenance_status !== 'available') {
      return res.status(400).json({ message: 'Le nouveau lit n\'est pas disponible' });
    }

    // Update the assignment with new bed information
    await db.execute(`
      UPDATE hospital_assignments 
      SET bed_number = ?, ward_name = ?
      WHERE id = ?
    `, [newBed.bed_number, newBed.ward_name, currentBed.current_patient_assignment_id]);

    // Update bed occupancy
    await db.execute(`
      UPDATE hospital_beds 
      SET is_occupied = FALSE, current_patient_assignment_id = NULL
      WHERE id = ?
    `, [bedId]);

    await db.execute(`
      UPDATE hospital_beds 
      SET is_occupied = TRUE, current_patient_assignment_id = ?
      WHERE id = ?
    `, [currentBed.current_patient_assignment_id, new_bed_id]);

    // Log the transfer
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'PATIENT_TRANSFER', 
      'hospital_assignments', 
      currentBed.current_patient_assignment_id, 
      `Transfert du lit ${currentBed.bed_number} vers ${newBed.bed_number}. Motif: ${transfer_reason}`
    ]);

    return res.status(200).json({ 
      message: 'Patient transféré avec succès'
    });
  } catch (error) {
    console.error('Error transferring patient:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Doctor Management Methods
exports.searchDoctors = async (req, res) => {
  console.log('🔍 searchDoctors method called!');
  console.log('Query params:', req.query);
  console.log('User:', req.user?.id, req.user?.role);
  
  try {
    const hospitalId = req.user.id_specifique_role;
    const { prenom, nom, numero_ordre } = req.query;
    
    console.log('Hospital ID:', hospitalId);
    console.log('Search criteria:', { prenom, nom, numero_ordre });

    let query = `
      SELECT 
        m.id, 
        m.prenom, 
        m.nom, 
        m.numero_ordre,
        s.nom as specialite,
        m.telephone,
        m.email_professionnel,
        m.est_actif,
        CASE WHEN mi.medecin_id IS NOT NULL THEN TRUE ELSE FALSE END as is_assigned
      FROM medecins m
      JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN medecin_institution mi ON m.id = mi.medecin_id AND mi.institution_id = ?
      WHERE m.est_actif = TRUE
    `;
    
    const params = [hospitalId];

    if (prenom) {
      query += ' AND m.prenom LIKE ?';
      params.push(`%${prenom}%`);
    }
    
    if (nom) {
      query += ' AND m.nom LIKE ?';
      params.push(`%${nom}%`);
    }

    if (numero_ordre) {
      query += ' AND m.numero_ordre LIKE ?';
      params.push(`%${numero_ordre}%`);
    }

    query += ' ORDER BY m.nom, m.prenom';

    const [doctors] = await db.execute(query, params);

    return res.status(200).json({ 
      doctors,
      totalDoctors: doctors.length
    });
  } catch (error) {
    console.error('Error searching doctors:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.addDoctorToHospital = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { doctorId } = req.params;
    const { department, start_date, notes } = req.body;

    // Check if doctor exists
    const [doctors] = await db.execute(
      'SELECT id, prenom, nom FROM medecins WHERE id = ? AND est_actif = TRUE', 
      [doctorId]
    );
    
    if (doctors.length === 0) {
      return res.status(404).json({ message: 'Médecin non trouvé' });
    }

    // Check if doctor is already assigned to this hospital
    const [existingAssignment] = await db.execute(`
      SELECT medecin_id FROM medecin_institution 
      WHERE medecin_id = ? AND institution_id = ?
    `, [doctorId, hospitalId]);

    if (existingAssignment.length > 0) {
      return res.status(400).json({ 
        message: 'Ce médecin travaille déjà dans cet hôpital' 
      });
    }

    // Add doctor to hospital - using correct column names
    await db.execute(`
      INSERT INTO medecin_institution (
        medecin_id, institution_id, date_affectation, departement, notes, est_principal
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [doctorId, hospitalId, start_date || new Date().toISOString().split('T')[0], department, notes, false]);

    return res.status(201).json({ 
      message: 'Médecin ajouté à l\'hôpital avec succès'
    });
  } catch (error) {
    console.error('Error adding doctor to hospital:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.removeDoctorFromHospital = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { doctorId } = req.params;

    // Check if doctor is assigned to this hospital
    const [assignment] = await db.execute(`
      SELECT id FROM medecin_institution 
      WHERE medecin_id = ? AND institution_id = ?
    `, [doctorId, hospitalId]);

    if (assignment.length === 0) {
      return res.status(404).json({ 
        message: 'Ce médecin ne travaille pas dans cet hôpital' 
      });
    }

    // Remove doctor from hospital
    await db.execute(`
      DELETE FROM medecin_institution 
      WHERE medecin_id = ? AND institution_id = ?
    `, [doctorId, hospitalId]);

    return res.status(200).json({ 
      message: 'Médecin retiré de l\'hôpital avec succès'
    });
  } catch (error) {
    console.error('Error removing doctor from hospital:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Get hospital admissions
exports.getHospitalAdmissions = async (req, res) => {
  try {
    const hospitalId = req.user.institution_id || req.user.id;

    const query = `
      SELECT 
        ha.*,
        p.prenom as patient_prenom,
        p.nom as patient_nom,
        p.CNE as patient_cne,
        p.telephone as patient_telephone
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      WHERE ha.hospital_id = ?
      ORDER BY ha.admission_date DESC
    `;

    const [admissions] = await db.execute(query, [hospitalId]);

    res.json({
      success: true,
      data: admissions
    });
  } catch (error) {
    console.error('Error fetching hospital admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des admissions'
    });
  }
};

// Get doctor statistics
exports.getDoctorStats = async (req, res) => {
  try {
    const hospitalId = req.user.institution_id || req.user.id;

    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as totalDoctors,
        COUNT(CASE WHEN hd.status = 'active' THEN 1 END) as activeDoctors
      FROM hospital_doctors hd
      WHERE hd.hospital_id = ?
    `, [hospitalId]);

    res.json({
      success: true,
      data: stats[0] || { totalDoctors: 0, activeDoctors: 0 }
    });
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques des médecins'
    });
  }
};

// Get admission statistics
exports.getAdmissionStats = async (req, res) => {
  try {
    const hospitalId = req.user.institution_id || req.user.id;

    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as totalAdmissions,
        COUNT(CASE WHEN discharge_date IS NULL THEN 1 END) as currentPatients
      FROM hospital_assignments
      WHERE hospital_id = ?
    `, [hospitalId]);

    res.json({
      success: true,
      data: stats[0] || { totalAdmissions: 0, currentPatients: 0 }
    });
  } catch (error) {
    console.error('Error fetching admission stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques d\'admission'
    });
  }
};

// Get all medical specialties
exports.getSpecialties = async (req, res) => {
  try {
    const [specialties] = await db.execute(`
      SELECT id, nom, description
      FROM specialites
      ORDER BY nom ASC
    `);

    res.json({
      success: true,
      data: specialties
    });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des spécialités'
    });
  }
};

// Get patient medical record
exports.getPatientMedicalRecord = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Verify patient exists and has been admitted to this hospital
    const [patientCheck] = await db.execute(`
      SELECT DISTINCT p.id, p.prenom, p.nom, p.CNE
      FROM patients p
      LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id
      WHERE p.id = ? AND (ha.hospital_id = ? OR ha.hospital_id IS NULL)
    `, [patientId, hospitalId]);

    if (patientCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé ou non autorisé'
      });
    }

    // Get comprehensive medical record
    const [medicalRecord] = await db.execute(`
      SELECT 
        p.id, p.prenom, p.nom, p.CNE, p.date_naissance, p.sexe,
        p.telephone, p.email, p.adresse, p.ville, p.groupe_sanguin,
        p.contact_urgence_nom, p.contact_urgence_telephone, p.contact_urgence_relation,
        GROUP_CONCAT(DISTINCT CONCAT(a.nom, ':', a.type) SEPARATOR ';') as allergies,
        GROUP_CONCAT(DISTINCT am.nom SEPARATOR ';') as antecedents_medicaux,
        GROUP_CONCAT(DISTINCT CONCAT(m.nom, ' - ', t.dosage, ' (', t.frequence, ')') SEPARATOR ';') as current_medications
      FROM patients p
      LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
      LEFT JOIN allergies a ON pa.allergie_id = a.id
      LEFT JOIN antecedents_medicaux am ON p.id = am.patient_id
      LEFT JOIN traitements t ON p.id = t.patient_id AND t.status = 'active'
      LEFT JOIN medicaments m ON t.medicament_id = m.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [patientId]);

    // Get latest vital signs
    const [vitalSigns] = await db.execute(`
      SELECT 
        tension_arterielle as blood_pressure,
        frequence_cardiaque as heart_rate,
        temperature,
        poids as weight,
        taille as height,
        date_mesure
      FROM constantes_vitales
      WHERE patient_id = ?
      ORDER BY date_mesure DESC
      LIMIT 1
    `, [patientId]);

    // Get recent medical notes
    const [medicalNotes] = await db.execute(`
      SELECT 
        mn.content as notes,
        mn.created_at,
        mn.note_type,
        CONCAT(m.prenom, ' ', m.nom) as doctor_name
      FROM notes_patient mn
      LEFT JOIN medecins m ON mn.medecin_id = m.id
      WHERE mn.patient_id = ?
      ORDER BY mn.created_at DESC
      LIMIT 10
    `, [patientId]);

    const record = medicalRecord[0] || {};
    const vitals = vitalSigns[0] || {};

    const response = {
      patient_info: {
        id: record.id,
        prenom: record.prenom,
        nom: record.nom,
        CNE: record.CNE,
        date_naissance: record.date_naissance,
        sexe: record.sexe,
        telephone: record.telephone,
        email: record.email,
        adresse: record.adresse,
        ville: record.ville,
        groupe_sanguin: record.groupe_sanguin,
        contact_urgence: {
          nom: record.contact_urgence_nom,
          telephone: record.contact_urgence_telephone,
          relation: record.contact_urgence_relation
        }
      },
      allergies: record.allergies || '',
      medical_history: record.antecedents_medicaux || '',
      current_medications: record.current_medications || '',
      vital_signs: {
        blood_pressure: vitals.blood_pressure || '',
        heart_rate: vitals.heart_rate || '',
        temperature: vitals.temperature || '',
        weight: vitals.weight || '',
        height: vitals.height || '',
        last_updated: vitals.date_mesure || null
      },
      notes: medicalNotes.map(note => ({
        content: note.notes,
        type: note.note_type,
        doctor: note.doctor_name,
        date: note.created_at
      }))
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching patient medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du dossier médical'
    });
  }
};

// Update patient medical record
exports.updatePatientMedicalRecord = async (req, res) => {
  try {
    const hospitalId = req.user.id_specifique_role;
    const { patientId } = req.params;
    const { allergies, medical_history, current_medications, vital_signs, notes } = req.body;

    // Verify patient exists and has been admitted to this hospital
    const [patientCheck] = await db.execute(`
      SELECT DISTINCT p.id
      FROM patients p
      LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id
      WHERE p.id = ? AND (ha.hospital_id = ? OR ha.hospital_id IS NULL)
    `, [patientId, hospitalId]);

    if (patientCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé ou non autorisé'
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update vital signs if provided
      if (vital_signs && Object.keys(vital_signs).some(key => vital_signs[key])) {
        await connection.execute(`
          INSERT INTO constantes_vitales (
            patient_id, tension_arterielle, frequence_cardiaque, temperature, 
            poids, taille, date_mesure, medecin_id
          ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
        `, [
          patientId,
          vital_signs.blood_pressure || null,
          vital_signs.heart_rate || null,
          vital_signs.temperature || null,
          vital_signs.weight || null,
          vital_signs.height || null,
          req.user.id
        ]);
      }

      // Add medical note if provided
      if (notes && notes.trim()) {
        await connection.execute(`
          INSERT INTO notes_patient (
            patient_id, medecin_id, content, note_type, created_at
          ) VALUES (?, ?, ?, 'hospital_update', NOW())
        `, [patientId, req.user.id, notes.trim()]);
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Dossier médical mis à jour avec succès'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating patient medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du dossier médical'
    });
  }
};



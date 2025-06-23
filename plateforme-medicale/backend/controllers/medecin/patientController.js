const db = require('../../config/db');

exports.addPatient = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const {
      prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, code_postal, pays
    } = req.body;

    // Validate required fields
    if (!prenom || !nom || !date_naissance || !sexe) {
      return res.status(400).json({ message: 'Prénom, nom, date de naissance et sexe sont obligatoires' });
    }

    // Validate sexe
    if (!['M', 'F'].includes(sexe)) {
      return res.status(400).json({ message: 'Sexe doit être M ou F' });
    }

    // Validate CNE uniqueness if provided
    if (CNE) {
      const [existingCNE] = await db.execute('SELECT id FROM patients WHERE CNE = ?', [CNE]);
      if (existingCNE.length > 0) {
        return res.status(400).json({ message: 'CNE déjà utilisé' });
      }
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Format d\'email invalide' });
    }

    // Insert patient
    const [result] = await db.execute(
      `INSERT INTO patients (
        prenom, nom, date_naissance, sexe, CNE, email, telephone, adresse, ville, code_postal, pays,
        medecin_traitant_id, date_inscription
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        prenom,
        nom,
        date_naissance,
        sexe,
        CNE || null,
        email || null,
        telephone || null,
        adresse || null,
        ville || null,
        code_postal || null,
        pays || 'France',
        medecinId
      ]
    );

    return res.status(201).json({ message: 'Patient ajouté avec succès', patientId: result.insertId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du patient:', error);
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    const { search } = req.query;
    
    // Debug logging
    console.log('=== DEBUG getPatients ===');
    console.log('User object:', req.user);
    console.log('medecinId:', medecinId);
    console.log('search term:', search);
    
    // First, check if this doctor is a hospital doctor by checking their affiliations
    const [doctorAffiliations] = await db.execute(
      `SELECT mi.institution_id, i.nom as institution_nom, i.type_institution, mi.est_principal
       FROM medecin_institution mi
       JOIN institutions i ON mi.institution_id = i.id
       WHERE mi.medecin_id = ? AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())`,
      [medecinId]
    );
    
    console.log('Doctor affiliations:', doctorAffiliations);
    
    let searchCondition = '';
    let searchParams = [];
    
    // Add search functionality for prenom and nom
    if (search && search.trim()) {
      searchCondition = `AND (p.prenom LIKE ? OR p.nom LIKE ? OR CONCAT(p.prenom, ' ', p.nom) LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      searchParams = [searchTerm, searchTerm, searchTerm];
    }

    // Build query based on doctor type
    let query;
    let queryParams;
    
    // Check if doctor has hospital affiliations
    const hasHospitalAffiliation = doctorAffiliations.some(aff => 
      aff.type_institution === 'hospital' || 
      ['hôpital', 'clinique', 'centre médical'].includes(aff.institution_nom?.toLowerCase())
    );
    
    if (hasHospitalAffiliation) {
      console.log('Doctor has hospital affiliation - using hospital-focused query');
      
      // For hospital doctors, include patients from:
      // 1. Direct assignments (where medecin_id = this doctor)
      // 2. Hospital assignments where doctor works at that hospital
      // 3. Regular appointments
      query = `
        SELECT DISTINCT
          p.id, 
          p.prenom, 
          p.nom, 
          p.date_naissance, 
          p.sexe, 
          p.CNE, 
          p.email, 
          p.telephone,
          p.adresse,
          COALESCE(MAX(rv.date_heure_debut), MAX(ha.admission_date), MAX(ha2.admission_date)) as derniere_consultation,
          COALESCE(MIN(rv.date_heure_debut), MIN(ha.admission_date), MIN(ha2.admission_date)) as premiere_consultation,
          CASE 
            WHEN ha.id IS NOT NULL AND ha.status = 'active' THEN 'Hospitalisé (assigné directement)'
            WHEN ha2.id IS NOT NULL AND ha2.status = 'active' THEN 'Hospitalisé (dans votre hôpital)'
            WHEN ha.id IS NOT NULL AND ha.status = 'discharged' THEN 'Ancien patient hospitalisé'
            WHEN ha2.id IS NOT NULL AND ha2.status = 'discharged' THEN 'Ancien patient hospitalisé'
            ELSE 'Patient ambulatoire'
          END as patient_type,
          COALESCE(ha.admission_date, ha2.admission_date) as admission_date,
          COALESCE(ha.admission_reason, ha2.admission_reason) as admission_reason,
          COALESCE(ha.ward_name, ha2.ward_name) as ward_name,
          COALESCE(i1.nom, i2.nom) as hospital_name
        FROM patients p
        LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ?
        LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id AND ha.medecin_id = ?
        LEFT JOIN institutions i1 ON ha.hospital_id = i1.id
        LEFT JOIN hospital_assignments ha2 ON p.id = ha2.patient_id 
        LEFT JOIN institutions i2 ON ha2.hospital_id = i2.id
        LEFT JOIN medecin_institution mi ON mi.institution_id = i2.id AND mi.medecin_id = ?
        WHERE (
          rv.medecin_id = ? OR 
          ha.medecin_id = ? OR 
          (ha2.status = 'active' AND mi.medecin_id = ? AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE()))
        ) ${searchCondition}
        GROUP BY p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, p.email, p.telephone, p.adresse, 
                 ha.id, ha.status, ha.admission_date, ha.admission_reason, ha.ward_name, i1.nom,
                 ha2.id, ha2.status, ha2.admission_date, ha2.admission_reason, ha2.ward_name, i2.nom
        ORDER BY 
          CASE 
            WHEN ha.status = 'active' THEN 1 
            WHEN ha2.status = 'active' THEN 2
            ELSE 3 
          END,
          COALESCE(MAX(rv.date_heure_debut), MAX(ha.admission_date), MAX(ha2.admission_date)) DESC
      `;
      
      queryParams = [medecinId, medecinId, medecinId, medecinId, medecinId, medecinId, ...searchParams];
      
    } else {
      console.log('Doctor is private practice - using standard query');
      
      // For private practice doctors, use the original query
      query = `
        SELECT DISTINCT
          p.id, 
          p.prenom, 
          p.nom, 
          p.date_naissance, 
          p.sexe, 
          p.CNE, 
          p.email, 
          p.telephone,
          p.adresse,
          COALESCE(MAX(rv.date_heure_debut), MAX(ha.admission_date)) as derniere_consultation,
          COALESCE(MIN(rv.date_heure_debut), MIN(ha.admission_date)) as premiere_consultation,
          CASE 
            WHEN ha.id IS NOT NULL AND ha.status = 'active' THEN 'Hospitalisé'
            WHEN ha.id IS NOT NULL AND ha.status = 'discharged' THEN 'Ancien patient hospitalisé'
            ELSE 'Patient ambulatoire'
          END as patient_type,
          ha.admission_date,
          ha.admission_reason,
          ha.ward_name,
          i.nom as hospital_name
        FROM patients p
        LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ?
        LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id AND ha.medecin_id = ?
        LEFT JOIN institutions i ON ha.hospital_id = i.id
        WHERE (rv.medecin_id = ? OR ha.medecin_id = ?) ${searchCondition}
        GROUP BY p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, p.email, p.telephone, p.adresse, 
                 ha.id, ha.status, ha.admission_date, ha.admission_reason, ha.ward_name, i.nom
        ORDER BY 
          CASE WHEN ha.status = 'active' THEN 1 ELSE 2 END,
          COALESCE(MAX(rv.date_heure_debut), MAX(ha.admission_date)) DESC
      `;
      
      queryParams = [medecinId, medecinId, medecinId, medecinId, ...searchParams];
    }

    console.log('SQL Query:', query);
    console.log('Query params:', queryParams);

    const [patients] = await db.execute(query, queryParams);
    
    console.log('Found patients count:', patients.length);
    console.log('First 3 patients:', patients.slice(0, 3));

    res.json({
      success: true,
      data: patients,
      total: patients.length,
      doctorType: hasHospitalAffiliation ? 'hospital' : 'private'
    });

  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des patients',
      error: error.message
    });
  }
};

// Get assigned hospital patients for hospital doctors
exports.getAssignedHospitalPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;

    // Get hospital patients assigned to this doctor
    const [patients] = await db.execute(`
      SELECT DISTINCT
        p.id, p.prenom, p.nom, p.CNE, p.date_naissance, p.sexe,
        p.telephone, p.email, p.adresse, p.ville, p.groupe_sanguin,
        ha.admission_date, ha.bed_number, ha.ward_name, ha.status as admission_status,
        ha.admission_reason, ha.id as assignment_id,
        i.nom as hospital_name
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      JOIN institutions i ON ha.hospital_id = i.id
      JOIN medecin_institution mi ON mi.institution_id = i.id
      WHERE mi.medecin_id = ? 
        AND ha.status = 'active' 
        AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())
        AND ha.discharge_date IS NULL
      ORDER BY ha.admission_date DESC
    `, [medecinId]);

    // Also get patients where this doctor is specifically assigned
    const [directAssignments] = await db.execute(`
      SELECT DISTINCT
        p.id, p.prenom, p.nom, p.CNE, p.date_naissance, p.sexe,
        p.telephone, p.email, p.adresse, p.ville, p.groupe_sanguin,
        ha.admission_date, ha.bed_number, ha.ward_name, ha.status as admission_status,
        ha.admission_reason, ha.id as assignment_id,
        i.nom as hospital_name
      FROM hospital_assignments ha
      JOIN patients p ON ha.patient_id = p.id
      JOIN institutions i ON ha.hospital_id = i.id
      WHERE ha.medecin_id = ? 
        AND ha.status = 'active' 
        AND ha.discharge_date IS NULL
      ORDER BY ha.admission_date DESC
    `, [medecinId]);

    // Combine and deduplicate results
    const allPatients = [...patients, ...directAssignments];
    const uniquePatients = allPatients.filter((patient, index, self) => 
      index === self.findIndex(p => p.id === patient.id)
    );

    return res.status(200).json({ 
      patients: uniquePatients,
      totalCount: uniquePatients.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des patients hospitaliers:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Diagnostic endpoint to help debug hospital doctor issues
exports.debugHospitalDoctor = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    
    console.log('=== DIAGNOSTIC FOR HOSPITAL DOCTOR ===');
    console.log('Doctor ID:', medecinId);
    console.log('User object:', req.user);
    
    // Check doctor exists
    const [doctorInfo] = await db.execute(
      `SELECT m.id, m.prenom, m.nom, m.numero_ordre, m.institution_id, i.nom as institution_nom, i.type_institution
       FROM medecins m
       LEFT JOIN institutions i ON m.institution_id = i.id
       WHERE m.id = ?`,
      [medecinId]
    );
    
    console.log('Doctor info:', doctorInfo[0]);
    
    // Check doctor-institution affiliations
    const [affiliations] = await db.execute(
      `SELECT mi.*, i.nom as institution_nom, i.type_institution
       FROM medecin_institution mi
       JOIN institutions i ON mi.institution_id = i.id
       WHERE mi.medecin_id = ?`,
      [medecinId]
    );
    
    console.log('Doctor affiliations:', affiliations);
    
    // Check hospital assignments where this doctor is assigned
    const [directAssignments] = await db.execute(
      `SELECT ha.*, p.prenom as patient_prenom, p.nom as patient_nom, i.nom as hospital_nom
       FROM hospital_assignments ha
       JOIN patients p ON ha.patient_id = p.id
       JOIN institutions i ON ha.hospital_id = i.id
       WHERE ha.medecin_id = ?`,
      [medecinId]
    );
    
    console.log('Direct hospital assignments:', directAssignments);
    
    // Check hospital assignments for hospitals where this doctor works
    const [hospitalAssignments] = await db.execute(
      `SELECT ha.*, p.prenom as patient_prenom, p.nom as patient_nom, i.nom as hospital_nom
       FROM hospital_assignments ha
       JOIN patients p ON ha.patient_id = p.id
       JOIN institutions i ON ha.hospital_id = i.id
       JOIN medecin_institution mi ON mi.institution_id = i.id
       WHERE mi.medecin_id = ? AND ha.status = 'active'`,
      [medecinId]
    );
    
    console.log('Hospital assignments where doctor works:', hospitalAssignments);
    
    // Check all hospital assignments (for debugging)
    const [allAssignments] = await db.execute(
      `SELECT ha.*, p.prenom as patient_prenom, p.nom as patient_nom, 
              i.nom as hospital_nom, m.prenom as doctor_prenom, m.nom as doctor_nom
       FROM hospital_assignments ha
       JOIN patients p ON ha.patient_id = p.id
       JOIN institutions i ON ha.hospital_id = i.id
       JOIN medecins m ON ha.medecin_id = m.id
       WHERE ha.status = 'active'
       LIMIT 10`
    );
    
    console.log('Sample active hospital assignments:', allAssignments);
    
    return res.status(200).json({
      success: true,
      debug_info: {
        doctor: doctorInfo[0],
        affiliations,
        directAssignments,
        hospitalAssignments,
        allAssignments
      }
    });
    
  } catch (error) {
    console.error('Error in debugHospitalDoctor:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors du diagnostic',
      error: error.message
    });
  }
}; 
const db = require('../../config/db');

// Get current hospital doctor information
exports.getCurrentHospitalMedecin = async (req, res) => {
  try {
    console.log('Getting hospital doctor info for user ID:', req.user.id_specifique_role);

    // First, get the basic doctor information
    const [medecins] = await db.execute(
      `SELECT
        m.id, m.prenom, m.nom, m.specialite_id, s.nom AS specialite_nom,
        m.numero_ordre, m.telephone, m.email_professionnel,
        m.tarif_consultation, m.est_actif
      FROM medecins m
      LEFT JOIN specialites s ON m.specialite_id = s.id
      WHERE m.id = ? AND m.est_actif = true`,
      [req.user.id_specifique_role]
    );
    
    if (medecins.length === 0) {
      console.log('Hospital doctor not found with ID:', req.user.id_specifique_role);
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    const medecin = medecins[0];
    console.log('Found hospital doctor:', medecin.prenom, medecin.nom);

    // Get all hospital affiliations for this doctor
    const [affiliations] = await db.execute(
      `SELECT 
        i.id, i.nom, i.type, i.type_institution, i.adresse, i.ville,
        mi.est_principal, mi.departement, mi.date_debut, mi.date_affectation
      FROM medecin_institution mi
      JOIN institutions i ON mi.institution_id = i.id
      WHERE mi.medecin_id = ? AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())
      ORDER BY mi.est_principal DESC, mi.date_debut ASC`,
      [req.user.id_specifique_role]
    );

    console.log('Found affiliations:', affiliations.length);

    // Determine doctor type and primary institution
    let doctorType = 'hospital';
    let primaryInstitution = null;

    if (affiliations.length > 0) {
      // Find the primary hospital affiliation
      primaryInstitution = affiliations.find(aff => aff.est_principal) || affiliations[0];
      
      // Ensure it's marked as hospital type
      if (primaryInstitution && 
          (primaryInstitution.type_institution === 'hospital' || 
           ['hôpital', 'clinique', 'centre médical'].includes(primaryInstitution.type))) {
        doctorType = 'hospital';
      }
    }

    // Get assigned patients for this hospital doctor
    const [assignedPatients] = await db.execute(
      `SELECT COUNT(*) as patient_count
      FROM affectations_patients ap
      JOIN medecin_institution mi ON ap.institution_id = mi.institution_id
      WHERE mi.medecin_id = ? AND ap.est_active = 1`,
      [req.user.id_specifique_role]
    );

    const response = {
      medecin: {
        ...medecin,
        doctorType,
        primaryInstitution,
        affiliations,
        assignedPatientCount: assignedPatients[0]?.patient_count || 0
      }
    };

    console.log('Returning hospital doctor data:', response);
    return res.status(200).json(response);

  } catch (error) {
    console.error('Erreur lors de la récupération du médecin hospitalier:', error);
    return res.status(500).json({ 
      message: "Erreur serveur lors de la récupération des informations du médecin", 
      error: error.message 
    });
  }
};

// Get patients assigned to this hospital doctor
exports.getAssignedHospitalPatients = async (req, res) => {
  try {
    const medecinId = req.user.id_specifique_role;
    console.log('Getting assigned patients for hospital doctor ID:', medecinId);

    // Get patients assigned to this doctor through hospital assignments
    const [patients] = await db.execute(
      `SELECT DISTINCT
        p.id, p.prenom, p.nom, p.date_naissance, p.telephone, p.email,
        p.adresse, p.ville, p.code_postal,
        ap.date_affectation, ap.motif_affectation, ap.est_active,
        i.nom as institution_nom,
        TIMESTAMPDIFF(YEAR, p.date_naissance, CURDATE()) as age
      FROM patients p
      JOIN affectations_patients ap ON p.id = ap.patient_id
      JOIN medecin_institution mi ON ap.institution_id = mi.institution_id
      JOIN institutions i ON mi.institution_id = i.id
      WHERE mi.medecin_id = ? 
        AND ap.est_active = 1
        AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())
      ORDER BY ap.date_affectation DESC`,
      [medecinId]
    );

    console.log('Found assigned patients:', patients.length);

    return res.status(200).json({ 
      patients,
      total: patients.length 
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des patients assignés:', error);
    return res.status(500).json({ 
      message: "Erreur serveur lors de la récupération des patients", 
      error: error.message 
    });
  }
};

// Get patient medical record for hospital doctor
exports.getHospitalPatientMedicalRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medecinId = req.user.id_specifique_role;

    console.log('Getting medical record for patient:', patientId, 'by hospital doctor:', medecinId);

    // First verify that this doctor has access to this patient
    const [access] = await db.execute(
      `SELECT COUNT(*) as has_access
      FROM affectations_patients ap
      JOIN medecin_institution mi ON ap.institution_id = mi.institution_id
      WHERE ap.patient_id = ? AND mi.medecin_id = ? AND ap.est_active = 1`,
      [patientId, medecinId]
    );

    if (access[0].has_access === 0) {
      return res.status(403).json({ 
        message: "Vous n'avez pas accès au dossier de ce patient" 
      });
    }

    // Get patient basic information
    const [patients] = await db.execute(
      `SELECT 
        p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.telephone, p.email,
        p.adresse, p.ville, p.code_postal, p.numero_securite_sociale,
        TIMESTAMPDIFF(YEAR, p.date_naissance, CURDATE()) as age
      FROM patients p
      WHERE p.id = ?`,
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    const patient = patients[0];

    // Get medical history
    const [antecedents] = await db.execute(
      `SELECT id, type, description, date_diagnostic, est_actif
      FROM antecedents_medicaux
      WHERE patient_id = ?
      ORDER BY date_diagnostic DESC`,
      [patientId]
    );

    // Get allergies
    const [allergies] = await db.execute(
      `SELECT a.nom, pa.severite, pa.date_detection, pa.notes
      FROM patient_allergies pa
      JOIN allergies a ON pa.allergie_id = a.id
      WHERE pa.patient_id = ?`,
      [patientId]
    );

    // Get current treatments
    const [traitements] = await db.execute(
      `SELECT 
        t.id, m.nom as medicament_nom, t.dosage, t.frequence, 
        t.date_debut, t.date_fin, t.instructions, t.est_actif
      FROM traitements t
      JOIN medicaments m ON t.medicament_id = m.id
      WHERE t.patient_id = ? AND t.est_actif = 1
      ORDER BY t.date_debut DESC`,
      [patientId]
    );

    // Get recent consultations
    const [consultations] = await db.execute(
      `SELECT 
        c.id, c.date_consultation, c.motif, c.diagnostic, c.notes,
        c.tension_arterielle, c.poids, c.taille, c.temperature,
        med.prenom as medecin_prenom, med.nom as medecin_nom
      FROM consultations c
      LEFT JOIN medecins med ON c.medecin_id = med.id
      WHERE c.patient_id = ?
      ORDER BY c.date_consultation DESC
      LIMIT 10`,
      [patientId]
    );

    // Get recent analysis results
    const [analyses] = await db.execute(
      `SELECT 
        ar.id, ar.date_analyse, ar.resultats, ar.commentaires,
        at.nom as type_analyse, ac.nom as categorie
      FROM resultats_analyses ar
      JOIN types_analyses at ON ar.type_analyse_id = at.id
      JOIN categories_analyses ac ON at.categorie_id = ac.id
      WHERE ar.patient_id = ?
      ORDER BY ar.date_analyse DESC
      LIMIT 5`,
      [patientId]
    );

    const medicalRecord = {
      patient,
      antecedents,
      allergies,
      traitements,
      consultations,
      analyses
    };

    console.log('Returning medical record for patient:', patientId);
    return res.status(200).json(medicalRecord);

  } catch (error) {
    console.error('Erreur lors de la récupération du dossier médical:', error);
    return res.status(500).json({ 
      message: "Erreur serveur lors de la récupération du dossier médical", 
      error: error.message 
    });
  }
}; 
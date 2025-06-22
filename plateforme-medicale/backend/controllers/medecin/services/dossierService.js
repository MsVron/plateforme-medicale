const db = require("../../../config/db");

/**
 * Service for retrieving comprehensive patient medical dossier
 */
class DossierService {
  /**
   * Get comprehensive medical dossier for a patient
   * @param {number} patientId - Patient ID
   * @param {number} medecinId - Doctor ID for access logging
   * @param {number} userId - User ID for audit logging
   * @returns {Object} Complete patient dossier
   */
  static async getPatientDossier(patientId, medecinId, userId) {
    console.log('=== DEBUG: DossierService.getPatientDossier called ===');
    console.log('patientId:', patientId, 'medecinId:', medecinId);

    // Validate patient exists
    const patient = await this.getPatientInfo(patientId);
    if (!patient) {
      throw new Error('Patient non trouvé');
    }

    // Get all dossier components in parallel for better performance
    const [
      allergies,
      antecedents,
      traitements,
      consultations,
      constantes,
      appointments,
      notes,
      analyses,
      imageries,
      documents,
      appointmentsSummary
    ] = await Promise.all([
      this.getPatientAllergies(patientId),
      this.getMedicalHistory(patientId),
      this.getTreatments(patientId),
      this.getConsultations(patientId),
      this.getVitalSigns(patientId),
      this.getAppointments(patientId),
      this.getPatientNotes(patientId),
      this.getAnalysisResults(patientId),
      this.getImagingResults(patientId),
      this.getMedicalDocuments(patientId),
      this.getAppointmentsSummary(patientId)
    ]);

    // Log access for audit
    await this.logDossierAccess(userId, patientId, patient);

    return {
      patient,
      allergies,
      antecedents,
      traitements,
      consultations,
      constantes,
      appointments,
      notes,
      analyses,
      imageries,
      documents,
      summary: this.generateSummary(consultations, traitements, allergies, appointmentsSummary)
    };
  }

  /**
   * Get patient basic information
   */
  static async getPatientInfo(patientId) {
    console.log('DEBUG: Fetching patient info...');
    const [patients] = await db.execute(`
      SELECT 
        p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE, 
        p.email, p.telephone, p.adresse, p.ville, p.code_postal, p.pays,
        p.groupe_sanguin, p.taille_cm, p.poids_kg, p.est_fumeur,
        p.consommation_alcool, p.activite_physique, p.profession,
        p.contact_urgence_nom, p.contact_urgence_telephone, p.contact_urgence_relation,
        p.allergies_notes, p.est_inscrit_par_medecin, p.date_inscription
      FROM patients p 
      WHERE p.id = ?
    `, [patientId]);
    
    return patients.length > 0 ? patients[0] : null;
  }

  /**
   * Get patient allergies with details
   */
  static async getPatientAllergies(patientId) {
    console.log('DEBUG: Fetching allergies...');
    const [allergies] = await db.execute(`
      SELECT 
        pa.patient_id, pa.allergie_id, pa.date_diagnostic, pa.severite, pa.notes,
        a.nom as allergie_nom, a.description as allergie_description
      FROM patient_allergies pa
      JOIN allergies a ON pa.allergie_id = a.id
      WHERE pa.patient_id = ?
      ORDER BY pa.severite DESC, a.nom ASC
    `, [patientId]);
    
    console.log('DEBUG: Allergies found:', allergies.length);
    return allergies;
  }

  /**
   * Get medical history (antecedents)
   */
  static async getMedicalHistory(patientId) {
    console.log('DEBUG: Fetching antecedents...');
    const [antecedents] = await db.execute(`
      SELECT 
        am.id, am.type, am.description, am.date_debut, am.date_fin, 
        am.est_chronique, am.date_enregistrement,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM antecedents_medicaux am
      LEFT JOIN medecins m ON am.medecin_id = m.id
      WHERE am.patient_id = ?
      ORDER BY am.date_enregistrement DESC
    `, [patientId]);
    
    console.log('DEBUG: Antecedents found:', antecedents.length);
    return antecedents;
  }

  /**
   * Get current and recent treatments
   */
  static async getTreatments(patientId) {
    console.log('DEBUG: Fetching treatments...');
    const [traitements] = await db.execute(`
      SELECT 
        t.id, t.posologie, t.date_debut, t.date_fin, t.est_permanent,
        t.date_prescription, t.instructions, t.rappel_prise, t.frequence_rappel,
        med.nom_commercial, med.nom_molecule, med.dosage, med.forme,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM traitements t
      JOIN medicaments med ON t.medicament_id = med.id
      JOIN medecins m ON t.medecin_prescripteur_id = m.id
      WHERE t.patient_id = ? 
      AND (t.est_permanent = 1 OR t.date_fin IS NULL OR t.date_fin >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH))
      ORDER BY t.date_prescription DESC
    `, [patientId]);
    
    console.log('DEBUG: Treatments found:', traitements.length);
    return traitements;
  }

  /**
   * Get recent consultations
   */
  static async getConsultations(patientId) {
    console.log('DEBUG: Fetching consultations...');
    const [consultations] = await db.execute(`
      SELECT 
        c.id, c.date_consultation, c.motif, c.anamnese, c.examen_clinique,
        c.diagnostic, c.conclusion, c.est_complete, c.follow_up_date,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        s.nom as specialite_nom,
        rv.id as rendez_vous_id, rv.statut as rdv_statut
      FROM consultations c
      JOIN medecins m ON c.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN rendez_vous rv ON c.rendez_vous_id = rv.id
      WHERE c.patient_id = ?
      ORDER BY c.date_consultation DESC
      LIMIT 20
    `, [patientId]);
    
    console.log('DEBUG: Consultations found:', consultations.length);
    return consultations;
  }

  /**
   * Get recent vital signs
   */
  static async getVitalSigns(patientId) {
    console.log('DEBUG: Fetching constantes...');
    const [constantes] = await db.execute(`
      SELECT 
        cv.id, cv.date_mesure, cv.temperature, cv.tension_arterielle_systolique,
        cv.tension_arterielle_diastolique, cv.frequence_cardiaque, cv.saturation_oxygene,
        cv.frequence_respiratoire, cv.glycemie, cv.poids, cv.taille, cv.imc, cv.notes,
        c.id as consultation_id, c.date_consultation
      FROM constantes_vitales cv
      LEFT JOIN consultations c ON cv.consultation_id = c.id
      WHERE cv.patient_id = ?
      ORDER BY cv.date_mesure DESC
      LIMIT 10
    `, [patientId]);
    
    console.log('DEBUG: Constantes found:', constantes.length);
    return constantes;
  }

  /**
   * Get recent appointments
   */
  static async getAppointments(patientId) {
    console.log('DEBUG: Fetching appointments...');
    const [appointments] = await db.execute(`
      SELECT 
        rv.id, rv.date_heure_debut, rv.date_heure_fin, rv.motif, rv.statut,
        rv.notes_patient, rv.mode, rv.date_creation,
        m.prenom as medecin_prenom, m.nom as medecin_nom,
        s.nom as specialite_nom,
        i.nom as institution_nom
      FROM rendez_vous rv
      JOIN medecins m ON rv.medecin_id = m.id
      LEFT JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON rv.institution_id = i.id
      WHERE rv.patient_id = ?
      ORDER BY rv.date_heure_debut DESC
      LIMIT 15
    `, [patientId]);
    
    console.log('DEBUG: Appointments found:', appointments.length);
    return appointments;
  }

  /**
   * Get appointments from the past year for summary statistics
   */
  static async getAppointmentsSummary(patientId) {
    console.log('DEBUG: Fetching appointments summary...');
    const [summaryData] = await db.execute(`
      SELECT 
        COUNT(*) as total_appointments,
        SUM(CASE WHEN rv.statut = 'terminé' THEN 1 ELSE 0 END) as completed_appointments,
        SUM(CASE WHEN rv.date_heure_debut >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN 1 ELSE 0 END) as appointments_past_year,
        SUM(CASE WHEN rv.statut = 'terminé' AND rv.date_heure_debut >= DATE_SUB(NOW(), INTERVAL 1 YEAR) THEN 1 ELSE 0 END) as completed_past_year,
        MAX(rv.date_heure_debut) as last_appointment_date
      FROM rendez_vous rv
      WHERE rv.patient_id = ?
    `, [patientId]);
    
    console.log('DEBUG: Appointments summary:', summaryData[0]);
    return summaryData[0];
  }

  /**
   * Get patient notes from doctors
   */
  static async getPatientNotes(patientId) {
    console.log('DEBUG: Fetching notes...');
    const [notes] = await db.execute(`
      SELECT 
        n.id, n.contenu, n.date_creation, n.est_important, n.categorie, n.medecin_id,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM notes_patient n
      JOIN medecins m ON n.medecin_id = m.id
      WHERE n.patient_id = ?
      ORDER BY n.date_creation DESC
      LIMIT 10
    `, [patientId]);
    
    console.log('DEBUG: Notes found:', notes.length);
    return notes;
  }

  /**
   * Get recent analysis results
   */
  static async getAnalysisResults(patientId) {
    console.log('DEBUG: Fetching analyses...');
    const [analyses] = await db.execute(`
      SELECT 
        ra.id, ra.type_analyse_id, ra.date_prescription, ra.date_realisation, ra.laboratoire,
        ra.valeur_numerique, ra.valeur_texte, ra.unite, ra.valeur_normale_min,
        ra.valeur_normale_max, ra.interpretation, ra.est_normal, ra.est_critique,
        ra.document_url, ra.notes_techniques,
        ta.nom as type_analyse, ta.valeurs_normales, ta.description as type_description,
        ca.id as categorie_id, ca.nom as categorie_nom, ca.description as categorie_description,
        mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
        mi.prenom as interpreteur_prenom, mi.nom as interpreteur_nom
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN categories_analyses ca ON ta.categorie_id = ca.id
      JOIN medecins mp ON ra.medecin_prescripteur_id = mp.id
      LEFT JOIN medecins mi ON ra.medecin_interpreteur_id = mi.id
      WHERE ra.patient_id = ?
      ORDER BY ra.date_realisation DESC, ra.date_prescription DESC
      LIMIT 20
    `, [patientId]);
    
    console.log('DEBUG: Analyses found:', analyses.length);
    return analyses;
  }

  /**
   * Get recent imaging results
   */
  static async getImagingResults(patientId) {
    console.log('DEBUG: Fetching imageries...');
    const [imageries] = await db.execute(`
      SELECT 
        ri.id, ri.date_prescription, ri.date_realisation, ri.interpretation,
        ri.conclusion, ri.image_urls,
        ti.nom as type_imagerie,
        mp.prenom as prescripteur_prenom, mp.nom as prescripteur_nom,
        i.nom as institution_nom
      FROM resultats_imagerie ri
      JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
      JOIN medecins mp ON ri.medecin_prescripteur_id = mp.id
      LEFT JOIN institutions i ON ri.institution_realisation_id = i.id
      WHERE ri.patient_id = ?
      ORDER BY ri.date_realisation DESC, ri.date_prescription DESC
      LIMIT 10
    `, [patientId]);
    
    console.log('DEBUG: Imageries found:', imageries.length);
    return imageries;
  }

  /**
   * Get medical documents
   */
  static async getMedicalDocuments(patientId) {
    console.log('DEBUG: Fetching documents...');
    const [documents] = await db.execute(`
      SELECT 
        dm.id, dm.type, dm.titre, dm.description, dm.document_url,
        dm.date_creation, dm.est_partage,
        m.prenom as medecin_prenom, m.nom as medecin_nom
      FROM documents_medicaux dm
      JOIN medecins m ON dm.medecin_id = m.id
      WHERE dm.patient_id = ?
      ORDER BY dm.date_creation DESC
      LIMIT 15
    `, [patientId]);
    
    console.log('DEBUG: Documents found:', documents.length);
    return documents;
  }

  /**
   * Log access for audit
   */
  static async logDossierAccess(userId, patientId, patient) {
    console.log('DEBUG: Logging access...');
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      userId, 
      'VIEW_DOSSIER', 
      'patients', 
      patientId, 
      `Consultation du dossier médical de ${patient.prenom} ${patient.nom}`
    ]);
  }

  /**
   * Generate dossier summary
   */
  static generateSummary(consultations, traitements, allergies, appointmentsSummary) {
    return {
      totalConsultations: consultations.length,
      totalTreatments: traitements.length,
      totalAllergies: allergies.length,
      // Appointment statistics
      totalAppointments: appointmentsSummary?.total_appointments || 0,
      appointmentsPastYear: appointmentsSummary?.appointments_past_year || 0,
      completedAppointments: appointmentsSummary?.completed_appointments || 0,
      completedPastYear: appointmentsSummary?.completed_past_year || 0,
      lastAppointmentDate: appointmentsSummary?.last_appointment_date || null,
      // Existing fields
      lastConsultation: consultations.length > 0 ? consultations[0].date_consultation : null,
      hasActiveAlerts: allergies.some(a => a.severite === 'sévère' || a.severite === 'mortelle')
    };
  }
}

module.exports = DossierService;

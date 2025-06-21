const db = require('../../config/db');
const { searchPatients } = require('../../utils/patientSearch');

// Search patients for laboratory (using shared search utility)
exports.searchPatients = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { prenom, nom, cne } = req.query;

    const result = await searchPatients({
      prenom,
      nom,
      cne,
      userId: req.user.id,
      institutionId: laboratoryId,
      institutionType: 'laboratory',
      additionalFields: `,
        COUNT(ra.id) as pending_tests`,
      additionalJoins: `
        LEFT JOIN resultats_analyses ra ON p.id = ra.patient_id 
          AND ra.statut IN ('en_attente', 'en_cours')`,
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

// Get patient test requests for laboratory
exports.getPatientTestRequests = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { patientId } = req.params;

    // Verify patient exists
    const [patients] = await db.execute(
      'SELECT id, prenom, nom FROM patients WHERE id = ?', 
      [patientId]
    );
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Get patient test requests
    const [testRequests] = await db.execute(`
      SELECT 
        ra.id,
        ra.date_demande,
        ra.date_realisation,
        ra.statut,
        ra.valeurs,
        ra.interpretation,
        ra.commentaires,
        ra.fichier_resultat,
        ta.nom as test_name,
        ta.type_analyse,
        ta.unite_mesure,
        ta.valeur_reference_min,
        ta.valeur_reference_max,
        ta.valeur_reference_texte,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur,
        s.nom as medecin_specialite,
        i.nom as laboratoire_executant
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN medecins m ON ra.medecin_id = m.id
      JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON ra.laboratoire_id = i.id
      WHERE ra.patient_id = ?
      ORDER BY ra.date_demande DESC, ta.nom
    `, [patientId]);

    // Get imaging requests
    const [imagingRequests] = await db.execute(`
      SELECT 
        ir.*,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur,
        s.nom as medecin_specialite,
        i.nom as laboratoire_executant,
        CONCAT(tech.prenom, ' ', tech.nom) as technician_name
      FROM imaging_requests ir
      JOIN medecins m ON ir.requesting_doctor_id = m.id
      JOIN specialites s ON m.specialite_id = s.id
      LEFT JOIN institutions i ON ir.assigned_laboratory_id = i.id
      LEFT JOIN laboratory_technicians tech ON ir.assigned_technician_id = tech.id
      WHERE ir.patient_id = ?
      ORDER BY ir.request_date DESC
    `, [patientId]);

    return res.status(200).json({ 
      patient: patients[0],
      testRequests,
      imagingRequests
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Upload test results (Labs provide actual test results)
exports.uploadTestResults = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { testRequestId } = req.params;
    const { 
      valeur_numerique,
      valeur_texte,
      unite,
      valeur_normale_min,
      valeur_normale_max,
      interpretation, 
      est_normal,
      est_critique,
      notes_techniques,
      document_url,
      technician_user_id 
    } = req.body;

    // Validate test request exists and is assigned to this lab or available
    const [testRequests] = await db.execute(`
      SELECT ra.*, p.prenom, p.nom, ta.nom as test_name
      FROM resultats_analyses ra
      JOIN patients p ON ra.patient_id = p.id
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      WHERE ra.id = ? AND ra.request_status IN ('requested', 'in_progress')
        AND (ra.laboratory_id IS NULL OR ra.laboratory_id = ?)
    `, [testRequestId, laboratoryId]);

    if (testRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande de test non trouvée, déjà complétée, ou non assignée à ce laboratoire' 
      });
    }

    const testRequest = testRequests[0];

    // Validate technician if provided
    if (technician_user_id) {
      const [technicians] = await db.execute(`
        SELECT lt.id FROM laboratory_technicians lt
        JOIN utilisateurs u ON lt.user_id = u.id
        WHERE u.id = ? AND lt.laboratory_id = ? AND lt.is_active = TRUE
      `, [technician_user_id, laboratoryId]);

      if (technicians.length === 0) {
        return res.status(400).json({ 
          message: 'Technicien non trouvé ou non autorisé pour ce laboratoire' 
        });
      }
    }

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Update test results with actual values
      await conn.execute(`
        UPDATE resultats_analyses 
        SET 
          valeur_numerique = ?,
          valeur_texte = ?,
          unite = ?,
          valeur_normale_min = ?,
          valeur_normale_max = ?,
          interpretation = ?,
          est_normal = ?,
          est_critique = ?,
          notes_techniques = ?,
          document_url = ?,
          date_realisation = NOW(),
          request_status = 'completed',
          laboratory_id = ?,
          technician_user_id = ?,
          date_status_updated = NOW()
        WHERE id = ?
      `, [
        valeur_numerique || null, valeur_texte || null, unite || null,
        valeur_normale_min || null, valeur_normale_max || null,
        interpretation || null, est_normal || null, est_critique || false,
        notes_techniques || null, document_url || null,
        laboratoryId, technician_user_id || null, testRequestId
      ]);

      // Log the result upload
      await conn.execute(`
        INSERT INTO historique_actions (
          utilisateur_id, action_type, table_concernee, 
          enregistrement_id, description
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        req.user.id, 
        'TEST_RESULTS_UPLOADED', 
        'resultats_analyses', 
        testRequestId, 
        `Résultats uploadés pour ${testRequest.test_name} - ${testRequest.prenom} ${testRequest.nom}`
      ]);

      // Commit transaction
      await conn.commit();

      return res.status(200).json({ 
        message: 'Résultats uploadés avec succès'
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload des résultats:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Upload imaging results (Labs provide actual imaging results)
exports.uploadImagingResults = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { imagingRequestId } = req.params;
    const { 
      interpretation, 
      conclusion, 
      image_urls,
      technician_user_id,
      radiologist_id
    } = req.body;

    // Validate imaging request exists and is assigned to this lab
    const [imagingRequests] = await db.execute(`
      SELECT ri.*, p.prenom, p.nom, ti.nom as imaging_type
      FROM resultats_imagerie ri
      JOIN patients p ON ri.patient_id = p.id
      JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
      WHERE ri.id = ? AND ri.request_status IN ('scheduled', 'in_progress')
        AND ri.institution_realisation_id = ?
    `, [imagingRequestId, laboratoryId]);

    if (imagingRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande d\'imagerie non trouvée, déjà complétée, ou non assignée à ce laboratoire' 
      });
    }

    const imagingRequest = imagingRequests[0];

    // Validate technician if provided
    if (technician_user_id) {
      const [technicians] = await db.execute(`
        SELECT lt.id FROM laboratory_technicians lt
        JOIN utilisateurs u ON lt.user_id = u.id
        WHERE u.id = ? AND lt.laboratory_id = ? AND lt.is_active = TRUE
      `, [technician_user_id, laboratoryId]);

      if (technicians.length === 0) {
        return res.status(400).json({ 
          message: 'Technicien non trouvé ou non autorisé pour ce laboratoire' 
        });
      }
    }

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Update imaging results
      await conn.execute(`
        UPDATE resultats_imagerie 
        SET 
          interpretation = ?,
          conclusion = ?,
          image_urls = ?,
          date_realisation = NOW(),
          request_status = 'completed',
          technician_assigned_id = ?,
          medecin_radiologue_id = ?,
          date_status_updated = NOW()
        WHERE id = ?
      `, [
        interpretation || null, conclusion || null, image_urls || null,
        technician_user_id || null, radiologist_id || null, imagingRequestId
      ]);

      // Log the result upload
      await conn.execute(`
        INSERT INTO historique_actions (
          utilisateur_id, action_type, table_concernee, 
          enregistrement_id, description
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        req.user.id, 
        'IMAGING_RESULTS_UPLOADED', 
        'resultats_imagerie', 
        imagingRequestId, 
        `Résultats d'imagerie uploadés pour ${imagingRequest.imaging_type} - ${imagingRequest.prenom} ${imagingRequest.nom}`
      ]);

      // Commit transaction
      await conn.commit();

      return res.status(200).json({ 
        message: 'Résultats d\'imagerie uploadés avec succès'
      });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Erreur lors de l\'upload des résultats d\'imagerie:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Get pending work for laboratory
exports.getPendingWork = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;

    // Get pending test requests
    const [pendingTests] = await db.execute(`
      SELECT 
        ra.id,
        ra.date_prescription,
        ra.request_status,
        ra.priority,
        ra.clinical_indication,
        ta.nom as test_name,
        ta.description as test_description,
        CONCAT(p.prenom, ' ', p.nom) as patient_name,
        p.CNE,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur,
        m.specialite_id
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN patients p ON ra.patient_id = p.id
      JOIN medecins m ON ra.medecin_prescripteur_id = m.id
      WHERE ra.request_status IN ('requested', 'in_progress')
        AND (ra.laboratory_id IS NULL OR ra.laboratory_id = ?)
      ORDER BY 
        CASE ra.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'normal' THEN 2 
        END,
        ra.date_prescription ASC
    `, [laboratoryId]);

    // Get pending imaging requests
    const [pendingImaging] = await db.execute(`
      SELECT 
        ri.id,
        ri.date_prescription,
        ri.request_status,
        ri.priority,
        ri.clinical_indication,
        ti.nom as imaging_type,
        ti.description as imaging_description,
        CONCAT(p.prenom, ' ', p.nom) as patient_name,
        p.CNE,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur,
        ri.contrast_required,
        ri.patient_preparation_instructions
      FROM resultats_imagerie ri
      JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
      JOIN patients p ON ri.patient_id = p.id
      JOIN medecins m ON ri.medecin_prescripteur_id = m.id
      WHERE ri.request_status IN ('requested', 'scheduled', 'in_progress')
        AND (ri.institution_realisation_id IS NULL OR ri.institution_realisation_id = ?)
      ORDER BY 
        CASE ri.priority 
          WHEN 'emergency' THEN 1
          WHEN 'stat' THEN 2
          WHEN 'urgent' THEN 3 
          WHEN 'routine' THEN 4
        END,
        ri.date_prescription ASC
    `, [laboratoryId]);

    return res.status(200).json({ 
      pendingTests,
      pendingImaging,
      totalPending: pendingTests.length + pendingImaging.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du travail en attente:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Accept/Assign test request to laboratory
exports.acceptTestRequest = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { testRequestId } = req.params;
    const { technician_user_id, estimated_completion_date } = req.body;

    // Validate test request exists and is available
    const [testRequests] = await db.execute(`
      SELECT ra.*, p.prenom, p.nom, ta.nom as test_name
      FROM resultats_analyses ra
      JOIN patients p ON ra.patient_id = p.id
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      WHERE ra.id = ? AND ra.request_status = 'requested'
        AND (ra.laboratory_id IS NULL OR ra.laboratory_id = ?)
    `, [testRequestId, laboratoryId]);

    if (testRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande de test non trouvée ou déjà assignée' 
      });
    }

    // Update test request to assign it to this laboratory
    await db.execute(`
      UPDATE resultats_analyses 
      SET 
        request_status = 'in_progress',
        laboratory_id = ?,
        technician_user_id = ?,
        date_status_updated = NOW()
      WHERE id = ?
    `, [laboratoryId, technician_user_id || null, testRequestId]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ACCEPT_TEST_REQUEST', 
      'resultats_analyses', 
      testRequestId, 
      `Demande de test acceptée par le laboratoire ID ${laboratoryId}`
    ]);

    return res.status(200).json({ 
      message: 'Demande de test acceptée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande de test:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

// Accept/Assign imaging request to laboratory
exports.acceptImagingRequest = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { imagingRequestId } = req.params;
    const { technician_user_id, scheduled_date } = req.body;

    // Validate imaging request exists and is available
    const [imagingRequests] = await db.execute(`
      SELECT ri.*, p.prenom, p.nom, ti.nom as imaging_type
      FROM resultats_imagerie ri
      JOIN patients p ON ri.patient_id = p.id
      JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
      WHERE ri.id = ? AND ri.request_status = 'requested'
        AND (ri.institution_realisation_id IS NULL OR ri.institution_realisation_id = ?)
    `, [imagingRequestId, laboratoryId]);

    if (imagingRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande d\'imagerie non trouvée ou déjà assignée' 
      });
    }

    // Update imaging request to assign it to this laboratory
    await db.execute(`
      UPDATE resultats_imagerie 
      SET 
        request_status = 'scheduled',
        institution_realisation_id = ?,
        technician_assigned_id = ?,
        scheduled_date = ?,
        date_status_updated = NOW()
      WHERE id = ?
    `, [laboratoryId, technician_user_id || null, scheduled_date || null, imagingRequestId]);

    // Log action
    await db.execute(`
      INSERT INTO historique_actions (
        utilisateur_id, action_type, table_concernee, 
        enregistrement_id, description
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      req.user.id, 
      'ACCEPT_IMAGING_REQUEST', 
      'resultats_imagerie', 
      imagingRequestId, 
      `Demande d'imagerie acceptée par le laboratoire ID ${laboratoryId}`
    ]);

    return res.status(200).json({ 
      message: 'Demande d\'imagerie acceptée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande d\'imagerie:', error);
    return res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

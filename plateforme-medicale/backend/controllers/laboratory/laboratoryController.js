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

// Upload test results
exports.uploadTestResults = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { testRequestId } = req.params;
    const { 
      valeurs, 
      interpretation, 
      commentaires, 
      fichier_resultat,
      technician_id 
    } = req.body;

    // Validate test request exists and is pending
    const [testRequests] = await db.execute(`
      SELECT ra.*, p.prenom, p.nom, ta.nom as test_name
      FROM resultats_analyses ra
      JOIN patients p ON ra.patient_id = p.id
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      WHERE ra.id = ? AND ra.statut IN ('en_attente', 'en_cours')
    `, [testRequestId]);

    if (testRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande de test non trouvée ou déjà complétée' 
      });
    }

    const testRequest = testRequests[0];

    // Validate technician if provided
    if (technician_id) {
      const [technicians] = await db.execute(`
        SELECT id FROM laboratory_technicians 
        WHERE id = ? AND laboratory_id = ? AND is_active = TRUE
      `, [technician_id, laboratoryId]);

      if (technicians.length === 0) {
        return res.status(400).json({ 
          message: 'Technicien non trouvé ou inactif' 
        });
      }
    }

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Update test results
      await conn.execute(`
        UPDATE resultats_analyses 
        SET 
          valeurs = ?,
          interpretation = ?,
          commentaires = ?,
          fichier_resultat = ?,
          date_realisation = NOW(),
          statut = 'termine',
          laboratoire_id = ?,
          technician_id = ?
        WHERE id = ?
      `, [
        valeurs, interpretation, commentaires, fichier_resultat,
        laboratoryId, technician_id, testRequestId
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

// Upload imaging results
exports.uploadImagingResults = async (req, res) => {
  try {
    const laboratoryId = req.user.id_specifique_role;
    const { imagingRequestId } = req.params;
    const { 
      findings, 
      interpretation, 
      recommendations, 
      image_files,
      technician_id 
    } = req.body;

    // Validate imaging request exists and is pending
    const [imagingRequests] = await db.execute(`
      SELECT ir.*, p.prenom, p.nom
      FROM imaging_requests ir
      JOIN patients p ON ir.patient_id = p.id
      WHERE ir.id = ? AND ir.status IN ('pending', 'in_progress')
    `, [imagingRequestId]);

    if (imagingRequests.length === 0) {
      return res.status(404).json({ 
        message: 'Demande d\'imagerie non trouvée ou déjà complétée' 
      });
    }

    const imagingRequest = imagingRequests[0];

    // Start transaction
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Update imaging results
      await conn.execute(`
        UPDATE imaging_requests 
        SET 
          findings = ?,
          interpretation = ?,
          recommendations = ?,
          image_files = ?,
          completion_date = NOW(),
          status = 'completed',
          assigned_laboratory_id = ?,
          assigned_technician_id = ?
        WHERE id = ?
      `, [
        findings, interpretation, recommendations, JSON.stringify(image_files),
        laboratoryId, technician_id, imagingRequestId
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
        'imaging_requests', 
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
        ra.date_demande,
        ra.statut,
        ta.nom as test_name,
        ta.type_analyse,
        CONCAT(p.prenom, ' ', p.nom) as patient_name,
        p.CNE,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur
      FROM resultats_analyses ra
      JOIN types_analyses ta ON ra.type_analyse_id = ta.id
      JOIN patients p ON ra.patient_id = p.id
      JOIN medecins m ON ra.medecin_id = m.id
      WHERE ra.statut IN ('en_attente', 'en_cours')
        AND (ra.laboratoire_id IS NULL OR ra.laboratoire_id = ?)
      ORDER BY ra.date_demande ASC
    `, [laboratoryId]);

    // Get pending imaging requests
    const [pendingImaging] = await db.execute(`
      SELECT 
        ir.id,
        ir.request_date,
        ir.status,
        ir.imaging_type,
        ir.urgency_level,
        CONCAT(p.prenom, ' ', p.nom) as patient_name,
        p.CNE,
        CONCAT(m.prenom, ' ', m.nom) as medecin_demandeur
      FROM imaging_requests ir
      JOIN patients p ON ir.patient_id = p.id
      JOIN medecins m ON ir.requesting_doctor_id = m.id
      WHERE ir.status IN ('pending', 'in_progress')
        AND (ir.assigned_laboratory_id IS NULL OR ir.assigned_laboratory_id = ?)
      ORDER BY ir.urgency_level DESC, ir.request_date ASC
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

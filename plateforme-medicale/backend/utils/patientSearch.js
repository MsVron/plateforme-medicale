const db = require('../config/db');

/**
 * Shared patient search functionality for all institution types
 * Ensures consistent search behavior across doctors, hospitals, pharmacies, and labs
 */

// Validate search parameters
const validateSearchParams = (prenom, nom, cne) => {
  if (!prenom && !nom && !cne) {
    return {
      isValid: false,
      message: 'Au moins un critère de recherche doit être fourni (prénom, nom, ou CNE)'
    };
  }

  if (prenom && prenom.trim().length < 2) {
    return {
      isValid: false,
      message: 'Le prénom doit contenir au moins 2 caractères'
    };
  }

  if (nom && nom.trim().length < 2) {
    return {
      isValid: false,
      message: 'Le nom doit contenir au moins 2 caractères'
    };
  }

  if (cne && cne.trim().length < 3) {
    return {
      isValid: false,
      message: 'Le CNE doit contenir au moins 3 caractères'
    };
  }

  return { isValid: true };
};

// Build search query conditions
const buildSearchConditions = (prenom, nom, cne) => {
  const whereConditions = [];
  const queryParams = [];

  if (prenom && prenom.trim()) {
    whereConditions.push('p.prenom = ?');
    queryParams.push(prenom.trim());
  }

  if (nom && nom.trim()) {
    whereConditions.push('p.nom = ?');
    queryParams.push(nom.trim());
  }

  if (cne && cne.trim()) {
    whereConditions.push('p.CNE = ?');
    queryParams.push(cne.trim());
  }

  return {
    whereClause: whereConditions.join(' AND '),
    queryParams
  };
};

// Log search activity for audit compliance
const logSearchActivity = async (userId, institutionId, searchCriteria, resultsCount, searchReason) => {
  try {
    await db.execute(`
      INSERT INTO patient_search_audit (
        searching_user_id, searching_institution_id, search_criteria, 
        search_results_count, search_reason
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      userId,
      institutionId,
      JSON.stringify(searchCriteria),
      resultsCount,
      searchReason
    ]);
  } catch (error) {
    console.error('Error logging search activity:', error);
    // Don't throw error as this shouldn't break the search functionality
  }
};

// Generic patient search for any institution type
exports.searchPatients = async (searchParams) => {
  const {
    prenom,
    nom,
    cne,
    userId,
    institutionId,
    institutionType,
    additionalFields = '',
    additionalJoins = '',
    additionalConditions = '',
    limit = 50
  } = searchParams;

  // Validate search parameters
  const validation = validateSearchParams(prenom, nom, cne);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  // Sanitize inputs
  const sanitizedPrenom = prenom ? prenom.trim() : null;
  const sanitizedNom = nom ? nom.trim() : null;
  const sanitizedCNE = cne ? cne.trim() : null;

  // Build search conditions
  const { whereClause, queryParams } = buildSearchConditions(sanitizedPrenom, sanitizedNom, sanitizedCNE);

  // Base query with common patient fields
  let query = `
    SELECT 
      p.id, 
      p.prenom, 
      p.nom, 
      p.date_naissance, 
      p.sexe, 
      p.CNE, 
      p.email, 
      p.telephone,
      p.adresse,
      p.ville,
      p.code_postal,
      p.groupe_sanguin,
      p.contact_urgence_nom,
      p.contact_urgence_telephone,
      p.contact_urgence_relation,
      p.est_inscrit_par_medecin,
      p.date_inscription,
      CONCAT(mt.prenom, ' ', mt.nom) as medecin_traitant_nom,
      s.nom as medecin_traitant_specialite
      ${additionalFields}
    FROM patients p
    LEFT JOIN medecins mt ON p.medecin_traitant_id = mt.id
    LEFT JOIN specialites s ON mt.specialite_id = s.id
    ${additionalJoins}
    WHERE ${whereClause}
    ${additionalConditions}
    ORDER BY p.nom, p.prenom
    LIMIT ?
  `;

  const finalParams = [...queryParams, limit];

  try {
    const [patients] = await db.execute(query, finalParams);

    // Log search activity for audit
    await logSearchActivity(
      userId,
      institutionId,
      {
        prenom: sanitizedPrenom,
        nom: sanitizedNom,
        cne: sanitizedCNE
      },
      patients.length,
      `${institutionType} patient search`
    );

    return {
      patients,
      searchCriteria: {
        prenom: sanitizedPrenom,
        nom: sanitizedNom,
        cne: sanitizedCNE
      },
      totalResults: patients.length
    };
  } catch (error) {
    console.error('Error in patient search:', error);
    throw new Error('Erreur serveur lors de la recherche');
  }
};

// Utility function to check if patient exists
exports.validatePatientExists = async (patientId) => {
  const [patients] = await db.execute(
    'SELECT id, prenom, nom FROM patients WHERE id = ?',
    [patientId]
  );
  
  if (patients.length === 0) {
    throw new Error('Patient non trouvé');
  }
  
  return patients[0];
};

// Utility function to get comprehensive patient record
exports.getComprehensivePatientRecord = async (patientId) => {
  const [records] = await db.execute(`
    SELECT * FROM comprehensive_patient_record WHERE patient_id = ?
  `, [patientId]);
  
  return records.length > 0 ? records[0] : null;
};

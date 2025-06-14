-- MEDICAL RECORD COMPLETENESS AND COMPREHENSIVE VIEWS
-- Views and functions to ensure all medical data is accessible and complete for different institution types

-- Comprehensive patient medical record view for doctors and hospitals
CREATE VIEW comprehensive_patient_record AS
SELECT 
    p.id as patient_id,
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
    p.pays,
    p.groupe_sanguin,
    p.taille_cm,
    p.poids_kg,
    p.est_fumeur,
    p.consommation_alcool,
    p.activite_physique,
    p.profession,
    p.contact_urgence_nom,
    p.contact_urgence_telephone,
    p.contact_urgence_relation,
    p.allergies_notes,
    p.date_inscription,
    p.est_inscrit_par_medecin,
    p.est_profil_complete,
    -- Medical completeness indicators
    CASE WHEN COUNT(DISTINCT pa.allergie_id) > 0 THEN TRUE ELSE FALSE END as has_allergies,
    CASE WHEN COUNT(DISTINCT am.id) > 0 THEN TRUE ELSE FALSE END as has_medical_history,
    CASE WHEN COUNT(DISTINCT t.id) > 0 THEN TRUE ELSE FALSE END as has_treatments,
    CASE WHEN COUNT(DISTINCT c.id) > 0 THEN TRUE ELSE FALSE END as has_consultations,
    CASE WHEN COUNT(DISTINCT ra.id) > 0 THEN TRUE ELSE FALSE END as has_lab_results,
    CASE WHEN COUNT(DISTINCT ri.id) > 0 THEN TRUE ELSE FALSE END as has_imaging_results,
    -- Counts for dashboard
    COUNT(DISTINCT pa.allergie_id) as allergies_count,
    COUNT(DISTINCT am.id) as antecedents_count,
    COUNT(DISTINCT t.id) as active_treatments_count,
    COUNT(DISTINCT c.id) as consultations_count,
    COUNT(DISTINCT ra.id) as lab_results_count,
    COUNT(DISTINCT ri.id) as imaging_results_count,
    -- Latest activity dates
    MAX(c.date_consultation) as last_consultation_date,
    MAX(t.date_prescription) as last_prescription_date,
    MAX(ra.date_realisation) as last_lab_result_date,
    MAX(ri.date_realisation) as last_imaging_date
FROM patients p
LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
LEFT JOIN antecedents_medicaux am ON p.id = am.patient_id
LEFT JOIN traitements t ON p.id = t.patient_id AND (t.est_permanent = 1 OR t.date_fin IS NULL OR t.date_fin >= CURDATE())
LEFT JOIN consultations c ON p.id = c.patient_id
LEFT JOIN resultats_analyses ra ON p.id = ra.patient_id
LEFT JOIN resultats_imagerie ri ON p.id = ri.patient_id
GROUP BY p.id;

-- Pharmacy-specific patient medication view
CREATE VIEW pharmacy_patient_medications AS
SELECT 
    p.id as patient_id,
    p.prenom,
    p.nom,
    p.CNE,
    p.date_naissance,
    p.telephone,
    t.id as prescription_id,
    t.posologie,
    t.date_debut,
    t.date_fin,
    t.est_permanent,
    t.date_prescription,
    t.instructions,
    t.status as prescription_status,
    m.nom_commercial,
    m.nom_molecule,
    m.dosage,
    m.forme,
    med.prenom as prescribing_doctor_first_name,
    med.nom as prescribing_doctor_last_name,
    med.numero_ordre as doctor_license,
    i.nom as prescribing_institution,
    -- Dispensing information
    md.quantity_dispensed,
    md.quantity_remaining,
    md.dispensing_date,
    md.pharmacy_id as dispensed_pharmacy_id,
    disp_inst.nom as dispensing_pharmacy_name,
    md.is_partial_dispensing,
    md.status as dispensing_status,
    -- Patient allergies relevant to medications
    GROUP_CONCAT(DISTINCT CONCAT(a.nom, ' (', pa.severite, ')') SEPARATOR '; ') as relevant_allergies
FROM patients p
JOIN traitements t ON p.id = t.patient_id
JOIN medicaments m ON t.medicament_id = m.id
JOIN medecins med ON t.medecin_prescripteur_id = med.id
LEFT JOIN institutions i ON med.institution_id = i.id
LEFT JOIN medication_dispensing md ON t.id = md.prescription_id
LEFT JOIN institutions disp_inst ON md.pharmacy_id = disp_inst.id
LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
LEFT JOIN allergies a ON pa.allergie_id = a.id
WHERE t.status IN ('prescribed', 'dispensed') 
  AND (t.est_permanent = 1 OR t.date_fin IS NULL OR t.date_fin >= CURDATE())
GROUP BY p.id, t.id, md.id;

-- Laboratory-specific patient test requests view
CREATE VIEW laboratory_patient_tests AS
SELECT 
    p.id as patient_id,
    p.prenom,
    p.nom,
    p.CNE,
    p.date_naissance,
    p.telephone,
    ra.id as analysis_id,
    ra.date_prescription,
    ra.date_realisation,
    ra.request_status,
    ra.priority,
    ta.nom as test_name,
    ca.nom as test_category,
    med.prenom as prescribing_doctor_first_name,
    med.nom as prescribing_doctor_last_name,
    med.numero_ordre as doctor_license,
    i.nom as prescribing_institution,
    ra.laboratory_id,
    lab_inst.nom as laboratory_name,
    ra.valeur_numerique,
    ra.valeur_texte,
    ra.unite,
    ra.valeur_normale_min,
    ra.valeur_normale_max,
    ra.est_normal,
    ra.est_critique,
    ra.interpretation,
    -- Sample tracking
    st.sample_id,
    st.sample_type,
    st.collection_date,
    st.sample_condition_on_receipt,
    -- Workflow status
    aw.workflow_step,
    aw.step_status,
    aw.assigned_technician_id
FROM patients p
JOIN resultats_analyses ra ON p.id = ra.patient_id
JOIN types_analyses ta ON ra.type_analyse_id = ta.id
JOIN categories_analyses ca ON ta.categorie_id = ca.id
JOIN medecins med ON ra.medecin_prescripteur_id = med.id
LEFT JOIN institutions i ON med.institution_id = i.id
LEFT JOIN institutions lab_inst ON ra.laboratory_id = lab_inst.id
LEFT JOIN sample_tracking st ON ra.id = st.analysis_request_id
LEFT JOIN analysis_workflow aw ON ra.id = aw.analysis_request_id
WHERE ra.request_status IN ('requested', 'in_progress', 'completed');

-- Hospital patient management view
CREATE VIEW hospital_patient_management AS
SELECT 
    p.id as patient_id,
    p.prenom,
    p.nom,
    p.CNE,
    p.date_naissance,
    p.sexe,
    p.telephone,
    p.contact_urgence_nom,
    p.contact_urgence_telephone,
    p.groupe_sanguin,
    -- Hospital assignment details
    ha.id as assignment_id,
    ha.admission_date,
    ha.discharge_date,
    ha.status as assignment_status,
    ha.admission_reason,
    ha.bed_number,
    ha.ward_name,
    ha.discharge_reason,
    h.nom as hospital_name,
    -- Primary doctor
    primary_med.prenom as primary_doctor_first_name,
    primary_med.nom as primary_doctor_last_name,
    primary_med.numero_ordre as primary_doctor_license,
    -- All assigned doctors
    GROUP_CONCAT(DISTINCT CONCAT(all_med.prenom, ' ', all_med.nom, ' (', hpd.role, ')') SEPARATOR '; ') as assigned_doctors,
    -- Recent surgeries
    COUNT(DISTINCT hs.id) as scheduled_surgeries_count,
    MAX(hs.scheduled_date) as next_surgery_date,
    -- Recent visits
    COUNT(DISTINCT hv.id) as visits_count,
    MAX(hv.arrival_time) as last_visit_date,
    -- Bed information
    hb.bed_type,
    hb.room_number,
    hb.ward_name as bed_ward
FROM patients p
JOIN hospital_assignments ha ON p.id = ha.patient_id
JOIN institutions h ON ha.hospital_id = h.id
JOIN medecins primary_med ON ha.medecin_id = primary_med.id
LEFT JOIN hospital_patient_doctors hpd ON ha.id = hpd.hospital_assignment_id AND hpd.is_active = 1
LEFT JOIN medecins all_med ON hpd.medecin_id = all_med.id
LEFT JOIN hospital_surgeries hs ON ha.id = hs.hospital_assignment_id AND hs.status IN ('scheduled', 'in_progress')
LEFT JOIN hospital_visits hv ON p.id = hv.patient_id AND hv.hospital_id = h.id
LEFT JOIN hospital_beds hb ON ha.id = hb.current_patient_assignment_id
WHERE ha.status = 'active'
GROUP BY p.id, ha.id;

-- Medical record completeness scoring function
DELIMITER //
CREATE FUNCTION calculate_medical_record_completeness(patient_id INT) 
RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE completeness_score DECIMAL(5,2) DEFAULT 0.0;
    DECLARE total_possible_score INT DEFAULT 100;
    
    -- Basic patient information (20 points)
    SELECT completeness_score + 
        CASE WHEN p.prenom IS NOT NULL AND p.nom IS NOT NULL THEN 5 ELSE 0 END +
        CASE WHEN p.date_naissance IS NOT NULL THEN 3 ELSE 0 END +
        CASE WHEN p.CNE IS NOT NULL THEN 3 ELSE 0 END +
        CASE WHEN p.telephone IS NOT NULL THEN 2 ELSE 0 END +
        CASE WHEN p.email IS NOT NULL THEN 2 ELSE 0 END +
        CASE WHEN p.adresse IS NOT NULL THEN 2 ELSE 0 END +
        CASE WHEN p.groupe_sanguin IS NOT NULL THEN 3 ELSE 0 END
    INTO completeness_score
    FROM patients p WHERE p.id = patient_id;
    
    -- Medical history (25 points)
    SELECT completeness_score + 
        CASE WHEN COUNT(*) > 0 THEN 15 ELSE 0 END +
        CASE WHEN COUNT(*) >= 3 THEN 10 ELSE 0 END
    INTO completeness_score
    FROM antecedents_medicaux am WHERE am.patient_id = patient_id;
    
    -- Allergies (15 points)
    SELECT completeness_score + 
        CASE WHEN COUNT(*) > 0 THEN 10 ELSE 0 END +
        CASE WHEN COUNT(*) >= 2 THEN 5 ELSE 0 END
    INTO completeness_score
    FROM patient_allergies pa WHERE pa.patient_id = patient_id;
    
    -- Current treatments (20 points)
    SELECT completeness_score + 
        CASE WHEN COUNT(*) > 0 THEN 15 ELSE 0 END +
        CASE WHEN COUNT(*) >= 2 THEN 5 ELSE 0 END
    INTO completeness_score
    FROM traitements t 
    WHERE t.patient_id = patient_id 
    AND (t.est_permanent = 1 OR t.date_fin IS NULL OR t.date_fin >= CURDATE());
    
    -- Recent consultations (10 points)
    SELECT completeness_score + 
        CASE WHEN COUNT(*) > 0 THEN 7 ELSE 0 END +
        CASE WHEN COUNT(*) >= 3 THEN 3 ELSE 0 END
    INTO completeness_score
    FROM consultations c 
    WHERE c.patient_id = patient_id 
    AND c.date_consultation >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
    
    -- Lab results (10 points)
    SELECT completeness_score + 
        CASE WHEN COUNT(*) > 0 THEN 7 ELSE 0 END +
        CASE WHEN COUNT(*) >= 5 THEN 3 ELSE 0 END
    INTO completeness_score
    FROM resultats_analyses ra 
    WHERE ra.patient_id = patient_id 
    AND ra.date_realisation >= DATE_SUB(CURDATE(), INTERVAL 2 YEAR);
    
    RETURN LEAST(completeness_score, 100.0);
END //
DELIMITER ;

-- Patient search function for institutions (with audit logging)
DELIMITER //
CREATE PROCEDURE search_patients_for_institution(
    IN search_first_name VARCHAR(50),
    IN search_last_name VARCHAR(50), 
    IN search_cne VARCHAR(20),
    IN searching_user_id INT,
    IN searching_institution_id INT,
    IN search_reason VARCHAR(255)
)
BEGIN
    DECLARE search_criteria JSON;
    DECLARE results_count INT DEFAULT 0;
    
    -- Build search criteria JSON
    SET search_criteria = JSON_OBJECT(
        'first_name', IFNULL(search_first_name, ''),
        'last_name', IFNULL(search_last_name, ''),
        'cne', IFNULL(search_cne, '')
    );
    
    -- Perform the search
    SELECT COUNT(*) INTO results_count
    FROM patients p
    WHERE (search_first_name IS NULL OR p.prenom LIKE CONCAT('%', search_first_name, '%'))
      AND (search_last_name IS NULL OR p.nom LIKE CONCAT('%', search_last_name, '%'))
      AND (search_cne IS NULL OR p.CNE = search_cne);
    
    -- Log the search for audit purposes
    INSERT INTO patient_search_audit (
        searching_user_id, 
        searching_institution_id, 
        search_criteria, 
        search_results_count, 
        search_reason
    ) VALUES (
        searching_user_id, 
        searching_institution_id, 
        search_criteria, 
        results_count, 
        search_reason
    );
    
    -- Return the results
    SELECT 
        p.id,
        p.prenom,
        p.nom,
        p.CNE,
        p.date_naissance,
        p.sexe,
        p.telephone,
        p.email,
        calculate_medical_record_completeness(p.id) as completeness_score
    FROM patients p
    WHERE (search_first_name IS NULL OR p.prenom LIKE CONCAT('%', search_first_name, '%'))
      AND (search_last_name IS NULL OR p.nom LIKE CONCAT('%', search_last_name, '%'))
      AND (search_cne IS NULL OR p.CNE = search_cne)
    ORDER BY p.nom, p.prenom
    LIMIT 50;
END //
DELIMITER ; 

-- for this one go to phpMyAdmin, then to our database for this project
-- then go to the SQL tab, paste the content of this file, and click on the go button
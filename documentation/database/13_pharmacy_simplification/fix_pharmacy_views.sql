-- ================================================================
-- FIX PHARMACY VIEWS - Remove problematic user name references
-- ================================================================

-- Step 1: Update prescription status tracking (if not already done)
ALTER TABLE traitements MODIFY COLUMN status ENUM('prescribed', 'partially_dispensed', 'fully_dispensed', 'expired', 'cancelled') DEFAULT 'prescribed';

-- Step 2: Create view for pharmacy prescription management (FIXED)
CREATE OR REPLACE VIEW pharmacy_prescription_view AS
SELECT 
    t.id as prescription_id,
    t.patient_id,
    p.prenom as patient_first_name,
    p.nom as patient_last_name,
    p.CNE as patient_cne,
    p.date_naissance as patient_birth_date,
    p.telephone as patient_phone,
    
    -- Prescription details
    t.date_prescription,
    t.posologie,
    t.date_debut,
    t.date_fin,
    t.est_permanent,
    t.instructions,
    t.status as prescription_status,
    
    -- Medication details
    m.nom_commercial as medication_name,
    m.nom_molecule as molecule_name,
    m.dosage,
    m.forme as medication_form,
    
    -- Doctor details
    CONCAT(med.prenom, ' ', med.nom) as prescribing_doctor,
    s.nom as doctor_specialty,
    i.nom as prescribing_institution,
    
    -- Dispensing status
    CASE 
        WHEN pd.id IS NULL THEN 'not_dispensed'
        WHEN t.est_permanent = 1 THEN 'ongoing_permanent'
        WHEN pd.is_fulfilled = 1 THEN 'completed'
        ELSE 'in_progress'
    END as dispensing_status,
    
    -- Last dispensing info
    pd.last_purchase_date,
    pd.dispensing_date as last_dispensing_date,
    pharm.nom as last_dispensing_pharmacy,
    pd.dispensing_notes,
    
    -- Patient allergies (for safety)
    GROUP_CONCAT(DISTINCT CONCAT(a.nom, ' (', pa.severite, ')') SEPARATOR '; ') as patient_allergies

FROM traitements t
JOIN patients p ON t.patient_id = p.id
JOIN medicaments m ON t.medicament_id = m.id
JOIN medecins med ON t.medecin_prescripteur_id = med.id
LEFT JOIN specialites s ON med.specialite_id = s.id
LEFT JOIN institutions i ON med.institution_id = i.id
LEFT JOIN prescription_dispensing pd ON t.id = pd.prescription_id
LEFT JOIN institutions pharm ON pd.pharmacy_id = pharm.id
LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
LEFT JOIN allergies a ON pa.allergie_id = a.id
GROUP BY t.id, pd.id
ORDER BY t.date_prescription DESC;

-- Step 3: Update pharmacy_patient_medications view (FIXED)
DROP VIEW IF EXISTS pharmacy_patient_medications;

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
    i.nom as prescribing_institution,
    -- Simplified dispensing information
    pd.dispensing_date,
    pd.pharmacy_id as dispensed_pharmacy_id,
    disp_inst.nom as dispensing_pharmacy_name,
    pd.is_fulfilled,
    pd.is_permanent_medication,
    pd.last_purchase_date,
    pd.status as dispensing_status,
    pd.dispensing_notes,
    -- Patient allergies relevant to medications
    GROUP_CONCAT(DISTINCT CONCAT(a.nom, ' (', pa.severite, ')') SEPARATOR '; ') as relevant_allergies
FROM patients p
JOIN traitements t ON p.id = t.patient_id
JOIN medicaments m ON t.medicament_id = m.id
JOIN medecins med ON t.medecin_prescripteur_id = med.id
LEFT JOIN institutions i ON med.institution_id = i.id
LEFT JOIN prescription_dispensing pd ON t.id = pd.prescription_id
LEFT JOIN institutions disp_inst ON pd.pharmacy_id = disp_inst.id
LEFT JOIN patient_allergies pa ON p.id = pa.patient_id
LEFT JOIN allergies a ON pa.allergie_id = a.id
WHERE t.status IN ('prescribed', 'partially_dispensed', 'fully_dispensed')
GROUP BY p.id, t.id, pd.id
ORDER BY t.date_prescription DESC;

-- ================================================================
-- COMPLETED! 
-- ================================================================
-- ✅ Fixed the views by removing problematic user name references
-- ✅ Pharmacy prescription management view created
-- ✅ Patient medications view updated
-- 
-- Your simplified pharmacy system is now ready!
-- ================================================================ 
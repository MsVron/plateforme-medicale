-- ================================================================
-- COMPLETE PHARMACY SYSTEM FIX
-- Run this in phpMyAdmin to fix the pharmacy patient search error
-- ================================================================

-- Step 1: Create the prescription_dispensing table if it doesn't exist
CREATE TABLE IF NOT EXISTS prescription_dispensing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT NOT NULL,
  patient_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  dispensed_by_user_id INT NOT NULL,
  medicament_id INT NOT NULL,
  
  -- Simple dispensing tracking
  dispensing_date DATETIME NOT NULL,
  dispensing_notes TEXT DEFAULT NULL,
  
  -- For permanent medications - track last purchase instead of scratching off
  is_permanent_medication BOOLEAN DEFAULT FALSE,
  last_purchase_date DATETIME DEFAULT NULL,
  
  -- For one-time medications - mark as fulfilled/scratched
  is_fulfilled BOOLEAN DEFAULT FALSE,
  
  -- Basic pricing (optional)
  unit_price DECIMAL(8,2) DEFAULT NULL,
  total_price DECIMAL(8,2) DEFAULT NULL,
  
  -- Insurance info (if needed)
  insurance_covered BOOLEAN DEFAULT FALSE,
  patient_copay DECIMAL(8,2) DEFAULT NULL,
  
  -- Status tracking
  status ENUM('dispensed', 'returned', 'cancelled') DEFAULT 'dispensed',
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (prescription_id) REFERENCES traitements(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES institutions(id) ON DELETE CASCADE,
  FOREIGN KEY (dispensed_by_user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE,
  
  INDEX idx_prescription_dispensing_prescription (prescription_id),
  INDEX idx_prescription_dispensing_patient (patient_id),
  INDEX idx_prescription_dispensing_pharmacy (pharmacy_id),
  INDEX idx_prescription_dispensing_date (dispensing_date),
  INDEX idx_prescription_dispensing_status (status),
  INDEX idx_prescription_dispensing_permanent (is_permanent_medication),
  INDEX idx_prescription_dispensing_fulfilled (is_fulfilled)
);

-- Step 2: Update prescription status tracking
ALTER TABLE traitements MODIFY COLUMN status ENUM('prescribed', 'partially_dispensed', 'fully_dispensed', 'expired', 'cancelled') DEFAULT 'prescribed';

-- Step 3: Create FIXED pharmacy prescription view (without problematic user references)
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

-- Step 4: Create FIXED pharmacy patient medications view
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
    -- Simplified dispensing information (NO USER NAMES)
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
-- ✅ prescription_dispensing table created
-- ✅ prescription status updated
-- ✅ pharmacy views created WITHOUT user name references
-- ✅ Fixed the "Unknown column 'u.prenom'" error
-- 
-- Your pharmacy system is now ready!
-- ================================================================ 
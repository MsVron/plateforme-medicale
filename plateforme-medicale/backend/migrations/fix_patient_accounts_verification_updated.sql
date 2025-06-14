-- ========================================
-- PATIENT ACCOUNTS AND VERIFICATION FIX - UPDATED VERSION
-- ========================================
-- This migration fixes the issues with patient user accounts and verification tokens
-- Run this AFTER populate_moroccan_patients.sql and populate_moroccan_doctors.sql
-- 
-- Issues addressed:
-- 1. Missing user accounts in utilisateurs table
-- 2. Missing verification tokens in verification_patients table
-- 3. Proper foreign key relationships
-- 4. Account verification status

-- ========================================
-- SECTION 1: CLEAN UP EXISTING DATA (OPTIONAL)
-- ========================================
-- Remove any existing patient user accounts that might be incomplete
-- This prevents duplicate key errors
DELETE FROM utilisateurs 
WHERE role = 'patient' 
AND id_specifique_role NOT IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Clean up orphaned verification tokens
DELETE FROM verification_patients 
WHERE patient_id NOT IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- ========================================
-- SECTION 2: CREATE USER ACCOUNTS FOR PATIENTS
-- ========================================
-- Create user accounts for patients that don't have them yet
-- Password: patient123 (hashed with bcrypt)

INSERT IGNORE INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie)
SELECT 
    CONCAT(LOWER(REPLACE(p.prenom, ' ', '')), '.', LOWER(REPLACE(p.nom, ' ', ''))),
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', -- patient123
    p.email,
    'patient',
    p.id,
    TRUE
FROM patients p 
WHERE p.CNE LIKE 'CN%'
AND p.email IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = 'patient' AND u.id_specifique_role = p.id
);

-- ========================================
-- SECTION 3: CREATE VERIFICATION TOKENS
-- ========================================
-- Create verification tokens for all patients
-- Set expiration date to 30 days from now

INSERT IGNORE INTO verification_patients (patient_id, token, date_expiration, est_verifie)
SELECT 
    p.id,
    CONCAT('VER_', p.CNE, '_', UNIX_TIMESTAMP(NOW())),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    TRUE  -- Set as already verified since these are existing patients
FROM patients p 
WHERE p.CNE LIKE 'CN%'
AND NOT EXISTS (
    SELECT 1 FROM verification_patients vp 
    WHERE vp.patient_id = p.id
);

-- ========================================
-- SECTION 4: UPDATE PATIENT PROFILES
-- ========================================
-- Mark all patient profiles as complete
UPDATE patients 
SET est_profil_complete = TRUE 
WHERE CNE LIKE 'CN%' AND est_profil_complete = FALSE;

-- ========================================
-- SECTION 5: ASSIGN TREATING DOCTORS
-- ========================================
-- Assign treating doctors to patients who don't have one
-- Use available doctors from the database

-- Get the first available general practitioner
SET @general_doctor_id = (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1);

-- Assign treating doctor to patients without one
UPDATE patients 
SET medecin_traitant_id = @general_doctor_id
WHERE CNE LIKE 'CN%' 
AND medecin_traitant_id IS NULL 
AND @general_doctor_id IS NOT NULL;

-- ========================================
-- SECTION 6: VERIFICATION AND CLEANUP
-- ========================================

-- Update user verification status based on verification_patients table
UPDATE utilisateurs u
INNER JOIN patients p ON u.role = 'patient' AND u.id_specifique_role = p.id
INNER JOIN verification_patients vp ON vp.patient_id = p.id
SET u.est_verifie = vp.est_verifie
WHERE p.CNE LIKE 'CN%';

-- ========================================
-- SECTION 7: SUMMARY REPORT
-- ========================================

SELECT 'PATIENT ACCOUNTS SUMMARY' as section;

-- Count patients with user accounts
SELECT 
    'USER ACCOUNTS' as metric,
    COUNT(DISTINCT p.id) as patients_with_accounts,
    (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') as total_patients
FROM patients p
INNER JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id
WHERE p.CNE LIKE 'CN%';

-- Count patients with verification tokens
SELECT 
    'VERIFICATION TOKENS' as metric,
    COUNT(DISTINCT p.id) as patients_with_tokens,
    (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') as total_patients
FROM patients p
INNER JOIN verification_patients vp ON vp.patient_id = p.id
WHERE p.CNE LIKE 'CN%';

-- Count verified patients
SELECT 
    'VERIFIED PATIENTS' as metric,
    COUNT(DISTINCT p.id) as verified_patients,
    (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') as total_patients
FROM patients p
INNER JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id
WHERE p.CNE LIKE 'CN%' AND u.est_verifie = TRUE;

-- Count patients with treating doctors
SELECT 
    'PATIENTS WITH TREATING DOCTORS' as metric,
    COUNT(*) as patients_with_doctors,
    (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') as total_patients
FROM patients 
WHERE CNE LIKE 'CN%' AND medecin_traitant_id IS NOT NULL;

-- Check for any issues
SELECT 
    'ISSUES CHECK' as section,
    CASE 
        WHEN (SELECT COUNT(*) FROM patients p 
              LEFT JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id 
              WHERE p.CNE LIKE 'CN%' AND u.id IS NULL) > 0 
        THEN CONCAT((SELECT COUNT(*) FROM patients p 
                     LEFT JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id 
                     WHERE p.CNE LIKE 'CN%' AND u.id IS NULL), ' patients without user accounts')
        WHEN (SELECT COUNT(*) FROM patients p 
              LEFT JOIN verification_patients vp ON vp.patient_id = p.id 
              WHERE p.CNE LIKE 'CN%' AND vp.id IS NULL) > 0 
        THEN CONCAT((SELECT COUNT(*) FROM patients p 
                     LEFT JOIN verification_patients vp ON vp.patient_id = p.id 
                     WHERE p.CNE LIKE 'CN%' AND vp.id IS NULL), ' patients without verification tokens')
        ELSE 'All patients have proper accounts and verification'
    END as status;

-- ========================================
-- MIGRATION COMPLETION
-- ========================================
SELECT 'Patient accounts and verification fix completed successfully!' as completion_status; 
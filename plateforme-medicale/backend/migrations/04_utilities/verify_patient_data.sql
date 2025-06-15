-- ========================================
-- PATIENT DATA VERIFICATION SCRIPT
-- ========================================
-- This script verifies that all patient data has been properly loaded
-- Run this to check the status of your patient migrations

-- ========================================
-- BASIC COUNTS VERIFICATION
-- ========================================

SELECT '=== BASIC DATA VERIFICATION ===' as section;

-- Check patients table
SELECT 
    'PATIENTS TABLE' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN CNE LIKE 'CN%' THEN 1 END) as moroccan_patients,
    COUNT(CASE WHEN est_profil_complete = TRUE THEN 1 END) as complete_profiles
FROM patients;

-- Check utilisateurs table for patients
SELECT 
    'USER ACCOUNTS' as table_name,
    COUNT(*) as total_patient_accounts,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_accounts,
    COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_accounts
FROM utilisateurs 
WHERE role = 'patient';

-- Check verification_patients table
SELECT 
    'VERIFICATION TOKENS' as table_name,
    COUNT(*) as total_tokens,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_tokens,
    COUNT(CASE WHEN date_expiration > NOW() THEN 1 END) as valid_tokens
FROM verification_patients;

-- ========================================
-- DETAILED VERIFICATION
-- ========================================

SELECT '=== DETAILED VERIFICATION ===' as section;

-- Check for patients without user accounts
SELECT 
    'PATIENTS WITHOUT ACCOUNTS' as check_type,
    COUNT(*) as count
FROM patients p
WHERE p.CNE LIKE 'CN%'
AND p.id NOT IN (
    SELECT COALESCE(id_specifique_role, 0) 
    FROM utilisateurs 
    WHERE role = 'patient'
);

-- Check for user accounts without verification tokens
SELECT 
    'ACCOUNTS WITHOUT VERIFICATION' as check_type,
    COUNT(*) as count
FROM utilisateurs u
WHERE u.role = 'patient'
AND u.id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')
AND u.id_specifique_role NOT IN (
    SELECT COALESCE(patient_id, 0) FROM verification_patients
);

-- Check for duplicate usernames
SELECT 
    'DUPLICATE USERNAMES' as check_type,
    COUNT(*) as count
FROM (
    SELECT nom_utilisateur, COUNT(*) as cnt
    FROM utilisateurs 
    WHERE role = 'patient'
    GROUP BY nom_utilisateur
    HAVING COUNT(*) > 1
) as duplicates;

-- ========================================
-- MEDICAL DATA VERIFICATION
-- ========================================

SELECT '=== MEDICAL DATA VERIFICATION ===' as section;

-- Check patient allergies
SELECT 
    'PATIENT ALLERGIES' as data_type,
    COUNT(DISTINCT patient_id) as patients_with_data,
    COUNT(*) as total_records
FROM patient_allergies 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Check medical antecedents
SELECT 
    'MEDICAL ANTECEDENTS' as data_type,
    COUNT(DISTINCT patient_id) as patients_with_data,
    COUNT(*) as total_records
FROM antecedents_medicaux 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Check patient notes
SELECT 
    'PATIENT NOTES' as data_type,
    COUNT(DISTINCT patient_id) as patients_with_data,
    COUNT(*) as total_records
FROM notes_patient 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- ========================================
-- SAMPLE DATA DISPLAY
-- ========================================

SELECT '=== SAMPLE PATIENT DATA ===' as section;

-- Show first 5 patients with their user accounts
SELECT 
    p.prenom,
    p.nom,
    p.CNE,
    p.ville,
    u.nom_utilisateur,
    u.est_verifie as account_verified,
    CASE WHEN vp.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_verification_token
FROM patients p
LEFT JOIN utilisateurs u ON p.id = u.id_specifique_role AND u.role = 'patient'
LEFT JOIN verification_patients vp ON p.id = vp.patient_id
WHERE p.CNE LIKE 'CN%'
ORDER BY p.id
LIMIT 5;

-- ========================================
-- FINAL STATUS
-- ========================================

SELECT '=== MIGRATION STATUS ===' as section;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') = 50 
        AND (SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient' AND id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) = 50
        AND (SELECT COUNT(*) FROM verification_patients WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) = 50
        THEN '✅ ALL MIGRATIONS SUCCESSFUL'
        ELSE '❌ MIGRATION INCOMPLETE - CHECK DETAILS ABOVE'
    END as status;

-- Show any issues that need attention
SELECT 
    'ISSUES TO FIX' as category,
    CASE 
        WHEN (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') != 50 THEN 'Missing patients data'
        WHEN (SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient' AND id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) != 50 THEN 'Missing user accounts'
        WHEN (SELECT COUNT(*) FROM verification_patients WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) != 50 THEN 'Missing verification tokens'
        ELSE 'No issues found'
    END as issue; 
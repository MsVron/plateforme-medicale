-- ========================================
-- PATIENT ACCOUNTS AND VERIFICATION FIX
-- ========================================
-- This migration fixes the issues with patient user accounts and verification tokens
-- Run this AFTER populate_moroccan_patients.sql and populate_patient_medical_records.sql
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
DELETE FROM utilisateurs WHERE role = 'patient' AND id_specifique_role IN (
    SELECT id FROM patients WHERE CNE LIKE 'CN%'
);

-- Remove any existing verification tokens for these patients
DELETE FROM verification_patients WHERE patient_id IN (
    SELECT id FROM patients WHERE CNE LIKE 'CN%'
);

-- ========================================
-- SECTION 2: CREATE USER ACCOUNTS FOR PATIENTS
-- ========================================
-- Create user accounts for all Moroccan patients
-- Password: patient123 (hashed with bcrypt)
-- All accounts are set as verified for testing purposes

INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie, date_creation) 
SELECT 
    CONCAT(LOWER(prenom), '.', LOWER(nom)) as nom_utilisateur,
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe, -- patient123
    email,
    'patient' as role,
    id as id_specifique_role,
    TRUE as est_verifie,
    NOW() as date_creation
FROM patients 
WHERE CNE LIKE 'CN%' 
AND email IS NOT NULL 
AND email != '';

-- ========================================
-- SECTION 3: HANDLE DUPLICATE USERNAMES
-- ========================================
-- Fix potential duplicate usernames by adding city suffix
UPDATE utilisateurs u1
JOIN patients p1 ON u1.id_specifique_role = p1.id
SET u1.nom_utilisateur = CONCAT(u1.nom_utilisateur, '.', LOWER(SUBSTRING(p1.ville, 1, 4)))
WHERE u1.role = 'patient' 
AND p1.CNE LIKE 'CN%'
AND EXISTS (
    SELECT 1 FROM utilisateurs u2 
    JOIN patients p2 ON u2.id_specifique_role = p2.id
    WHERE u2.nom_utilisateur = u1.nom_utilisateur 
    AND u2.id != u1.id 
    AND u2.role = 'patient'
    AND p2.CNE LIKE 'CN%'
);

-- ========================================
-- SECTION 4: CREATE VERIFICATION TOKENS
-- ========================================
-- Generate verification tokens for all patients
-- Tokens are set to expire in 30 days from creation
-- All tokens are marked as verified for testing

INSERT INTO verification_patients (patient_id, token, date_creation, date_expiration, est_verifie)
SELECT 
    p.id as patient_id,
    CONCAT(
        'VT_',
        UPPER(SUBSTRING(MD5(CONCAT(p.id, p.email, NOW())), 1, 16)),
        '_',
        UPPER(SUBSTRING(MD5(CONCAT(p.CNE, p.prenom, p.nom)), 1, 16))
    ) as token,
    NOW() as date_creation,
    DATE_ADD(NOW(), INTERVAL 30 DAY) as date_expiration,
    TRUE as est_verifie
FROM patients p
WHERE p.CNE LIKE 'CN%'
AND p.email IS NOT NULL 
AND p.email != '';

-- ========================================
-- SECTION 5: UPDATE PATIENT PROFILES
-- ========================================
-- Ensure all patient profiles are marked as complete
UPDATE patients 
SET est_profil_complete = TRUE 
WHERE CNE LIKE 'CN%';

-- ========================================
-- SECTION 6: VERIFICATION AND STATISTICS
-- ========================================

-- Verify user accounts creation
SELECT 
    'USER ACCOUNTS VERIFICATION' as category,
    COUNT(*) as total_patient_accounts,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_accounts,
    COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_accounts
FROM utilisateurs 
WHERE role = 'patient' 
AND id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Verify verification tokens
SELECT 
    'VERIFICATION TOKENS' as category,
    COUNT(*) as total_tokens,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_tokens,
    COUNT(CASE WHEN date_expiration > NOW() THEN 1 END) as valid_tokens
FROM verification_patients 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Check for any missing user accounts
SELECT 
    'MISSING ACCOUNTS CHECK' as category,
    COUNT(*) as patients_without_accounts
FROM patients p
WHERE p.CNE LIKE 'CN%'
AND p.id NOT IN (
    SELECT id_specifique_role 
    FROM utilisateurs 
    WHERE role = 'patient'
);

-- Check for duplicate usernames
SELECT 
    'DUPLICATE USERNAMES CHECK' as category,
    COUNT(*) as duplicate_count
FROM (
    SELECT nom_utilisateur, COUNT(*) as cnt
    FROM utilisateurs 
    WHERE role = 'patient' 
    AND id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')
    GROUP BY nom_utilisateur
    HAVING COUNT(*) > 1
) as duplicates;

-- Final summary
SELECT 
    'MIGRATION SUMMARY' as category,
    (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') as total_patients,
    (SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient' AND id_specifique_role IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) as user_accounts_created,
    (SELECT COUNT(*) FROM verification_patients WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%')) as verification_tokens_created
FROM DUAL;

-- ========================================
-- MIGRATION COMPLETION MESSAGE
-- ========================================
SELECT 'Patient accounts and verification fix completed successfully!' as status;
SELECT 'All patient accounts are now properly created with verification tokens.' as message;
SELECT 'Default password for all patient accounts: patient123' as password_info; 
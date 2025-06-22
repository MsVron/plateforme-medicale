-- ADD INSTITUTION LOGIN CREDENTIALS - SAFE VERSION
-- Migration to add missing login credentials for hospitals, clinics, and medical centers
-- Created: 2024
-- Description: Adds login credentials in utilisateurs table for all institutional healthcare providers
-- This version handles email conflicts by using alternative emails when needed

-- ========================================
-- DIAGNOSTIC QUERIES FIRST
-- ========================================

-- Check current state of institutions
SELECT 
    'INSTITUTION AUDIT' as type,
    i.id,
    i.nom as institution_name,
    i.email_contact,
    i.type_institution,
    CASE 
        WHEN EXISTS (SELECT 1 FROM utilisateurs u WHERE u.role = i.type_institution AND u.id_specifique_role = i.id) 
        THEN 'HAS USER ACCOUNT'
        WHEN EXISTS (SELECT 1 FROM utilisateurs u WHERE u.email = i.email_contact)
        THEN 'EMAIL CONFLICT'
        ELSE 'NEEDS CREDENTIALS'
    END as status
FROM institutions i
WHERE i.type_institution IN ('hospital', 'institution')
ORDER BY i.type_institution, i.nom;

-- ========================================
-- HOSPITAL LOGIN CREDENTIALS
-- ========================================

-- Create login credentials for hospitals (role = 'hospital')
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) 
SELECT 
    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e'), 'è', 'e'), 'ç', 'c')) as nom_utilisateur,
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe, -- password123
    CASE 
        WHEN EXISTS (SELECT 1 FROM utilisateurs u WHERE u.email = i.email_contact) 
        THEN CONCAT('admin.', LOWER(REPLACE(REPLACE(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e'), 'è', 'e'), 'ç', 'c')), '@system.ma')
        ELSE i.email_contact
    END as email,
    'hospital' as role,
    i.id as id_specifique_role,
    TRUE as est_verifie
FROM institutions i 
WHERE i.type_institution = 'hospital' 
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = 'hospital' AND u.id_specifique_role = i.id
);

-- ========================================
-- CLINIC AND MEDICAL CENTER LOGIN CREDENTIALS
-- ========================================

-- Create login credentials for clinics and medical centers (role = 'institution')
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) 
SELECT 
    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e'), 'è', 'e'), 'ç', 'c')) as nom_utilisateur,
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe, -- password123
    CASE 
        WHEN EXISTS (SELECT 1 FROM utilisateurs u WHERE u.email = i.email_contact) 
        THEN CONCAT('admin.', LOWER(REPLACE(REPLACE(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e'), 'è', 'e'), 'ç', 'c')), '@system.ma')
        ELSE i.email_contact
    END as email,
    'institution' as role,
    i.id as id_specifique_role,
    TRUE as est_verifie
FROM institutions i 
WHERE i.type_institution = 'institution' 
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = 'institution' AND u.id_specifique_role = i.id
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify hospital credentials were created
SELECT 
    'HOSPITAL CREDENTIALS' as type,
    i.nom as institution_name,
    u.nom_utilisateur,
    u.email,
    u.role,
    CASE 
        WHEN u.email LIKE '%@system.ma' THEN 'ALTERNATIVE EMAIL USED'
        ELSE 'ORIGINAL EMAIL USED'
    END as email_status
FROM institutions i
INNER JOIN utilisateurs u ON u.role = 'hospital' AND u.id_specifique_role = i.id
WHERE i.type_institution = 'hospital'
ORDER BY i.nom;

-- Verify clinic/medical center credentials were created  
SELECT 
    'INSTITUTION CREDENTIALS' as type,
    i.nom as institution_name,
    u.nom_utilisateur,
    u.email,
    u.role,
    CASE 
        WHEN u.email LIKE '%@system.ma' THEN 'ALTERNATIVE EMAIL USED'
        ELSE 'ORIGINAL EMAIL USED'
    END as email_status
FROM institutions i
INNER JOIN utilisateurs u ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE i.type_institution = 'institution'
ORDER BY i.nom;

-- Summary count
SELECT 
    'SUMMARY' as type,
    COUNT(CASE WHEN i.type_institution = 'hospital' THEN 1 END) as hospitals_with_credentials,
    COUNT(CASE WHEN i.type_institution = 'institution' THEN 1 END) as institutions_with_credentials,
    COUNT(*) as total_institution_credentials,
    COUNT(CASE WHEN u.email LIKE '%@system.ma' THEN 1 END) as alternative_emails_used
FROM institutions i
INNER JOIN utilisateurs u ON u.role = i.type_institution AND u.id_specifique_role = i.id
WHERE i.type_institution IN ('hospital', 'institution');

-- Show any remaining institutions without credentials
SELECT 
    'MISSING CREDENTIALS' as type,
    i.nom as institution_name,
    i.email_contact,
    i.type_institution,
    'STILL NEEDS CREDENTIALS' as status
FROM institutions i
WHERE i.type_institution IN ('hospital', 'institution')
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = i.type_institution AND u.id_specifique_role = i.id
)
ORDER BY i.nom; 
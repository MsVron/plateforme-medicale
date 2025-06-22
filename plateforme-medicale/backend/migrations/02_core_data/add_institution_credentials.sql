-- ADD INSTITUTION LOGIN CREDENTIALS
-- Migration to add missing login credentials for hospitals, clinics, and medical centers
-- Created: 2024
-- Description: Adds login credentials in utilisateurs table for all institutional healthcare providers

-- ========================================
-- HOSPITAL LOGIN CREDENTIALS
-- ========================================

-- Create login credentials for hospitals (role = 'hospital')
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) 
SELECT 
    LOWER(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e')) as nom_utilisateur,
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe, -- password123
    i.email_contact,
    'hospital' as role,
    i.id as id_specifique_role,
    TRUE as est_verifie
FROM institutions i 
WHERE i.type_institution = 'hospital' 
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = 'hospital' AND u.id_specifique_role = i.id
)
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.email = i.email_contact
);

-- ========================================
-- CLINIC AND MEDICAL CENTER LOGIN CREDENTIALS
-- ========================================

-- Create login credentials for clinics and medical centers (role = 'institution')
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) 
SELECT 
    LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(i.nom, ' ', '.'), 'é', 'e'), 'è', 'e'), 'ç', 'c'), '.dr.', '.dr')) as nom_utilisateur,
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe, -- password123
    i.email_contact,
    'institution' as role,
    i.id as id_specifique_role,
    TRUE as est_verifie
FROM institutions i 
WHERE i.type_institution IN ('institution', 'clinic') 
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.role = 'institution' AND u.id_specifique_role = i.id
)
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.email = i.email_contact
);

-- ========================================
-- DIAGNOSTIC QUERIES
-- ========================================

-- Check for potential email conflicts before creating credentials
SELECT 
    'EMAIL CONFLICT CHECK' as type,
    i.nom as institution_name,
    i.email_contact,
    i.type_institution,
    'CONFLICT - Email already exists' as status
FROM institutions i
INNER JOIN utilisateurs u ON u.email = i.email_contact
WHERE i.type_institution IN ('hospital', 'institution', 'clinic')
ORDER BY i.nom;

-- Check institutions without user accounts
SELECT 
    'MISSING CREDENTIALS' as type,
    i.nom as institution_name,
    i.email_contact,
    i.type_institution,
    'NEEDS CREDENTIALS' as status
FROM institutions i
WHERE i.type_institution IN ('hospital', 'institution', 'clinic')
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE (
        (i.type_institution = 'hospital' AND u.role = 'hospital' AND u.id_specifique_role = i.id) OR
        (i.type_institution IN ('institution', 'clinic') AND u.role = 'institution' AND u.id_specifique_role = i.id)
    )
)
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE u.email = i.email_contact
)
ORDER BY i.nom;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify hospital credentials were created
SELECT 
    'HOSPITAL CREDENTIALS' as type,
    i.nom as institution_name,
    u.nom_utilisateur,
    u.email,
    u.role
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
    u.role
FROM institutions i
INNER JOIN utilisateurs u ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE i.type_institution IN ('institution', 'clinic')
ORDER BY i.nom;

-- Summary count
SELECT 
    'SUMMARY' as type,
    COUNT(CASE WHEN i.type_institution = 'hospital' THEN 1 END) as hospitals_with_credentials,
    COUNT(CASE WHEN i.type_institution IN ('institution', 'clinic') THEN 1 END) as institutions_with_credentials,
    COUNT(*) as total_institution_credentials
FROM institutions i
INNER JOIN utilisateurs u ON u.role = i.type_institution AND u.id_specifique_role = i.id
WHERE i.type_institution IN ('hospital', 'institution', 'clinic'); 
-- ROLLBACK INSTITUTION CREDENTIALS
-- Script to clean up problematic institution user accounts
-- Created: 2024
-- Description: Removes institution users that were created with errors

-- ========================================
-- DIAGNOSTIC - SHOW CURRENT PROBLEMATIC ENTRIES
-- ========================================

-- Show institution users that might have been created with issues
SELECT 
    'CURRENT INSTITUTION USERS' as type,
    u.id,
    u.nom_utilisateur,
    u.email,
    u.role,
    u.id_specifique_role,
    i.nom as institution_name,
    i.type_institution
FROM utilisateurs u
LEFT JOIN institutions i ON (
    (u.role = 'hospital' AND i.id = u.id_specifique_role AND i.type_institution = 'hospital') OR
    (u.role = 'institution' AND i.id = u.id_specifique_role AND i.type_institution IN ('institution', 'clinic', 'clinique', 'centre médical', 'cabinet privé'))
)
WHERE u.role IN ('hospital', 'institution', 'pharmacy', 'laboratory')
ORDER BY u.role, u.nom_utilisateur;

-- Show problematic usernames (with double dots or other issues)
SELECT 
    'PROBLEMATIC USERNAMES' as type,
    u.id,
    u.nom_utilisateur,
    u.email,
    u.role,
    'Contains double dots or formatting issues' as issue
FROM utilisateurs u
WHERE u.role IN ('hospital', 'institution', 'pharmacy', 'laboratory')
AND (u.nom_utilisateur LIKE '%..%' OR u.nom_utilisateur LIKE '%.dr.%')
ORDER BY u.nom_utilisateur;

-- ========================================
-- ROLLBACK OPTIONS
-- ========================================

-- Option A: Remove ALL institution users (clean slate)
-- Uncomment the following lines if you want to remove ALL institution users:

/*
DELETE FROM utilisateurs 
WHERE role IN ('hospital', 'institution', 'pharmacy', 'laboratory');

SELECT 'CLEAN SLATE ROLLBACK COMPLETED' as status, 
       'All institution users removed' as message;
*/

-- Option B: Remove only problematic usernames
-- Uncomment the following lines if you want to remove only problematic entries:

/*
DELETE FROM utilisateurs 
WHERE role IN ('hospital', 'institution', 'pharmacy', 'laboratory')
AND (nom_utilisateur LIKE '%..%' OR nom_utilisateur LIKE '%.dr.%');

SELECT 'SELECTIVE ROLLBACK COMPLETED' as status, 
       'Only problematic usernames removed' as message;
*/

-- Option C: Remove specific institution users by role
-- Uncomment the following lines if you want to remove only institution role users:

/*
DELETE FROM utilisateurs 
WHERE role = 'institution';

SELECT 'INSTITUTION ROLE ROLLBACK COMPLETED' as status, 
       'All institution role users removed' as message;
*/

-- ========================================
-- VERIFICATION AFTER ROLLBACK
-- ========================================

-- Check what remains after rollback
SELECT 
    'REMAINING INSTITUTION USERS' as type,
    COUNT(*) as count,
    u.role
FROM utilisateurs u
WHERE u.role IN ('hospital', 'institution', 'pharmacy', 'laboratory')
GROUP BY u.role
ORDER BY u.role;

-- Check institutions without user accounts
SELECT 
    'INSTITUTIONS WITHOUT CREDENTIALS' as type,
    COUNT(*) as count,
    i.type_institution
FROM institutions i
WHERE i.type_institution IN ('hospital', 'institution', 'clinic', 'pharmacy', 'laboratory', 'clinique', 'centre médical', 'cabinet privé')
AND NOT EXISTS (
    SELECT 1 FROM utilisateurs u 
    WHERE (
        (i.type_institution = 'hospital' AND u.role = 'hospital' AND u.id_specifique_role = i.id) OR
        (i.type_institution IN ('institution', 'clinic', 'clinique', 'centre médical', 'cabinet privé') AND u.role = 'institution' AND u.id_specifique_role = i.id) OR
        (i.type_institution = 'pharmacy' AND u.role = 'pharmacy' AND u.id_specifique_role = i.id) OR
        (i.type_institution = 'laboratory' AND u.role = 'laboratory' AND u.id_specifique_role = i.id)
    )
)
GROUP BY i.type_institution
ORDER BY i.type_institution; 
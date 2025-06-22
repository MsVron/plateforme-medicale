-- DELETE ORPHANED PRIVATE CABINETS
-- SQL script to remove private cabinets (cabinets privés) that aren't associated with any doctor
-- Created for cleaning up orphaned institutions

-- ========================================
-- DIAGNOSTIC: IDENTIFY ORPHANED PRIVATE CABINETS
-- ========================================

-- Show current state before deletion
SELECT 'DIAGNOSTIC: Private cabinets without associated doctors' as info;

SELECT 
    i.id,
    i.nom,
    i.type,
    i.ville,
    i.medecin_proprietaire_id,
    CASE 
        WHEN i.medecin_proprietaire_id IS NULL THEN 'NO_OWNER'
        WHEN m.id IS NULL THEN 'INVALID_OWNER'
        ELSE 'HAS_VALID_OWNER'
    END as status
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé'
ORDER BY i.id;

-- Count orphaned private cabinets
SELECT 
    COUNT(*) as total_orphaned_cabinets
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- ========================================
-- SAFETY CHECK: RELATED DATA
-- ========================================

-- Check if orphaned cabinets have any related data that would prevent deletion
SELECT 'Checking for related data in orphaned private cabinets...' as info;

-- Check appointments in orphaned cabinets
SELECT 
    'Appointments in orphaned cabinets' as check_type,
    COUNT(*) as count
FROM rendez_vous rv
INNER JOIN institutions i ON rv.institution_id = i.id
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- Check doctor affiliations in orphaned cabinets
SELECT 
    'Doctor affiliations in orphaned cabinets' as check_type,
    COUNT(*) as count
FROM medecin_institution mi
INNER JOIN institutions i ON mi.institution_id = i.id
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- ========================================
-- DELETION COMMAND
-- ========================================

-- Delete orphaned private cabinets
-- Only deletes cabinets where:
-- 1. type = 'cabinet privé'
-- 2. medecin_proprietaire_id is NULL OR references a non-existent doctor

DELETE i FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- ========================================
-- VERIFICATION: AFTER DELETION
-- ========================================

-- Show remaining private cabinets after deletion
SELECT 'VERIFICATION: Remaining private cabinets after cleanup' as info;

SELECT 
    i.id,
    i.nom,
    i.ville,
    i.medecin_proprietaire_id,
    m.prenom,
    m.nom as medecin_nom
FROM institutions i
INNER JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé'
ORDER BY i.id;

-- Count remaining private cabinets
SELECT 
    COUNT(*) as remaining_private_cabinets
FROM institutions i
WHERE i.type = 'cabinet privé';

SELECT 'Cleanup completed successfully!' as status; 
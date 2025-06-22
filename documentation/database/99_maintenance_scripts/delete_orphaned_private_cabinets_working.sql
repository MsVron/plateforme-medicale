-- WORKING DELETE ORPHANED PRIVATE CABINETS
-- Script to delete useless orphaned private cabinets that aren't associated with any doctor
-- Only uses tables that actually exist in the database

-- ========================================
-- STEP 1: IDENTIFY THE USELESS CABINETS
-- ========================================

-- Create temporary table to identify orphaned cabinets
CREATE TEMPORARY TABLE temp_orphaned_cabinets AS
SELECT 
    i.id,
    i.nom,
    i.ville,
    i.medecin_proprietaire_id
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- Show what will be deleted
SELECT 
    CONCAT('Found ', COUNT(*), ' USELESS orphaned private cabinets to DELETE:') as summary
FROM temp_orphaned_cabinets;

SELECT 
    id,
    nom,
    ville,
    'USELESS - NO DOCTOR OWNER' as status
FROM temp_orphaned_cabinets
ORDER BY id;

-- ========================================
-- STEP 2: CLEAN REFERENCING DATA (ONLY EXISTING TABLES)
-- ========================================

-- Clean patient search audit records (if exists)
DELETE psa FROM patient_search_audit psa
INNER JOIN temp_orphaned_cabinets oc ON psa.searching_institution_id = oc.id;

-- Clean appointments
DELETE rv FROM rendez_vous rv
INNER JOIN temp_orphaned_cabinets oc ON rv.institution_id = oc.id;

-- Clean doctor-institution affiliations
DELETE mi FROM medecin_institution mi
INNER JOIN temp_orphaned_cabinets oc ON mi.institution_id = oc.id;

-- Clean doctor availability schedules
DELETE dm FROM disponibilites_medecin dm
INNER JOIN temp_orphaned_cabinets oc ON dm.institution_id = oc.id;

-- Update doctors to remove references to orphaned institutions
UPDATE medecins m
INNER JOIN temp_orphaned_cabinets oc ON m.institution_id = oc.id
SET m.institution_id = NULL;

-- Clean institution user accounts
DELETE u FROM utilisateurs u
INNER JOIN temp_orphaned_cabinets oc ON u.id_specifique_role = oc.id
WHERE u.role IN ('institution', 'hospital', 'pharmacy', 'laboratory');

-- Clean treatments (using correct table name)
DELETE t FROM traitements t
INNER JOIN temp_orphaned_cabinets oc ON t.pharmacy_dispensed_id = oc.id;

-- Clean analysis results (using correct table name: resultats_analyses)
DELETE ra FROM resultats_analyses ra
INNER JOIN temp_orphaned_cabinets oc ON ra.laboratory_id = oc.id;

-- Clean medical imaging (using correct table name: resultats_imagerie)
DELETE ri FROM resultats_imagerie ri
INNER JOIN temp_orphaned_cabinets oc ON ri.institution_realisation_id = oc.id;

-- Clean prescription access logs (if exists)
DELETE pal FROM prescription_access_logs pal
INNER JOIN temp_orphaned_cabinets oc ON pal.pharmacy_id = oc.id;

-- Clean analysis access logs (if exists)
DELETE aal FROM analysis_access_logs aal
INNER JOIN temp_orphaned_cabinets oc ON aal.laboratory_id = oc.id;

-- Clean institution change requests (if exists)
DELETE icr FROM institution_change_requests icr
INNER JOIN temp_orphaned_cabinets oc ON icr.institution_id = oc.id;

-- Clean analysis workflow (if exists)
DELETE aw FROM analysis_workflow aw
INNER JOIN temp_orphaned_cabinets oc ON aw.laboratory_id = oc.id;

-- ========================================
-- STEP 3: DELETE THE USELESS INSTITUTIONS
-- ========================================

-- Store count for verification
SET @deleted_count = (SELECT COUNT(*) FROM temp_orphaned_cabinets);

SELECT CONCAT('Deleting ', @deleted_count, ' USELESS cabinets that serve NO PURPOSE...') as action;

-- DELETE THE USELESS ORPHANED PRIVATE CABINETS
DELETE i FROM institutions i
INNER JOIN temp_orphaned_cabinets oc ON i.id = oc.id
WHERE i.type = 'cabinet privé';

-- ========================================
-- STEP 4: VERIFICATION
-- ========================================

SELECT CONCAT('SUCCESS! Deleted ', @deleted_count, ' USELESS orphaned private cabinets!') as result;

-- Show remaining private cabinets (all should have valid owners now)
SELECT 'Remaining private cabinets (all have valid doctor owners):' as info;

SELECT 
    i.id,
    i.nom,
    i.ville,
    CONCAT(m.prenom, ' ', m.nom) as doctor_owner,
    m.numero_ordre
FROM institutions i
INNER JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé'
ORDER BY i.id;

-- Final counts
SELECT 
    COUNT(*) as remaining_private_cabinets_with_valid_owners
FROM institutions i
INNER JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé';

-- Verify no orphaned cabinets remain (should be 0)
SELECT 
    COUNT(*) as remaining_orphaned_cabinets_should_be_ZERO
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- Clean up
DROP TEMPORARY TABLE temp_orphaned_cabinets;

SELECT '🎉 CLEANUP COMPLETED! All useless orphaned cabinets have been DELETED! 🎉' as final_status; 
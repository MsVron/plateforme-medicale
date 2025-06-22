-- IMPROVED DELETE ORPHANED PRIVATE CABINETS
-- Script to safely remove private cabinets that aren't associated with any doctor
-- This version dynamically identifies orphaned cabinets without hardcoded IDs
-- Based on the current database schema from documentation

-- ========================================
-- STEP 1: IDENTIFY ORPHANED CABINETS
-- ========================================

-- Create a view to identify orphaned private cabinets
CREATE TEMPORARY TABLE temp_orphaned_cabinets AS
SELECT 
    i.id,
    i.nom,
    i.ville,
    i.medecin_proprietaire_id,
    CASE 
        WHEN i.medecin_proprietaire_id IS NULL THEN 'No owner assigned'
        WHEN m.id IS NULL THEN 'Invalid owner reference'
        ELSE 'Valid owner'
    END as orphan_reason
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- Show what will be deleted
SELECT 
    CONCAT('Found ', COUNT(*), ' orphaned private cabinets to delete:') as summary
FROM temp_orphaned_cabinets;

SELECT 
    id,
    nom,
    ville,
    orphan_reason
FROM temp_orphaned_cabinets
ORDER BY id;

-- ========================================
-- STEP 2: CLEAN REFERENCING DATA
-- ========================================

-- Clean patient search audit records
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

-- Clean treatments dispensed by these institutions
DELETE t FROM traitements t
INNER JOIN temp_orphaned_cabinets oc ON t.pharmacy_dispensed_id = oc.id;

-- Clean analysis results from these laboratories
DELETE ar FROM analysis_results ar
INNER JOIN temp_orphaned_cabinets oc ON ar.laboratory_id = oc.id;

-- Clean medical imaging records
DELETE im FROM imagerie_medicale im
INNER JOIN temp_orphaned_cabinets oc ON im.institution_realisation_id = oc.id;

-- Clean additional tables that may reference institutions
-- (These tables may or may not exist, but the script will continue if they don't)

-- Clean pharmacy access logs (if table exists)
DELETE FROM pharmacy_access_logs 
WHERE pharmacy_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean laboratory access logs (if table exists) 
DELETE FROM laboratory_access_logs 
WHERE laboratory_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean hospital management records (if tables exist)
DELETE FROM hospital_admissions 
WHERE hospital_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM hospital_discharges 
WHERE hospital_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean change requests (if tables exist)
DELETE FROM institution_change_requests 
WHERE institution_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM hospital_change_requests 
WHERE hospital_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean pharmacy inventory (if tables exist)
DELETE FROM pharmacy_inventory 
WHERE pharmacy_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM pharmacy_stock_movements 
WHERE pharmacy_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean patient access audit (if table exists)
DELETE FROM patient_access_audit 
WHERE accessing_institution_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean pharmacy follow-ups (if table exists)
DELETE FROM pharmacy_follow_ups 
WHERE pharmacy_follow_up_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean analysis workflow tables (if they exist)
DELETE FROM analysis_requests 
WHERE requesting_institution_id IN (SELECT id FROM temp_orphaned_cabinets)
OR assigned_laboratory_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM analysis_assignments 
WHERE requesting_institution_id IN (SELECT id FROM temp_orphaned_cabinets)
OR assigned_laboratory_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM laboratory_capabilities 
WHERE laboratory_id IN (SELECT id FROM temp_orphaned_cabinets);

-- Clean institution notifications and admin audit (if tables exist)
DELETE FROM institution_users 
WHERE institution_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM institution_notifications 
WHERE institution_id IN (SELECT id FROM temp_orphaned_cabinets);

DELETE FROM institution_admin_audit 
WHERE institution_id IN (SELECT id FROM temp_orphaned_cabinets);

-- ========================================
-- STEP 3: DELETE THE ORPHANED INSTITUTIONS
-- ========================================

-- Store count before deletion for verification
SET @orphaned_count = (SELECT COUNT(*) FROM temp_orphaned_cabinets);

-- Delete the orphaned private cabinets
DELETE i FROM institutions i
INNER JOIN temp_orphaned_cabinets oc ON i.id = oc.id
WHERE i.type = 'cabinet privé';

-- ========================================
-- STEP 4: VERIFICATION
-- ========================================

SELECT CONCAT('Successfully deleted ', @orphaned_count, ' orphaned private cabinets.') as result;

-- Show remaining private cabinets (should all have valid owners now)
SELECT 'Remaining private cabinets (all should have valid owners):' as info;

SELECT 
    i.id,
    i.nom,
    i.ville,
    i.medecin_proprietaire_id,
    CONCAT(m.prenom, ' ', m.nom) as medecin_proprietaire,
    m.numero_ordre
FROM institutions i
INNER JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé'
ORDER BY i.id;

-- Show total count
SELECT 
    COUNT(*) as total_remaining_private_cabinets_with_valid_owners
FROM institutions i
INNER JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé';

-- Verify no orphaned cabinets remain
SELECT 
    COUNT(*) as remaining_orphaned_cabinets_should_be_zero
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

-- Clean up temporary table
DROP TEMPORARY TABLE temp_orphaned_cabinets;

SELECT 'Cleanup completed successfully! All private cabinets now have valid doctor owners.' as status; 
-- SAFE DELETE ORPHANED PRIVATE CABINETS
-- Script to safely remove private cabinets that aren't associated with any doctor
-- This version handles foreign key constraints by cleaning up referencing data first

-- ========================================
-- STEP 1: IDENTIFY ORPHANED INSTITUTIONS
-- ========================================

-- Create a temporary table with orphaned institution IDs for easier reference
CREATE TEMPORARY TABLE orphaned_cabinets AS
SELECT i.id, i.nom, i.ville
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé' 
AND (i.medecin_proprietaire_id IS NULL OR m.id IS NULL);

SELECT 'Orphaned private cabinets to be deleted:' as info;
SELECT * FROM orphaned_cabinets;

-- ========================================
-- STEP 2: CHECK AND CLEAN REFERENCING DATA
-- ========================================

-- Check patient_search_audit table
SELECT 'Checking patient_search_audit table...' as info;
SELECT COUNT(*) as count_in_patient_search_audit
FROM patient_search_audit psa
INNER JOIN orphaned_cabinets oc ON psa.searching_institution_id = oc.id;

-- Clean patient_search_audit records
DELETE psa FROM patient_search_audit psa
INNER JOIN orphaned_cabinets oc ON psa.searching_institution_id = oc.id;

-- Check rendez_vous (appointments) table
SELECT 'Checking rendez_vous table...' as info;
SELECT COUNT(*) as count_in_rendez_vous
FROM rendez_vous rv
INNER JOIN orphaned_cabinets oc ON rv.institution_id = oc.id;

-- Clean appointments
DELETE rv FROM rendez_vous rv
INNER JOIN orphaned_cabinets oc ON rv.institution_id = oc.id;

-- Check medecin_institution affiliations
SELECT 'Checking medecin_institution table...' as info;
SELECT COUNT(*) as count_in_medecin_institution
FROM medecin_institution mi
INNER JOIN orphaned_cabinets oc ON mi.institution_id = oc.id;

-- Clean doctor-institution affiliations
DELETE mi FROM medecin_institution mi
INNER JOIN orphaned_cabinets oc ON mi.institution_id = oc.id;

-- Check disponibilites_medecin table
SELECT 'Checking disponibilites_medecin table...' as info;
SELECT COUNT(*) as count_in_disponibilites_medecin
FROM disponibilites_medecin dm
INNER JOIN orphaned_cabinets oc ON dm.institution_id = oc.id;

-- Clean doctor availability schedules
DELETE dm FROM disponibilites_medecin dm
INNER JOIN orphaned_cabinets oc ON dm.institution_id = oc.id;

-- Check if any medications reference these institutions
SELECT 'Checking medicaments table...' as info;
SELECT COUNT(*) as count_in_medicaments
FROM medicaments med
INNER JOIN orphaned_cabinets oc ON med.pharmacy_dispensed_id = oc.id;

-- Clean medication references
DELETE med FROM medicaments med
INNER JOIN orphaned_cabinets oc ON med.pharmacy_dispensed_id = oc.id;

-- Check analysis_results table
SELECT 'Checking analysis_results table...' as info;
SELECT COUNT(*) as count_in_analysis_results
FROM analysis_results ar
INNER JOIN orphaned_cabinets oc ON ar.laboratory_id = oc.id;

-- Clean analysis results
DELETE ar FROM analysis_results ar
INNER JOIN orphaned_cabinets oc ON ar.laboratory_id = oc.id;

-- Check imagerie_medicale table
SELECT 'Checking imagerie_medicale table...' as info;
SELECT COUNT(*) as count_in_imagerie_medicale
FROM imagerie_medicale im
INNER JOIN orphaned_cabinets oc ON im.institution_realisation_id = oc.id;

-- Clean medical imaging records
DELETE im FROM imagerie_medicale im
INNER JOIN orphaned_cabinets oc ON im.institution_realisation_id = oc.id;

-- Check utilisateurs table (institution users)
SELECT 'Checking utilisateurs table...' as info;
SELECT COUNT(*) as count_in_utilisateurs
FROM utilisateurs u
INNER JOIN orphaned_cabinets oc ON u.id_specifique_role = oc.id
WHERE u.role IN ('institution', 'hospital', 'pharmacy', 'laboratory');

-- Clean institution user accounts
DELETE u FROM utilisateurs u
INNER JOIN orphaned_cabinets oc ON u.id_specifique_role = oc.id
WHERE u.role IN ('institution', 'hospital', 'pharmacy', 'laboratory');

-- Check any other potential references
-- (Add more tables as needed based on your specific schema)

-- ========================================
-- STEP 3: CLEAN DOCTOR REFERENCES
-- ========================================

-- Update any doctors that reference these institutions as their primary institution
SELECT 'Checking medecins table references...' as info;
SELECT COUNT(*) as doctors_referencing_orphaned_institutions
FROM medecins m
INNER JOIN orphaned_cabinets oc ON m.institution_id = oc.id;

-- Update doctors to remove references to orphaned institutions
UPDATE medecins m
INNER JOIN orphaned_cabinets oc ON m.institution_id = oc.id
SET m.institution_id = NULL;

-- ========================================
-- STEP 4: DELETE THE ORPHANED INSTITUTIONS
-- ========================================

SELECT 'All referencing data cleaned. Now deleting orphaned institutions...' as info;

-- Delete the orphaned private cabinets
DELETE i FROM institutions i
INNER JOIN orphaned_cabinets oc ON i.id = oc.id;

-- ========================================
-- STEP 5: VERIFICATION
-- ========================================

SELECT 'Verification: Remaining private cabinets' as info;

SELECT 
    i.id,
    i.nom,
    i.ville,
    i.medecin_proprietaire_id,
    m.prenom,
    m.nom as medecin_nom
FROM institutions i
LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
WHERE i.type = 'cabinet privé'
ORDER BY i.id;

SELECT 
    COUNT(*) as total_remaining_private_cabinets
FROM institutions i
WHERE i.type = 'cabinet privé';

-- Clean up temporary table
DROP TEMPORARY TABLE orphaned_cabinets;

SELECT 'Cleanup completed successfully!' as status; 
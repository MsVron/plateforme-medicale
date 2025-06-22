-- CORRECTED DELETE ORPHANED PRIVATE CABINETS
-- Script based on actual database schema from documentation
-- Targets orphaned cabinet IDs: 11-35

-- ========================================
-- STEP 1: CLEAN REFERENCING DATA (CORRECTED)
-- ========================================

-- Clean patient_search_audit records (we know there are 8)
DELETE FROM patient_search_audit 
WHERE searching_institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean appointments (should be 0 based on previous check)
DELETE FROM rendez_vous 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean doctor-institution affiliations (should be 0 based on previous check)
DELETE FROM medecin_institution 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean doctor availability schedules (should be 0 based on previous check)
DELETE FROM disponibilites_medecin 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Update doctors to remove references to orphaned institutions (should be 0 based on previous check)
UPDATE medecins 
SET institution_id = NULL
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean institution user accounts (should be 0 based on previous check)
DELETE FROM utilisateurs 
WHERE role IN ('institution', 'hospital', 'pharmacy', 'laboratory')
AND id_specifique_role IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- ========================================
-- CORRECTED: Clean actual tables that reference institutions
-- ========================================

-- Clean treatments that were dispensed by these institutions
DELETE FROM traitements 
WHERE pharmacy_dispensed_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean analysis results from these laboratories
DELETE FROM analysis_results 
WHERE laboratory_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean medical imaging records
DELETE FROM imagerie_medicale 
WHERE institution_realisation_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean pharmacy access logs (if table exists)
DELETE FROM pharmacy_access_logs 
WHERE pharmacy_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean laboratory access logs (if table exists)
DELETE FROM laboratory_access_logs 
WHERE laboratory_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean hospital management records (if table exists)
DELETE FROM hospital_admissions 
WHERE hospital_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM hospital_discharges 
WHERE hospital_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean change requests (if table exists)
DELETE FROM institution_change_requests 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM hospital_change_requests 
WHERE hospital_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean pharmacy enhancements (if tables exist)
DELETE FROM pharmacy_inventory 
WHERE pharmacy_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM pharmacy_stock_movements 
WHERE pharmacy_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean patient access audit (if table exists)
DELETE FROM patient_access_audit 
WHERE accessing_institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean pharmacy follow-ups (if table exists) 
DELETE FROM pharmacy_follow_ups 
WHERE pharmacy_follow_up_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean analysis workflow tables (if they exist)
DELETE FROM analysis_requests 
WHERE requesting_institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35)
OR assigned_laboratory_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM analysis_assignments 
WHERE requesting_institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35)
OR assigned_laboratory_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM laboratory_capabilities 
WHERE laboratory_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- Clean institution users and notifications (if tables exist)
DELETE FROM institution_users 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM institution_notifications 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

DELETE FROM institution_admin_audit 
WHERE institution_id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35);

-- ========================================
-- STEP 2: DELETE THE ORPHANED INSTITUTIONS
-- ========================================

SELECT 'All referencing data cleaned. Now deleting orphaned institutions...' as info;

-- Delete the orphaned private cabinets
DELETE FROM institutions 
WHERE id IN (11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35)
AND type = 'cabinet privé';

-- ========================================
-- STEP 3: VERIFICATION
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

SELECT 'Cleanup completed successfully!' as status; 
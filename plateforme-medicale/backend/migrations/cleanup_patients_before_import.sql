-- ========================================
-- COMPREHENSIVE PATIENT DATA CLEANUP SCRIPT
-- ========================================
-- This script completely removes ALL existing patient data from the database
-- Run this BEFORE importing populate_moroccan_patients.sql
-- 
-- ⚠️  WARNING: This will delete ALL patient data permanently!
-- ⚠️  Make sure you have a backup if you need to preserve any existing data!

-- Disable foreign key checks temporarily to avoid constraint issues
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- STEP 1: Clear all patient-related data (in dependency order)
-- ========================================

-- Clear AI diagnosis data (if tables exist)
DELETE FROM diagnosis_feedback WHERE patient_id IS NOT NULL;
DELETE FROM diagnosis_suggestions WHERE patient_id IS NOT NULL;

-- Clear access logs (correct table names)
DELETE FROM prescription_access_logs WHERE patient_id IS NOT NULL;
DELETE FROM analysis_access_logs WHERE patient_id IS NOT NULL;

-- Clear patient care data
DELETE FROM rappels_suivi WHERE patient_id IS NOT NULL;
DELETE FROM mesures_patient WHERE patient_id IS NOT NULL;
DELETE FROM notes_patient WHERE patient_id IS NOT NULL;

-- Clear institutional management data
DELETE FROM hospital_assignments WHERE patient_id IS NOT NULL;

-- Clear notifications and documents
DELETE FROM documents_medicaux WHERE patient_id IS NOT NULL;

-- Clear medical analysis results
DELETE FROM resultats_analyses WHERE patient_id IS NOT NULL;
DELETE FROM resultats_imagerie WHERE patient_id IS NOT NULL;

-- Clear consultation and appointment data
DELETE FROM constantes_vitales WHERE patient_id IS NOT NULL;
DELETE FROM consultations WHERE patient_id IS NOT NULL;
DELETE FROM rendez_vous WHERE patient_id IS NOT NULL;

-- Clear medication data
DELETE FROM traitements WHERE patient_id IS NOT NULL;

-- Clear medical history and allergies
DELETE FROM patient_allergies WHERE patient_id IS NOT NULL;
DELETE FROM antecedents_medicaux WHERE patient_id IS NOT NULL;

-- Clear patient favorites and evaluations
DELETE FROM favoris_medecins WHERE patient_id IS NOT NULL;
DELETE FROM evaluations_medecins WHERE patient_id IS NOT NULL;

-- Clear patient verification records
DELETE FROM verification_patients WHERE patient_id IS NOT NULL;

-- Clear patient user accounts
DELETE FROM utilisateurs WHERE role = 'patient';

-- Finally, clear patients table
DELETE FROM patients;

-- ========================================
-- STEP 2: Clear any orphaned data that might reference patients
-- ========================================

-- Clear any audit logs that might reference patient operations
DELETE FROM audit_logs WHERE entity_type = 'patients' OR entity_type LIKE '%patient%';
DELETE FROM historique_actions WHERE table_concernee = 'patients' OR table_concernee LIKE '%patient%';

-- Clear any notifications that might be patient-related (notifications table uses utilisateur_id, not patient_id)
-- We'll clear these when we delete patient user accounts above

-- ========================================
-- STEP 3: Reset auto-increment counters
-- ========================================

-- Reset auto-increment for patients table
ALTER TABLE patients AUTO_INCREMENT = 1;

-- Reset auto-increment for verification_patients table
ALTER TABLE verification_patients AUTO_INCREMENT = 1;

-- Reset auto-increment for patient_allergies (if it has an auto-increment column)
-- Note: This table uses composite primary key, so no auto-increment to reset

-- Reset other patient-related tables
ALTER TABLE notes_patient AUTO_INCREMENT = 1;
ALTER TABLE rappels_suivi AUTO_INCREMENT = 1;
ALTER TABLE mesures_patient AUTO_INCREMENT = 1;
ALTER TABLE favoris_medecins AUTO_INCREMENT = 1;
ALTER TABLE evaluations_medecins AUTO_INCREMENT = 1;
ALTER TABLE antecedents_medicaux AUTO_INCREMENT = 1;

-- Reset diagnosis tables if they exist
ALTER TABLE diagnosis_suggestions AUTO_INCREMENT = 1;
ALTER TABLE diagnosis_feedback AUTO_INCREMENT = 1;

-- Reset access log tables
ALTER TABLE prescription_access_logs AUTO_INCREMENT = 1;
ALTER TABLE analysis_access_logs AUTO_INCREMENT = 1;

-- Reset other tables
ALTER TABLE documents_medicaux AUTO_INCREMENT = 1;

-- ========================================
-- STEP 4: Re-enable foreign key checks
-- ========================================

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- STEP 5: COMPREHENSIVE VERIFICATION QUERIES
-- ========================================
-- Run these to verify cleanup was completely successful

SELECT '=== CLEANUP VERIFICATION ===' as section;

-- Core patient data
SELECT 'Patients remaining:' as check_type, COUNT(*) as count FROM patients;
SELECT 'Patient users remaining:' as check_type, COUNT(*) as count FROM utilisateurs WHERE role = 'patient';
SELECT 'Verification tokens remaining:' as check_type, COUNT(*) as count FROM verification_patients;

-- Medical data
SELECT 'Patient allergies remaining:' as check_type, COUNT(*) as count FROM patient_allergies;
SELECT 'Patient antecedents remaining:' as check_type, COUNT(*) as count FROM antecedents_medicaux;
SELECT 'Patient notes remaining:' as check_type, COUNT(*) as count FROM notes_patient;
SELECT 'Patient measurements remaining:' as check_type, COUNT(*) as count FROM mesures_patient;
SELECT 'Patient reminders remaining:' as check_type, COUNT(*) as count FROM rappels_suivi;

-- Appointments and consultations
SELECT 'Patient appointments remaining:' as check_type, COUNT(*) as count FROM rendez_vous WHERE patient_id IS NOT NULL;
SELECT 'Patient consultations remaining:' as check_type, COUNT(*) as count FROM consultations WHERE patient_id IS NOT NULL;
SELECT 'Patient vital signs remaining:' as check_type, COUNT(*) as count FROM constantes_vitales WHERE patient_id IS NOT NULL;

-- Medical analysis
SELECT 'Patient analysis results remaining:' as check_type, COUNT(*) as count FROM resultats_analyses WHERE patient_id IS NOT NULL;
SELECT 'Patient imaging results remaining:' as check_type, COUNT(*) as count FROM resultats_imagerie WHERE patient_id IS NOT NULL;

-- Medications
SELECT 'Patient treatments remaining:' as check_type, COUNT(*) as count FROM traitements WHERE patient_id IS NOT NULL;

-- Patient relationships
SELECT 'Patient favorites remaining:' as check_type, COUNT(*) as count FROM favoris_medecins;
SELECT 'Patient evaluations remaining:' as check_type, COUNT(*) as count FROM evaluations_medecins;

-- Institutional data
SELECT 'Hospital assignments remaining:' as check_type, COUNT(*) as count FROM hospital_assignments WHERE patient_id IS NOT NULL;

-- Documents
SELECT 'Patient documents remaining:' as check_type, COUNT(*) as count FROM documents_medicaux WHERE patient_id IS NOT NULL;

-- Access logs (correct table names)
SELECT 'Patient prescription access logs remaining:' as check_type, COUNT(*) as count FROM prescription_access_logs WHERE patient_id IS NOT NULL;
SELECT 'Patient analysis access logs remaining:' as check_type, COUNT(*) as count FROM analysis_access_logs WHERE patient_id IS NOT NULL;

-- AI diagnosis data (if tables exist)
SELECT 'Patient diagnosis suggestions remaining:' as check_type, COUNT(*) as count FROM diagnosis_suggestions WHERE patient_id IS NOT NULL;
SELECT 'Patient diagnosis feedback remaining:' as check_type, COUNT(*) as count FROM diagnosis_feedback WHERE patient_id IS NOT NULL;

-- ========================================
-- STEP 6: FINAL STATUS CHECK
-- ========================================

SELECT '=== CLEANUP STATUS ===' as section;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM patients) = 0 
        AND (SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient') = 0
        AND (SELECT COUNT(*) FROM verification_patients) = 0
        AND (SELECT COUNT(*) FROM patient_allergies) = 0
        AND (SELECT COUNT(*) FROM antecedents_medicaux) = 0
        AND (SELECT COUNT(*) FROM notes_patient) = 0
        THEN '✅ CLEANUP SUCCESSFUL - All patient data removed'
        ELSE '❌ CLEANUP INCOMPLETE - Check verification results above'
    END as cleanup_status;

-- ========================================
-- INSTRUCTIONS FOR NEXT STEPS
-- ========================================

SELECT '=== NEXT STEPS ===' as section;
SELECT '1. Verify all counts above show 0' as step_1;
SELECT '2. Run populate_moroccan_patients.sql' as step_2;
SELECT '3. Run populate_patient_medical_records.sql' as step_3;
SELECT '4. Run fix_patient_accounts_verification.sql' as step_4;
SELECT '5. Run verify_patient_data.sql to confirm success' as step_5;

-- Commit all changes
COMMIT; 
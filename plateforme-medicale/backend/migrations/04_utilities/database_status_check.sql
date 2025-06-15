-- ========================================
-- DATABASE STATUS CHECK SCRIPT
-- ========================================
-- This script provides a comprehensive overview of your database status
-- Run this to understand what data exists and identify any issues

-- ========================================
-- SECTION 1: BASIC TABLE COUNTS
-- ========================================
SELECT 'DATABASE OVERVIEW' as section;

SELECT 'BASIC TABLE COUNTS' as subsection;

SELECT 
    'patients' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN CNE LIKE 'CN%' THEN 1 END) as moroccan_patients,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as patients_with_email
FROM patients;

SELECT 
    'medecins' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_doctors
FROM medecins;

SELECT 
    'utilisateurs' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN role = 'patient' THEN 1 END) as patient_users,
    COUNT(CASE WHEN role = 'medecin' THEN 1 END) as doctor_users,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_users
FROM utilisateurs;

SELECT 
    'verification_patients' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_tokens
FROM verification_patients;

SELECT 
    'specialites' as table_name,
    COUNT(*) as total_records
FROM specialites;

SELECT 
    'allergies' as table_name,
    COUNT(*) as total_records
FROM allergies;

-- ========================================
-- SECTION 2: PATIENT ANALYSIS
-- ========================================
SELECT 'PATIENT ANALYSIS' as subsection;

-- Patient demographics
SELECT 
    'PATIENT DEMOGRAPHICS' as metric,
    COUNT(*) as total_patients,
    COUNT(CASE WHEN sexe = 'M' THEN 1 END) as male_patients,
    COUNT(CASE WHEN sexe = 'F' THEN 1 END) as female_patients,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) < 18 THEN 1 END) as minors,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) >= 65 THEN 1 END) as seniors
FROM patients 
WHERE CNE LIKE 'CN%';

-- Patient cities distribution
SELECT 
    'PATIENT CITIES' as metric,
    ville,
    COUNT(*) as patient_count
FROM patients 
WHERE CNE LIKE 'CN%'
GROUP BY ville
ORDER BY patient_count DESC;

-- Patients with complete profiles
SELECT 
    'PROFILE COMPLETION' as metric,
    COUNT(CASE WHEN est_profil_complete = TRUE THEN 1 END) as complete_profiles,
    COUNT(CASE WHEN est_profil_complete = FALSE THEN 1 END) as incomplete_profiles,
    COUNT(*) as total_patients
FROM patients 
WHERE CNE LIKE 'CN%';

-- ========================================
-- SECTION 3: DOCTOR ANALYSIS
-- ========================================
SELECT 'DOCTOR ANALYSIS' as subsection;

-- Doctors by specialty
SELECT 
    'DOCTORS BY SPECIALTY' as metric,
    s.nom as specialty,
    COUNT(m.id) as doctor_count
FROM specialites s
LEFT JOIN medecins m ON m.specialite_id = s.id
GROUP BY s.id, s.nom
ORDER BY doctor_count DESC;

-- Active doctors
SELECT 
    'DOCTOR STATUS' as metric,
    COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_doctors,
    COUNT(CASE WHEN est_actif = FALSE THEN 1 END) as inactive_doctors,
    COUNT(*) as total_doctors
FROM medecins;

-- ========================================
-- SECTION 4: USER ACCOUNT ANALYSIS
-- ========================================
SELECT 'USER ACCOUNT ANALYSIS' as subsection;

-- User accounts by role
SELECT 
    'USERS BY ROLE' as metric,
    role,
    COUNT(*) as user_count,
    COUNT(CASE WHEN est_verifie = TRUE THEN 1 END) as verified_count,
    COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_count
FROM utilisateurs
GROUP BY role
ORDER BY user_count DESC;

-- Patient user account status
SELECT 
    'PATIENT USER ACCOUNTS' as metric,
    COUNT(DISTINCT p.id) as total_patients,
    COUNT(DISTINCT u.id) as patients_with_accounts,
    COUNT(DISTINCT CASE WHEN u.est_verifie = TRUE THEN u.id END) as verified_patient_accounts
FROM patients p
LEFT JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id
WHERE p.CNE LIKE 'CN%';

-- ========================================
-- SECTION 5: MEDICAL DATA ANALYSIS
-- ========================================
SELECT 'MEDICAL DATA ANALYSIS' as subsection;

-- Patient allergies
SELECT 
    'PATIENT ALLERGIES' as metric,
    COUNT(DISTINCT patient_id) as patients_with_allergies,
    COUNT(*) as total_allergy_records
FROM patient_allergies pa
INNER JOIN patients p ON pa.patient_id = p.id
WHERE p.CNE LIKE 'CN%';

-- Medical antecedents
SELECT 
    'MEDICAL ANTECEDENTS' as metric,
    COUNT(DISTINCT patient_id) as patients_with_antecedents,
    COUNT(*) as total_antecedent_records
FROM antecedents_medicaux am
INNER JOIN patients p ON am.patient_id = p.id
WHERE p.CNE LIKE 'CN%';

-- Patient notes
SELECT 
    'PATIENT NOTES' as metric,
    COUNT(DISTINCT patient_id) as patients_with_notes,
    COUNT(*) as total_notes
FROM notes_patient np
INNER JOIN patients p ON np.patient_id = p.id
WHERE p.CNE LIKE 'CN%';

-- ========================================
-- SECTION 6: FOREIGN KEY INTEGRITY CHECK
-- ========================================
SELECT 'FOREIGN KEY INTEGRITY CHECK' as subsection;

-- Check for patients without user accounts
SELECT 
    'PATIENTS WITHOUT USER ACCOUNTS' as issue_type,
    COUNT(*) as count
FROM patients p
LEFT JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id
WHERE p.CNE LIKE 'CN%' AND u.id IS NULL;

-- Check for patients without verification tokens
SELECT 
    'PATIENTS WITHOUT VERIFICATION TOKENS' as issue_type,
    COUNT(*) as count
FROM patients p
LEFT JOIN verification_patients vp ON vp.patient_id = p.id
WHERE p.CNE LIKE 'CN%' AND vp.id IS NULL;

-- Check for patients without treating doctors
SELECT 
    'PATIENTS WITHOUT TREATING DOCTORS' as issue_type,
    COUNT(*) as count
FROM patients p
WHERE p.CNE LIKE 'CN%' AND p.medecin_traitant_id IS NULL;

-- Check for orphaned user accounts
SELECT 
    'ORPHANED PATIENT USER ACCOUNTS' as issue_type,
    COUNT(*) as count
FROM utilisateurs u
LEFT JOIN patients p ON u.role = 'patient' AND u.id_specifique_role = p.id
WHERE u.role = 'patient' AND p.id IS NULL;

-- Check for orphaned verification tokens
SELECT 
    'ORPHANED VERIFICATION TOKENS' as issue_type,
    COUNT(*) as count
FROM verification_patients vp
LEFT JOIN patients p ON vp.patient_id = p.id
WHERE p.id IS NULL;

-- ========================================
-- SECTION 7: SAMPLE DATA PREVIEW
-- ========================================
SELECT 'SAMPLE DATA PREVIEW' as subsection;

-- Sample patients
SELECT 
    'SAMPLE PATIENTS' as data_type,
    CNE, prenom, nom, ville, email, est_profil_complete
FROM patients 
WHERE CNE LIKE 'CN%'
ORDER BY id
LIMIT 5;

-- Sample doctors
SELECT 
    'SAMPLE DOCTORS' as data_type,
    m.prenom, m.nom, s.nom as specialite, m.est_actif
FROM medecins m
LEFT JOIN specialites s ON m.specialite_id = s.id
ORDER BY m.id
LIMIT 5;

-- Sample user accounts
SELECT 
    'SAMPLE USER ACCOUNTS' as data_type,
    nom_utilisateur, email, role, est_verifie, est_actif
FROM utilisateurs
ORDER BY id
LIMIT 5;

-- ========================================
-- SECTION 8: RECOMMENDATIONS
-- ========================================
SELECT 'RECOMMENDATIONS' as subsection;

SELECT 
    'NEXT STEPS' as recommendation_type,
    CASE 
        WHEN (SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%') = 0 
        THEN 'Import populate_moroccan_patients.sql first'
        WHEN (SELECT COUNT(*) FROM medecins) = 0 
        THEN 'Import populate_moroccan_doctors.sql next'
        WHEN (SELECT COUNT(*) FROM patients p LEFT JOIN utilisateurs u ON u.role = "patient" AND u.id_specifique_role = p.id WHERE p.CNE LIKE "CN%" AND u.id IS NULL) > 0
        THEN 'Run fix_patient_accounts_verification_updated.sql to create user accounts'
        WHEN (SELECT COUNT(*) FROM patient_allergies pa INNER JOIN patients p ON pa.patient_id = p.id WHERE p.CNE LIKE "CN%") = 0
        THEN 'Import populate_patient_medical_records_fixed.sql for medical data'
        ELSE 'Database appears to be properly set up!'
    END as recommendation;

-- ========================================
-- COMPLETION
-- ========================================
SELECT 'DATABASE STATUS CHECK COMPLETED' as completion_status; 
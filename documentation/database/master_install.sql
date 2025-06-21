-- MEDICAL PLATFORM DATABASE - MASTER INSTALLATION SCRIPT
-- This script creates the complete medical platform database structure
-- Execute this file to set up the entire database

-- Disable foreign key checks temporarily for installation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. CORE TABLES
SOURCE sql_structure/01_core_tables/01_authentication.sql;
SOURCE sql_structure/01_core_tables/02_institutions_specialties.sql;
SOURCE sql_structure/01_core_tables/03_doctors.sql;
SOURCE sql_structure/01_core_tables/04_patients.sql;
SOURCE sql_structure/01_core_tables/05_institution_users.sql;

-- 2. MEDICAL DATA
SOURCE sql_structure/02_medical_data/01_allergies_antecedents.sql;
SOURCE sql_structure/02_medical_data/02_medications.sql;
SOURCE sql_structure/02_medical_data/03_pharmacy_enhancements.sql;

-- 3. APPOINTMENTS AND CONSULTATIONS
SOURCE sql_structure/03_appointments_consultations/01_appointments.sql;
SOURCE sql_structure/03_appointments_consultations/02_consultations.sql;

-- 4. MEDICAL ANALYSIS
SOURCE sql_structure/04_medical_analysis/01_analysis_categories.sql;
SOURCE sql_structure/04_medical_analysis/02_analysis_results.sql;
SOURCE sql_structure/04_medical_analysis/03_imaging.sql;
SOURCE sql_structure/04_medical_analysis/04_laboratory_enhancements.sql;
SOURCE sql_structure/04_medical_analysis/05_analysis_workflow_fix.sql;

-- 5. SYSTEM MANAGEMENT
SOURCE sql_structure/05_system_management/01_notifications.sql;
SOURCE sql_structure/05_system_management/02_audit_logs.sql;

-- 6. PATIENT CARE
SOURCE sql_structure/06_patient_care/01_notes_reminders.sql;
SOURCE sql_structure/06_patient_care/02_hospital_management.sql;

-- 7. INSTITUTIONAL MANAGEMENT
SOURCE sql_structure/07_institutional_management/01_change_requests.sql;

-- 8. ACCESS TRACKING
SOURCE sql_structure/08_access_tracking/01_access_logs.sql;

-- 9. DATA INITIALIZATION
SOURCE sql_structure/09_data_initialization/01_analysis_categories_data.sql;
SOURCE sql_structure/09_data_initialization/02_hematology_analysis.sql;
SOURCE sql_structure/09_data_initialization/03_biochemistry_analysis.sql;
SOURCE sql_structure/09_data_initialization/04_other_analysis_types.sql;
SOURCE sql_structure/09_data_initialization/05_sample_data.sql;

-- 10. FOREIGN KEYS AND CONSTRAINTS
SOURCE sql_structure/10_foreign_keys_constraints/01_foreign_key_setup.sql;

-- 11. VIEWS AND TRIGGERS
SOURCE sql_structure/11_views_triggers/01_views.sql;
SOURCE sql_structure/11_views_triggers/02_triggers.sql;

-- 12. MEDICAL RECORD COMPLETENESS
SOURCE sql_structure/12_medical_record_completeness/01_medical_record_views.sql;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Display completion message
SELECT 'Medical Platform Database Installation Complete!' as 'Status';
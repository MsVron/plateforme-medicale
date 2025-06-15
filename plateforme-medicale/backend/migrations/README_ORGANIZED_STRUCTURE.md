# Migrations Folder - Organized Structure

This folder has been reorganized for better maintainability and clarity. All migration files are now categorized into logical subdirectories.

## 📁 Directory Structure

### 01_database_structure/
Contains all files related to database schema modifications and structural changes:
- `improve_database_structure.sql` - Main database structure improvements
- `add_*.sql` - Files that add new columns, tables, or constraints
- `complete_resultats_migration.sql` - Results table migration completion
- `fix_missing_column.sql` - Column fixes
- `remove_teleconsultation_complete.sql` - Teleconsultation removal

### 02_core_data/
Contains the essential data population files that form the foundation of the system:
- `populate_moroccan_doctors.sql` - 50 Moroccan doctors across specialties
- `populate_moroccan_patients.sql` - 50 Moroccan patients with realistic data
- `populate_patient_medical_records_fixed.sql` - Basic medical records (allergies, antecedents)
- `populate_analysis_types.sql` - Medical analysis types and categories

### 03_enhanced_medical_records/
Contains advanced medical data that builds upon the core data:
- `populate_past_treatments.sql` - Historical treatments and medications
- `populate_weight_height_history.sql` - Growth curves and weight management data
- `populate_medical_notes.sql` - Detailed clinical observations and notes
- `populate_appointments.sql` - Past and future appointment records

### 04_utilities/
Contains maintenance, verification, and utility scripts:
- `cleanup_patients_before_import.sql` - Data cleanup utilities
- `database_status_check.sql` - Database integrity verification
- `fix_*.sql` - Various database fixes and corrections
- `verify_patient_data.sql` - Data validation scripts
- `run_all_migrations.sql` - Batch execution script

### 05_documentation/
Contains all documentation and reference files:
- `README_Enhanced_Medical_Records.md` - Enhanced medical records guide
- `MIGRATION_ORDER.md` - Import order and instructions
- Other documentation files

## 🚀 Import Order

Follow this order when importing via phpMyAdmin:

### Phase 1: Database Structure (01_database_structure/)
1. `improve_database_structure.sql`
2. `add_*.sql` files (in any order)
3. `complete_resultats_migration.sql`
4. Other structure files as needed

### Phase 2: Core Data (02_core_data/)
1. `populate_moroccan_doctors.sql`
2. `populate_moroccan_patients.sql`
3. `populate_patient_medical_records_fixed.sql`
4. `populate_analysis_types.sql`

### Phase 3: Enhanced Medical Records (03_enhanced_medical_records/)
1. `populate_past_treatments.sql`
2. `populate_weight_height_history.sql`
3. `populate_medical_notes.sql`
4. `populate_appointments.sql`

### Phase 4: Utilities (04_utilities/) - Optional
Run these as needed for maintenance or verification.

## 📊 Data Overview

After completing all imports, you will have:
- **50 Doctors** across all medical specialties
- **50 Patients** with comprehensive medical histories
- **40+ Medications** covering all therapeutic classes
- **25+ Treatment Records** for chronic conditions
- **100+ Weight/Height Measurements** with growth curves
- **25+ Medical Notes** with detailed clinical observations
- **40+ Appointments** (past and future)

## 🔧 Verification

After importing, run the verification queries from `04_utilities/database_status_check.sql` to ensure data integrity.

## 📝 Notes

- All files maintain foreign key relationships
- Data is medically accurate and realistic
- Patient names and data follow Moroccan conventions
- CNE numbers follow proper format (CN + 6 digits)
- All dates and medical progressions are chronologically consistent

## 🆘 Troubleshooting

If you encounter issues:
1. Check the specific README in `05_documentation/`
2. Run verification scripts from `04_utilities/`
3. Ensure proper import order was followed
4. Check for foreign key constraint violations

---

*This organized structure makes it easier to maintain, understand, and extend the medical platform database.* 
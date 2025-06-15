# Patient Data Import Guide

This guide explains how to safely import the 50 Moroccan patients into your medical platform database.

## 📋 Files Overview

1. **`cleanup_patients_before_import.sql`** - Clears existing patient data
2. **`populate_moroccan_patients.sql`** - Imports 50 new patients with complete medical records

## 🚀 Import Process

### Step 1: Backup Your Database (Recommended)
Before making any changes, create a backup of your current database:
```sql
-- In phpMyAdmin, use Export feature or run:
mysqldump -u your_username -p your_database_name > backup_before_patient_import.sql
```

### Step 2: Run Cleanup Script
1. Open **phpMyAdmin**
2. Select your database
3. Go to **SQL** tab
4. Copy and paste the contents of `cleanup_patients_before_import.sql`
5. Click **Go** to execute

**Expected Result:** All verification queries should show count = 0

### Step 3: Import Patient Data
1. In **phpMyAdmin**, go to **SQL** tab again
2. Copy and paste the contents of `populate_moroccan_patients.sql`
3. Click **Go** to execute

**Expected Result:** 50 patients imported successfully

### Step 4: Verify Import
Run these verification queries:
```sql
-- Check patient count
SELECT COUNT(*) as total_patients FROM patients;

-- Check user accounts
SELECT COUNT(*) as total_patient_users FROM utilisateurs WHERE role = 'patient';

-- Check medical records
SELECT COUNT(*) as total_allergies FROM patient_allergies;
SELECT COUNT(*) as total_antecedents FROM antecedents_medicaux;
SELECT COUNT(*) as total_notes FROM notes_patient;

-- Check CNE uniqueness
SELECT CNE, COUNT(*) as count FROM patients GROUP BY CNE HAVING count > 1;
```

**Expected Results:**
- `total_patients`: 50
- `total_patient_users`: 50  
- `total_allergies`: ~150+ (multiple allergies per patient)
- `total_antecedents`: ~200+ (multiple medical history entries)
- `total_notes`: ~100+ (doctor notes)
- CNE uniqueness query should return **no results** (all unique)

## 📊 What Gets Imported

### Patient Distribution
- **Casablanca**: 15 patients
- **Rabat**: 10 patients  
- **Marrakech**: 8 patients
- **Fès**: 6 patients
- **Other cities**: 11 patients (Agadir, Tanger, Oujda, Meknès, Safi, Tétouan)

### Patient Demographics
- **Age range**: 9-69 years old
- **Gender**: 25 male, 25 female
- **Professions**: Diverse (students, professionals, retirees, children)
- **Medical conditions**: Various chronic conditions, allergies, treatments

### Medical Records Include
- ✅ Complete patient profiles
- ✅ User accounts with secure passwords
- ✅ Medical allergies with severity levels
- ✅ Medical history (antecedents)
- ✅ Doctor notes and follow-up plans
- ✅ Associated with existing doctors

## 🔧 Troubleshooting

### If you get "Duplicate entry" errors:
1. Make sure you ran the cleanup script first
2. Check if there are any remaining patients: `SELECT COUNT(*) FROM patients;`
3. If patients remain, run the cleanup script again

### If foreign key errors occur:
1. The cleanup script disables foreign key checks temporarily
2. Make sure the script completed successfully
3. Verify your doctors table has data (patients reference doctors)

### If some medical records are missing:
1. Check that the `@patient_start_id` variable is set correctly
2. Verify all sections of the populate script executed
3. Run the verification queries to identify missing data

## 🎯 Success Criteria

After successful import, you should have:
- ✅ 50 unique patients with no CNE duplicates
- ✅ 50 user accounts (username format: firstname.lastname)
- ✅ Complete medical dossiers for each patient
- ✅ Proper associations with existing doctors
- ✅ No database constraint violations

## 📞 Support

If you encounter any issues during import, check:
1. Database connection is stable
2. You have sufficient privileges (INSERT, DELETE, ALTER)
3. All referenced doctors exist in the `medecins` table
4. No other processes are accessing the database during import

---

**Note**: This import process is designed for development/testing environments. For production use, additional considerations for data privacy and security should be implemented. 
# 🏥 Medical Platform Database Migration Guide

## 📋 Overview

This guide provides step-by-step instructions for properly setting up the medical platform database with Moroccan patient and doctor data, including medical records, user accounts, and verification systems.

## 🚨 Important Notes

- **NEVER MODIFY .env FILE** under any circumstances
- Always run migrations in the specified order
- Use MySQL/phpMyAdmin via XAMPP
- Each migration includes verification queries to check success

## 📁 Migration Files Overview

### ✅ **Correct Files to Use**

| File | Purpose | Status |
|------|---------|--------|
| `improved_complete_db.sql` | Complete database structure | ✅ Use this |
| `populate_moroccan_patients.sql` | 50 Moroccan patients with user accounts | ✅ Use this |
| `populate_moroccan_doctors.sql` | Moroccan doctors with specialties | ✅ Use this |
| `populate_patient_medical_records_fixed.sql` | Medical records with proper foreign keys | ✅ Use this |
| `fix_patient_accounts_verification_updated.sql` | Patient account fixes | ✅ Use this |
| `database_status_check.sql` | Comprehensive database verification | ✅ Use this |
| `verify_patient_data.sql` | Quick verification script | ✅ Use this |

### ❌ **Deleted/Problematic Files**

| File | Issue | Status |
|------|-------|--------|
| `populate_patient_medical_records.sql` | Foreign key constraint violations | ❌ DELETED |

## 🔄 Migration Process

### **Phase 1: Database Structure Setup**

#### Step 1: Create Database Structure
```sql
-- Import: improved_complete_db.sql
-- This creates all tables, relationships, and basic data
```

**What this does:**
- Creates all database tables
- Sets up foreign key relationships
- Adds medical specialties
- Creates analysis types and categories
- Adds basic allergies data
- Creates super admin account

**Verification:**
```sql
SHOW TABLES;
SELECT COUNT(*) FROM specialites;
SELECT COUNT(*) FROM allergies;
```

### **Phase 2: Core Data Population**

#### Step 2: Add Moroccan Patients
```sql
-- Import: populate_moroccan_patients.sql
-- Adds 50 diverse Moroccan patients with user accounts
```

**What this does:**
- Adds 50 Moroccan patients with CNE numbers (CN101985 to CN513009)
- Creates user accounts for all patients (username: firstname.lastname)
- Sets up patient demographics across major Moroccan cities
- Assigns treating doctors where available
- All patients have complete profiles

**Patient Distribution:**
- Casablanca: 15 patients
- Rabat: 10 patients
- Marrakech: 8 patients
- Fès: 6 patients
- Other cities: 11 patients

**Verification:**
```sql
SELECT COUNT(*) FROM patients WHERE CNE LIKE 'CN%';
SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient';
SELECT ville, COUNT(*) FROM patients WHERE CNE LIKE 'CN%' GROUP BY ville;
```

#### Step 3: Add Moroccan Doctors
```sql
-- Import: populate_moroccan_doctors.sql
-- Adds doctors with specialties and institutions
```

**What this does:**
- Adds doctors across different specialties
- Creates medical institutions (hospitals, clinics, private practices)
- Sets up doctor-institution relationships
- Creates user accounts for doctors
- Configures doctor availability schedules

**Verification:**
```sql
SELECT COUNT(*) FROM medecins;
SELECT COUNT(*) FROM institutions;
SELECT COUNT(*) FROM utilisateurs WHERE role = 'medecin';
```

### **Phase 3: Account Management**

#### Step 4: Fix Patient Accounts and Verification
```sql
-- Import: fix_patient_accounts_verification_updated.sql
-- Ensures all patients have proper user accounts and verification
```

**What this does:**
- Creates missing user accounts for patients
- Generates verification tokens for all patients
- Sets patients as verified (since they're existing patients)
- Assigns treating doctors to patients without one
- Cleans up orphaned accounts

**Features:**
- Password for all patients: `patient123`
- All patients are pre-verified
- Automatic treating doctor assignment
- Comprehensive error checking

**Verification:**
```sql
-- Check patients with user accounts
SELECT COUNT(*) FROM patients p 
INNER JOIN utilisateurs u ON u.role = 'patient' AND u.id_specifique_role = p.id 
WHERE p.CNE LIKE 'CN%';

-- Check verification tokens
SELECT COUNT(*) FROM verification_patients;
```

### **Phase 4: Medical Data Population**

#### Step 5: Add Medical Records
```sql
-- Import: populate_patient_medical_records_fixed.sql
-- Adds allergies, medical antecedents, and doctor notes
```

**What this does:**
- Adds patient allergies with severity levels
- Creates medical antecedents (family history, chronic conditions)
- Adds doctor notes and observations
- Uses proper foreign key references
- Handles missing references gracefully

**Medical Data Includes:**
- **Allergies:** Medication, environmental, and food allergies
- **Antecedents:** Chronic diseases, family history, surgical history
- **Notes:** Doctor observations, treatment plans, follow-up notes

**Safety Features:**
- Existence checks before inserting
- References doctors by specialty ID
- Graceful handling of missing data
- No foreign key constraint violations

**Verification:**
```sql
SELECT COUNT(*) FROM patient_allergies;
SELECT COUNT(*) FROM antecedents_medicaux;
SELECT COUNT(*) FROM notes_patient;
```

### **Phase 5: Verification and Testing**

#### Step 6: Comprehensive Database Check
```sql
-- Import: database_status_check.sql
-- Comprehensive analysis of database state
```

**What this does:**
- Analyzes all table counts
- Checks patient demographics
- Verifies doctor distribution
- Analyzes user account status
- Checks medical data completeness
- Identifies foreign key integrity issues
- Provides recommendations

#### Step 7: Quick Verification
```sql
-- Import: verify_patient_data.sql
-- Quick verification of patient data
```

**What this does:**
- Quick counts of all major tables
- Verification of patient-doctor relationships
- Check of user account completeness

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Foreign Key Constraint Errors
**Symptoms:** Error 1452 - Cannot add or update a child row
**Solution:** 
- Ensure you're using the `_fixed.sql` files
- Run migrations in the correct order
- Check that referenced tables have data

#### Issue 2: Duplicate Key Errors
**Symptoms:** Error 1062 - Duplicate entry
**Solution:**
- Use `INSERT IGNORE` statements (already in our files)
- Clean up existing data before re-running
- Check for existing records

#### Issue 3: Missing User Accounts
**Symptoms:** Patients exist but can't log in
**Solution:**
- Run `fix_patient_accounts_verification_updated.sql`
- Check `utilisateurs` table for patient accounts
- Verify `id_specifique_role` matches patient IDs

#### Issue 4: Missing Medical Data
**Symptoms:** Patients have no allergies or medical history
**Solution:**
- Run `populate_patient_medical_records_fixed.sql`
- Ensure doctors exist before adding medical records
- Check foreign key relationships

## 📊 Expected Results

After successful migration, you should have:

### **Patients**
- 50 Moroccan patients with complete profiles
- All patients have user accounts (username: firstname.lastname)
- All patients are verified and can log in
- Patients distributed across major Moroccan cities

### **Doctors**
- Multiple doctors across different specialties
- Doctors have user accounts and can log in
- Doctors are associated with medical institutions
- Availability schedules configured

### **Medical Data**
- Patient allergies with severity levels
- Medical antecedents and family history
- Doctor notes and observations
- Proper foreign key relationships

### **User Accounts**
- Super admin: `ayaberroukech` (password: `admin`)
- Patient accounts: `firstname.lastname` (password: `patient123`)
- Doctor accounts: Various usernames (password: `doctor123`)

## 🔐 Login Credentials

### **Super Admin**
- Username: `ayaberroukech`
- Password: `admin`
- Email: `aya.beroukech@medical.com`

### **Sample Patient Accounts**
- Username: `youssef.alami` (password: `patient123`)
- Username: `aicha.benali` (password: `patient123`)
- Username: `omar.tazi` (password: `patient123`)

### **Sample Doctor Accounts**
- Username: `aminabenali` (password: `doctor123`)
- Username: `omartazi` (password: `doctor123`)

## 📝 Migration Checklist

- [ ] **Step 1:** Import `improved_complete_db.sql`
- [ ] **Step 2:** Import `populate_moroccan_patients.sql`
- [ ] **Step 3:** Import `populate_moroccan_doctors.sql`
- [ ] **Step 4:** Import `fix_patient_accounts_verification_updated.sql`
- [ ] **Step 5:** Import `populate_patient_medical_records_fixed.sql`
- [ ] **Step 6:** Run `database_status_check.sql` for verification
- [ ] **Step 7:** Run `verify_patient_data.sql` for final check
- [ ] **Step 8:** Test login with sample accounts
- [ ] **Step 9:** Verify patient data in frontend application

## 🚀 Post-Migration Testing

### **Frontend Testing**
1. **Login Tests:**
   - Super admin login
   - Patient login
   - Doctor login

2. **Patient Features:**
   - View medical records
   - Search doctors
   - Book appointments
   - View allergies and medical history

3. **Doctor Features:**
   - View patient list
   - Access patient medical records
   - Add medical notes
   - Manage appointments

4. **Admin Features:**
   - Manage users
   - View statistics
   - Manage institutions

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting guide above**
2. **Run the database status check script**
3. **Verify you followed the migration order**
4. **Check MySQL error logs**
5. **Ensure all foreign key relationships are intact**

## 🔄 Rollback Procedure

If you need to start over:

1. **Drop the database:**
   ```sql
   DROP DATABASE plateforme_medicale;
   CREATE DATABASE plateforme_medicale;
   ```

2. **Start from Step 1 of the migration process**

## 📈 Database Statistics

After successful migration:
- **Patients:** 50 Moroccan patients
- **Doctors:** Multiple across specialties
- **User Accounts:** All patients and doctors have accounts
- **Medical Records:** Comprehensive allergies, antecedents, and notes
- **Institutions:** Hospitals, clinics, and private practices
- **Specialties:** 10 medical specialties
- **Analysis Types:** 100+ medical analysis types
- **Allergies:** 18 common allergies

---

**Last Updated:** December 2024  
**Version:** 2.0  
**Status:** Production Ready ✅ 
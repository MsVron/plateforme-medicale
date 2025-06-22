# 🔄 Database Migration Order - Quick Reference

## ✅ **CORRECT ORDER TO IMPORT FILES**

### **1. Database Structure**
```sql
-- Import: improved_complete_db.sql
-- Creates all tables, relationships, specialties, allergies, super admin
```

### **2. Moroccan Patients**
```sql
-- Import: populate_moroccan_patients.sql
-- Adds 50 Moroccan patients with user accounts
```

### **3. Moroccan Doctors**
```sql
-- Import: populate_moroccan_doctors.sql
-- Adds doctors, institutions, and doctor user accounts
```

### **4. Hospitals, Clinics, and Medical Centers**
```sql
-- Import: populate_hospitals_clinics_doctors.sql
-- Adds 3 hospitals, 3 clinics, 3 medical centers and 30 additional doctors
```

### **5. Institution Login Credentials**
```sql
-- Import: add_missing_institution_credentials_fixed.sql
-- Adds missing login credentials for institutions EXCLUDING private cabinets
-- Private cabinets already have doctor credentials from populate_moroccan_doctors.sql
```

### **6. Fix Patient Accounts**
```sql
-- Import: fix_patient_accounts_verification_updated.sql
-- Ensures all patients have proper user accounts and verification
```

### **7. Medical Records**
```sql
-- Import: populate_patient_medical_records_fixed.sql
-- Adds allergies, medical antecedents, and doctor notes
```

### **8. Verification (Optional)**
```sql
-- Import: database_status_check.sql
-- Comprehensive database analysis and verification
```

### **9. Quick Check (Optional)**
```sql
-- Import: verify_patient_data.sql
-- Quick verification of patient data
```

## ❌ **FILES TO AVOID**

- ~~`populate_patient_medical_records.sql`~~ ← **DELETED** (caused foreign key errors)

## 🔐 **Login Credentials After Migration**

- **Super Admin:** `ayaberroukech` / `admin`
- **Patients:** `firstname.lastname` / `patient123`
- **Doctors:** Various usernames / `doctor123`
- **Hospitals:** `universitaire.mohammed.vi` / `admin123`
- **Clinics/Medical Centers:** `al.madina` / `admin123`
- **Private Cabinets:** Use existing doctor credentials (e.g., `aminabenali` / `admin123`)

## 📊 **Expected Results**

- **50 Moroccan patients** with complete profiles
- **Multiple doctors** across specialties
- **All user accounts** working and verified
- **Medical records** (allergies, antecedents, notes)
- **No foreign key constraint errors**

---

**⚠️ IMPORTANT:** Always follow this exact order to avoid foreign key constraint violations! 
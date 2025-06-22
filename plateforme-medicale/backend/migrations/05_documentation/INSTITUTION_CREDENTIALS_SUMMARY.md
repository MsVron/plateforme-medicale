# Institution Credentials Migration Summary (CORRECTED)

## Overview
This document summarizes the migration to add login credentials for institutional healthcare providers in the medical platform database, **EXCLUDING private cabinets** which already have doctor credentials.

## Problem Statement
The database contained institutions (hospitals, clinics, medical centers) from `populate_hospitals_clinics_doctors.sql` that were created without corresponding login credentials in the `utilisateurs` table. Private cabinets from `populate_moroccan_doctors.sql` already have doctor credentials and are excluded.

## Institutions Requiring Credentials

### 1. Hospitals (3 institutions)
- **Source**: `populate_hospitals_clinics_doctors.sql`
- **Type**: `type_institution = 'hospital'`, `type = 'hôpital'`
- **Role Mapping**: `role = 'hospital'`
- **Count**: 3 hospitals
- **Examples**: Hôpital Universitaire Mohammed VI, Hôpital Ibn Sina, Hôpital Militaire Mohammed V

### 2. Cliniques (3 institutions)
- **Source**: `populate_hospitals_clinics_doctors.sql`
- **Type**: `type_institution = 'institution'`, `type = 'clinique'`
- **Role Mapping**: `role = 'institution'`
- **Count**: 3 cliniques
- **Examples**: Clinique Al Madina, Clinique Atlas, Clinique Océan

### 3. Centres Médicaux (3 institutions)
- **Source**: `populate_hospitals_clinics_doctors.sql`
- **Type**: `type_institution = 'institution'`, `type = 'centre médical'`
- **Role Mapping**: `role = 'institution'`
- **Count**: 3 centres médicaux
- **Examples**: Centre Médical Avicenne, Centre Médical Andalous, Centre Médical Maghreb

### 4. Private Cabinets (26 institutions) - EXCLUDED
- **Source**: `populate_moroccan_doctors.sql`
- **Type**: `type_institution = 'clinic'`, `type = 'cabinet privé'`
- **Status**: **ALREADY HAVE CREDENTIALS** - Each has a doctor user account
- **Count**: 26 private cabinets
- **Note**: These are excluded from this migration as they already have doctor credentials

## Migration Details

### Target Institutions
- **Total needing credentials**: 9 institutions (3 hospitals + 3 cliniques + 3 centres)
- **Excluded**: 26 private cabinets (already have doctor credentials)

### Credential Generation Rules

#### Username Generation
1. Remove prefixes: "Hôpital ", "Clinique ", "Centre Médical "
2. Convert to lowercase
3. Replace spaces with dots (.)
4. Replace special characters (é→e, è→e, ç→c)

#### Email Generation
- Format: `admin.{clean_name}@system.ma`
- Uses system domain to avoid conflicts with existing emails

#### Role Mapping
- **Hospitals**: `role = 'hospital'`
- **Cliniques/Centres**: `role = 'institution'`

### Example Credentials

#### Hospitals (`role = 'hospital'`)
- **Hôpital Universitaire Mohammed VI**
  - Username: `universitaire.mohammed.vi`
  - Password: `admin123`
  - Email: `admin.universitaire.mohammed.vi@system.ma`

#### Cliniques (`role = 'institution'`)
- **Clinique Al Madina**
  - Username: `al.madina`
  - Password: `admin123`
  - Email: `admin.al.madina@system.ma`

#### Centres Médicaux (`role = 'institution'`)
- **Centre Médical Avicenne**
  - Username: `avicenne`
  - Password: `admin123`
  - Email: `admin.avicenne@system.ma`

## Migration Files

### Primary Migration
- **File**: `add_missing_institution_credentials_fixed.sql`
- **Location**: `plateforme-medicale/backend/migrations/02_core_data/`
- **Features**:
  - Excludes private cabinets
  - Uses conditional INSERT to avoid duplicates
  - Comprehensive diagnostics and verification
  - System email generation to avoid conflicts

### Rollback (if needed)
- **File**: `rollback_institution_credentials.sql`
- **Location**: `plateforme-medicale/backend/migrations/04_utilities/`

## Verification

The migration includes verification queries to confirm:
1. Only institutions without existing credentials are processed
2. Private cabinets are properly excluded
3. Correct role mapping is applied
4. No duplicate usernames or emails are created

## Expected Results

After running the migration:
- **9 new institution user accounts** (hospitals, cliniques, centres)
- **26 private cabinets remain unchanged** (they already have doctor credentials)
- **Total institution access**: 35 institutions (9 with institution credentials + 26 with doctor credentials)

## Important Notes

- **Private cabinets are intentionally excluded** as they already have doctor credentials
- Migration is idempotent (can be run multiple times safely)
- Uses system emails (@system.ma) to avoid conflicts
- All passwords are hashed using bcrypt
- Default password is `admin123` for all institution accounts 
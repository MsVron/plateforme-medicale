# Moroccan Doctors Population Migration

## Overview
This migration populates the medical platform database with 25 Moroccan doctors and their private cabinets, distributed across major cities in Morocco with realistic specialties distribution.

## Migration File
- **File**: `populate_moroccan_doctors.sql`
- **Created**: 2024
- **Purpose**: Add sample doctors data for application demonstration and testing

## What This Migration Does

### 1. Private Cabinets (Institutions)
Creates 25 private medical cabinets across Morocco:

#### Cities Covered:
- **Casablanca** (5 cabinets) - Economic capital
- **Rabat** (4 cabinets) - Political capital  
- **Marrakech** (3 cabinets) - Tourist city
- **Fès** (3 cabinets) - Cultural capital
- **Agadir** (2 cabinets) - Coastal city
- **Tanger** (2 cabinets) - Northern city
- **Oujda** (2 cabinets) - Eastern city
- **Meknès** (1 cabinet)
- **Tétouan** (1 cabinet)
- **Kénitra** (1 cabinet)
- **Safi** (1 cabinet)
- **El Jadida** (1 cabinet)

Each cabinet includes:
- Realistic Moroccan addresses
- GPS coordinates (latitude/longitude)
- Moroccan phone numbers (+212 format)
- Professional email addresses
- Proper institution type classification

### 2. Doctors (Médecins)
Creates 25 doctors with authentic Moroccan names:

#### Specialty Distribution:
- **Médecine générale**: 6 doctors (24%)
- **Cardiologie**: 3 doctors (12%)
- **Pédiatrie**: 3 doctors (12%)
- **Gynécologie-Obstétrique**: 3 doctors (12%)
- **Dermatologie**: 2 doctors (8%)
- **Ophtalmologie**: 2 doctors (8%)
- **Orthopédie**: 2 doctors (8%)
- **Neurologie**: 2 doctors (8%)
- **Psychiatrie**: 1 doctor (4%)
- **Radiologie**: 1 doctor (4%)

#### Doctor Information Includes:
- Authentic Moroccan first and last names
- Unique medical license numbers (numero_ordre)
- Professional biographies in French
- Consultation fees in Moroccan Dirhams (220-500 MAD)
- Languages spoken (Arabic, French, English, Spanish, Berber)
- Specialization details
- Contact information
- GPS coordinates

### 3. User Accounts
Creates authentication accounts for all 25 doctors:
- Username format: `firstnamelastname` (lowercase)
- Default password: `admin` (hashed with bcrypt)
- Email linked to professional addresses
- Role: `medecin`
- All accounts verified and active

### 4. Institution Ownership
Links each doctor to their private cabinet:
- Updates `medecin_proprietaire_id` in institutions table
- Establishes doctor-institution relationships

### 5. Doctor-Institution Affiliations
Creates primary affiliations:
- Each doctor affiliated with their own cabinet
- `est_principal = TRUE` for all affiliations
- Realistic start dates (2017-2021)

### 6. Sample Availability Schedules
Adds working hours for 3 sample doctors:
- **Dr. Amina Benali** (General Medicine): Mon-Fri 8:00-18:00, Sat 8:00-13:00
- **Dr. Omar Tazi** (Cardiology): Mon-Thu 9:00-17:00, Fri 9:00-12:00
- **Dr. Fatima Zahra Idrissi** (Pediatrics): Mon-Sat with lunch breaks

### 7. Specialty Usage Count Update
Updates the `usage_count` field in specialties table to reflect the new doctor distribution.

## Sample Doctor Profiles

### Dr. Amina Benali - Médecine Générale (Casablanca)
- **License**: MG-CAS-001
- **Languages**: Arabic, French, English
- **Fee**: 300 MAD
- **Bio**: "Médecin généraliste expérimentée avec 15 ans d'expérience. Spécialisée dans le suivi des maladies chroniques et la médecine préventive."

### Dr. Omar Tazi - Cardiologie (Casablanca)
- **License**: CAR-CAS-005
- **Languages**: Arabic, French, English
- **Fee**: 500 MAD
- **Bio**: "Cardiologue interventionnel avec 20 ans d'expérience. Spécialisé dans les maladies coronariennes et l'hypertension artérielle."

### Dr. Zineb Filali - Dermatologie (Fès)
- **License**: DER-FES-014
- **Languages**: Arabic, French
- **Fee**: 350 MAD
- **Bio**: "Dermatologue spécialisée dans le traitement de l'acné, du psoriasis et de la dermatologie esthétique."

## Database Tables Affected

1. **institutions** - 25 new private cabinets
2. **medecins** - 25 new doctors
3. **utilisateurs** - 25 new user accounts
4. **medecin_institution** - 25 new affiliations
5. **disponibilites_medecin** - Sample schedules for 3 doctors
6. **specialites** - Updated usage counts
7. **notes_patient** - 2 sample notes (requires existing patients)

## Prerequisites

Before running this migration:
1. Ensure the `specialites` table is populated with the required specialties
2. The database schema should be fully created
3. At least one patient should exist for the sample notes (patient_id = 1)

## How to Run

```bash
# Navigate to the backend directory
cd plateforme-medicale/backend

# Run the migration using MySQL client
mysql -u your_username -p your_database_name < migrations/populate_moroccan_doctors.sql

# Or using a database management tool
# Import the SQL file into your database
```

## Verification

After running the migration, verify the data:

```sql
-- Check doctors count by specialty
SELECT s.nom, COUNT(m.id) as doctor_count 
FROM specialites s 
LEFT JOIN medecins m ON s.id = m.specialite_id 
GROUP BY s.id, s.nom 
ORDER BY doctor_count DESC;

-- Check institutions by city
SELECT ville, COUNT(*) as cabinet_count 
FROM institutions 
WHERE type = 'cabinet privé' 
GROUP BY ville 
ORDER BY cabinet_count DESC;

-- Check user accounts
SELECT COUNT(*) as total_doctor_accounts 
FROM utilisateurs 
WHERE role = 'medecin';
```

## Notes

- All phone numbers use the Moroccan format (+212)
- GPS coordinates are realistic for each city
- Email addresses are fictional but follow professional patterns
- Consultation fees are in Moroccan Dirhams (MAD)
- All doctors accept new patients by default
- Most general practitioners accept walk-in patients
- Specialists typically require appointments

## Rollback

To rollback this migration:

```sql
-- Delete in reverse order to respect foreign key constraints
DELETE FROM notes_patient WHERE medecin_id BETWEEN 1 AND 25;
DELETE FROM disponibilites_medecin WHERE medecin_id BETWEEN 1 AND 25;
DELETE FROM medecin_institution WHERE medecin_id BETWEEN 1 AND 25;
DELETE FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role BETWEEN 1 AND 25;
DELETE FROM medecins WHERE id BETWEEN 1 AND 25;
UPDATE institutions SET medecin_proprietaire_id = NULL WHERE medecin_proprietaire_id BETWEEN 1 AND 25;
DELETE FROM institutions WHERE type = 'cabinet privé' AND id BETWEEN 1 AND 26;

-- Reset specialty usage counts
UPDATE specialites SET usage_count = (
    SELECT COUNT(*) FROM medecins WHERE specialite_id = specialites.id
);
```

## Future Enhancements

This migration can be extended to include:
- More detailed availability schedules for all doctors
- Sample patient appointments
- Medical consultation history
- Doctor ratings and reviews
- Additional specialties
- More cities coverage
- Multilingual doctor profiles

## Contact

For questions about this migration, refer to the main project documentation or contact the development team. 
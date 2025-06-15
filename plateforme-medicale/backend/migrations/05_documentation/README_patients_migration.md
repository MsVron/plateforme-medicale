# Moroccan Patients Migration Documentation

## Overview
This migration populates the database with 50 diverse Moroccan patients with comprehensive medical records. The migration is designed to provide realistic test data for the medical platform.

## File Location
- **Migration File**: `plateforme-medicale/backend/migrations/populate_moroccan_patients.sql`
- **Documentation**: `plateforme-medicale/backend/migrations/README_patients_migration.md`

## Migration Contents

### 1. Patient Demographics
- **Total Patients**: 50
- **Gender Distribution**: 25 Male, 25 Female
- **Age Groups**:
  - Children (0-17): 8 patients
  - Adults (18-64): 32 patients  
  - Seniors (65+): 10 patients

### 2. Geographic Distribution
- **Casablanca**: 15 patients (Economic capital)
- **Rabat**: 10 patients (Political capital)
- **Marrakech**: 8 patients (Tourist city)
- **Fès**: 6 patients (Cultural capital)
- **Other cities**: 11 patients (Agadir, Tanger, Oujda, Meknès, Tétouan, El Jadida, Safi)

### 3. Medical Conditions Covered
- **Chronic Diseases**: Diabetes, Hypertension, Arthritis, COPD, Asthma
- **Pediatric Conditions**: ADHD, Growth disorders, Allergies
- **Geriatric Conditions**: Parkinson's, Osteoporosis, Cataracts
- **Women's Health**: Endometriosis, Dysmenorrhea, Pregnancy-related
- **Mental Health**: Anxiety disorders, Depression, Social phobia
- **Allergies**: Food, medication, environmental allergies

### 4. Data Included

#### 4.1 Patient Basic Information
- Personal details (name, birth date, gender, CNE)
- Contact information (address, phone, email)
- Emergency contacts
- Physical characteristics (height, weight, blood type)
- Lifestyle factors (smoking, alcohol, physical activity)
- Profession

#### 4.2 User Accounts
- Username format: `firstname.lastname`
- Password: `patient123` (hashed with bcrypt)
- All accounts are verified and active

#### 4.3 Medical Records
- **Allergies**: 17 different allergy types with severity levels
- **Medical History**: Chronic conditions, family history
- **Patient Notes**: Doctor observations and treatment notes
- **Measurements**: Vital signs, lab values
- **Follow-up Reminders**: Scheduled medical follow-ups

#### 4.4 Healthcare Relationships
- **Assigned Doctors**: Each patient has a treating physician
- **Appointments**: Past and upcoming appointments
- **Doctor Favorites**: Patient preferences
- **Doctor Evaluations**: Patient ratings and reviews

## Usage Instructions

### For PHPMyAdmin (XAMPP)
1. Open PHPMyAdmin in your browser
2. Select your medical platform database
3. Go to the "Import" tab
4. Choose the `populate_moroccan_patients.sql` file
5. Click "Go" to execute the migration

### For MySQL Command Line
```bash
mysql -u username -p database_name < populate_moroccan_patients.sql
```

### Prerequisites
- The doctors migration must be run first (`populate_moroccan_doctors.sql`)
- All core database tables must exist
- Specialties and institutions must be populated

## Sample Patient Profiles

### Pediatric Patient
- **Name**: Khalid Tazi (8 years old)
- **Conditions**: ADHD, egg allergy
- **Doctor**: Dr. Fatima Zahra Idrissi (Pediatrician)
- **Location**: Casablanca

### Adult with Chronic Disease
- **Name**: Omar Tazi (45 years old)
- **Conditions**: Hypertension, family history of diabetes
- **Doctor**: Dr. Omar Tazi (Cardiologist)
- **Location**: Casablanca

### Senior Patient
- **Name**: Abdelkader Taibi (72 years old)
- **Conditions**: Early Parkinson's disease
- **Doctor**: Dr. Houda Taibi (Dermatologist/General care)
- **Location**: Tanger

## Data Quality Features

### Realistic Names
- All names are authentic Moroccan names
- Proper gender-appropriate naming
- Family name consistency where applicable

### Medical Accuracy
- Age-appropriate conditions
- Realistic medication allergies
- Proper severity classifications
- Logical doctor-patient assignments

### Geographic Authenticity
- Real Moroccan cities and postal codes
- Authentic street names and addresses
- Proper phone number formats (+212)

## Testing Scenarios

### Login Testing
Use any patient username with password `patient123`:
- `youssef.alami` / `patient123`
- `aicha.benali` / `patient123`
- `khalid.tazi` / `patient123`

### Medical Record Testing
- Patients with allergies: Test allergy warnings
- Chronic patients: Test follow-up reminders
- Pediatric patients: Test age-appropriate features

### Appointment Testing
- Existing appointments for testing scheduling
- Various appointment statuses (completed, upcoming, cancelled)

## Maintenance Notes

### Adding More Patients
1. Update the patient count in the header comment
2. Add new patient records following the existing pattern
3. Create corresponding user accounts
4. Add medical records as appropriate
5. Update summary statistics

### Modifying Existing Data
- Patient IDs are calculated dynamically using `@patient_start_id`
- Doctor assignments use name-based lookups for flexibility
- All foreign key relationships are properly maintained

## Security Considerations

### Password Security
- All passwords are properly hashed using bcrypt
- Default password should be changed in production
- Consider implementing password reset functionality

### Data Privacy
- All patient data is fictional
- No real personal information is used
- Complies with GDPR requirements for test data

## Troubleshooting

### Common Issues
1. **Foreign Key Errors**: Ensure doctors migration is run first
2. **Duplicate Entries**: Check if migration was already run
3. **Missing Specialties**: Verify core data is populated

### Verification Queries
```sql
-- Check patient count
SELECT COUNT(*) FROM patients WHERE id >= @patient_start_id;

-- Check user accounts
SELECT COUNT(*) FROM utilisateurs WHERE role = 'patient';

-- Check medical records
SELECT COUNT(*) FROM patient_allergies;
SELECT COUNT(*) FROM antecedents_medicaux;
```

## Version History
- **v1.0**: Initial 40 patients
- **v2.0**: Expanded to 50 patients with enhanced medical records
- **v2.1**: Added comprehensive documentation and better organization

## Support
For issues or questions regarding this migration, please refer to the main project documentation or contact the development team. 
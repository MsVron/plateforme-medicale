# Medical Platform Database Structure

This folder contains the reorganized database structure for the medical platform. The SQL files have been categorized and organized into logical groups for better maintainability and understanding.

## Installation

To install the complete database structure, run:

```sql
SOURCE sql_structure/master_install.sql;
```

This will execute all SQL files in the correct order.

## Folder Structure

### 01_core_tables/
Core system tables that form the foundation of the platform:
- **01_authentication.sql** - User authentication and role management
- **02_institutions_specialties.sql** - Medical institutions and specialties
- **03_doctors.sql** - Doctor profiles, availability, and institutional affiliations
- **04_patients.sql** - Patient profiles, verification, and ratings

### 02_medical_data/
Medical information and history:
- **01_allergies_antecedents.sql** - Patient allergies and medical history
- **02_medications.sql** - Medication management and prescriptions

### 03_appointments_consultations/
Appointment and consultation management:
- **01_appointments.sql** - Appointment scheduling and management
- **02_consultations.sql** - Medical consultations and vital signs

### 04_medical_analysis/
Medical analysis and testing:
- **01_analysis_categories.sql** - Analysis types and categories structure
- **02_analysis_results.sql** - Laboratory analysis results
- **03_imaging.sql** - Medical imaging types and results

### 05_system_management/
System-level functionality:
- **01_notifications.sql** - Notifications and medical documents
- **02_audit_logs.sql** - System audit logs and activity tracking

### 06_patient_care/
Patient care and follow-up:
- **01_notes_reminders.sql** - Patient notes, reminders, and measurements

### 07_institutional_management/
Institution management features:
- **01_change_requests.sql** - Institution change requests and hospital assignments

### 08_access_tracking/
GDPR compliance and access tracking:
- **01_access_logs.sql** - Prescription and analysis access logs

### 09_data_initialization/
Initial data and reference values:
- **01_analysis_categories_data.sql** - Medical analysis categories
- **02_hematology_analysis.sql** - Blood analysis types
- **03_biochemistry_analysis.sql** - Biochemical analysis types
- **04_other_analysis_types.sql** - All other analysis types (hormones, vitamins, etc.)
- **05_sample_data.sql** - Sample specialties, institutions, and admin data

### 10_foreign_keys_constraints/
Constraints that need to be added after table creation:
- **01_foreign_key_setup.sql** - Foreign key constraints

### 11_views_triggers/
Database views and triggers:
- **01_views.sql** - Useful database views
- **02_triggers.sql** - Data consistency triggers

## Key Features

### Comprehensive Medical Analysis System
The database includes over 150 medical analysis types organized into categories:
- Hematology (blood tests)
- Biochemistry (metabolic tests)
- Endocrinology (hormones)
- Immunology (immune system tests)
- Microbiology (infections)
- Vitamins and minerals
- Tumor markers
- Cardiology markers
- Coagulation tests
- Urology tests

### Multi-Role Authentication
Support for multiple user roles:
- Super Admin
- Admin
- Doctor (Medecin)
- Patient
- Institution (Pharmacy, Hospital, Laboratory)

### GDPR Compliance
Built-in access tracking for sensitive patient data including:
- Prescription access logs
- Analysis access logs
- Audit trails

### Institution Management
Complete institution management with:
- Change request approval workflows
- Hospital patient assignments
- Multi-institution doctor affiliations

### Patient Care Features
Comprehensive patient management:
- Medical history and allergies
- Vital signs tracking
- Follow-up reminders
- Document management

## Usage Notes

1. Run the `master_install.sql` script to install the complete database
2. The script automatically handles foreign key dependencies
3. Sample data is included for immediate testing
4. All tables include proper indexing for performance
5. Triggers maintain data consistency automatically

## Security Features

- Password hashing for user authentication
- Role-based access control
- Audit logging for all sensitive operations
- GDPR-compliant access tracking
- IP address logging for security monitoring

## Sample Admin Account

A default super admin account is created:
- Username: `ayaberroukech`
- Password: `admin`
- Email: `aya.beroukech@medical.com`

**Change this password immediately in production!** 
# Multi-Institution Medical Platform Backend Implementation

## Overview

This document provides comprehensive documentation for the backend implementation of a multi-institution medical platform that enables different types of medical institutions (private cabinets, hospitals, pharmacies, and laboratories) to access and manage patient medical records according to their specific roles and requirements.

## Table of Contents

1. [Project Requirements](#project-requirements)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Details](#implementation-details)
4. [Database Schema Utilization](#database-schema-utilization)
5. [API Endpoints](#api-endpoints)
6. [Security & Compliance](#security--compliance)
7. [Code Organization](#code-organization)
8. [Testing & Deployment](#testing--deployment)

## Project Requirements

### Original Requirements Analysis

The project required implementing backend functionality for four distinct types of medical institutions:

#### 1. Private Cabinets (Doctors)
- **Status**: Mostly implemented, required verification of database table utilization
- **Requirements**: Access to comprehensive patient medical records
- **Functionality**: Patient search, medical record management, consultation tracking

#### 2. Hospitals
- **Requirements**: 
  - Assign patients to single or multiple doctors working in the hospital
  - Track patient visits, stay duration, procedures, and surgeries
  - Patient search by exact first name, last name, and CNE
  - Add walk-in patients (reusing existing functionality)

#### 3. Pharmacies
- **Requirements**:
  - Patient search using same mechanism as doctors (exact match)
  - View prescriptions with dates
  - Mark dispensed medications
  - Cross-pharmacy medication history visibility
  - Integration with doctor prescription viewing

#### 4. Laboratories
- **Requirements**:
  - View test and imaging requests from doctors
  - Upload results after patient search
  - Enable doctors/hospitals to view results and source laboratory
  - Patient search by exact first name, last name, and CNE

## Architecture Overview

### Core Design Principles

1. **Code Reusability**: Shared utilities to prevent duplication
2. **Consistent Patient Search**: Unified search mechanism across all institutions
3. **Role-Based Access Control**: Institution-specific permissions
4. **Audit Compliance**: GDPR-compliant logging for all patient searches
5. **Database Integration**: Full utilization of existing database schema

### System Components

```
Backend Architecture
├── Authentication & Authorization
│   ├── JWT-based authentication
│   ├── Role-based middleware
│   └── Institution-specific access control
├── Shared Utilities
│   ├── Patient search utility
│   ├── Validation functions
│   └── Audit logging
├── Institution Controllers
│   ├── Hospital controller
│   ├── Pharmacy controller
│   ├── Laboratory controller
│   └── Enhanced medical record controller
├── API Routes
│   ├── Hospital routes
│   ├── Pharmacy routes
│   ├── Laboratory routes
│   └── Updated medical routes
└── Database Integration
    ├── MySQL connection pool
    ├── Transaction management
    └── View utilization
```

## Implementation Details

### 1. Enhanced Authentication Middleware

**File**: `middlewares/auth.js`

#### New Middleware Functions Added:

```javascript
// Pharmacy-specific access control
exports.isPharmacy = (req, res, next) => {
  if (!['pharmacy', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux pharmacies" });
  }
  next();
};

// Hospital-specific access control
exports.isHospital = (req, res, next) => {
  if (!['hospital', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux hôpitaux" });
  }
  next();
};

// Laboratory-specific access control
exports.isLaboratory = (req, res, next) => {
  if (!['laboratory', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux laboratoires" });
  }
  next();
};

// Medical institutions (hospitals, clinics, doctors)
exports.isMedicalInstitution = (req, res, next) => {
  if (!['medecin', 'hospital', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux institutions médicales" });
  }
  next();
};
```

#### Updated Institution Middleware:

```javascript
// Updated to include new institution types
exports.isInstitution = (req, res, next) => {
  if (!['institution', 'pharmacy', 'hospital', 'laboratory', 'admin', 'super_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès réservé aux institutions médicales" });
  }
  next();
};
```

### 2. Shared Patient Search Utility

**File**: `utils/patientSearch.js`

#### Core Functions:

##### `validateSearchParams(prenom, nom, cne)`
- Validates that at least one search criterion is provided
- Ensures minimum character requirements (2 for names, 3 for CNE)
- Returns validation result with error messages

##### `buildSearchConditions(prenom, nom, cne)`
- Constructs dynamic SQL WHERE clauses for exact matches
- Sanitizes input parameters
- Returns SQL conditions and parameter array

##### `logSearchActivity(userId, institutionId, searchCriteria, resultsCount, searchReason)`
- GDPR-compliant audit logging for all patient searches
- Logs user, institution, search criteria, and results count
- Stores in `patient_search_audit` table

##### `searchPatients(searchParams)`
- Generic patient search function for all institution types
- Supports additional fields, joins, and conditions per institution
- Implements consistent validation, sanitization, and audit logging

**Usage Example**:
```javascript
const result = await searchPatients({
  prenom: 'John',
  nom: 'Doe',
  cne: 'CNE123',
  userId: req.user.id,
  institutionId: hospitalId,
  institutionType: 'hospital',
  additionalFields: ', ha.admission_date, ha.bed_number',
  additionalJoins: 'LEFT JOIN hospital_assignments ha ON p.id = ha.patient_id',
  additionalConditions: 'AND ha.status = "active"',
  limit: 50
});
```

### 3. Hospital Management System

**File**: `controllers/hospital/hospitalController.js`

#### Key Functions:

##### `searchPatients(req, res)`
- Hospital-specific patient search with admission status
- Shows current assignment information (bed, ward, admission date)
- Indicates if patient is currently admitted

##### `getHospitalPatients(req, res)`
- Retrieves hospital patient management view
- Shows all patients associated with the hospital
- Ordered by admission date

##### `admitPatient(req, res)`
- Admits patient to hospital with doctor assignment
- Validates doctor works at the hospital
- Manages bed allocation and assignment tracking
- Creates audit log entry

##### `dischargePatient(req, res)`
- Discharges patient and updates assignment status
- Frees up bed allocation
- Records discharge reason and date
- Creates audit log entry

##### `addWalkInPatient(req, res)`
- Adds walk-in patients with hospital context
- Reuses existing patient creation functionality
- Automatically associates with hospital

#### Database Tables Utilized:
- `hospital_assignments`: Patient-hospital-doctor assignments
- `hospital_beds`: Bed management and occupancy
- `hospital_surgeries`: Surgery tracking
- `hospital_stays`: Stay duration and details

### 4. Pharmacy Management System

**File**: `controllers/pharmacy/pharmacyController.js`

#### Key Functions:

##### `searchPatients(req, res)`
- Pharmacy-specific patient search
- Includes patient allergy information for safety
- Shows prescription availability status

##### `getPatientPrescriptions(req, res)`
- Retrieves all prescriptions for a patient
- Shows dispensing status (pending, partial, complete)
- Includes prescription dates and doctor information

##### `dispenseMedication(req, res)`
- Dispenses medications from prescriptions
- Updates inventory levels
- Tracks partial and complete dispensing
- Records pharmacy and pharmacist information

**Request Body**:
```json
{
  "quantity_dispensed": 30,
  "pharmacist_notes": "Patient counseled on side effects"
}
```

##### `getPharmacyPatientMedications(req, res)`
- Shows pharmacy-specific view of patient medications
- Cross-pharmacy medication history
- Includes dispensing dates and quantities

##### `checkMedicationInteractions(req, res)`
- Checks for drug interactions
- Validates against patient allergies
- Returns interaction warnings

**Request Body**:
```json
{
  "medication_ids": [1, 2, 3],
  "patient_id": 123
}
```

#### Database Tables Utilized:
- `prescription_medications`: Individual medication prescriptions
- `medication_dispensing`: Dispensing records
- `pharmacy_inventory`: Stock management
- `medication_interactions`: Drug interaction database

### 5. Laboratory Management System

**File**: `controllers/laboratory/laboratoryController.js`

#### Key Functions:

##### `searchPatients(req, res)`
- Laboratory-specific patient search
- Shows pending test and imaging request counts
- Includes patient contact information

##### `getPatientTestRequests(req, res)`
- Retrieves test and imaging requests for a patient
- Shows request status (pending, in_progress, completed)
- Includes requesting doctor and urgency information

##### `uploadTestResults(req, res)`
- Uploads laboratory test results
- Associates results with specific technician
- Updates request status to completed
- Notifies requesting doctor

**Request Body**:
```json
{
  "results": "Glucose: 95 mg/dL (Normal)",
  "technician_notes": "Sample processed normally",
  "result_file_url": "/uploads/lab_results/test_123.pdf"
}
```

##### `uploadImagingResults(req, res)`
- Uploads imaging results (X-ray, MRI, CT, etc.)
- Stores image URLs and radiologist reports
- Updates imaging request status

##### `getPendingWork(req, res)`
- Retrieves pending work queue for laboratory
- Prioritizes by urgency and request date
- Shows workload distribution

#### Database Tables Utilized:
- `test_requests`: Laboratory test orders
- `imaging_requests`: Medical imaging orders
- `test_results`: Laboratory results storage
- `imaging_results`: Imaging results and reports
- `laboratory_technicians`: Technician assignments

### 6. Enhanced Medical Record Controller

**File**: `controllers/medecin/medicalRecordController.js`

#### Updates Made:

##### Migrated to Shared Patient Search:
- Replaced custom patient search with shared utility
- Maintains doctor-specific functionality (appointment history)
- Improved audit logging and consistency

**Before**:
```javascript
// Custom search implementation with duplicate validation logic
const [patients] = await db.execute(`
  SELECT p.*, CASE WHEN rv.patient_id IS NOT NULL THEN TRUE ELSE FALSE END as a_rendez_vous_avec_medecin
  FROM patients p
  LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ?
  WHERE ${whereClause}
  // ... validation and logging code
`);
```

**After**:
```javascript
// Using shared utility with institution-specific additions
const result = await searchPatients({
  prenom, nom, cne,
  userId: req.user.id,
  institutionId: medecinId,
  institutionType: 'doctor',
  additionalFields: `, CASE WHEN rv.patient_id IS NOT NULL THEN TRUE ELSE FALSE END as a_rendez_vous_avec_medecin`,
  additionalJoins: `LEFT JOIN rendez_vous rv ON p.id = rv.patient_id AND rv.medecin_id = ${medecinId}`,
  additionalConditions: `GROUP BY p.id`
});
```

## Database Schema Utilization

### Core Tables Verification

#### Patient Management:
- ✅ `patients`: Core patient information
- ✅ `patient_search_audit`: GDPR-compliant search logging
- ✅ `comprehensive_patient_record`: View for complete patient data

#### Hospital Management:
- ✅ `hospital_assignments`: Patient-hospital-doctor assignments
- ✅ `hospital_beds`: Bed management and occupancy tracking
- ✅ `hospital_surgeries`: Surgery procedures and outcomes
- ✅ `hospital_stays`: Stay duration and billing information

#### Pharmacy Management:
- ✅ `prescriptions`: Doctor prescriptions
- ✅ `prescription_medications`: Individual medication items
- ✅ `medication_dispensing`: Dispensing records and history
- ✅ `pharmacy_inventory`: Stock levels and management
- ✅ `medication_interactions`: Drug interaction database

#### Laboratory Management:
- ✅ `test_requests`: Laboratory test orders
- ✅ `imaging_requests`: Medical imaging orders
- ✅ `test_results`: Laboratory results storage
- ✅ `imaging_results`: Imaging results and radiologist reports
- ✅ `laboratory_technicians`: Technician assignments and specializations

#### Medical Records:
- ✅ `consultations`: Doctor consultations and visits
- ✅ `constantes_vitales`: Vital signs and measurements
- ✅ `antecedents_medicaux`: Medical history
- ✅ `allergies`: Patient allergies and reactions
- ✅ `vaccinations`: Vaccination records

### Database Views Utilized:

#### `comprehensive_patient_record`
- Complete patient medical history
- Aggregated data from all medical interactions
- Used for complete patient record retrieval

#### `hospital_patient_management`
- Hospital-specific patient view
- Current assignments and bed occupancy
- Stay duration and billing information

#### `pharmacy_patient_medications`
- Cross-pharmacy medication history
- Dispensing records and remaining quantities
- Drug interaction warnings

## API Endpoints

### Hospital Routes (`/api/hospital`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| GET | `/patients/search` | Search patients with hospital context | `verifyToken`, `isHospital` |
| GET | `/patients` | Get hospital patient list | `verifyToken`, `isHospital` |
| POST | `/patients/:patientId/admit` | Admit patient to hospital | `verifyToken`, `isHospital` |
| PUT | `/assignments/:assignmentId/discharge` | Discharge patient | `verifyToken`, `isHospital` |
| POST | `/patients/walk-in` | Add walk-in patient | `verifyToken`, `isHospital` |

### Pharmacy Routes (`/api/pharmacy`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| GET | `/patients/search` | Search patients with allergy info | `verifyToken`, `isPharmacy` |
| GET | `/patients/:patientId/prescriptions` | Get patient prescriptions | `verifyToken`, `isPharmacy` |
| GET | `/patients/:patientId/medications` | Get medication history | `verifyToken`, `isPharmacy` |
| POST | `/prescriptions/:prescriptionMedicationId/dispense` | Dispense medication | `verifyToken`, `isPharmacy` |
| POST | `/medications/check-interactions` | Check drug interactions | `verifyToken`, `isPharmacy` |

### Laboratory Routes (`/api/laboratory`)

| Method | Endpoint | Description | Middleware |
|--------|----------|-------------|------------|
| GET | `/patients/search` | Search patients with pending tests | `verifyToken`, `isLaboratory` |
| GET | `/patients/:patientId/test-requests` | Get test requests | `verifyToken`, `isLaboratory` |
| PUT | `/test-requests/:testRequestId/results` | Upload test results | `verifyToken`, `isLaboratory` |
| PUT | `/imaging-requests/:imagingRequestId/results` | Upload imaging results | `verifyToken`, `isLaboratory` |
| GET | `/pending-work` | Get pending work queue | `verifyToken`, `isLaboratory` |

## Security & Compliance

### Authentication & Authorization

#### JWT Token Structure:
```javascript
{
  id: user.id,
  nom_utilisateur: user.username,
  role: user.role, // 'hospital', 'pharmacy', 'laboratory', etc.
  prenom: user.first_name,
  nom: user.last_name,
  id_specifique_role: user.institution_id // Institution-specific ID
}
```

#### Role-Based Access Control:
- **Super Admin**: Full system access
- **Admin**: Administrative functions
- **Hospital**: Hospital-specific patient management
- **Pharmacy**: Prescription and medication management
- **Laboratory**: Test and imaging result management
- **Doctor**: Medical record access and consultation management

### GDPR Compliance

#### Patient Search Audit Logging:
```javascript
// Every patient search is logged with:
{
  searching_user_id: userId,
  searching_institution_id: institutionId,
  search_criteria: { prenom, nom, cne },
  search_results_count: resultsCount,
  search_reason: institutionType + ' patient search',
  search_timestamp: NOW()
}
```

#### Data Protection Measures:
- Input validation and sanitization
- SQL injection prevention
- Exact match searches only (no fuzzy matching for privacy)
- Audit trail for all patient data access
- Role-based data filtering

### Transaction Safety

#### Critical Operations Use Database Transactions:
```javascript
// Example: Medication dispensing
const connection = await db.getConnection();
await connection.beginTransaction();
try {
  // Update prescription status
  // Update inventory levels
  // Record dispensing history
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
}
```

## Code Organization

### File Structure:
```
backend/
├── controllers/
│   ├── hospital/
│   │   └── hospitalController.js
│   ├── pharmacy/
│   │   └── pharmacyController.js
│   ├── laboratory/
│   │   └── laboratoryController.js
│   └── medecin/
│       └── medicalRecordController.js (updated)
├── middlewares/
│   └── auth.js (enhanced)
├── routes/
│   ├── hospitalRoutes.js
│   ├── pharmacyRoutes.js
│   └── laboratoryRoutes.js
├── utils/
│   └── patientSearch.js (new)
├── config/
│   └── db.js
└── server.js (updated)
```

### Code Quality Measures:

#### Error Handling:
```javascript
try {
  // Operation logic
  return res.status(200).json(result);
} catch (error) {
  console.error('Operation error:', error);
  return res.status(500).json({ 
    message: error.message || 'Erreur serveur'
  });
}
```

#### Input Validation:
```javascript
// Consistent validation across all controllers
if (!prenom && !nom && !cne) {
  throw new Error('Au moins un critère de recherche doit être fourni');
}
```

#### Response Standardization:
```javascript
// Consistent response format
return res.status(200).json({
  patients: results,
  searchCriteria: { prenom, nom, cne },
  totalResults: results.length
});
```

## Testing & Deployment

### Environment Configuration

#### Required Environment Variables:
```bash
# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=plateforme_medicale

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
```

### Database Setup Requirements:

1. **Import Complete Database Schema**:
   ```sql
   SOURCE improved_complete_db.sql;
   ```

2. **Verify Required Tables**:
   - All institution-specific tables (hospital_assignments, medication_dispensing, etc.)
   - Audit tables (patient_search_audit, historique_actions)
   - Views (comprehensive_patient_record, hospital_patient_management)

3. **Create Institution Users**:
   - Hospital users with role 'hospital'
   - Pharmacy users with role 'pharmacy'
   - Laboratory users with role 'laboratory'

### Deployment Checklist:

- ✅ All controllers implemented and tested
- ✅ Routes properly configured with middleware
- ✅ Database schema supports all features
- ✅ Environment variables documented
- ✅ Error handling implemented
- ✅ Audit logging functional
- ✅ Security measures in place
- ✅ Code documentation complete

## Key Features Summary

### 🔍 **Unified Patient Search**
- Exact match search by first name, last name, and CNE
- Consistent across all institution types
- GDPR-compliant audit logging
- Institution-specific additional data

### 🏥 **Hospital Management**
- Patient admission and discharge workflow
- Multi-doctor assignments per patient
- Bed management and occupancy tracking
- Surgery and procedure recording

### 💊 **Pharmacy Operations**
- Prescription viewing and management
- Medication dispensing with inventory control
- Cross-pharmacy medication history
- Drug interaction checking

### 🧪 **Laboratory Services**
- Test and imaging request management
- Result uploading with technician assignment
- Pending work queue organization
- Integration with doctor/hospital systems

### 🔐 **Security & Compliance**
- Role-based access control
- JWT authentication
- GDPR-compliant audit trails
- Input validation and sanitization

### 📊 **Database Integration**
- Full utilization of existing schema
- Optimized queries with proper indexing
- Transaction safety for critical operations
- Comprehensive views for complex data

## Conclusion

This implementation provides a complete, production-ready backend infrastructure for a multi-institution medical platform. The system maintains data security, ensures audit compliance, and provides consistent user experience across different institution types while leveraging the existing database schema effectively.

The modular design allows for easy maintenance and future enhancements, while the shared utilities ensure consistency and reduce code duplication. All institution types can now efficiently access and manage patient medical records according to their specific roles and requirements. 
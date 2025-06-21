# Analysis Workflow Separation - Implementation Summary

## Issue Description
Previously, doctors could directly add analysis results with values to the database, which violated the proper medical workflow where:
- **Doctors** should only be able to **request** tests/analyses/imaging
- **Laboratories** should be the only ones able to **provide actual results** with values

## Changes Made

### 1. Database Structure Updates

#### New File: `04_medical_analysis/05_analysis_workflow_fix.sql`
- Updated `resultats_analyses` table with proper workflow fields:
  - `request_status` ENUM('requested', 'in_progress', 'completed', 'validated')
  - `priority` ENUM('normal', 'urgent')
  - `clinical_indication` TEXT - Required field for requests
  - `sample_type` VARCHAR(50)
  - `requesting_institution_id` INT
  - Additional workflow tracking fields

- Updated `resultats_imagerie` table with similar workflow fields:
  - `request_status` ENUM('requested', 'scheduled', 'in_progress', 'completed', 'validated')
  - `priority` ENUM('routine', 'urgent', 'stat', 'emergency')
  - `clinical_indication` TEXT
  - `patient_preparation_instructions` TEXT
  - `contrast_required` BOOLEAN
  - Additional imaging-specific fields

- Created `laboratory_technicians` table for proper technician management
- Added proper indexes and foreign key constraints

### 2. Medical Record Controller Changes (`medicalRecordController.js`)

#### Removed Functions (Doctor Restrictions):
- ❌ `addAnalysisResult` - Doctors can no longer add results directly
- ❌ `updateAnalysisResult` - Doctors can no longer modify results
- ❌ `deleteAnalysisResult` - Doctors can no longer delete results

#### New Functions (Doctor Capabilities):
- ✅ `requestAnalysis` - Doctors can request analysis tests
- ✅ `updateAnalysisRequest` - Doctors can modify their requests (only if not yet processed)
- ✅ `cancelAnalysisRequest` - Doctors can cancel their requests (only if not yet processed)
- ✅ `requestImaging` - Doctors can request imaging studies
- ✅ `updateImagingRequest` - Doctors can modify imaging requests
- ✅ `cancelImagingRequest` - Doctors can cancel imaging requests
- ✅ `getImagingTypes` - Get available imaging types

### 3. Laboratory Controller Updates (`laboratoryController.js`)

#### Enhanced Functions:
- ✅ `uploadTestResults` - Labs can provide actual test results with values
- ✅ `uploadImagingResults` - Labs can provide actual imaging results
- ✅ `getPendingWork` - Updated to show proper request workflow
- ✅ `acceptTestRequest` - Labs can accept/assign test requests
- ✅ `acceptImagingRequest` - Labs can accept/assign imaging requests

### 4. Routes Updates

#### Medical Routes (`medecinRoutes.js`):
```javascript
// OLD (removed)
router.post('/medecin/patients/:patientId/analyses', ...)
router.put('/medecin/patients/:patientId/analyses/:analysisId', ...)
router.delete('/medecin/patients/:patientId/analyses/:analysisId', ...)

// NEW (added)
router.post('/medecin/patients/:patientId/analysis-requests', ...)
router.put('/medecin/patients/:patientId/analysis-requests/:requestId', ...)
router.delete('/medecin/patients/:patientId/analysis-requests/:requestId', ...)
router.post('/medecin/patients/:patientId/imaging-requests', ...)
router.put('/medecin/patients/:patientId/imaging-requests/:requestId', ...)
router.delete('/medecin/patients/:patientId/imaging-requests/:requestId', ...)
```

#### Laboratory Routes (`laboratoryRoutes.js`):
```javascript
// NEW (added)
router.post('/test-requests/:testRequestId/accept', ...)
router.post('/imaging-requests/:imagingRequestId/accept', ...)
```

## Workflow Process

### 1. Doctor Workflow:
1. **Request Analysis**: Doctor creates analysis request with clinical indication
2. **Request Imaging**: Doctor creates imaging request with clinical details
3. **Modify Requests**: Doctor can modify requests only if status is 'requested'
4. **Cancel Requests**: Doctor can cancel requests only if not yet processed
5. **View Results**: Doctor can view completed results (read-only)

### 2. Laboratory Workflow:
1. **View Pending Work**: Lab sees all pending requests
2. **Accept Requests**: Lab accepts and assigns requests to technicians
3. **Provide Results**: Lab technicians enter actual test/imaging results
4. **Update Status**: System automatically updates request status

## Database Installation

To apply these changes to an existing database:

```sql
SOURCE documentation/database/04_medical_analysis/05_analysis_workflow_fix.sql;
```

Or for a fresh installation, the `master_install.sql` has been updated to include this file automatically.

## Benefits

1. **Proper Medical Workflow**: Enforces correct separation of responsibilities
2. **Data Integrity**: Prevents doctors from entering lab results directly
3. **Audit Trail**: Complete tracking of requests and results
4. **Status Management**: Clear request status tracking
5. **Institution Management**: Proper assignment of work to laboratories
6. **Technician Tracking**: Links results to specific technicians

## Breaking Changes

⚠️ **Frontend Impact**: Any frontend code that was directly calling the old analysis result endpoints will need to be updated to use the new request-based endpoints.

⚠️ **API Changes**: The API structure has changed from result-based to request-based workflow.

## Migration Notes

For existing data, the workflow fix script uses `ALTER TABLE` with `IF NOT EXISTS` clauses to safely add new columns without breaking existing installations. 
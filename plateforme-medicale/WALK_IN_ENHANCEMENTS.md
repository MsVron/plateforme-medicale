# Walk-In Patient Management Enhancements

## Overview

This document describes the enhancements made to the patient management system to support walk-in patients and improve doctor dashboard functionality. The implementation includes two main features:

1. **Enhanced Patient Search for Walk-In Patients**
2. **Walk-In Preference Management for Doctors**

## Features

### 1. Enhanced Patient Search

#### Description
Enables doctors to search for patients in the system using exact matches for first name, last name, and CNE (unique identifier).

#### Key Features
- **Exact Match Search**: No partial matches for names and CNE
- **Multiple Search Criteria**: Search by any combination of first name, last name, and CNE
- **Security**: Input sanitization and SQL injection prevention
- **Performance**: Database indexing for optimized search queries
- **Audit Trail**: All searches are logged for security purposes

#### API Endpoints

**GET** `/api/medecin/patients/search`

**Query Parameters:**
- `prenom` (optional): Exact first name
- `nom` (optional): Exact last name  
- `cne` (optional): Exact CNE

**Example Request:**
```javascript
GET /api/medecin/patients/search?prenom=Mohamed&nom=Alami
```

**Response:**
```json
{
  "patients": [
    {
      "id": 1,
      "prenom": "Mohamed",
      "nom": "Alami",
      "date_naissance": "1990-01-15",
      "sexe": "M",
      "CNE": "AB123456",
      "email": "mohamed.alami@email.com",
      "telephone": "+212600000000",
      "est_inscrit_par_medecin": false,
      "a_rendez_vous_avec_medecin": true
    }
  ],
  "searchCriteria": {
    "prenom": "Mohamed",
    "nom": "Alami",
    "cne": null
  },
  "totalResults": 1
}
```

#### Frontend Implementation

**Location:** `frontend/src/pages/medecin/PatientSearch.jsx`

**Features:**
- Separate input fields for each search criterion
- Real-time validation
- Clear search functionality
- Results display with patient status indicators
- Walk-in patient identification

### 2. Walk-In Preference Management

#### Description
Allows doctors to configure whether they accept walk-in patients (patients without appointments).

#### Key Features
- **Toggle Interface**: Simple on/off switch
- **Persistent Storage**: Preference saved in database
- **Public Visibility**: Preference visible to patients during doctor search
- **Audit Trail**: Changes logged for security purposes

#### Database Schema

**New Field in `medecins` table:**
```sql
accepte_patients_walk_in BOOLEAN DEFAULT TRUE
```

**New Index:**
```sql
CREATE INDEX idx_medecins_walk_in ON medecins(accepte_patients_walk_in);
```

#### API Endpoints

**GET** `/api/medecin/walk-in-preference`

**Response:**
```json
{
  "accepte_patients_walk_in": true
}
```

**PUT** `/api/medecin/walk-in-preference`

**Request Body:**
```json
{
  "accepte_patients_walk_in": false
}
```

**Response:**
```json
{
  "message": "Préférence walk-in mise à jour avec succès",
  "accepte_patients_walk_in": false
}
```

#### Frontend Implementation

**Component:** `frontend/src/components/medecin/WalkInPreferenceToggle.jsx`

**Features:**
- Material-UI Switch component
- Loading states
- Error handling
- Success feedback
- Visual indicators (icons and chips)

## Database Changes

### New Fields
1. `medecins.accepte_patients_walk_in` - Boolean field for walk-in preference

### New Indexes
1. `idx_medecins_walk_in` - Index on walk-in preference
2. `idx_patients_prenom` - Index on patient first name
3. `idx_patients_nom` - Index on patient last name
4. `idx_patients_prenom_nom` - Composite index on first and last name

### Migration Script
**Location:** `backend/migrations/add_walk_in_preference.sql`

**Usage:**
```bash
cd backend
node run-migration.js
```

## Security Considerations

### Input Validation
- All search inputs are sanitized and validated
- Minimum length requirements for search terms
- SQL injection prevention through parameterized queries

### Access Control
- Only authenticated doctors can search patients
- Walk-in preference can only be modified by the doctor themselves
- All actions are logged in the audit trail

### Data Privacy
- Patient search results are limited to essential information
- Full medical records require separate authorization
- Search activities are logged for compliance

## Performance Optimizations

### Database Indexes
- Optimized indexes for exact name searches
- Composite indexes for multi-field searches
- Walk-in preference index for public doctor searches

### Query Optimization
- Parameterized queries for better performance
- Limited result sets (max 50 patients per search)
- Efficient JOIN operations

## Error Handling

### Backend Error Responses
- Validation errors with specific field information
- Descriptive error messages
- Proper HTTP status codes

### Frontend Error Handling
- User-friendly error messages
- Input validation feedback
- Network error recovery

## Testing

### Manual Testing Scenarios

#### Patient Search
1. Search with exact first name only
2. Search with exact last name only
3. Search with exact CNE only
4. Search with multiple criteria
5. Search with invalid/short inputs
6. Search with no results

#### Walk-In Preference
1. Toggle preference on/off
2. Verify persistence across sessions
3. Test error scenarios (network issues)
4. Verify public visibility

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test patient search
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/medecin/patients/search?prenom=Mohamed"

# Test walk-in preference
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/medecin/walk-in-preference"
```

## Deployment

### Prerequisites
1. Database migration must be run
2. Frontend components must be built
3. Backend routes must be deployed

### Deployment Steps
1. Run database migration
2. Deploy backend changes
3. Deploy frontend changes
4. Verify functionality

## Future Enhancements

### Potential Improvements
1. **Advanced Search Filters**: Add filters for age, location, etc.
2. **Search History**: Save recent searches for quick access
3. **Bulk Operations**: Allow bulk actions on search results
4. **Export Functionality**: Export search results to CSV/PDF
5. **Real-time Updates**: WebSocket updates for preference changes

### Integration Opportunities
1. **Appointment Scheduling**: Direct booking from search results
2. **Notification System**: Alerts when walk-in preference changes
3. **Analytics Dashboard**: Search patterns and usage statistics
4. **Mobile App**: Native mobile interface for search functionality

## Support and Maintenance

### Monitoring
- Monitor search performance and usage patterns
- Track walk-in preference adoption rates
- Monitor error rates and user feedback

### Maintenance Tasks
- Regular index optimization
- Audit log cleanup
- Performance monitoring
- Security updates

## Troubleshooting

### Common Issues

#### Search Not Working
1. Check database indexes are created
2. Verify API endpoint accessibility
3. Check authentication token validity
4. Review server logs for errors

#### Walk-In Preference Not Saving
1. Verify database field exists
2. Check API endpoint permissions
3. Review network connectivity
4. Check browser console for errors

### Debug Commands
```bash
# Check database structure
DESCRIBE medecins;

# Check indexes
SHOW INDEX FROM medecins;
SHOW INDEX FROM patients;

# Check recent searches
SELECT * FROM historique_actions WHERE action_type = 'SEARCH_PATIENTS' ORDER BY date_action DESC LIMIT 10;
```

## Contact

For technical support or questions about these enhancements, please contact the development team. 
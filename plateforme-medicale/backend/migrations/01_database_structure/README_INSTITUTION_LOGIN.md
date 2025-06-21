# Institution Login Credentials System

## Overview

This system automatically generates login credentials for institutions when they are created through the admin interface. This allows institutions (hospitals, clinics, pharmacies, laboratories) to log into the platform and access their respective dashboards.

## How It Works

### 1. Automatic Username Generation

When an institution is created, the system automatically generates a username based on:
- Institution type (hôpital, clinique, pharmacie, laboratoire)
- Institution name (cleaned and normalized)

**Format:** `{type}.{cleanedName}`

**Examples:**
- "Hôpital Mohammed V" → `hôpital.mohammedv`
- "Clinique Al Farabi" → `clinique.alfarabi`
- "Pharmacie Centrale" → `pharmacie.centrale`

### 2. Exclusions

**Cabinet privé** institutions do NOT get automatic login credentials as they are managed differently in the system.

### 3. Duplicate Handling

If a username already exists, the system appends a number:
- `hôpital.alfarabi1`
- `hôpital.alfarabi2`
- etc.

### 4. Password Generation

- Temporary passwords are randomly generated (16 characters)
- Mix of uppercase, lowercase, and numbers
- Passwords are properly hashed with bcrypt before storage

## Database Changes

### New Table: `institution_user_creation_log`

Tracks all generated credentials for audit purposes:

```sql
CREATE TABLE institution_user_creation_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    institution_nom VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    temp_password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_changed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);
```

### Updated `utilisateurs` Table

New user records are created with:
- `role`: Based on institution type (hospital, pharmacy, laboratory, institution)
- `id_specifique_role`: Links to the institution ID
- `est_verifie`: Set to TRUE (pre-verified)

## Migration Process

### For Existing Institutions

1. **Run SQL Migration:**
   ```bash
   mysql -u username -p database_name < add_institution_user_accounts.sql
   ```

2. **Hash Passwords:**
   ```bash
   cd plateforme-medicale/backend
   node scripts/setup/hash-institution-passwords.js
   ```

3. **Distribute Credentials:**
   The script will output all generated credentials for manual distribution to institutions.

### For New Institutions

Credentials are automatically generated when created through the admin interface. The admin will see a dialog with the generated credentials that can be copied and distributed.

## Security Considerations

1. **Temporary Passwords**: All generated passwords are temporary and institutions should change them on first login
2. **Secure Distribution**: Credentials should be distributed securely to institutions
3. **Audit Trail**: All credential generation is logged in the `institution_user_creation_log` table
4. **Password Complexity**: Generated passwords meet security requirements

## Frontend Changes

### Admin Interface

- New credentials dialog shows generated username and password
- Copy-to-clipboard functionality for easy distribution
- Clear warnings about password security

### Institution Login

Institutions can now log in using:
- Their generated username (e.g., `hôpital.alfarabi`)
- Their temporary password (to be changed on first login)

## Role Mapping

| Institution Type | User Role | Dashboard Access |
|------------------|-----------|------------------|
| hôpital | hospital | Hospital Dashboard |
| clinique | hospital | Hospital Dashboard |
| centre médical | hospital | Hospital Dashboard |
| laboratoire | laboratory | Laboratory Dashboard |
| pharmacie | pharmacy | Pharmacy Dashboard |
| cabinet privé | institution | Institution Dashboard |

## Troubleshooting

### If credentials are not generated:
1. Check if institution type is "cabinet privé" (excluded)
2. Verify database connection
3. Check backend logs for errors

### If username conflicts occur:
The system automatically handles conflicts by appending numbers. No manual intervention needed.

### If passwords need to be reset:
Use the standard password reset mechanism or generate new credentials through the admin interface.

## Files Modified

### Backend:
- `routes/adminRoutes.js` - Institution creation logic
- `scripts/setup/hash-institution-passwords.js` - Password hashing script
- `migrations/01_database_structure/add_institution_user_accounts.sql` - Database migration

### Frontend:
- `pages/admin/InstitutionManagement.jsx` - Admin interface with credentials dialog

## Testing

1. Create a new institution through admin interface
2. Verify credentials are generated (except for cabinet privé)
3. Test login with generated credentials
4. Verify institution can access appropriate dashboard
5. Test password change functionality

## Future Enhancements

1. **Password Reset**: Implement dedicated password reset for institutions
2. **Email Notifications**: Automatically email credentials to institutions
3. **First Login Flow**: Force password change on first login
4. **Credential Management**: Admin interface to view/reset institution credentials 
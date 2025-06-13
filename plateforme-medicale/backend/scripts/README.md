# Scripts Directory

This directory contains all utility scripts, tests, and setup scripts for the medical platform backend.

## Directory Structure

```
scripts/
├── tests/          # Test scripts for various components
├── setup/          # Database setup and migration scripts
├── utils/          # Utility scripts for maintenance and checks
└── README.md       # This file
```

## Tests (`/tests`)

### AI and Performance Tests
- **test-phi3-mini.js** - Tests for Phi3 Mini AI model integration
- **test-fast.js** - Fast performance tests for core functionality
- **test-optimized.js** - Optimized performance testing suite
- **test-quick.js** - Quick smoke tests for basic functionality
- **test_bold_formatting.js** - Tests for text formatting features

### Feature Tests
- **test-slots.js** - Tests for appointment slot management
- **test-email.js** - Email service functionality tests
- **test-db.js** - Database connection and query tests
- **test-appointments-api.js** - Appointment API endpoint tests

### Running Tests
```bash
# Run individual tests
node scripts/tests/test-db.js
node scripts/tests/test-email.js

# Run all tests (if you have a test runner)
npm test
```

## Setup (`/setup`)

### Database Setup
- **setup-data.js** - Initial data setup for the database
- **run-migration.js** - Single migration runner
- **apply-migration.js** - Apply specific migration
- **apply-all-migrations.js** - Apply all pending migrations

### Sample Data
- **add-comprehensive-analysis-types.js** - Add medical analysis types to database
- **add-sample-allergies.js** - Add sample allergy data
- **add-sample-medications.js** - Add sample medication data
- **create-doctor-user.js** - Create sample doctor user accounts

### Usage
```bash
# Setup initial database
node scripts/setup/setup-data.js

# Apply all migrations
node scripts/setup/apply-all-migrations.js

# Add sample data
node scripts/setup/add-sample-medications.js
node scripts/setup/add-sample-allergies.js
```

## Utils (`/utils`)

### System Utilities
- **check-database-structure.js** - Verify database schema and structure
- **check-users.js** - Check user accounts and permissions
- **generateHash.js** - Generate password hashes for testing
- **optimize-ollama.js** - Optimize Ollama AI service configuration

### Usage
```bash
# Check database structure
node scripts/utils/check-database-structure.js

# Check user accounts
node scripts/utils/check-users.js

# Generate password hash
node scripts/utils/generateHash.js
```

## Best Practices

1. **Before running setup scripts**: Ensure your database is properly configured
2. **Before running tests**: Make sure your test database is set up
3. **Environment variables**: Ensure all required environment variables are set
4. **Backup**: Always backup your database before running migration scripts

## Environment Requirements

- Node.js 16+
- MySQL 8.0+
- Required environment variables:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `JWT_SECRET`
  - Email service credentials (for email tests)

## Troubleshooting

If you encounter issues:

1. Check database connection: `node scripts/tests/test-db.js`
2. Verify environment variables are set
3. Ensure database permissions are correct
4. Check logs in the main application for detailed error messages 
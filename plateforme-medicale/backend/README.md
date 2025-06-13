# 🏥 Medical Platform Backend

A comprehensive Node.js/Express backend for a medical platform with AI-powered diagnosis assistance.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up database
node scripts/setup/setup-data.js

# Apply migrations
node scripts/setup/apply-all-migrations.js

# Start the server
npm start
```

## 📁 Project Structure

```
backend/
├── 🤖 ai/              # AI services and configuration
├── 🛠️ scripts/         # Organized scripts (tests, setup, utils)
├── 🎮 controllers/     # Request handlers
├── 🛣️ routes/          # API endpoints
├── 🔒 middlewares/     # Authentication & validation
├── 🔧 services/        # Business logic services
├── 🛠️ utils/           # Helper utilities
├── ⚙️ config/          # Configuration files
├── 📊 migrations/      # Database migrations
├── 🚀 server.js        # Main server file
└── 📱 app.js           # Express app configuration
```

## 🔧 Key Features

- **AI-Powered Diagnosis**: Integrated AI assistant for medical diagnosis
- **Multi-Role Authentication**: Support for patients, doctors, admins, institutions
- **Appointment Management**: Complete booking and scheduling system
- **Medical Records**: Comprehensive patient history and treatment tracking
- **Geolocation Services**: Find nearby healthcare providers
- **Email Notifications**: Automated appointment and system notifications

## 📚 Documentation

- **[Scripts Documentation](scripts/README.md)** - All test, setup, and utility scripts
- **[AI System Documentation](ai/README.md)** - AI services and configuration
- **[Organization Summary](ORGANIZATION_SUMMARY.md)** - Complete project organization details

## 🧪 Testing

```bash
# Test database connection
node scripts/tests/test-db.js

# Test email service
node scripts/tests/test-email.js

# Test AI services
node scripts/tests/test-fast.js
```

## 🛠️ Development

### Database Setup
```bash
# Check database structure
node scripts/utils/check-database-structure.js

# Add sample data
node scripts/setup/add-sample-medications.js
node scripts/setup/add-sample-allergies.js
```

### User Management
```bash
# Create doctor accounts
node scripts/setup/create-doctor-user.js

# Check user accounts
node scripts/utils/check-users.js
```

## 🌟 Technologies

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT + bcrypt
- **AI Integration**: Ollama, OpenAI, Hugging Face
- **Email**: Nodemailer
- **Validation**: Custom validation middleware

## 📝 Environment Variables

Required environment variables:
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `EMAIL_*` - Email service configuration
- `AI_*` - AI service API keys

## 🤝 Contributing

1. Follow the organized directory structure
2. Add tests for new features in `scripts/tests/`
3. Document new utilities in the appropriate README
4. Use the existing code patterns and conventions

## 📞 Support

For issues or questions:
1. Check the documentation in each directory
2. Run diagnostic scripts in `scripts/utils/`
3. Review the organization summary for project structure

---

**Professional medical platform backend - organized, documented, and ready for production! 🚀** 
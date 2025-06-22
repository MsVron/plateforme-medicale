# 🏥 Medical Platform Database Documentation

## 📋 Quick Start
This folder contains the organized database structure for the medical platform, with all SQL files categorized and documented for better maintainability.

**📖 For comprehensive documentation:** See `00_DATABASE_STRUCTURE.md` for detailed structure overview.

## 🚀 Installation

To install the complete database structure:

```sql
SOURCE master_install.sql;
```

This executes all SQL files in the correct dependency order.

## 🗂️ Directory Structure

### **📁 Core Foundation (01-05)**
- **`01_core_tables/`** - Essential platform foundation tables
- **`02_medical_data/`** - Patient medical information
- **`03_appointments_consultations/`** - Scheduling and consultations  
- **`04_medical_analysis/`** - Laboratory and imaging systems
- **`05_system_management/`** - System administration

### **📁 Advanced Features (06-12)**
- **`06_patient_care/`** - Advanced patient care features
- **`07_institutional_management/`** - Multi-institution features
- **`08_access_tracking/`** - GDPR compliance and access logs
- **`09_data_initialization/`** - Sample data and initial setup
- **`10_foreign_keys_constraints/`** - Database integrity
- **`11_views_triggers/`** - Database automation
- **`12_medical_record_completeness/`** - Medical record analytics

### **📁 Recent Updates & Maintenance**
- **`13_pharmacy_simplification/`** - 💊 Pharmacy system simplification (Latest)
- **`99_maintenance_scripts/`** - 🔧 Database maintenance and cleanup tools

## ✨ Key Features

### **🩺 Comprehensive Medical Analysis System**
150+ medical analysis types organized into categories:
- Hematology (blood tests)
- Biochemistry (metabolic tests)  
- Endocrinology (hormones)
- Immunology (immune system)
- Microbiology (infections)
- Vitamins and minerals
- Tumor markers
- Cardiology markers
- Coagulation tests
- Urology tests

### **👥 Multi-Role Authentication**
Support for multiple user roles:
- **Super Admin** - Platform administration
- **Admin** - Institution administration
- **Médecin** - Doctor/physician
- **Patient** - End users
- **Institution** - Pharmacy, Hospital, Laboratory staff

### **🔒 GDPR Compliance**
Built-in access tracking for sensitive patient data:
- Prescription access logs
- Analysis access logs
- Comprehensive audit trails
- Patient data access tracking

### **🏢 Multi-Institution Support**
Complete institution management:
- Change request approval workflows
- Hospital patient assignments
- Multi-institution doctor affiliations
- Cross-institution data access

### **💊 Simplified Pharmacy System** (Latest Update)
Streamlined prescription fulfillment:
- ✅ Online prescription visibility
- ✅ Simple "scratch off" for one-time medications
- ✅ Last purchase tracking for permanent medications
- ❌ No complex inventory management

## 🎯 Recent Updates

### **Pharmacy System Simplification** (Latest)
- Removed complex inventory management
- Added simple prescription fulfillment tracking
- Supports permanent vs one-time medication handling
- See `13_pharmacy_simplification/` for details

### **Database Organization** (This Update)
- Created comprehensive structure documentation
- Organized maintenance scripts
- Added detailed installation guides
- Improved directory structure

## 🔧 Maintenance

### **Regular Maintenance**
- Use scripts in `99_maintenance_scripts/` for cleanup
- Always backup before running maintenance scripts
- Test on development environment first

### **Orphaned Data Cleanup**
- Scripts available for cleaning orphaned medical cabinets
- Multiple versions with different safety levels
- See `99_maintenance_scripts/README.md` for usage

## 🛡️ Security Features

- **Password hashing** for user authentication
- **Role-based access control** with granular permissions
- **Audit logging** for all sensitive operations
- **GDPR-compliant** access tracking
- **IP address logging** for security monitoring
- **Session management** with timeout controls

## 🧪 Sample Data

### **Default Super Admin Account**
- Username: `ayaberroukech`
- Password: `admin`
- Email: `aya.beroukech@medical.com`

**⚠️ Change this password immediately in production!**

### **Sample Institutions**
- Medical institutions with different types
- Sample doctors with specialties
- Test patients for development

## 📚 Usage Guidelines

### **Development Environment**
1. Run `master_install.sql` for complete setup
2. Use sample data for testing
3. Check `00_DATABASE_STRUCTURE.md` for architecture details

### **Production Environment**
1. Review all scripts before execution
2. Backup existing database
3. Change default passwords
4. Configure proper user permissions
5. Set up regular backup procedures

### **Maintenance & Updates**
1. Always backup before maintenance
2. Use appropriate maintenance scripts
3. Test changes on development first
4. Document any customizations

## 📞 Support

### **Documentation**
- `00_DATABASE_STRUCTURE.md` - Complete architecture overview
- `13_pharmacy_simplification/README.md` - Pharmacy system changes
- `99_maintenance_scripts/README.md` - Maintenance procedures
- Individual SQL files contain inline documentation

### **Troubleshooting**
1. Check database error logs
2. Verify user permissions
3. Review foreign key constraints
4. Test with smaller datasets
5. Consult maintenance script documentation

## 🔄 Update History

| Version | Changes | Date | Status |
|---------|---------|------|--------|
| Latest | Pharmacy simplification, Documentation organization | Current | ✅ Active |
| Previous | GDPR compliance, Multi-institution support | Historical | ✅ Stable |
| Base | Core medical platform functionality | Foundation | ✅ Stable |

---

**📖 For detailed technical documentation, architecture diagrams, and implementation guides, see the comprehensive documentation in `00_DATABASE_STRUCTURE.md`** 
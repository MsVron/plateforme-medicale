# Documentation Structure

This directory contains all the documentation for the Medical Platform (Plateforme Médicale) project, organized into logical categories for easy navigation and maintenance.

## Directory Structure

### 📊 `/reports`
Contains project reports and analysis documents:
- `Rapport_PFA_Plateforme_Medicale(unfinished).md` - Main project report (work in progress)
- `FORM_VALIDATION_REPORT.md` - Form validation analysis and findings
- `FORM_VALIDATION_FIXES_SUMMARY.md` - Summary of form validation fixes implemented

### 📚 `/guides`
Implementation guides and technical documentation:
- `MULTI_INSTITUTION_FRONTEND_IMPLEMENTATION.md` - Multi-institution frontend implementation guide
- `AI_CHATBOT_INTEGRATION_GUIDE.md` - AI chatbot integration instructions
- `AI_DIAGNOSIS_IMPLEMENTATION_COMPLETE.md` - Complete AI diagnosis implementation guide
- `README_IMPROVEMENTS.md` - Documentation improvements and suggestions

### 🗄️ `/database`
Database-related documentation and structure:
- **Organized SQL structure directories** (01-12 numbered directories)
- `INSTITUTION_ENHANCEMENTS_SUMMARY.md` - Institution-related database enhancements
- `master_install.sql` - Master database installation script
- `create_diagnosis_tables.sql` - Diagnosis tables creation script
- `README.md` - Database structure documentation

### 🤖 `/ai-chatbot`
AI chatbot implementation files and notebooks:
- `Medical_Chatbot_phi3_mini.ipynb` - Jupyter notebook for medical chatbot using Phi-3 Mini
- `colab_complete_setup.py` - Complete setup script for Google Colab
- `colab_medical_chatbot_fixed.py` - Fixed version of the medical chatbot for Colab

### 📜 `/sql-scripts`
Standalone SQL scripts and database utilities:
- `improved_complete_db.sql` - Improved complete database schema
- `complete_db.sql` - Complete database schema
- `test-appointments.sql` - Test data for appointments
- `add_verification_table.sql` - Verification table addition script
- `initialize.sql` - Database initialization script

### 📈 `/diagrams`
Visual documentation and diagrams:
- `complete_db.svg` - Database schema diagram (SVG format)
- `complete_db.mermaid` - Database schema diagram (Mermaid format)
- **Subdirectories:**
  - `donnees/` - Data-related diagrams
  - `fonctionnel/` - Functional diagrams
  - `planning/` - Planning and timeline diagrams

### 📋 `/project-management`
Project management documents and notes:
- `présentation ntoes.txt` - Presentation notes

### 🎨 `/frontend`
Frontend-specific documentation (reserved for future use)

### ⚙️ `/backend`
Backend-specific documentation (reserved for future use)

## Navigation Tips

1. **For Database Information**: Start with `/database/README.md` for structure overview, then explore numbered directories (01-12) for specific components
2. **For Implementation**: Check `/guides` for step-by-step implementation instructions
3. **For AI Features**: Visit `/ai-chatbot` for chatbot implementation and `/guides` for AI diagnosis integration
4. **For Visual Understanding**: Use `/diagrams` for database schema and system architecture
5. **For Project Status**: Check `/reports` for current project status and analysis

## File Organization Principles

- **Logical Grouping**: Files are grouped by their primary purpose and audience
- **Clear Naming**: Descriptive filenames that indicate content and purpose
- **Hierarchical Structure**: Subdirectories for complex topics with multiple related files
- **Cross-References**: Related files are linked through this README and individual documentation

## Contributing to Documentation

When adding new documentation:
1. Choose the appropriate directory based on the content type
2. Use descriptive filenames with consistent naming conventions
3. Update this README if adding new categories or significant files
4. Include cross-references to related documentation where relevant

## Quick Access

- **Database Schema**: `/diagrams/complete_db.svg` or `/diagrams/complete_db.mermaid`
- **Main Project Report**: `/reports/Rapport_PFA_Plateforme_Medicale(unfinished).md`
- **AI Integration**: `/guides/AI_CHATBOT_INTEGRATION_GUIDE.md`
- **Database Setup**: `/database/master_install.sql`
- **Frontend Implementation**: `/guides/MULTI_INSTITUTION_FRONTEND_IMPLEMENTATION.md`

---

*Last Updated: [Current Date]*
*Documentation Structure Version: 1.0* 
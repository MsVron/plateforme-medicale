-- MASTER MIGRATION SCRIPT
-- Date: 2024
-- Description: Run all migrations for medical platform improvements
-- This script applies all database improvements in the correct order

-- ============================================================================
-- STEP 1: Run the main database structure improvements
-- ============================================================================
SOURCE improve_database_structure.sql;

-- ============================================================================
-- STEP 2: Fix missing categorie_id column in types_analyses
-- ============================================================================
SOURCE fix_missing_column.sql;

-- ============================================================================
-- STEP 3: Add missing unite column to types_analyses
-- ============================================================================
SOURCE add_missing_columns.sql;

-- ============================================================================
-- STEP 4: Populate analysis types with comprehensive medical data
-- ============================================================================
SOURCE populate_analysis_types.sql;

-- ============================================================================
-- STEP 5: Complete resultats_analyses table migration
-- ============================================================================
SOURCE complete_resultats_migration.sql;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check categories
SELECT 'Analysis Categories:' as info, COUNT(*) as count FROM categories_analyses;

-- Check analysis types with categories
SELECT 'Analysis Types with Categories:' as info, COUNT(*) as count 
FROM types_analyses WHERE categorie_id IS NOT NULL;

-- Check resultats_analyses structure
SELECT 'Resultats Analyses Columns:' as info, COUNT(*) as count 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'resultats_analyses' 
AND COLUMN_NAME IN ('valeur_numerique', 'valeur_texte', 'est_critique');

-- Check patients table enhancements
SELECT 'Patient Table Enhancements:' as info, COUNT(*) as count 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'patients' 
AND COLUMN_NAME IN ('contact_urgence_relation', 'allergies_notes');

-- Sample data verification
SELECT 'Sample Analysis Types by Category:' as info;
SELECT ca.nom as categorie, COUNT(ta.id) as types_count
FROM categories_analyses ca
LEFT JOIN types_analyses ta ON ca.id = ta.categorie_id
GROUP BY ca.id, ca.nom
ORDER BY ca.ordre_affichage;

COMMIT; 
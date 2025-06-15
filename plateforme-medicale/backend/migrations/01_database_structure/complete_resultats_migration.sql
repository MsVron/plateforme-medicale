-- Migration: Complete resultats_analyses table migration
-- Date: 2024
-- Description: Add missing columns for enhanced analysis results

-- Add missing columns for enhanced analysis results
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_numerique DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_texte TEXT DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS unite VARCHAR(20) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_normale_min DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_normale_max DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS est_critique BOOLEAN DEFAULT FALSE;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS notes_techniques TEXT DEFAULT NULL;

-- Migrate existing data from 'resultats' column to 'valeur_texte'
UPDATE resultats_analyses 
SET valeur_texte = resultats 
WHERE resultats IS NOT NULL AND valeur_texte IS NULL; 
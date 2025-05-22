-- Migration: Add walk-in preference to medecins table
-- Date: 2024-01-XX
-- Description: Adds accepte_patients_walk_in field to medecins table and creates indexes for better search performance

-- Add walk-in preference field to medecins table (if it doesn't exist)
ALTER TABLE medecins 
ADD COLUMN IF NOT EXISTS accepte_patients_walk_in BOOLEAN DEFAULT TRUE;

-- Add index for walk-in preference queries
CREATE INDEX IF NOT EXISTS idx_medecins_walk_in ON medecins(accepte_patients_walk_in);

-- Add indexes for exact name searches on patients table (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_patients_prenom ON patients(prenom);
CREATE INDEX IF NOT EXISTS idx_patients_nom ON patients(nom);
CREATE INDEX IF NOT EXISTS idx_patients_prenom_nom ON patients(prenom, nom);

-- Update existing doctors to have walk-in preference enabled by default
UPDATE medecins 
SET accepte_patients_walk_in = TRUE 
WHERE accepte_patients_walk_in IS NULL; 
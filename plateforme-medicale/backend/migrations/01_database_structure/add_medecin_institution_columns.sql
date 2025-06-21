-- Add missing columns to medecin_institution table
-- This migration adds departement and notes columns and renames date_debut to date_affectation

-- Add departement column
ALTER TABLE medecin_institution 
ADD COLUMN IF NOT EXISTS departement VARCHAR(100) DEFAULT NULL;

-- Add notes column  
ALTER TABLE medecin_institution 
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL;

-- Add date_affectation column (keeping date_debut for compatibility)
ALTER TABLE medecin_institution 
ADD COLUMN IF NOT EXISTS date_affectation DATE DEFAULT NULL;

-- Copy data from date_debut to date_affectation for existing records
UPDATE medecin_institution 
SET date_affectation = date_debut 
WHERE date_affectation IS NULL AND date_debut IS NOT NULL;

-- Make date_affectation NOT NULL like date_debut
ALTER TABLE medecin_institution 
MODIFY COLUMN date_affectation DATE NOT NULL;

COMMIT; 
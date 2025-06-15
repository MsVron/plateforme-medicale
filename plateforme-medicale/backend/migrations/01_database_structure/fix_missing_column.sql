-- Migration: Fix missing categorie_id column in types_analyses
-- Date: 2024
-- Description: Add categorie_id column and foreign key constraint to types_analyses table

-- Add categorie_id column if it doesn't exist
ALTER TABLE types_analyses ADD COLUMN IF NOT EXISTS categorie_id INT DEFAULT NULL;

-- Add ordre_affichage column if it doesn't exist  
ALTER TABLE types_analyses ADD COLUMN IF NOT EXISTS ordre_affichage INT DEFAULT 0;

-- Set default category for existing records (Autre category)
UPDATE types_analyses 
SET categorie_id = (SELECT id FROM categories_analyses WHERE nom = 'Autre' LIMIT 1) 
WHERE categorie_id IS NULL;

-- Add foreign key constraint
ALTER TABLE types_analyses 
ADD CONSTRAINT IF NOT EXISTS fk_types_analyses_categorie 
FOREIGN KEY (categorie_id) REFERENCES categories_analyses(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_types_analyses_categorie 
ON types_analyses(categorie_id, ordre_affichage); 
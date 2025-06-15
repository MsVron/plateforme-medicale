-- 1. Remove the teleconsultation column from consultations table
ALTER TABLE consultations
DROP COLUMN is_teleconsultation;

-- 2. Update any existing teleconsultation appointments to présentiel
UPDATE rendez_vous
SET mode = 'présentiel'
WHERE mode = 'téléconsultation';

-- 3. Modify the ENUM to remove the téléconsultation option
ALTER TABLE rendez_vous
MODIFY COLUMN mode ENUM('présentiel') DEFAULT 'présentiel';

-- 4. Update any frontend configuration that might reference teleconsultation
-- This is a placeholder for any additional configuration changes that might be needed
-- in case there are configuration tables that store UI options 
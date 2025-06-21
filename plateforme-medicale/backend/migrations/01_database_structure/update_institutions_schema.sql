-- Update institutions table schema
-- Add 'pharmacie' to type ENUM and change default country

-- Update the type ENUM to include 'pharmacie'
ALTER TABLE institutions 
MODIFY COLUMN type ENUM('hôpital','clinique','cabinet privé','centre médical','laboratoire','pharmacie','autre') NOT NULL DEFAULT 'autre';

-- Update the type_institution ENUM to map to user roles correctly
-- hôpital, clinique, centre médical -> hospital role
-- laboratoire -> laboratory role  
-- pharmacie -> pharmacy role
-- cabinet privé -> institution role
ALTER TABLE institutions 
MODIFY COLUMN type_institution ENUM('hospital', 'pharmacy', 'laboratory', 'institution') DEFAULT 'institution';

-- Update the default country to 'Maroc' for new records
ALTER TABLE institutions 
MODIFY COLUMN pays VARCHAR(50) NOT NULL DEFAULT 'Maroc';

-- Update existing records that have 'France' as country to 'Maroc'
UPDATE institutions SET pays = 'Maroc' WHERE pays = 'France';

-- Update existing records to map institution types to correct user roles
UPDATE institutions SET type_institution = 'hospital' WHERE type IN ('hôpital', 'clinique', 'centre médical');
UPDATE institutions SET type_institution = 'laboratory' WHERE type = 'laboratoire';
UPDATE institutions SET type_institution = 'pharmacy' WHERE type = 'pharmacie';
UPDATE institutions SET type_institution = 'institution' WHERE type = 'cabinet privé' OR type_institution IS NULL; 
-- Fix for missing handicap columns in patients table
-- Run this script in phpMyAdmin to add the missing columns

-- Add all handicap-related columns to the patients table
ALTER TABLE patients 
ADD COLUMN a_handicap BOOLEAN DEFAULT FALSE AFTER profession,
ADD COLUMN type_handicap ENUM('moteur', 'sensoriel', 'intellectuel', 'psychique', 'multiple', 'autre') DEFAULT NULL AFTER a_handicap,
ADD COLUMN type_handicap_autre VARCHAR(100) DEFAULT NULL AFTER type_handicap,
ADD COLUMN niveau_handicap ENUM('léger', 'modéré', 'sévère') DEFAULT NULL AFTER type_handicap_autre,
ADD COLUMN description_handicap TEXT DEFAULT NULL AFTER niveau_handicap,
ADD COLUMN besoins_accessibilite TEXT DEFAULT NULL AFTER description_handicap,
ADD COLUMN equipements_medicaux TEXT DEFAULT NULL AFTER besoins_accessibilite,
ADD COLUMN autonomie_niveau ENUM('autonome', 'assistance_partielle', 'assistance_totale') DEFAULT NULL AFTER equipements_medicaux;

-- Add indexes for better performance
CREATE INDEX idx_patients_handicap ON patients(a_handicap);
CREATE INDEX idx_patients_type_handicap ON patients(type_handicap);

-- Set default values for existing patients
UPDATE patients SET a_handicap = FALSE WHERE a_handicap IS NULL;

-- Verify the changes
DESCRIBE patients; 
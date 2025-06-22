-- Migration: Add handicap/disability fields to patients table
-- Date: 2024-12-19
-- Purpose: Enable tracking of patient disability information in medical records

ALTER TABLE patients 
ADD COLUMN a_handicap BOOLEAN DEFAULT FALSE AFTER profession,
ADD COLUMN type_handicap ENUM('moteur', 'sensoriel', 'intellectuel', 'psychique', 'multiple', 'autre') DEFAULT NULL AFTER a_handicap,
ADD COLUMN type_handicap_autre VARCHAR(100) DEFAULT NULL AFTER type_handicap,
ADD COLUMN niveau_handicap ENUM('léger', 'modéré', 'sévère') DEFAULT NULL AFTER type_handicap_autre,
ADD COLUMN description_handicap TEXT DEFAULT NULL AFTER niveau_handicap,
ADD COLUMN besoins_accessibilite TEXT DEFAULT NULL AFTER description_handicap,
ADD COLUMN equipements_medicaux TEXT DEFAULT NULL AFTER besoins_accessibilite,
ADD COLUMN autonomie_niveau ENUM('autonome', 'assistance_partielle', 'assistance_totale') DEFAULT NULL AFTER equipements_medicaux;

-- Add index for handicap status for efficient queries
CREATE INDEX idx_patients_handicap ON patients(a_handicap);
CREATE INDEX idx_patients_type_handicap ON patients(type_handicap);

-- Update existing patients to have handicap status set to FALSE if NULL
UPDATE patients SET a_handicap = FALSE WHERE a_handicap IS NULL; 
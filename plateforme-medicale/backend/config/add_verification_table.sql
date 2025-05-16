-- Create the verification_patients table if it doesn't exist
CREATE TABLE IF NOT EXISTS `verification_patients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `date_expiration` DATETIME NOT NULL,
  `est_verifie` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
);

-- Add est_verifie column to utilisateurs table if it doesn't exist
ALTER TABLE `utilisateurs` 
ADD COLUMN IF NOT EXISTS `est_verifie` BOOLEAN DEFAULT FALSE; 
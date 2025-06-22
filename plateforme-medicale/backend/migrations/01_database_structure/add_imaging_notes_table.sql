-- Add imaging notes table for doctor notes on imaging results
-- This migration adds the ability for doctors to add notes/comments on imaging results

-- Table des notes médicales sur les résultats d'imagerie
CREATE TABLE IF NOT EXISTS imaging_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  imaging_result_id INT NOT NULL,
  medecin_id INT NOT NULL,
  patient_id INT NOT NULL,
  note_content TEXT NOT NULL,
  note_type ENUM('observation', 'interpretation', 'follow_up', 'concern', 'recommendation') DEFAULT 'observation',
  is_important BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (imaging_result_id) REFERENCES resultats_imagerie(id) ON DELETE CASCADE,
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  INDEX idx_imaging_notes_result (imaging_result_id),
  INDEX idx_imaging_notes_patient (patient_id),
  INDEX idx_imaging_notes_medecin (medecin_id),
  INDEX idx_imaging_notes_created (created_at)
);

-- Add uploads directory path to serve static files
-- Note: The uploads directory needs to be created at plateforme-medicale/backend/uploads/imaging/
-- This directory will store uploaded imaging files

-- Update any existing imaging results to ensure image_urls field can handle longer URLs
ALTER TABLE resultats_imagerie MODIFY COLUMN image_urls TEXT; 
-- MEDICAL IMAGING
-- Medical imaging types and results management

-- Table des types d'imagerie
CREATE TABLE types_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Table des résultats d'imagerie
CREATE TABLE resultats_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type_imagerie_id INT NOT NULL,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription DATE NOT NULL,
  date_realisation DATE,
  institution_realisation_id INT,
  interpretation TEXT,
  conclusion TEXT,
  image_urls TEXT,
  medecin_radiologue_id INT,
  date_interpretation DATETIME,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (type_imagerie_id) REFERENCES types_imagerie(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_realisation_id) REFERENCES institutions(id),
  FOREIGN KEY (medecin_radiologue_id) REFERENCES medecins(id)
);

-- Table des notes médicales sur les résultats d'imagerie
CREATE TABLE imaging_notes (
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
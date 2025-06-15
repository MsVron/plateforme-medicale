-- MEDICAL HISTORY AND ALLERGIES
-- Patient allergies, medical antecedents, and related medical history

-- Table des allergies
CREATE TABLE allergies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Table de liaison patient-allergies
CREATE TABLE patient_allergies (
  patient_id INT NOT NULL,
  allergie_id INT NOT NULL,
  date_diagnostic DATE,
  severite ENUM('légère', 'modérée', 'sévère', 'mortelle') NOT NULL,
  notes TEXT,
  PRIMARY KEY (patient_id, allergie_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (allergie_id) REFERENCES allergies(id)
);

-- Table des antécédents médicaux
CREATE TABLE antecedents_medicaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type ENUM('medical', 'chirurgical', 'familial') NOT NULL,
  description TEXT NOT NULL,
  date_debut DATE,
  date_fin DATE,
  est_chronique BOOLEAN DEFAULT FALSE,
  medecin_id INT,
  date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
); 
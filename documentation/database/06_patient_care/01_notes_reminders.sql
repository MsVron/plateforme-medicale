-- PATIENT CARE AND FOLLOW-UP
-- Patient notes, reminders, and measurements

-- Table des notes patient
CREATE TABLE notes_patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  contenu TEXT NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_important BOOLEAN DEFAULT FALSE,
  categorie VARCHAR(50) DEFAULT 'general',
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des rappels de suivi
CREATE TABLE rappels_suivi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  date_rappel DATE NOT NULL,
  motif VARCHAR(255) NOT NULL,
  description TEXT,
  est_complete BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des mesures patient
CREATE TABLE mesures_patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  type_mesure VARCHAR(50) NOT NULL,
  valeur DECIMAL(10,2) NOT NULL,
  unite VARCHAR(20) NOT NULL,
  date_mesure DATETIME NOT NULL,
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
); 
-- CONSULTATIONS AND VITAL SIGNS
-- Medical consultations and vital signs recording

-- Table des consultations
CREATE TABLE consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rendez_vous_id INT NOT NULL,
  medecin_id INT NOT NULL,
  patient_id INT NOT NULL,
  date_consultation DATETIME NOT NULL,
  motif TEXT NOT NULL,
  anamnese TEXT,
  examen_clinique TEXT,
  diagnostic TEXT,
  conclusion TEXT,
  est_complete BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME,
  follow_up_date DATE DEFAULT NULL,
  FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Table des constantes vitales
CREATE TABLE constantes_vitales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT NOT NULL,
  patient_id INT NOT NULL,
  date_mesure DATETIME NOT NULL,
  temperature DECIMAL(3,1),
  tension_arterielle_systolique INT,
  tension_arterielle_diastolique INT,
  frequence_cardiaque INT,
  saturation_oxygene INT,
  frequence_respiratoire INT,
  glycemie DECIMAL(5,2),
  poids DECIMAL(5,2) DEFAULT NULL,
  taille INT DEFAULT NULL,
  imc DECIMAL(4,2) DEFAULT NULL,
  notes TEXT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
); 
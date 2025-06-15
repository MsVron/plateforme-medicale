-- MEDICATIONS AND TREATMENTS
-- Medication management, prescriptions, and treatment tracking

-- Table des médicaments
CREATE TABLE medicaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom_commercial VARCHAR(100) NOT NULL,
  nom_molecule VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  forme ENUM('comprimé', 'gélule', 'sirop', 'injectable', 'patch', 'pommade', 'autre') NOT NULL,
  description TEXT
);

-- Table des traitements en cours
CREATE TABLE traitements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medicament_id INT NOT NULL,
  posologie VARCHAR(255) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE,
  est_permanent BOOLEAN DEFAULT FALSE,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  instructions TEXT,
  rappel_prise BOOLEAN DEFAULT FALSE,
  frequence_rappel VARCHAR(100) DEFAULT NULL,
  status ENUM('prescribed', 'dispensed', 'expired') DEFAULT 'prescribed',
  pharmacy_dispensed_id INT DEFAULT NULL,
  date_dispensed DATETIME DEFAULT NULL,
  dispensed_by_user_id INT DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (pharmacy_dispensed_id) REFERENCES institutions(id),
  FOREIGN KEY (dispensed_by_user_id) REFERENCES utilisateurs(id)
);

-- Treatment indexes
CREATE INDEX idx_traitements_status ON traitements(status);
CREATE INDEX idx_traitements_patient_status ON traitements(patient_id, status);
CREATE INDEX idx_traitements_patient_date ON traitements(patient_id, date_prescription DESC); 
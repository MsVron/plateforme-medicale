-- MEDICAL ANALYSIS RESULTS
-- Storage and management of medical analysis results

-- Table des résultats d'analyses avec structure améliorée
CREATE TABLE resultats_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type_analyse_id INT NOT NULL,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription DATE NOT NULL,
  date_realisation DATE,
  laboratoire VARCHAR(100),
  valeur_numerique DECIMAL(10,3),
  valeur_texte TEXT,
  unite VARCHAR(20),
  valeur_normale_min DECIMAL(10,3),
  valeur_normale_max DECIMAL(10,3),
  interpretation TEXT,
  est_normal BOOLEAN,
  est_critique BOOLEAN DEFAULT FALSE,
  document_url VARCHAR(255),
  medecin_interpreteur_id INT,
  date_interpretation DATETIME,
  notes_techniques TEXT,
  laboratory_id INT DEFAULT NULL,
  request_status ENUM('requested', 'in_progress', 'completed', 'validated') DEFAULT 'requested',
  priority ENUM('normal', 'urgent') DEFAULT 'normal',
  technician_user_id INT DEFAULT NULL,
  date_status_updated DATETIME DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (type_analyse_id) REFERENCES types_analyses(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (medecin_interpreteur_id) REFERENCES medecins(id),
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (technician_user_id) REFERENCES utilisateurs(id)
);

-- Analysis results indexes
CREATE INDEX idx_resultats_analyses_patient_date ON resultats_analyses(patient_id, date_realisation DESC);
CREATE INDEX idx_resultats_analyses_laboratory ON resultats_analyses(laboratory_id);
CREATE INDEX idx_resultats_analyses_status ON resultats_analyses(request_status);
CREATE INDEX idx_resultats_analyses_priority ON resultats_analyses(priority); 
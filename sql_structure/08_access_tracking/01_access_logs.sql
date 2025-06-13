-- ACCESS TRACKING AND GDPR COMPLIANCE
-- Tracking access to sensitive patient data

-- PRESCRIPTION ACCESS LOGS (for GDPR compliance and pharmacy access tracking)
CREATE TABLE prescription_access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  prescription_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  accessed_by_user_id INT NOT NULL,
  access_reason VARCHAR(255) NOT NULL,
  patient_cne VARCHAR(20) NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  access_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescription_id) REFERENCES traitements(id),
  FOREIGN KEY (pharmacy_id) REFERENCES institutions(id),
  FOREIGN KEY (accessed_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_prescription_access_patient (patient_id),
  INDEX idx_prescription_access_pharmacy (pharmacy_id),
  INDEX idx_prescription_access_date (access_date)
);

-- ANALYSIS ACCESS LOGS (for laboratory access tracking)
CREATE TABLE analysis_access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  analysis_id INT NOT NULL,
  laboratory_id INT NOT NULL,
  accessed_by_user_id INT NOT NULL,
  access_reason VARCHAR(255) NOT NULL,
  patient_cne VARCHAR(20) NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  access_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (analysis_id) REFERENCES resultats_analyses(id),
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (accessed_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_analysis_access_patient (patient_id),
  INDEX idx_analysis_access_laboratory (laboratory_id),
  INDEX idx_analysis_access_date (access_date)
); 
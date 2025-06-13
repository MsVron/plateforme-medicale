-- INSTITUTIONAL MANAGEMENT
-- Institution change requests and hospital assignments

-- INSTITUTION CHANGE REQUESTS TABLE (for admin-initiated changes requiring super admin approval)
CREATE TABLE institution_change_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution_id INT DEFAULT NULL,
  request_type ENUM('create', 'modify', 'delete') NOT NULL,
  requested_by_user_id INT NOT NULL,
  request_data JSON NOT NULL,
  current_data JSON DEFAULT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by_user_id INT DEFAULT NULL,
  review_comment TEXT DEFAULT NULL,
  date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_reviewed DATETIME DEFAULT NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (requested_by_user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (reviewed_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_change_requests_status (status),
  INDEX idx_change_requests_type (request_type),
  INDEX idx_change_requests_requested_by (requested_by_user_id)
);

-- HOSPITAL ASSIGNMENTS TABLE
CREATE TABLE hospital_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  hospital_id INT NOT NULL,
  admission_date DATETIME NOT NULL,
  discharge_date DATETIME DEFAULT NULL,
  status ENUM('active', 'discharged', 'transferred') DEFAULT 'active',
  admission_reason TEXT NOT NULL,
  bed_number VARCHAR(20) DEFAULT NULL,
  ward_name VARCHAR(100) DEFAULT NULL,
  assigned_by_user_id INT NOT NULL,
  discharge_reason TEXT DEFAULT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (hospital_id) REFERENCES institutions(id),
  FOREIGN KEY (assigned_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_hospital_assignments_patient (patient_id),
  INDEX idx_hospital_assignments_medecin (medecin_id),
  INDEX idx_hospital_assignments_hospital (hospital_id),
  INDEX idx_hospital_assignments_status (status)
); 
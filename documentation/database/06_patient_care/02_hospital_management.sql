-- ENHANCED HOSPITAL MANAGEMENT
-- Extended hospital functionality for patient care, surgeries, and multi-doctor assignments

-- Table for tracking surgeries and procedures
CREATE TABLE hospital_surgeries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  hospital_assignment_id INT NOT NULL,
  primary_surgeon_id INT NOT NULL,
  surgery_type VARCHAR(200) NOT NULL,
  surgery_description TEXT,
  scheduled_date DATETIME NOT NULL,
  actual_start_time DATETIME,
  actual_end_time DATETIME,
  duration_minutes INT,
  operating_room VARCHAR(50),
  anesthesia_type ENUM('local', 'general', 'regional', 'sedation') DEFAULT 'general',
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'postponed') DEFAULT 'scheduled',
  complications TEXT,
  post_op_notes TEXT,
  recovery_notes TEXT,
  created_by_user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (hospital_assignment_id) REFERENCES hospital_assignments(id),
  FOREIGN KEY (primary_surgeon_id) REFERENCES medecins(id),
  FOREIGN KEY (created_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_hospital_surgeries_patient (patient_id),
  INDEX idx_hospital_surgeries_assignment (hospital_assignment_id),
  INDEX idx_hospital_surgeries_surgeon (primary_surgeon_id),
  INDEX idx_hospital_surgeries_status (status),
  INDEX idx_hospital_surgeries_date (scheduled_date)
);

-- Table for additional surgeons/assistants in surgeries
CREATE TABLE surgery_team (
  id INT AUTO_INCREMENT PRIMARY KEY,
  surgery_id INT NOT NULL,
  medecin_id INT NOT NULL,
  role ENUM('assistant_surgeon', 'anesthesiologist', 'nurse', 'resident', 'other') NOT NULL,
  role_description VARCHAR(100),
  FOREIGN KEY (surgery_id) REFERENCES hospital_surgeries(id) ON DELETE CASCADE,
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  UNIQUE KEY unique_surgery_doctor_role (surgery_id, medecin_id, role),
  INDEX idx_surgery_team_surgery (surgery_id),
  INDEX idx_surgery_team_medecin (medecin_id)
);

-- Enhanced hospital visits tracking (separate from assignments for outpatient visits)
CREATE TABLE hospital_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  hospital_id INT NOT NULL,
  attending_medecin_id INT NOT NULL,
  visit_type ENUM('emergency', 'outpatient', 'follow_up', 'consultation', 'procedure') NOT NULL,
  arrival_time DATETIME NOT NULL,
  departure_time DATETIME,
  visit_duration_minutes INT,
  chief_complaint TEXT,
  triage_level ENUM('1_critical', '2_urgent', '3_less_urgent', '4_standard', '5_non_urgent'),
  department VARCHAR(100),
  room_number VARCHAR(20),
  visit_notes TEXT,
  discharge_instructions TEXT,
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  status ENUM('active', 'completed', 'left_without_treatment') DEFAULT 'active',
  created_by_user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (hospital_id) REFERENCES institutions(id),
  FOREIGN KEY (attending_medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (created_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_hospital_visits_patient (patient_id),
  INDEX idx_hospital_visits_hospital (hospital_id),
  INDEX idx_hospital_visits_medecin (attending_medecin_id),
  INDEX idx_hospital_visits_date (arrival_time),
  INDEX idx_hospital_visits_status (status)
);

-- Table for multiple doctor assignments per hospital patient
CREATE TABLE hospital_patient_doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_assignment_id INT NOT NULL,
  medecin_id INT NOT NULL,
  role ENUM('primary', 'consulting', 'specialist', 'resident', 'intern') NOT NULL,
  specialty_focus VARCHAR(100),
  assignment_date DATETIME NOT NULL,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  assigned_by_user_id INT NOT NULL,
  FOREIGN KEY (hospital_assignment_id) REFERENCES hospital_assignments(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (assigned_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_hospital_patient_doctors_assignment (hospital_assignment_id),
  INDEX idx_hospital_patient_doctors_medecin (medecin_id),
  INDEX idx_hospital_patient_doctors_active (is_active)
);

-- Hospital bed management
CREATE TABLE hospital_beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  bed_number VARCHAR(20) NOT NULL,
  ward_name VARCHAR(100) NOT NULL,
  room_number VARCHAR(20),
  bed_type ENUM('standard', 'icu', 'emergency', 'maternity', 'pediatric', 'isolation') DEFAULT 'standard',
  is_occupied BOOLEAN DEFAULT FALSE,
  current_patient_assignment_id INT DEFAULT NULL,
  last_cleaned DATETIME,
  maintenance_status ENUM('available', 'maintenance', 'out_of_service') DEFAULT 'available',
  FOREIGN KEY (hospital_id) REFERENCES institutions(id),
  FOREIGN KEY (current_patient_assignment_id) REFERENCES hospital_assignments(id),
  UNIQUE KEY unique_hospital_bed (hospital_id, bed_number),
  INDEX idx_hospital_beds_hospital (hospital_id),
  INDEX idx_hospital_beds_availability (is_occupied, maintenance_status)
);

-- Hospital indexes for performance
CREATE INDEX idx_hospital_assignments_dates ON hospital_assignments(admission_date, discharge_date);
CREATE INDEX idx_hospital_assignments_active ON hospital_assignments(status, discharge_date); 
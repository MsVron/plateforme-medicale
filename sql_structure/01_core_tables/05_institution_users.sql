-- INSTITUTION USER MANAGEMENT
-- Enhanced user management for different types of institutions (hospitals, pharmacies, laboratories)

-- Table for institution staff profiles
CREATE TABLE institution_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  institution_id INT NOT NULL,
  staff_type ENUM('pharmacist', 'pharmacy_technician', 'hospital_admin', 'hospital_nurse', 'hospital_receptionist', 'lab_technician', 'lab_manager', 'radiologist', 'other') NOT NULL,
  employee_id VARCHAR(50),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  professional_license VARCHAR(100),
  license_expiry_date DATE,
  department VARCHAR(100),
  position_title VARCHAR(100),
  hire_date DATE,
  employment_status ENUM('active', 'inactive', 'suspended', 'terminated') DEFAULT 'active',
  supervisor_id INT DEFAULT NULL,
  shift_pattern VARCHAR(100),
  access_permissions JSON, -- Specific permissions for this staff member
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  notes TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (supervisor_id) REFERENCES institution_staff(id),
  UNIQUE KEY unique_user_institution (user_id, institution_id),
  INDEX idx_institution_staff_institution (institution_id),
  INDEX idx_institution_staff_type (staff_type),
  INDEX idx_institution_staff_status (employment_status),
  INDEX idx_institution_staff_license (professional_license)
);

-- Table for institution-specific permissions and roles
CREATE TABLE institution_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution_type ENUM('pharmacy', 'hospital', 'laboratory', 'clinic') NOT NULL,
  permission_name VARCHAR(100) NOT NULL,
  permission_description TEXT,
  permission_category ENUM('patient_access', 'prescription_management', 'analysis_management', 'administrative', 'reporting', 'system') NOT NULL,
  is_sensitive BOOLEAN DEFAULT FALSE,
  requires_audit_log BOOLEAN DEFAULT FALSE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_institution_permission (institution_type, permission_name),
  INDEX idx_institution_permissions_type (institution_type),
  INDEX idx_institution_permissions_category (permission_category)
);

-- Table for staff permission assignments
CREATE TABLE staff_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  permission_id INT NOT NULL,
  granted_by_user_id INT NOT NULL,
  granted_date DATETIME NOT NULL,
  expiry_date DATETIME DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  FOREIGN KEY (staff_id) REFERENCES institution_staff(id),
  FOREIGN KEY (permission_id) REFERENCES institution_permissions(id),
  FOREIGN KEY (granted_by_user_id) REFERENCES utilisateurs(id),
  UNIQUE KEY unique_staff_permission (staff_id, permission_id),
  INDEX idx_staff_permissions_staff (staff_id),
  INDEX idx_staff_permissions_permission (permission_id),
  INDEX idx_staff_permissions_active (is_active)
);

-- Table for institution working hours and availability
CREATE TABLE institution_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution_id INT NOT NULL,
  day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  break_start_time TIME DEFAULT NULL,
  break_end_time TIME DEFAULT NULL,
  emergency_hours BOOLEAN DEFAULT FALSE, -- For hospitals that are 24/7
  special_notes TEXT,
  effective_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  INDEX idx_institution_schedules_institution (institution_id),
  INDEX idx_institution_schedules_day (day_of_week),
  INDEX idx_institution_schedules_effective (effective_date, end_date)
);

-- Table for institution services offered
CREATE TABLE institution_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  institution_id INT NOT NULL,
  service_type ENUM('prescription_dispensing', 'medication_counseling', 'emergency_care', 'outpatient_care', 'inpatient_care', 'surgery', 'diagnostic_imaging', 'laboratory_testing', 'blood_work', 'radiology', 'pathology', 'other') NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_description TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  requires_appointment BOOLEAN DEFAULT FALSE,
  average_wait_time_minutes INT DEFAULT NULL,
  cost_estimate DECIMAL(8,2) DEFAULT NULL,
  insurance_accepted BOOLEAN DEFAULT TRUE,
  special_requirements TEXT,
  equipment_needed VARCHAR(255),
  staff_required JSON, -- Array of required staff types
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  INDEX idx_institution_services_institution (institution_id),
  INDEX idx_institution_services_type (service_type),
  INDEX idx_institution_services_available (is_available)
);

-- Table for patient search audit (for GDPR compliance across all institution types)
CREATE TABLE patient_search_audit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  searching_user_id INT NOT NULL,
  searching_institution_id INT NOT NULL,
  search_criteria JSON NOT NULL, -- Store search parameters (name, CNE, etc.)
  search_results_count INT NOT NULL,
  patient_accessed_id INT DEFAULT NULL, -- If a specific patient was accessed
  search_reason VARCHAR(255) NOT NULL,
  search_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  FOREIGN KEY (searching_user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (searching_institution_id) REFERENCES institutions(id),
  FOREIGN KEY (patient_accessed_id) REFERENCES patients(id),
  INDEX idx_patient_search_audit_user (searching_user_id),
  INDEX idx_patient_search_audit_institution (searching_institution_id),
  INDEX idx_patient_search_audit_timestamp (search_timestamp),
  INDEX idx_patient_search_audit_patient (patient_accessed_id)
);

-- Insert default permissions for different institution types
INSERT INTO institution_permissions (institution_type, permission_name, permission_description, permission_category, is_sensitive, requires_audit_log) VALUES
-- Pharmacy permissions
('pharmacy', 'view_prescriptions', 'View patient prescriptions', 'prescription_management', TRUE, TRUE),
('pharmacy', 'dispense_medications', 'Dispense medications to patients', 'prescription_management', TRUE, TRUE),
('pharmacy', 'modify_prescription_status', 'Update prescription dispensing status', 'prescription_management', TRUE, TRUE),
('pharmacy', 'view_medication_history', 'View patient medication history across pharmacies', 'patient_access', TRUE, TRUE),
('pharmacy', 'manage_inventory', 'Manage pharmacy inventory', 'administrative', FALSE, FALSE),
('pharmacy', 'generate_reports', 'Generate pharmacy reports', 'reporting', FALSE, FALSE),

-- Hospital permissions
('hospital', 'admit_patients', 'Admit patients to hospital', 'patient_access', TRUE, TRUE),
('hospital', 'assign_doctors', 'Assign doctors to patients', 'patient_access', TRUE, TRUE),
('hospital', 'schedule_surgeries', 'Schedule surgical procedures', 'patient_access', TRUE, TRUE),
('hospital', 'manage_bed_assignments', 'Manage hospital bed assignments', 'administrative', FALSE, TRUE),
('hospital', 'view_patient_records', 'View complete patient medical records', 'patient_access', TRUE, TRUE),
('hospital', 'update_visit_records', 'Update patient visit information', 'patient_access', TRUE, TRUE),
('hospital', 'discharge_patients', 'Discharge patients from hospital', 'patient_access', TRUE, TRUE),

-- Laboratory permissions
('laboratory', 'receive_test_requests', 'Receive and process test requests', 'analysis_management', FALSE, TRUE),
('laboratory', 'perform_tests', 'Perform laboratory tests', 'analysis_management', FALSE, TRUE),
('laboratory', 'upload_results', 'Upload test results', 'analysis_management', TRUE, TRUE),
('laboratory', 'validate_results', 'Validate and approve test results', 'analysis_management', TRUE, TRUE),
('laboratory', 'manage_samples', 'Manage sample tracking and storage', 'analysis_management', FALSE, TRUE),
('laboratory', 'operate_equipment', 'Operate laboratory equipment', 'analysis_management', FALSE, FALSE),
('laboratory', 'quality_control', 'Perform quality control procedures', 'analysis_management', FALSE, TRUE);

-- ENHANCED PHARMACY MANAGEMENT
-- Extended pharmacy functionality for medication dispensing, history tracking, and cross-pharmacy visibility

-- Table for detailed medication dispensing records
CREATE TABLE medication_dispensing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT NOT NULL, -- References traitements(id)
  patient_id INT NOT NULL,
  pharmacy_id INT NOT NULL,
  dispensed_by_user_id INT NOT NULL,
  medicament_id INT NOT NULL,
  quantity_prescribed DECIMAL(8,2) NOT NULL,
  quantity_dispensed DECIMAL(8,2) NOT NULL,
  quantity_remaining DECIMAL(8,2) NOT NULL,
  unit_type VARCHAR(50) NOT NULL, -- tablets, ml, boxes, etc.
  dispensing_date DATETIME NOT NULL,
  batch_number VARCHAR(50),
  expiry_date DATE,
  unit_price DECIMAL(8,2),
  total_price DECIMAL(8,2),
  insurance_covered BOOLEAN DEFAULT FALSE,
  insurance_percentage DECIMAL(5,2),
  patient_copay DECIMAL(8,2),
  dispensing_notes TEXT,
  is_partial_dispensing BOOLEAN DEFAULT FALSE,
  original_dispensing_id INT DEFAULT NULL, -- For tracking partial dispensings
  pharmacist_verification_id INT, -- Pharmacist who verified the dispensing
  status ENUM('dispensed', 'returned', 'expired', 'recalled') DEFAULT 'dispensed',
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prescription_id) REFERENCES traitements(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (pharmacy_id) REFERENCES institutions(id),
  FOREIGN KEY (dispensed_by_user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id),
  FOREIGN KEY (original_dispensing_id) REFERENCES medication_dispensing(id),
  FOREIGN KEY (pharmacist_verification_id) REFERENCES utilisateurs(id),
  INDEX idx_medication_dispensing_prescription (prescription_id),
  INDEX idx_medication_dispensing_patient (patient_id),
  INDEX idx_medication_dispensing_pharmacy (pharmacy_id),
  INDEX idx_medication_dispensing_date (dispensing_date),
  INDEX idx_medication_dispensing_status (status)
);

-- Table for pharmacy inventory management
CREATE TABLE pharmacy_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pharmacy_id INT NOT NULL,
  medicament_id INT NOT NULL,
  batch_number VARCHAR(50) NOT NULL,
  quantity_in_stock DECIMAL(8,2) NOT NULL,
  unit_type VARCHAR(50) NOT NULL,
  purchase_price DECIMAL(8,2),
  selling_price DECIMAL(8,2),
  expiry_date DATE NOT NULL,
  supplier_name VARCHAR(100),
  date_received DATE,
  minimum_stock_level DECIMAL(8,2) DEFAULT 0,
  is_controlled_substance BOOLEAN DEFAULT FALSE,
  storage_requirements TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pharmacy_id) REFERENCES institutions(id),
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id),
  UNIQUE KEY unique_pharmacy_med_batch (pharmacy_id, medicament_id, batch_number),
  INDEX idx_pharmacy_inventory_pharmacy (pharmacy_id),
  INDEX idx_pharmacy_inventory_medicament (medicament_id),
  INDEX idx_pharmacy_inventory_expiry (expiry_date),
  INDEX idx_pharmacy_inventory_stock_level (quantity_in_stock)
);

-- Table for medication interaction warnings
CREATE TABLE medication_interactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medicament_1_id INT NOT NULL,
  medicament_2_id INT NOT NULL,
  interaction_type ENUM('major', 'moderate', 'minor', 'contraindicated') NOT NULL,
  interaction_description TEXT NOT NULL,
  clinical_significance TEXT,
  management_recommendation TEXT,
  severity_score INT DEFAULT 1 CHECK (severity_score BETWEEN 1 AND 10),
  is_active BOOLEAN DEFAULT TRUE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicament_1_id) REFERENCES medicaments(id),
  FOREIGN KEY (medicament_2_id) REFERENCES medicaments(id),
  UNIQUE KEY unique_interaction (medicament_1_id, medicament_2_id),
  INDEX idx_medication_interactions_med1 (medicament_1_id),
  INDEX idx_medication_interactions_med2 (medicament_2_id),
  INDEX idx_medication_interactions_type (interaction_type)
);

-- Table for prescription refill tracking
CREATE TABLE prescription_refills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_prescription_id INT NOT NULL,
  patient_id INT NOT NULL,
  prescribing_medecin_id INT NOT NULL,
  refill_number INT NOT NULL,
  refill_date DATE NOT NULL,
  quantity_authorized DECIMAL(8,2) NOT NULL,
  refills_remaining INT NOT NULL,
  authorized_by_user_id INT NOT NULL,
  notes TEXT,
  status ENUM('authorized', 'dispensed', 'expired', 'cancelled') DEFAULT 'authorized',
  expiry_date DATE,
  FOREIGN KEY (original_prescription_id) REFERENCES traitements(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescribing_medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (authorized_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_prescription_refills_original (original_prescription_id),
  INDEX idx_prescription_refills_patient (patient_id),
  INDEX idx_prescription_refills_status (status)
);

-- Enhanced prescription access logs for better pharmacy tracking
CREATE TABLE enhanced_prescription_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  prescription_id INT NOT NULL,
  accessing_institution_id INT NOT NULL,
  accessing_user_id INT NOT NULL,
  access_type ENUM('view', 'dispense', 'modify', 'refill') NOT NULL,
  patient_cne VARCHAR(20) NOT NULL,
  patient_full_name VARCHAR(150) NOT NULL,
  prescription_details JSON, -- Store prescription snapshot
  access_reason VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id VARCHAR(100),
  access_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescription_id) REFERENCES traitements(id),
  FOREIGN KEY (accessing_institution_id) REFERENCES institutions(id),
  FOREIGN KEY (accessing_user_id) REFERENCES utilisateurs(id),
  INDEX idx_enhanced_prescription_access_patient (patient_id),
  INDEX idx_enhanced_prescription_access_institution (accessing_institution_id),
  INDEX idx_enhanced_prescription_access_timestamp (access_timestamp),
  INDEX idx_enhanced_prescription_access_type (access_type)
);

-- Table for medication adherence tracking
CREATE TABLE medication_adherence (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  prescription_id INT NOT NULL,
  medicament_id INT NOT NULL,
  expected_dose_date DATE NOT NULL,
  actual_dose_date DATE,
  dose_taken BOOLEAN DEFAULT FALSE,
  dose_amount DECIMAL(8,2),
  adherence_percentage DECIMAL(5,2),
  missed_dose_reason VARCHAR(255),
  side_effects_reported TEXT,
  pharmacy_follow_up_id INT,
  tracking_method ENUM('patient_report', 'pharmacy_refill', 'electronic_monitoring', 'pill_count') DEFAULT 'patient_report',
  notes TEXT,
  date_recorded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescription_id) REFERENCES traitements(id),
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id),
  FOREIGN KEY (pharmacy_follow_up_id) REFERENCES institutions(id),
  INDEX idx_medication_adherence_patient (patient_id),
  INDEX idx_medication_adherence_prescription (prescription_id),
  INDEX idx_medication_adherence_date (expected_dose_date)
); 
-- ANALYSIS WORKFLOW FIX
-- This file fixes the analysis workflow to properly separate doctor requests from laboratory results
-- Doctors can only request tests/imaging, laboratories provide the actual results

-- 1. Update resultats_analyses table to support proper workflow
ALTER TABLE resultats_analyses 
ADD COLUMN IF NOT EXISTS request_status ENUM('requested', 'in_progress', 'completed', 'validated') DEFAULT 'requested',
ADD COLUMN IF NOT EXISTS priority ENUM('normal', 'urgent') DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS laboratory_id INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS technician_user_id INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS date_status_updated DATETIME DEFAULT NULL,
ADD COLUMN IF NOT EXISTS clinical_indication TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sample_type VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sample_collection_date DATETIME DEFAULT NULL,
ADD COLUMN IF NOT EXISTS requesting_institution_id INT DEFAULT NULL;

-- Add foreign key constraints if they don't exist
ALTER TABLE resultats_analyses 
ADD CONSTRAINT fk_resultats_analyses_laboratory 
FOREIGN KEY (laboratory_id) REFERENCES institutions(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_resultats_analyses_technician 
FOREIGN KEY (technician_user_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_resultats_analyses_requesting_institution 
FOREIGN KEY (requesting_institution_id) REFERENCES institutions(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resultats_analyses_request_status ON resultats_analyses(request_status);
CREATE INDEX IF NOT EXISTS idx_resultats_analyses_priority ON resultats_analyses(priority);
CREATE INDEX IF NOT EXISTS idx_resultats_analyses_laboratory_id ON resultats_analyses(laboratory_id);

-- 2. Update resultats_imagerie table to support proper workflow
ALTER TABLE resultats_imagerie 
ADD COLUMN IF NOT EXISTS request_status ENUM('requested', 'scheduled', 'in_progress', 'completed', 'validated') DEFAULT 'requested',
ADD COLUMN IF NOT EXISTS priority ENUM('routine', 'urgent', 'stat', 'emergency') DEFAULT 'routine',
ADD COLUMN IF NOT EXISTS clinical_indication TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS patient_preparation_instructions TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS contrast_required BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS contrast_type VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS special_instructions TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS technician_assigned_id INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS equipment_used VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS accession_number VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS study_instance_uid VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS requesting_institution_id INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS date_status_updated DATETIME DEFAULT NULL;

-- Add foreign key constraints for imaging
ALTER TABLE resultats_imagerie 
ADD CONSTRAINT fk_resultats_imagerie_technician 
FOREIGN KEY (technician_assigned_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_resultats_imagerie_requesting_institution 
FOREIGN KEY (requesting_institution_id) REFERENCES institutions(id) ON DELETE SET NULL;

-- Add indexes for imaging
CREATE INDEX IF NOT EXISTS idx_resultats_imagerie_request_status ON resultats_imagerie(request_status);
CREATE INDEX IF NOT EXISTS idx_resultats_imagerie_priority ON resultats_imagerie(priority);
CREATE INDEX IF NOT EXISTS idx_resultats_imagerie_institution ON resultats_imagerie(institution_realisation_id);

-- 3. Create analysis_requests table for better workflow tracking (optional - can use existing resultats_analyses)
CREATE TABLE IF NOT EXISTS analysis_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  requesting_medecin_id INT NOT NULL,
  type_analyse_id INT NOT NULL,
  requesting_institution_id INT DEFAULT NULL,
  assigned_laboratory_id INT DEFAULT NULL,
  request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  priority ENUM('normal', 'urgent', 'stat') DEFAULT 'normal',
  clinical_indication TEXT NOT NULL,
  sample_type VARCHAR(50) DEFAULT NULL,
  special_instructions TEXT DEFAULT NULL,
  request_status ENUM('requested', 'assigned', 'sample_collected', 'in_progress', 'completed', 'validated', 'cancelled') DEFAULT 'requested',
  scheduled_date DATETIME DEFAULT NULL,
  sample_collection_date DATETIME DEFAULT NULL,
  estimated_completion_date DATETIME DEFAULT NULL,
  created_by_user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (requesting_medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (type_analyse_id) REFERENCES types_analyses(id),
  FOREIGN KEY (requesting_institution_id) REFERENCES institutions(id),
  FOREIGN KEY (assigned_laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (created_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_analysis_requests_patient (patient_id),
  INDEX idx_analysis_requests_status (request_status),
  INDEX idx_analysis_requests_laboratory (assigned_laboratory_id),
  INDEX idx_analysis_requests_priority (priority),
  INDEX idx_analysis_requests_date (request_date)
);

-- 4. Create imaging_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS imaging_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  requesting_medecin_id INT NOT NULL,
  type_imagerie_id INT NOT NULL,
  requesting_institution_id INT DEFAULT NULL,
  assigned_laboratory_id INT DEFAULT NULL,
  request_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scheduled_date DATETIME DEFAULT NULL,
  completed_date DATETIME DEFAULT NULL,
  priority ENUM('routine', 'urgent', 'stat', 'emergency') DEFAULT 'routine',
  clinical_indication TEXT NOT NULL,
  patient_preparation_instructions TEXT DEFAULT NULL,
  contrast_required BOOLEAN DEFAULT FALSE,
  contrast_type VARCHAR(100) DEFAULT NULL,
  special_instructions TEXT DEFAULT NULL,
  request_status ENUM('requested', 'scheduled', 'in_progress', 'completed', 'validated', 'cancelled', 'no_show') DEFAULT 'requested',
  technician_assigned_id INT DEFAULT NULL,
  radiologist_assigned_id INT DEFAULT NULL,
  equipment_used VARCHAR(100) DEFAULT NULL,
  study_instance_uid VARCHAR(255) DEFAULT NULL,
  accession_number VARCHAR(50) DEFAULT NULL,
  patient_history_relevant TEXT DEFAULT NULL,
  allergies_contrast BOOLEAN DEFAULT FALSE,
  pregnancy_status ENUM('unknown', 'not_pregnant', 'pregnant', 'possibly_pregnant') DEFAULT 'unknown',
  created_by_user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (requesting_medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (type_imagerie_id) REFERENCES types_imagerie(id),
  FOREIGN KEY (requesting_institution_id) REFERENCES institutions(id),
  FOREIGN KEY (assigned_laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (technician_assigned_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (radiologist_assigned_id) REFERENCES medecins(id),
  FOREIGN KEY (created_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_imaging_requests_patient (patient_id),
  INDEX idx_imaging_requests_status (request_status),
  INDEX idx_imaging_requests_laboratory (assigned_laboratory_id),
  INDEX idx_imaging_requests_priority (priority),
  INDEX idx_imaging_requests_date (request_date)
);

-- 5. Create laboratory_technicians table if it doesn't exist
CREATE TABLE IF NOT EXISTS laboratory_technicians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  laboratory_id INT NOT NULL,
  employee_id VARCHAR(50) DEFAULT NULL,
  specializations JSON DEFAULT NULL,
  certifications JSON DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE DEFAULT NULL,
  access_level ENUM('basic', 'advanced', 'supervisor', 'manager') DEFAULT 'basic',
  can_validate_results BOOLEAN DEFAULT FALSE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  UNIQUE KEY unique_user_laboratory (user_id, laboratory_id),
  INDEX idx_laboratory_technicians_laboratory (laboratory_id),
  INDEX idx_laboratory_technicians_active (is_active)
);

-- 6. Update master_install.sql reference
-- Add this file to the installation sequence in master_install.sql 
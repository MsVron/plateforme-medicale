-- INSTITUTIONS AND MEDICAL SPECIALTIES
-- Core institutional and specialty management

-- Table des institutions
CREATE TABLE institutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  adresse VARCHAR(255) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  code_postal VARCHAR(10) NOT NULL,
  pays VARCHAR(50) NOT NULL DEFAULT 'France',
  telephone VARCHAR(20) DEFAULT NULL,
  email_contact VARCHAR(100) NOT NULL,
  site_web VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  horaires_ouverture TEXT DEFAULT NULL,
  coordonnees_gps VARCHAR(50) DEFAULT NULL,
  latitude DECIMAL(10, 8) DEFAULT NULL,
  longitude DECIMAL(11, 8) DEFAULT NULL,
  est_actif BOOLEAN DEFAULT TRUE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type ENUM('hôpital','clinique','cabinet privé','centre médical','laboratoire','autre') NOT NULL DEFAULT 'autre',
  medecin_proprietaire_id INT DEFAULT NULL,
  type_institution ENUM('pharmacy', 'hospital', 'laboratory', 'clinic', 'hôpital', 'clinique', 'cabinet privé', 'centre médical', 'laboratoire', 'autre') DEFAULT 'autre',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved'
);

-- Table des spécialités médicales
CREATE TABLE specialites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  usage_count INT DEFAULT 0,
  UNIQUE KEY nom (nom)
);

-- Institutions and specialties indexes
CREATE INDEX idx_institutions_type ON institutions(type_institution);
CREATE INDEX idx_institutions_status ON institutions(status); 
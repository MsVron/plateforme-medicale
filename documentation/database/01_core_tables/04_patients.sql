-- PATIENTS AND PATIENT MANAGEMENT
-- Patient profiles, verification, and core patient data

-- Table des patients
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(50) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  date_naissance DATE NOT NULL,
  sexe ENUM('M', 'F') NOT NULL,
  CNE VARCHAR(20) UNIQUE,
  adresse VARCHAR(255),
  ville VARCHAR(100),
  code_postal VARCHAR(10),
  pays VARCHAR(50) DEFAULT 'France',
  telephone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  contact_urgence_nom VARCHAR(100),
  contact_urgence_telephone VARCHAR(20),
  contact_urgence_relation VARCHAR(50),
  groupe_sanguin ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  taille_cm INT,
  poids_kg DECIMAL(5,2),
  est_fumeur BOOLEAN,
  consommation_alcool ENUM('non', 'occasionnel', 'régulier', 'quotidien'),
  activite_physique ENUM('sédentaire', 'légère', 'modérée', 'intense'),
  profession VARCHAR(100),
  medecin_traitant_id INT,
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_inscrit_par_medecin BOOLEAN DEFAULT FALSE,
  medecin_inscripteur_id INT DEFAULT NULL,
  est_profil_complete BOOLEAN DEFAULT FALSE,
  allergies_notes TEXT DEFAULT NULL,
  FOREIGN KEY (medecin_traitant_id) REFERENCES medecins(id),
  FOREIGN KEY (medecin_inscripteur_id) REFERENCES medecins(id)
);

-- Table de vérification des comptes patients
CREATE TABLE verification_patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_expiration DATETIME NOT NULL,
  est_verifie BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Table des favoris
CREATE TABLE favoris_medecins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favori (patient_id, medecin_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des évaluations des médecins
CREATE TABLE evaluations_medecins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_approuve BOOLEAN DEFAULT FALSE,
  est_anonyme BOOLEAN DEFAULT FALSE,
  UNIQUE KEY unique_evaluation (patient_id, medecin_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Patient indexes
CREATE INDEX idx_patients_cne ON patients(CNE);
CREATE INDEX idx_patients_inscrit_par_medecin ON patients(est_inscrit_par_medecin);
CREATE INDEX idx_patients_prenom ON patients(prenom);
CREATE INDEX idx_patients_nom ON patients(nom);
CREATE INDEX idx_patients_prenom_nom ON patients(prenom, nom); 
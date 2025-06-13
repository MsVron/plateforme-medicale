-- DOCTORS AND AVAILABILITY MANAGEMENT
-- Doctor profiles, availability, and institutional affiliations

-- Table des médecins
CREATE TABLE medecins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(50) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  specialite_id INT DEFAULT NULL,
  numero_ordre VARCHAR(50) NOT NULL,
  telephone VARCHAR(20) DEFAULT NULL,
  email_professionnel VARCHAR(100) DEFAULT NULL,
  photo_url VARCHAR(255) DEFAULT NULL,
  biographie TEXT DEFAULT NULL,
  institution_id INT DEFAULT NULL,
  est_actif BOOLEAN DEFAULT TRUE,
  adresse VARCHAR(255) DEFAULT NULL,
  ville VARCHAR(100) DEFAULT NULL,
  code_postal VARCHAR(10) DEFAULT NULL,
  pays VARCHAR(50) DEFAULT 'France',
  latitude DECIMAL(10, 8) DEFAULT NULL,
  longitude DECIMAL(11, 8) DEFAULT NULL,
  tarif_consultation DECIMAL(8, 2) DEFAULT NULL,
  accepte_nouveaux_patients BOOLEAN DEFAULT TRUE,
  temps_consultation_moyen INT DEFAULT 30,
  langues_parlees VARCHAR(255) DEFAULT NULL,
  accepte_patients_walk_in BOOLEAN DEFAULT TRUE,
  UNIQUE KEY numero_ordre (numero_ordre),
  KEY specialite_id (specialite_id),
  KEY institution_id (institution_id),
  KEY idx_ville (ville),
  KEY idx_code_postal (code_postal),
  FOREIGN KEY (specialite_id) REFERENCES specialites (id),
  FOREIGN KEY (institution_id) REFERENCES institutions (id)
);

-- Table des affiliations médecins-institutions
CREATE TABLE medecin_institution (
  medecin_id INT,
  institution_id INT,
  est_principal BOOLEAN DEFAULT FALSE,
  date_debut DATE NOT NULL,
  date_fin DATE,
  PRIMARY KEY (medecin_id, institution_id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

-- Table des disponibilités des médecins
CREATE TABLE disponibilites_medecin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medecin_id INT NOT NULL,
  institution_id INT NOT NULL,
  jour_semaine ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche') NOT NULL,
  heure_debut TIME NOT NULL,
  heure_fin TIME NOT NULL,
  intervalle_minutes INT DEFAULT 30,
  a_pause_dejeuner BOOLEAN DEFAULT FALSE,
  heure_debut_pause TIME,
  heure_fin_pause TIME,
  est_actif BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  CHECK (
    (a_pause_dejeuner = FALSE AND heure_debut_pause IS NULL AND heure_fin_pause IS NULL) OR
    (a_pause_dejeuner = TRUE AND heure_debut_pause IS NOT NULL AND heure_fin_pause IS NOT NULL AND
     heure_debut_pause > heure_debut AND heure_fin_pause < heure_fin AND
     heure_debut_pause < heure_fin_pause)
  )
);

-- Table des jours d'indisponibilité exceptionnelle
CREATE TABLE indisponibilites_exceptionnelles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medecin_id INT NOT NULL,
  date_debut DATETIME NOT NULL,
  date_fin DATETIME NOT NULL,
  motif VARCHAR(255),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Doctors indexes
CREATE INDEX idx_medecins_walk_in ON medecins(accepte_patients_walk_in); 
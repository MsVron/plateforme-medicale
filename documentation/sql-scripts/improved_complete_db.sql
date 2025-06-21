-- IMPROVED MEDICAL PLATFORM DATABASE SCHEMA
-- All patient information is modifiable by doctors
-- Comprehensive medical analysis types with categories
-- Proper ordering and structure

-- Table d'authentification commune
CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom_utilisateur VARCHAR(50) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('super_admin', 'admin', 'medecin', 'patient', 'institution', 'pharmacy', 'hospital', 'laboratory') NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_specifique_role INT NOT NULL,
  est_actif BOOLEAN DEFAULT TRUE,
  derniere_connexion DATETIME,
  token_reset_password VARCHAR(255),
  date_expiration_token DATETIME,
  est_verifie BOOLEAN DEFAULT FALSE
);

-- Table des super administrateurs
CREATE TABLE super_admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(50) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  telephone VARCHAR(20),
  adresse VARCHAR(255)
);

-- Table des administrateurs
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(50) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  telephone VARCHAR(20),
  cree_par INT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cree_par) REFERENCES super_admins(id)
);

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

-- Add foreign key constraint after medecins table is created
ALTER TABLE institutions ADD CONSTRAINT institutions_ibfk_1 FOREIGN KEY (medecin_proprietaire_id) REFERENCES medecins (id);

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

-- IMPROVED: Table des patients - ALL FIELDS MODIFIABLE BY DOCTOR
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
  contact_urgence_relation VARCHAR(50), -- Relation avec le contact d'urgence
  groupe_sanguin ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), -- MODIFIABLE par médecin
  taille_cm INT,
  poids_kg DECIMAL(5,2),
  est_fumeur BOOLEAN,
  consommation_alcool ENUM('non', 'occasionnel', 'régulier', 'quotidien'),
  activite_physique ENUM('sédentaire', 'légère', 'modérée', 'intense'),
  profession VARCHAR(100), -- PROFESSION PRÉSENTE dans la DB
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

-- Table des allergies
CREATE TABLE allergies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Table de liaison patient-allergies
CREATE TABLE patient_allergies (
  patient_id INT NOT NULL,
  allergie_id INT NOT NULL,
  date_diagnostic DATE,
  severite ENUM('légère', 'modérée', 'sévère', 'mortelle') NOT NULL,
  notes TEXT,
  PRIMARY KEY (patient_id, allergie_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (allergie_id) REFERENCES allergies(id)
);

-- Table des antécédents médicaux
CREATE TABLE antecedents_medicaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type ENUM('medical', 'chirurgical', 'familial') NOT NULL,
  description TEXT NOT NULL,
  date_debut DATE,
  date_fin DATE,
  est_chronique BOOLEAN DEFAULT FALSE,
  medecin_id INT,
  date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des médicaments
CREATE TABLE medicaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom_commercial VARCHAR(100) NOT NULL,
  nom_molecule VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  forme ENUM('comprimé', 'gélule', 'sirop', 'injectable', 'patch', 'pommade', 'autre') NOT NULL,
  description TEXT
);

-- Table des traitements en cours
CREATE TABLE traitements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medicament_id INT NOT NULL,
  posologie VARCHAR(255) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE,
  est_permanent BOOLEAN DEFAULT FALSE,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  instructions TEXT,
  rappel_prise BOOLEAN DEFAULT FALSE,
  frequence_rappel VARCHAR(100) DEFAULT NULL,
  status ENUM('prescribed', 'dispensed', 'expired') DEFAULT 'prescribed',
  pharmacy_dispensed_id INT DEFAULT NULL,
  date_dispensed DATETIME DEFAULT NULL,
  dispensed_by_user_id INT DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medicament_id) REFERENCES medicaments(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (pharmacy_dispensed_id) REFERENCES institutions(id),
  FOREIGN KEY (dispensed_by_user_id) REFERENCES utilisateurs(id)
);

-- Table des rendez-vous
CREATE TABLE rendez_vous (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  institution_id INT NOT NULL,
  date_heure_debut DATETIME NOT NULL,
  date_heure_fin DATETIME NOT NULL,
  motif VARCHAR(255) NOT NULL,
  statut ENUM('planifié', 'confirmé', 'en cours', 'terminé', 'annulé', 'patient absent') DEFAULT 'planifié',
  notes_patient TEXT,
  mode ENUM('présentiel') DEFAULT 'présentiel',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createur_id INT NOT NULL,
  rappel_24h_envoye BOOLEAN DEFAULT FALSE,
  rappel_1h_envoye BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (createur_id) REFERENCES utilisateurs(id)
);

-- Table des notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('rdv', 'annulation', 'rappel', 'résultat', 'système') NOT NULL,
  est_lue BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_lecture DATETIME,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des consultations
CREATE TABLE consultations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rendez_vous_id INT NOT NULL,
  medecin_id INT NOT NULL,
  patient_id INT NOT NULL,
  date_consultation DATETIME NOT NULL,
  motif TEXT NOT NULL,
  anamnese TEXT,
  examen_clinique TEXT,
  diagnostic TEXT,
  conclusion TEXT,
  est_complete BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification DATETIME,
  follow_up_date DATE DEFAULT NULL,
  FOREIGN KEY (rendez_vous_id) REFERENCES rendez_vous(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Table des constantes vitales
CREATE TABLE constantes_vitales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT NOT NULL,
  patient_id INT NOT NULL,
  date_mesure DATETIME NOT NULL,
  temperature DECIMAL(3,1),
  tension_arterielle_systolique INT,
  tension_arterielle_diastolique INT,
  frequence_cardiaque INT,
  saturation_oxygene INT,
  frequence_respiratoire INT,
  glycemie DECIMAL(5,2),
  poids DECIMAL(5,2) DEFAULT NULL,
  taille INT DEFAULT NULL,
  imc DECIMAL(4,2) DEFAULT NULL,
  notes TEXT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- IMPROVED: Table des catégories d'analyses médicales
CREATE TABLE categories_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  ordre_affichage INT DEFAULT 0
);

-- IMPROVED: Table des types d'analyses avec catégories
CREATE TABLE types_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  valeurs_normales TEXT,
  unite VARCHAR(20),
  categorie_id INT NOT NULL,
  ordre_affichage INT DEFAULT 0,
  FOREIGN KEY (categorie_id) REFERENCES categories_analyses(id)
);

-- IMPROVED: Table des résultats d'analyses avec structure améliorée
CREATE TABLE resultats_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type_analyse_id INT NOT NULL,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription DATE NOT NULL,
  date_realisation DATE,
  laboratoire VARCHAR(100),
  valeur_numerique DECIMAL(10,3), -- Valeur numérique pour analyses quantitatives
  valeur_texte TEXT, -- Valeur textuelle pour analyses qualitatives
  unite VARCHAR(20), -- Unité de mesure
  valeur_normale_min DECIMAL(10,3), -- Valeur normale minimale
  valeur_normale_max DECIMAL(10,3), -- Valeur normale maximale
  interpretation TEXT,
  est_normal BOOLEAN,
  est_critique BOOLEAN DEFAULT FALSE, -- Valeur critique
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

-- Table des types d'imagerie
CREATE TABLE types_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Table des résultats d'imagerie
CREATE TABLE resultats_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type_imagerie_id INT NOT NULL,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription DATE NOT NULL,
  date_realisation DATE,
  institution_realisation_id INT,
  interpretation TEXT,
  conclusion TEXT,
  image_urls TEXT,
  medecin_radiologue_id INT,
  date_interpretation DATETIME,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (type_imagerie_id) REFERENCES types_imagerie(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_realisation_id) REFERENCES institutions(id),
  FOREIGN KEY (medecin_radiologue_id) REFERENCES medecins(id)
);

-- Table des documents médicaux
CREATE TABLE documents_medicaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type ENUM('ordonnance', 'certificat', 'compte-rendu', 'lettre', 'autre') NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  document_url VARCHAR(255) NOT NULL,
  medecin_id INT NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_partage BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table de l'historique des actions
CREATE TABLE historique_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  table_concernee VARCHAR(50) NOT NULL,
  enregistrement_id INT NOT NULL,
  description TEXT,
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  adresse_ip VARCHAR(45),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table des notes patient
CREATE TABLE notes_patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  contenu TEXT NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_important BOOLEAN DEFAULT FALSE,
  categorie VARCHAR(50) DEFAULT 'general',
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des rappels de suivi
CREATE TABLE rappels_suivi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  date_rappel DATE NOT NULL,
  motif VARCHAR(255) NOT NULL,
  description TEXT,
  est_complete BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- Table des mesures patient
CREATE TABLE mesures_patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  type_mesure VARCHAR(50) NOT NULL,
  valeur DECIMAL(10,2) NOT NULL,
  unite VARCHAR(20) NOT NULL,
  date_mesure DATETIME NOT NULL,
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
);

-- COMPREHENSIVE MEDICAL ANALYSIS CATEGORIES AND TYPES
INSERT INTO categories_analyses (nom, description, ordre_affichage) VALUES
('Hématologie', 'Analyses sanguines de base et spécialisées', 1),
('Biochimie', 'Analyses biochimiques et métaboliques', 2),
('Endocrinologie', 'Hormones et marqueurs endocriniens', 3),
('Immunologie', 'Tests immunologiques et auto-immuns', 4),
('Microbiologie', 'Analyses bactériologiques et infectieuses', 5),
('Vitamines et Minéraux', 'Dosages vitaminiques et minéraux', 6),
('Marqueurs Tumoraux', 'Marqueurs de cancer et oncologie', 7),
('Cardiologie', 'Marqueurs cardiaques', 8),
('Coagulation', 'Tests de coagulation sanguine', 9),
('Urologie', 'Analyses urinaires', 10),
('Autre', 'Autres analyses non classifiées', 99);

-- HÉMATOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoglobine', 'Taux d\'hémoglobine dans le sang', 'H: 13-17 g/dL, F: 12-15 g/dL', 'g/dL', 1, 1),
('Hématocrite', 'Pourcentage de globules rouges', 'H: 40-50%, F: 36-44%', '%', 1, 2),
('Globules rouges', 'Numération des érythrocytes', 'H: 4.5-5.5 M/μL, F: 4.0-5.0 M/μL', 'M/μL', 1, 3),
('Globules blancs', 'Numération leucocytaire', '4.0-11.0', '10³/μL', 1, 4),
('Plaquettes', 'Numération plaquettaire', '150-450', '10³/μL', 1, 5),
('VGM', 'Volume globulaire moyen', '80-100', 'fL', 1, 6),
('TCMH', 'Teneur corpusculaire moyenne en hémoglobine', '27-32', 'pg', 1, 7),
('CCMH', 'Concentration corpusculaire moyenne en hémoglobine', '32-36', 'g/dL', 1, 8),
('Réticulocytes', 'Jeunes globules rouges', '0.5-2.5', '%', 1, 9),
('Vitesse de sédimentation', 'VS - Vitesse de sédimentation', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', 1, 10);

-- BIOCHIMIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Glucose', 'Glycémie à jeun', '70-100', 'mg/dL', 2, 1),
('HbA1c', 'Hémoglobine glyquée', '<5.7%', '%', 2, 2),
('Créatinine', 'Fonction rénale', 'H: 0.7-1.3 mg/dL, F: 0.6-1.1 mg/dL', 'mg/dL', 2, 3),
('Urée', 'Azote uréique', '15-45', 'mg/dL', 2, 4),
('Acide urique', 'Uricémie', 'H: 3.5-7.2 mg/dL, F: 2.6-6.0 mg/dL', 'mg/dL', 2, 5),
('Cholestérol total', 'Cholestérol sanguin', '<200', 'mg/dL', 2, 6),
('HDL Cholestérol', 'Bon cholestérol', 'H: >40 mg/dL, F: >50 mg/dL', 'mg/dL', 2, 7),
('LDL Cholestérol', 'Mauvais cholestérol', '<100', 'mg/dL', 2, 8),
('Triglycérides', 'Lipides sanguins', '<150', 'mg/dL', 2, 9),
('ASAT (SGOT)', 'Transaminase aspartique', '10-40', 'UI/L', 2, 10),
('ALAT (SGPT)', 'Transaminase alanine', '7-56', 'UI/L', 2, 11),
('Gamma GT', 'Gamma glutamyl transférase', 'H: 9-48 UI/L, F: 9-32 UI/L', 'UI/L', 2, 12),
('Phosphatases alcalines', 'Enzymes hépatiques et osseuses', '44-147', 'UI/L', 2, 13),
('Bilirubine totale', 'Pigment biliaire', '0.3-1.2', 'mg/dL', 2, 14),
('Bilirubine directe', 'Bilirubine conjuguée', '0.0-0.3', 'mg/dL', 2, 15),
('Protéines totales', 'Protéinémie', '6.0-8.3', 'g/dL', 2, 16),
('Albumine', 'Albumine sérique', '3.5-5.0', 'g/dL', 2, 17),
('LDH', 'Lactate déshydrogénase', '140-280', 'UI/L', 2, 18);

-- ENDOCRINOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TSH', 'Hormone thyréostimulante', '0.27-4.2', 'mUI/L', 3, 1),
('T3 libre', 'Triiodothyronine libre', '2.0-4.4', 'pg/mL', 3, 2),
('T4 libre', 'Thyroxine libre', '0.93-1.7', 'ng/dL', 3, 3),
('Cortisol', 'Hormone du stress', '6.2-19.4 μg/dL (matin)', 'μg/dL', 3, 4),
('Insuline', 'Hormone pancréatique', '2.6-24.9', 'μUI/mL', 3, 5),
('Testostérone', 'Hormone masculine', 'H: 264-916 ng/dL', 'ng/dL', 3, 6),
('Œstradiol', 'Hormone féminine', 'Variable selon cycle', 'pg/mL', 3, 7),
('Progestérone', 'Hormone de grossesse', 'Variable selon cycle', 'ng/mL', 3, 8),
('FSH', 'Hormone folliculo-stimulante', 'Variable selon âge/sexe', 'mUI/mL', 3, 9),
('LH', 'Hormone lutéinisante', 'Variable selon âge/sexe', 'mUI/mL', 3, 10),
('Prolactine', 'Hormone lactogène', 'H: 4.0-15.2 ng/mL, F: 4.8-23.3 ng/mL', 'ng/mL', 3, 11),
('Hormone de croissance', 'GH - Somatotropine', '0.0-10.0', 'ng/mL', 3, 12),
('IGF-1', 'Facteur de croissance', 'Variable selon âge', 'ng/mL', 3, 13);

-- VITAMINES ET MINÉRAUX
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Vitamine D', '25-OH Vitamine D3', '30-100', 'ng/mL', 6, 1),
('Vitamine B12', 'Cobalamine', '200-900', 'pg/mL', 6, 2),
('Folates', 'Acide folique', '2.7-17.0', 'ng/mL', 6, 3),
('Vitamine B1', 'Thiamine', '70-180', 'nmol/L', 6, 4),
('Vitamine B6', 'Pyridoxine', '5-50', 'μg/L', 6, 5),
('Vitamine C', 'Acide ascorbique', '0.4-2.0', 'mg/dL', 6, 6),
('Vitamine A', 'Rétinol', '30-65', 'μg/dL', 6, 7),
('Vitamine E', 'Tocophérol', '5.0-20.0', 'μg/mL', 6, 8),
('Fer sérique', 'Fer sanguin', 'H: 65-175 μg/dL, F: 50-170 μg/dL', 'μg/dL', 6, 9),
('Ferritine', 'Réserves de fer', 'H: 12-300 ng/mL, F: 12-150 ng/mL', 'ng/mL', 6, 10),
('Transferrine', 'Protéine de transport du fer', '200-360', 'mg/dL', 6, 11),
('Coefficient de saturation', 'Saturation de la transferrine', '20-50', '%', 6, 12),
('Zinc', 'Oligo-élément', '70-120', 'μg/dL', 6, 13),
('Magnésium', 'Minéral essentiel', '1.7-2.2', 'mg/dL', 6, 14),
('Calcium', 'Minéral osseux', '8.5-10.5', 'mg/dL', 6, 15),
('Phosphore', 'Minéral osseux', '2.5-4.5', 'mg/dL', 6, 16),
('Sélénium', 'Oligo-élément antioxydant', '70-150', 'μg/L', 6, 17);

-- IMMUNOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('CRP', 'Protéine C-réactive', '<3.0', 'mg/L', 4, 1),
('CRP ultra-sensible', 'CRP haute sensibilité', '<1.0', 'mg/L', 4, 2),
('Facteur rhumatoïde', 'Auto-anticorps', '<14', 'UI/mL', 4, 3),
('Anticorps anti-CCP', 'Peptides citrullinés cycliques', '<20', 'U/mL', 4, 4),
('ANA', 'Anticorps anti-nucléaires', 'Négatif', 'Titre', 4, 5),
('Anti-DNA', 'Anticorps anti-ADN natif', '<7', 'UI/mL', 4, 6),
('Complément C3', 'Fraction du complément', '90-180', 'mg/dL', 4, 7),
('Complément C4', 'Fraction du complément', '10-40', 'mg/dL', 4, 8),
('IgG', 'Immunoglobulines G', '700-1600', 'mg/dL', 4, 9),
('IgA', 'Immunoglobulines A', '70-400', 'mg/dL', 4, 10),
('IgM', 'Immunoglobulines M', '40-230', 'mg/dL', 4, 11),
('IgE totales', 'Immunoglobulines E', '<100', 'UI/mL', 4, 12);

-- MARQUEURS TUMORAUX
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA', 'Antigène prostatique spécifique', '<4.0', 'ng/mL', 7, 1),
('CEA', 'Antigène carcino-embryonnaire', '<5.0', 'ng/mL', 7, 2),
('CA 19-9', 'Marqueur pancréatique', '<37', 'U/mL', 7, 3),
('CA 125', 'Marqueur ovarien', '<35', 'U/mL', 7, 4),
('CA 15-3', 'Marqueur mammaire', '<30', 'U/mL', 7, 5),
('AFP', 'Alpha-fœtoprotéine', '<10', 'ng/mL', 7, 6),
('Beta-HCG', 'Gonadotrophine chorionique', '<5', 'mUI/mL', 7, 7);

-- CARDIOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Troponine I', 'Marqueur d\'infarctus', '<0.04', 'ng/mL', 8, 1),
('Troponine T', 'Marqueur cardiaque', '<0.01', 'ng/mL', 8, 2),
('CK-MB', 'Créatine kinase MB', '<6.3', 'ng/mL', 8, 3),
('Myoglobine', 'Protéine musculaire', 'H: 28-72 ng/mL, F: 25-58 ng/mL', 'ng/mL', 8, 4),
('BNP', 'Peptide natriurétique', '<100', 'pg/mL', 8, 5),
('NT-proBNP', 'Pro-peptide natriurétique', '<125', 'pg/mL', 8, 6);

-- COAGULATION
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TP', 'Temps de prothrombine', '70-100', '%', 9, 1),
('INR', 'Rapport normalisé international', '0.8-1.2', 'Ratio', 9, 2),
('TCA', 'Temps de céphaline activée', '25-35', 'sec', 9, 3),
('Fibrinogène', 'Facteur de coagulation', '200-400', 'mg/dL', 9, 4),
('D-Dimères', 'Produits de dégradation', '<500', 'ng/mL', 9, 5);

-- UROLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Protéinurie', 'Protéines urinaires', '<150', 'mg/24h', 10, 1),
('Microalbuminurie', 'Albumine urinaire', '<30', 'mg/g créat', 10, 2),
('Clairance créatinine', 'Fonction rénale', '>90', 'mL/min/1.73m²', 10, 3),
('Sodium urinaire', 'Électrolyte urinaire', '40-220', 'mEq/24h', 10, 4),
('Potassium urinaire', 'Électrolyte urinaire', '25-125', 'mEq/24h', 10, 5);

-- MICROBIOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoculture', 'Culture sanguine', 'Stérile', 'Qualitatif', 5, 1),
('ECBU', 'Examen cytobactériologique urinaire', '<10⁴ UFC/mL', 'UFC/mL', 5, 2),
('Coproculture', 'Culture des selles', 'Flore normale', 'Qualitatif', 5, 3),
('Prélèvement gorge', 'Culture pharyngée', 'Flore normale', 'Qualitatif', 5, 4),
('Antibiogramme', 'Test de sensibilité aux antibiotiques', 'Variable', 'Qualitatif', 5, 5);

-- Exemples de données
INSERT INTO super_admins (prenom, nom, telephone, adresse)
VALUES ('Aya', 'Beroukech', '+212 614-026389', 'SupMTI Oujda');

-- Insert corresponding user for authentication
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie)
VALUES (
  'ayaberroukech',
  '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', -- Password: admin
  'aya.beroukech@medical.com',
  'super_admin',
  1,
  TRUE
);

INSERT INTO specialites (nom, description) VALUES
('Médecine générale', 'Médecine de premier recours et suivi global du patient'),
('Cardiologie', 'Spécialité médicale traitant des troubles du cœur et du système cardiovasculaire'),
('Pédiatrie', 'Spécialité médicale consacrée aux enfants et à leurs maladies'),
('Gynécologie-Obstétrique', 'Spécialité médicale qui s\'occupe de la santé du système reproducteur féminin et du suivi de grossesse'),
('Dermatologie', 'Spécialité médicale qui s\'occupe de la peau, des muqueuses et des phanères'),
('Ophtalmologie', 'Spécialité médicale concernant les yeux et la vision'),
('Orthopédie', 'Spécialité chirurgicale qui traite les troubles du système musculo-squelettique'),
('Neurologie', 'Spécialité médicale traitant des troubles du système nerveux'),
('Psychiatrie', 'Spécialité médicale traitant des troubles mentaux'),
('Radiologie', 'Spécialité médicale utilisant l\'imagerie pour diagnostiquer les maladies');

-- Exemple d'institutions avec coordonnées géographiques
INSERT INTO institutions (nom, adresse, ville, code_postal, pays, telephone, email_contact, coordonnees_gps, latitude, longitude, type) VALUES 
('Hôpital Central', '15 Avenue de la République', 'Paris', '75011', 'France', '+33 1 45 67 89 10', 'contact@hopital-central.fr', '48.8566,2.3522', 48.8566, 2.3522, 'hôpital'),
('Clinique Nord', '8 Rue du Nord', 'Lyon', '69001', 'France', '+33 4 72 10 20 30', 'contact@clinique-nord.fr', '45.7640,4.8357', 45.7640, 4.8357, 'clinique');

-- Add indexes for better performance
CREATE INDEX idx_patients_cne ON patients(CNE);
CREATE INDEX idx_utilisateurs_nom_utilisateur ON utilisateurs(nom_utilisateur);
CREATE INDEX idx_patients_inscrit_par_medecin ON patients(est_inscrit_par_medecin);
CREATE INDEX idx_medecins_walk_in ON medecins(accepte_patients_walk_in);
CREATE INDEX idx_patients_prenom ON patients(prenom);
CREATE INDEX idx_patients_nom ON patients(nom);
CREATE INDEX idx_patients_prenom_nom ON patients(prenom, nom);
CREATE INDEX idx_resultats_analyses_patient_date ON resultats_analyses(patient_id, date_realisation DESC);
CREATE INDEX idx_types_analyses_categorie ON types_analyses(categorie_id, ordre_affichage);
CREATE INDEX idx_traitements_patient_date ON traitements(patient_id, date_prescription DESC);

-- ========================================
-- COMPREHENSIVE ANALYSIS TYPES EXPANSION
-- ========================================

-- Additional comprehensive analysis types to expand the medical testing capabilities

-- HÉMATOLOGIE - Additional blood tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Vitesse de sédimentation (VS)', 'Vitesse de chute des globules rouges', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', 1, 11),
('Polynucléaires neutrophiles', 'Type de globules blancs', '1.8-7.7 10³/μL', '10³/μL', 1, 12),
('Polynucléaires éosinophiles', 'Type de globules blancs', '0.05-0.5 10³/μL', '10³/μL', 1, 13),
('Polynucléaires basophiles', 'Type de globules blancs', '0.01-0.1 10³/μL', '10³/μL', 1, 14),
('Lymphocytes', 'Type de globules blancs', '1.0-4.0 10³/μL', '10³/μL', 1, 15),
('Monocytes', 'Type de globules blancs', '0.2-1.0 10³/μL', '10³/μL', 1, 16);

-- BIOCHIMIE - Additional biochemistry tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Sodium', 'Électrolyte principal', '136-145 mmol/L', 'mmol/L', 2, 19),
('Potassium', 'Électrolyte intracellulaire', '3.5-5.1 mmol/L', 'mmol/L', 2, 20),
('Chlore', 'Électrolyte', '98-107 mmol/L', 'mmol/L', 2, 21),
('Calcium', 'Minéral osseux', '8.5-10.5 mg/dL', 'mg/dL', 2, 22),
('Phosphore', 'Minéral osseux', '2.5-4.5 mg/dL', 'mg/dL', 2, 23),
('Magnésium', 'Minéral essentiel', '1.7-2.2 mg/dL', 'mg/dL', 2, 24);

-- ENDOCRINOLOGIE - Additional hormones
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('ACTH', 'Hormone adrénocorticotrope', '7-63 pg/mL', 'pg/mL', 3, 14),
('Parathormone (PTH)', 'Hormone parathyroïdienne', '15-65 pg/mL', 'pg/mL', 3, 15);

-- IMMUNOLOGIE - Additional immunological tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Anticorps anti-nucléaires (AAN)', 'Auto-anticorps', '<1/80', 'titre', 4, 13),
('Anticorps anti-DNA natif', 'Auto-anticorps spécifiques', '<7 UI/mL', 'UI/mL', 4, 14),
('Complément C3', 'Protéine du complément', '90-180 mg/dL', 'mg/dL', 4, 15),
('Complément C4', 'Protéine du complément', '10-40 mg/dL', 'mg/dL', 4, 16),
('Immunoglobulines IgG', 'Anticorps de défense', '700-1600 mg/dL', 'mg/dL', 4, 17),
('Immunoglobulines IgA', 'Anticorps de défense', '70-400 mg/dL', 'mg/dL', 4, 18),
('Immunoglobulines IgM', 'Anticorps de défense', '40-230 mg/dL', 'mg/dL', 4, 19),
('Immunoglobulines IgE', 'Anticorps d\'allergie', '<100 UI/mL', 'UI/mL', 4, 20);

-- MICROBIOLOGIE - Infectious disease tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Procalcitonine', 'Marqueur d\'infection bactérienne', '<0.25 ng/mL', 'ng/mL', 5, 6),
('Sérologie VIH', 'Anticorps anti-VIH', 'Négatif', '', 5, 7),
('Sérologie Hépatite B (HBs Ag)', 'Antigène de surface hépatite B', 'Négatif', '', 5, 8),
('Sérologie Hépatite C', 'Anticorps anti-VHC', 'Négatif', '', 5, 9),
('Sérologie Toxoplasmose IgG', 'Immunité toxoplasmose', 'Variable', 'UI/mL', 5, 10),
('Sérologie Toxoplasmose IgM', 'Infection récente toxoplasmose', 'Négatif', '', 5, 11),
('Sérologie Rubéole IgG', 'Immunité rubéole', '>10 UI/mL', 'UI/mL', 5, 12),
('Sérologie CMV IgG', 'Immunité cytomégalovirus', 'Variable', 'UA/mL', 5, 13),
('Sérologie CMV IgM', 'Infection récente CMV', 'Négatif', '', 5, 14);

-- VITAMINES ET MINÉRAUX - Additional vitamins and minerals
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Folates (Vitamine B9)', 'Acide folique', '3-17 ng/mL', 'ng/mL', 6, 18),
('Vitamine B1 (Thiamine)', 'Vitamine B1', '70-180 nmol/L', 'nmol/L', 6, 19),
('Vitamine B6', 'Pyridoxine', '5-50 ng/mL', 'ng/mL', 6, 20),
('Vitamine C', 'Acide ascorbique', '0.4-2.0 mg/dL', 'mg/dL', 6, 21),
('Vitamine E', 'Tocophérol', '5-18 mg/L', 'mg/L', 6, 22),
('Vitamine A', 'Rétinol', '30-65 μg/dL', 'μg/dL', 6, 23),
('Cuivre', 'Oligo-élément', '70-140 μg/dL', 'μg/dL', 6, 24),
('Sélénium', 'Oligo-élément antioxydant', '70-150 μg/L', 'μg/L', 6, 25),
('Transferrine', 'Protéine de transport du fer', '200-360 mg/dL', 'mg/dL', 6, 26),
('Coefficient de saturation de la transferrine', 'Saturation en fer', '20-50%', '%', 6, 27);

-- MARQUEURS TUMORAUX - Additional cancer markers
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA libre', 'PSA libre', 'Ratio libre/total >15%', 'ng/mL', 7, 8),
('Calcitonine', 'Marqueur thyroïdien', 'H: <11.5 pg/mL, F: <4.6 pg/mL', 'pg/mL', 7, 9),
('Thyroglobuline', 'Marqueur thyroïdien', '<55 ng/mL', 'ng/mL', 7, 10);

-- CARDIOLOGIE - Additional cardiac markers
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('LDH1', 'Isoforme cardiaque de LDH', '45-90 UI/L', 'UI/L', 8, 7),
('Homocystéine', 'Facteur de risque cardiovasculaire', '<15 μmol/L', 'μmol/L', 8, 8);

-- COAGULATION - Additional coagulation tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Antithrombine III', 'Inhibiteur de coagulation', '80-120%', '%', 9, 6),
('Protéine C', 'Anticoagulant naturel', '70-140%', '%', 9, 7),
('Protéine S', 'Anticoagulant naturel', '60-140%', '%', 9, 8),
('Facteur V Leiden', 'Mutation thrombophilique', 'Absent', '', 9, 9);

-- UROLOGIE - Additional urine tests
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Créatinine urinaire', 'Créatinine dans les urines', '0.8-1.8 g/24h', 'g/24h', 10, 6),
('Débit de filtration glomérulaire (DFG)', 'Fonction rénale estimée', '>90 mL/min/1.73m²', 'mL/min/1.73m²', 10, 7),
('Sédiment urinaire', 'Examen microscopique des urines', 'Normal', '', 10, 8),
('Nitrites urinaires', 'Marqueur d\'infection urinaire', 'Négatif', '', 10, 9),
('Leucocytes urinaires', 'Globules blancs dans les urines', '<10/μL', '/μL', 10, 10),
('Hématies urinaires', 'Globules rouges dans les urines', '<5/μL', '/μL', 10, 11),
('Glucose urinaire', 'Sucre dans les urines', 'Négatif', '', 10, 12),
('Cétones urinaires', 'Corps cétoniques', 'Négatif', '', 10, 13);

-- ENHANCED INSTITUTION MANAGEMENT MODIFICATIONS
-- Add institution type and status fields
ALTER TABLE institutions 
ADD COLUMN type_institution ENUM('pharmacy', 'hospital', 'laboratory', 'clinic', 'hôpital', 'clinique', 'cabinet privé', 'centre médical', 'laboratoire', 'autre') DEFAULT 'autre',
ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved';

-- ENHANCED TRAITEMENTS TABLE - Add dispensing status
ALTER TABLE traitements 
ADD COLUMN status ENUM('prescribed', 'dispensed', 'expired') DEFAULT 'prescribed',
ADD COLUMN pharmacy_dispensed_id INT DEFAULT NULL,
ADD COLUMN date_dispensed DATETIME DEFAULT NULL,
ADD COLUMN dispensed_by_user_id INT DEFAULT NULL,
ADD FOREIGN KEY (pharmacy_dispensed_id) REFERENCES institutions(id),
ADD FOREIGN KEY (dispensed_by_user_id) REFERENCES utilisateurs(id);

-- ENHANCED RESULTATS_ANALYSES TABLE - Add laboratory management
ALTER TABLE resultats_analyses 
ADD COLUMN laboratory_id INT DEFAULT NULL,
ADD COLUMN request_status ENUM('requested', 'in_progress', 'completed', 'validated') DEFAULT 'requested',
ADD COLUMN priority ENUM('normal', 'urgent') DEFAULT 'normal',
ADD COLUMN technician_user_id INT DEFAULT NULL,
ADD COLUMN date_status_updated DATETIME DEFAULT NULL,
ADD FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
ADD FOREIGN KEY (technician_user_id) REFERENCES utilisateurs(id);

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

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT DEFAULT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
  INDEX idx_audit_logs_user (user_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_created (created_at)
);

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

-- Add indexes for better performance on new functionality
CREATE INDEX idx_traitements_status ON traitements(status);
CREATE INDEX idx_traitements_patient_status ON traitements(patient_id, status);
CREATE INDEX idx_resultats_analyses_laboratory ON resultats_analyses(laboratory_id);
CREATE INDEX idx_resultats_analyses_status ON resultats_analyses(request_status);
CREATE INDEX idx_resultats_analyses_priority ON resultats_analyses(priority);
CREATE INDEX idx_institutions_type ON institutions(type_institution);
CREATE INDEX idx_institutions_status ON institutions(status);

-- INSTITUTION LOGIN ENHANCEMENT USING EXISTING UTILISATEURS TABLE
-- Add additional indexes for institution authentication
CREATE INDEX idx_utilisateurs_role_specifique ON utilisateurs(role, id_specifique_role);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);

-- Create a view to easily check institution login status
CREATE OR REPLACE VIEW v_institution_login_status AS
SELECT 
    i.id as institution_id,
    i.nom as institution_name,
    i.type_institution,
    i.status as institution_status,
    i.est_actif as institution_active,
    u.id as user_id,
    u.nom_utilisateur,
    u.email,
    u.est_actif as user_active,
    u.est_verifie as user_verified,
    u.derniere_connexion,
    CASE 
        WHEN u.id IS NOT NULL AND u.est_actif = TRUE AND i.est_actif = TRUE AND i.status = 'approved' 
        THEN TRUE 
        ELSE FALSE 
    END as can_login
FROM institutions i
LEFT JOIN utilisateurs u ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE i.est_actif = TRUE;

-- Create a view for institutional users with their details
CREATE OR REPLACE VIEW v_institutional_users AS
SELECT 
    u.id as user_id,
    u.nom_utilisateur,
    u.email,
    u.role,
    u.est_actif as user_active,
    u.est_verifie,
    u.derniere_connexion,
    i.id as institution_id,
    i.nom as institution_name,
    i.type_institution,
    i.status as institution_status,
    i.ville,
    i.telephone,
    i.email_contact
FROM utilisateurs u
INNER JOIN institutions i ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE u.est_actif = TRUE AND i.est_actif = TRUE;

-- Add triggers to maintain data consistency for institutional users
DELIMITER $$

CREATE TRIGGER tr_institution_user_create
AFTER INSERT ON utilisateurs
FOR EACH ROW
BEGIN
    -- When a new institutional user is created, log it
    IF NEW.role = 'institution' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, created_at)
        VALUES (NEW.id, 'INSTITUTION_USER_CREATED', 'utilisateurs', NEW.id, 
                JSON_OBJECT('institution_id', NEW.id_specifique_role, 'email', NEW.email), NOW());
    END IF;
END$$

CREATE TRIGGER tr_institution_status_change
AFTER UPDATE ON institutions
FOR EACH ROW
BEGIN
    -- When institution status changes, update corresponding user status
    IF OLD.status != NEW.status OR OLD.est_actif != NEW.est_actif THEN
        -- Deactivate user if institution is not approved or not active
        IF NEW.status != 'approved' OR NEW.est_actif = FALSE THEN
            UPDATE utilisateurs 
            SET est_actif = FALSE 
            WHERE role = 'institution' AND id_specifique_role = NEW.id;
        ELSE
            -- Reactivate user if institution becomes approved and active
            UPDATE utilisateurs 
            SET est_actif = TRUE 
            WHERE role = 'institution' AND id_specifique_role = NEW.id;
        END IF;
        
        -- Log the change
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, created_at)
        VALUES (1, 'INSTITUTION_STATUS_CHANGED', 'institutions', NEW.id, 
                JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status, 
                           'old_active', OLD.est_actif, 'new_active', NEW.est_actif), NOW());
    END IF;
END$$

DELIMITER ; 

-- Migration for AI Diagnosis Assistant Tables
-- Create tables for storing diagnosis suggestions and feedback

-- Table for storing diagnosis suggestions
CREATE TABLE IF NOT EXISTS diagnosis_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    symptoms JSON NOT NULL,
    suggestions JSON NOT NULL,
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient_created (patient_id, created_at)
);

-- Table for storing patient feedback on diagnosis suggestions
CREATE TABLE IF NOT EXISTS diagnosis_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suggestion_id INT NOT NULL,
    patient_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (suggestion_id) REFERENCES diagnosis_suggestions(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_suggestion_rating (suggestion_id, rating)
); 

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

-- ENHANCED LABORATORY MANAGEMENT
-- Extended laboratory functionality for better workflow, imaging requests, and technician management

-- Enhanced imaging requests with better status tracking
CREATE TABLE imaging_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  prescribing_medecin_id INT NOT NULL,
  type_imagerie_id INT NOT NULL,
  requesting_institution_id INT DEFAULT NULL,
  performing_laboratory_id INT DEFAULT NULL,
  request_date DATETIME NOT NULL,
  scheduled_date DATETIME,
  completed_date DATETIME,
  priority ENUM('routine', 'urgent', 'stat', 'emergency') DEFAULT 'routine',
  clinical_indication TEXT NOT NULL,
  patient_preparation_instructions TEXT,
  contrast_required BOOLEAN DEFAULT FALSE,
  contrast_type VARCHAR(100),
  special_instructions TEXT,
  request_status ENUM('requested', 'scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'requested',
  technician_assigned_id INT DEFAULT NULL,
  radiologist_assigned_id INT DEFAULT NULL,
  equipment_used VARCHAR(100),
  study_instance_uid VARCHAR(255), -- DICOM identifier
  accession_number VARCHAR(50),
  referring_physician_notes TEXT,
  patient_history_relevant TEXT,
  allergies_contrast BOOLEAN DEFAULT FALSE,
  pregnancy_status ENUM('unknown', 'not_pregnant', 'pregnant', 'possibly_pregnant') DEFAULT 'unknown',
  created_by_user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified DATETIME DEFAULT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescribing_medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (type_imagerie_id) REFERENCES types_imagerie(id),
  FOREIGN KEY (requesting_institution_id) REFERENCES institutions(id),
  FOREIGN KEY (performing_laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (technician_assigned_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (radiologist_assigned_id) REFERENCES medecins(id),
  FOREIGN KEY (created_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_imaging_requests_patient (patient_id),
  INDEX idx_imaging_requests_status (request_status),
  INDEX idx_imaging_requests_laboratory (performing_laboratory_id),
  INDEX idx_imaging_requests_priority (priority),
  INDEX idx_imaging_requests_date (request_date)
);

-- Laboratory technician assignments and specializations
CREATE TABLE laboratory_technicians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  laboratory_id INT NOT NULL,
  employee_id VARCHAR(50),
  specializations JSON, -- Array of specializations like ["hematology", "biochemistry", "microbiology"]
  certifications JSON, -- Array of certifications
  shift_schedule JSON, -- Weekly schedule
  is_active BOOLEAN DEFAULT TRUE,
  hire_date DATE,
  supervisor_id INT DEFAULT NULL,
  access_level ENUM('basic', 'advanced', 'supervisor', 'manager') DEFAULT 'basic',
  can_validate_results BOOLEAN DEFAULT FALSE,
  max_concurrent_tests INT DEFAULT 10,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (supervisor_id) REFERENCES laboratory_technicians(id),
  UNIQUE KEY unique_user_laboratory (user_id, laboratory_id),
  INDEX idx_laboratory_technicians_laboratory (laboratory_id),
  INDEX idx_laboratory_technicians_active (is_active),
  INDEX idx_laboratory_technicians_specializations (specializations(255))
);

-- Enhanced analysis workflow tracking
CREATE TABLE analysis_workflow (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analysis_request_id INT NOT NULL, -- References resultats_analyses(id)
  patient_id INT NOT NULL,
  laboratory_id INT NOT NULL,
  workflow_step ENUM('received', 'sample_prep', 'testing', 'quality_control', 'validation', 'reporting', 'completed') NOT NULL,
  step_status ENUM('pending', 'in_progress', 'completed', 'failed', 'skipped') DEFAULT 'pending',
  assigned_technician_id INT DEFAULT NULL,
  step_start_time DATETIME,
  step_end_time DATETIME,
  duration_minutes INT,
  equipment_used VARCHAR(100),
  reagent_batch VARCHAR(50),
  quality_control_passed BOOLEAN DEFAULT NULL,
  step_notes TEXT,
  error_code VARCHAR(50),
  error_description TEXT,
  supervisor_review_required BOOLEAN DEFAULT FALSE,
  supervisor_reviewed_by INT DEFAULT NULL,
  supervisor_review_date DATETIME,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (analysis_request_id) REFERENCES resultats_analyses(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (assigned_technician_id) REFERENCES laboratory_technicians(id),
  FOREIGN KEY (supervisor_reviewed_by) REFERENCES laboratory_technicians(id),
  INDEX idx_analysis_workflow_request (analysis_request_id),
  INDEX idx_analysis_workflow_laboratory (laboratory_id),
  INDEX idx_analysis_workflow_step (workflow_step, step_status),
  INDEX idx_analysis_workflow_technician (assigned_technician_id)
);

-- Laboratory equipment management
CREATE TABLE laboratory_equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  laboratory_id INT NOT NULL,
  equipment_name VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  serial_number VARCHAR(100),
  manufacturer VARCHAR(100),
  installation_date DATE,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  calibration_date DATE,
  next_calibration_date DATE,
  status ENUM('operational', 'maintenance', 'out_of_service', 'calibration') DEFAULT 'operational',
  location_in_lab VARCHAR(100),
  supported_test_types JSON, -- Array of test types this equipment can perform
  maintenance_notes TEXT,
  warranty_expiry_date DATE,
  service_contract_info TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  INDEX idx_laboratory_equipment_laboratory (laboratory_id),
  INDEX idx_laboratory_equipment_status (status),
  INDEX idx_laboratory_equipment_maintenance (next_maintenance_date)
);

-- Sample tracking and chain of custody
CREATE TABLE sample_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analysis_request_id INT NOT NULL,
  patient_id INT NOT NULL,
  sample_id VARCHAR(50) NOT NULL,
  sample_type ENUM('blood', 'urine', 'stool', 'saliva', 'tissue', 'swab', 'other') NOT NULL,
  collection_date DATETIME NOT NULL,
  collection_site VARCHAR(100),
  collected_by_user_id INT,
  collection_method VARCHAR(100),
  sample_volume DECIMAL(8,2),
  sample_unit VARCHAR(20),
  container_type VARCHAR(50),
  preservation_method VARCHAR(100),
  transport_conditions VARCHAR(100),
  received_at_lab_date DATETIME,
  received_by_technician_id INT,
  sample_condition_on_receipt ENUM('good', 'acceptable', 'poor', 'rejected') DEFAULT 'good',
  rejection_reason TEXT,
  storage_location VARCHAR(100),
  storage_temperature DECIMAL(5,2),
  expiry_date DATETIME,
  disposal_date DATETIME,
  chain_of_custody_notes TEXT,
  barcode VARCHAR(100),
  FOREIGN KEY (analysis_request_id) REFERENCES resultats_analyses(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (collected_by_user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (received_by_technician_id) REFERENCES laboratory_technicians(id),
  UNIQUE KEY unique_sample_id (sample_id),
  INDEX idx_sample_tracking_analysis (analysis_request_id),
  INDEX idx_sample_tracking_patient (patient_id),
  INDEX idx_sample_tracking_collection_date (collection_date),
  INDEX idx_sample_tracking_barcode (barcode)
);

-- Laboratory quality control
CREATE TABLE laboratory_quality_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  laboratory_id INT NOT NULL,
  test_type_id INT NOT NULL,
  control_type ENUM('internal', 'external', 'proficiency') NOT NULL,
  control_date DATE NOT NULL,
  control_batch VARCHAR(50),
  expected_value DECIMAL(10,3),
  actual_value DECIMAL(10,3),
  acceptable_range_min DECIMAL(10,3),
  acceptable_range_max DECIMAL(10,3),
  result_status ENUM('pass', 'fail', 'warning') NOT NULL,
  deviation_percentage DECIMAL(5,2),
  corrective_action_required BOOLEAN DEFAULT FALSE,
  corrective_action_taken TEXT,
  technician_id INT NOT NULL,
  supervisor_reviewed BOOLEAN DEFAULT FALSE,
  supervisor_id INT DEFAULT NULL,
  equipment_used VARCHAR(100),
  reagent_lot VARCHAR(50),
  environmental_conditions TEXT,
  notes TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (laboratory_id) REFERENCES institutions(id),
  FOREIGN KEY (test_type_id) REFERENCES types_analyses(id),
  FOREIGN KEY (technician_id) REFERENCES laboratory_technicians(id),
  FOREIGN KEY (supervisor_id) REFERENCES laboratory_technicians(id),
  INDEX idx_laboratory_qc_laboratory (laboratory_id),
  INDEX idx_laboratory_qc_test_type (test_type_id),
  INDEX idx_laboratory_qc_date (control_date),
  INDEX idx_laboratory_qc_status (result_status)
);

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


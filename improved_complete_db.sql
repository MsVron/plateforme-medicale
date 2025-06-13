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
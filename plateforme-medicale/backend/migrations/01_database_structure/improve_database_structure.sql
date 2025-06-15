-- MIGRATION SCRIPT: Improve Database Structure
-- Date: 2024
-- Description: Add comprehensive medical analysis categories, improve patient data management

-- Step 1: Add missing fields to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS contact_urgence_relation VARCHAR(50) DEFAULT NULL;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS medecin_inscripteur_id INT DEFAULT NULL;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies_notes TEXT DEFAULT NULL;

-- Add foreign key for medecin_inscripteur_id if it doesn't exist
ALTER TABLE patients ADD CONSTRAINT fk_patients_medecin_inscripteur 
FOREIGN KEY (medecin_inscripteur_id) REFERENCES medecins(id) ON DELETE SET NULL;

-- Step 2: Add missing fields to traitements table
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS rappel_prise BOOLEAN DEFAULT FALSE;
ALTER TABLE traitements ADD COLUMN IF NOT EXISTS frequence_rappel VARCHAR(100) DEFAULT NULL;

-- Step 3: Add missing fields to constantes_vitales table
ALTER TABLE constantes_vitales ADD COLUMN IF NOT EXISTS poids DECIMAL(5,2) DEFAULT NULL;
ALTER TABLE constantes_vitales ADD COLUMN IF NOT EXISTS taille INT DEFAULT NULL;
ALTER TABLE constantes_vitales ADD COLUMN IF NOT EXISTS imc DECIMAL(4,2) DEFAULT NULL;

-- Step 4: Add missing fields to consultations table
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS follow_up_date DATE DEFAULT NULL;

-- Step 5: Create analysis categories table
CREATE TABLE IF NOT EXISTS categories_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  ordre_affichage INT DEFAULT 0
);

-- Step 6: Backup existing types_analyses table and recreate with categories
-- First, create a backup
CREATE TABLE IF NOT EXISTS types_analyses_backup AS SELECT * FROM types_analyses;

-- Add category support to types_analyses
ALTER TABLE types_analyses ADD COLUMN IF NOT EXISTS categorie_id INT DEFAULT NULL;
ALTER TABLE types_analyses ADD COLUMN IF NOT EXISTS ordre_affichage INT DEFAULT 0;

-- Step 7: Insert comprehensive analysis categories
INSERT IGNORE INTO categories_analyses (nom, description, ordre_affichage) VALUES
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

-- Step 8: Add foreign key constraint for categories
ALTER TABLE types_analyses ADD CONSTRAINT fk_types_analyses_categorie 
FOREIGN KEY (categorie_id) REFERENCES categories_analyses(id) ON DELETE SET NULL;

-- Step 9: Update existing analysis types to have a default category
UPDATE types_analyses SET categorie_id = (SELECT id FROM categories_analyses WHERE nom = 'Autre') 
WHERE categorie_id IS NULL;

-- Step 10: Insert comprehensive analysis types
-- HÉMATOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoglobine', 'Taux d\'hémoglobine dans le sang', 'H: 13-17 g/dL, F: 12-15 g/dL', 'g/dL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 1),
('Hématocrite', 'Pourcentage de globules rouges', 'H: 40-50%, F: 36-44%', '%', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 2),
('Globules rouges', 'Numération des érythrocytes', 'H: 4.5-5.5 M/μL, F: 4.0-5.0 M/μL', 'M/μL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 3),
('Globules blancs', 'Numération leucocytaire', '4.0-11.0', '10³/μL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 4),
('Plaquettes', 'Numération plaquettaire', '150-450', '10³/μL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 5),
('VGM', 'Volume globulaire moyen', '80-100', 'fL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 6),
('TCMH', 'Teneur corpusculaire moyenne en hémoglobine', '27-32', 'pg', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 7),
('CCMH', 'Concentration corpusculaire moyenne en hémoglobine', '32-36', 'g/dL', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 8),
('Réticulocytes', 'Jeunes globules rouges', '0.5-2.5', '%', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 9),
('Vitesse de sédimentation', 'VS - Vitesse de sédimentation', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', (SELECT id FROM categories_analyses WHERE nom = 'Hématologie'), 10);

-- BIOCHIMIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Glucose', 'Glycémie à jeun', '70-100', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 1),
('HbA1c', 'Hémoglobine glyquée', '<5.7%', '%', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 2),
('Créatinine', 'Fonction rénale', 'H: 0.7-1.3 mg/dL, F: 0.6-1.1 mg/dL', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 3),
('Urée', 'Azote uréique', '15-45', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 4),
('Acide urique', 'Uricémie', 'H: 3.5-7.2 mg/dL, F: 2.6-6.0 mg/dL', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 5),
('Cholestérol total', 'Cholestérol sanguin', '<200', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 6),
('HDL Cholestérol', 'Bon cholestérol', 'H: >40 mg/dL, F: >50 mg/dL', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 7),
('LDL Cholestérol', 'Mauvais cholestérol', '<100', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 8),
('Triglycérides', 'Lipides sanguins', '<150', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 9),
('ASAT (SGOT)', 'Transaminase aspartique', '10-40', 'UI/L', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 10),
('ALAT (SGPT)', 'Transaminase alanine', '7-56', 'UI/L', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 11),
('Gamma GT', 'Gamma glutamyl transférase', 'H: 9-48 UI/L, F: 9-32 UI/L', 'UI/L', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 12),
('Phosphatases alcalines', 'Enzymes hépatiques et osseuses', '44-147', 'UI/L', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 13),
('Bilirubine totale', 'Pigment biliaire', '0.3-1.2', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 14),
('Bilirubine directe', 'Bilirubine conjuguée', '0.0-0.3', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 15),
('Protéines totales', 'Protéinémie', '6.0-8.3', 'g/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 16),
('Albumine', 'Albumine sérique', '3.5-5.0', 'g/dL', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 17),
('LDH', 'Lactate déshydrogénase', '140-280', 'UI/L', (SELECT id FROM categories_analyses WHERE nom = 'Biochimie'), 18);

-- VITAMINES ET MINÉRAUX
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Vitamine D', '25-OH Vitamine D3', '30-100', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 1),
('Vitamine B12', 'Cobalamine', '200-900', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 2),
('Folates', 'Acide folique', '2.7-17.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 3),
('Vitamine B1', 'Thiamine', '70-180', 'nmol/L', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 4),
('Vitamine B6', 'Pyridoxine', '5-50', 'μg/L', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 5),
('Vitamine C', 'Acide ascorbique', '0.4-2.0', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 6),
('Vitamine A', 'Rétinol', '30-65', 'μg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 7),
('Vitamine E', 'Tocophérol', '5.0-20.0', 'μg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 8),
('Fer sérique', 'Fer sanguin', 'H: 65-175 μg/dL, F: 50-170 μg/dL', 'μg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 9),
('Ferritine', 'Réserves de fer', 'H: 12-300 ng/mL, F: 12-150 ng/mL', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 10),
('Transferrine', 'Protéine de transport du fer', '200-360', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 11),
('Coefficient de saturation', 'Saturation de la transferrine', '20-50', '%', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 12),
('Zinc', 'Oligo-élément', '70-120', 'μg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 13),
('Magnésium', 'Minéral essentiel', '1.7-2.2', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 14),
('Calcium', 'Minéral osseux', '8.5-10.5', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 15),
('Phosphore', 'Minéral osseux', '2.5-4.5', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 16),
('Sélénium', 'Oligo-élément antioxydant', '70-150', 'μg/L', (SELECT id FROM categories_analyses WHERE nom = 'Vitamines et Minéraux'), 17);

-- Step 11: Improve resultats_analyses table structure
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_numerique DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_texte TEXT DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS unite VARCHAR(20) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_normale_min DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS valeur_normale_max DECIMAL(10,3) DEFAULT NULL;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS est_critique BOOLEAN DEFAULT FALSE;
ALTER TABLE resultats_analyses ADD COLUMN IF NOT EXISTS notes_techniques TEXT DEFAULT NULL;

-- Step 12: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_cne ON patients(CNE);
CREATE INDEX IF NOT EXISTS idx_patients_inscrit_par_medecin ON patients(est_inscrit_par_medecin);
CREATE INDEX IF NOT EXISTS idx_patients_prenom ON patients(prenom);
CREATE INDEX IF NOT EXISTS idx_patients_nom ON patients(nom);
CREATE INDEX IF NOT EXISTS idx_patients_prenom_nom ON patients(prenom, nom);
CREATE INDEX IF NOT EXISTS idx_resultats_analyses_patient_date ON resultats_analyses(patient_id, date_realisation DESC);
CREATE INDEX IF NOT EXISTS idx_types_analyses_categorie ON types_analyses(categorie_id, ordre_affichage);
CREATE INDEX IF NOT EXISTS idx_traitements_patient_date ON traitements(patient_id, date_prescription DESC);

-- Step 13: Update existing data
-- Migrate existing resultats data to new structure
UPDATE resultats_analyses 
SET valeur_texte = resultats 
WHERE resultats IS NOT NULL AND valeur_texte IS NULL;

-- Step 14: Add more analysis types for other categories
-- ENDOCRINOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TSH', 'Hormone thyréostimulante', '0.27-4.2', 'mUI/L', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 1),
('T3 libre', 'Triiodothyronine libre', '2.0-4.4', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 2),
('T4 libre', 'Thyroxine libre', '0.93-1.7', 'ng/dL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 3),
('Cortisol', 'Hormone du stress', '6.2-19.4 μg/dL (matin)', 'μg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 4),
('Insuline', 'Hormone pancréatique', '2.6-24.9', 'μUI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 5);

-- IMMUNOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('CRP', 'Protéine C-réactive', '<3.0', 'mg/L', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 1),
('CRP ultra-sensible', 'CRP haute sensibilité', '<1.0', 'mg/L', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 2),
('Facteur rhumatoïde', 'Auto-anticorps', '<14', 'UI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 3);

-- CARDIOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Troponine I', 'Marqueur d\'infarctus', '<0.04', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 1),
('Troponine T', 'Marqueur cardiaque', '<0.01', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 2),
('CK-MB', 'Créatine kinase MB', '<6.3', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 3);

-- COAGULATION
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TP', 'Temps de prothrombine', '70-100', '%', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 1),
('INR', 'Rapport normalisé international', '0.8-1.2', 'Ratio', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 2),
('TCA', 'Temps de céphaline activée', '25-35', 'sec', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 3);

-- UROLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Protéinurie', 'Protéines urinaires', '<150', 'mg/24h', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 1),
('Microalbuminurie', 'Albumine urinaire', '<30', 'mg/g créat', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 2),
('Clairance créatinine', 'Fonction rénale', '>90', 'mL/min/1.73m²', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 3);

-- MICROBIOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoculture', 'Culture sanguine', 'Stérile', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 1),
('ECBU', 'Examen cytobactériologique urinaire', '<10⁴ UFC/mL', 'UFC/mL', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 2),
('Coproculture', 'Culture des selles', 'Flore normale', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 3);

-- MARQUEURS TUMORAUX
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA', 'Antigène prostatique spécifique', '<4.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 1),
('CEA', 'Antigène carcino-embryonnaire', '<5.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 2),
('CA 19-9', 'Marqueur pancréatique', '<37', 'U/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 3);

-- Step 15: Final cleanup and validation
-- Make sure all types_analyses have a category
UPDATE types_analyses 
SET categorie_id = (SELECT id FROM categories_analyses WHERE nom = 'Autre') 
WHERE categorie_id IS NULL;

-- Make the categorie_id field NOT NULL after setting defaults
ALTER TABLE types_analyses MODIFY COLUMN categorie_id INT NOT NULL;

COMMIT; 
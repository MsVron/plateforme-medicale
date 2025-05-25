-- Migration: Populate analysis types with categories
-- Date: 2024
-- Description: Insert comprehensive medical analysis categories and types

-- Insert analysis categories
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

-- ENDOCRINOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TSH', 'Hormone thyréostimulante', '0.27-4.2', 'mUI/L', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 1),
('T3 libre', 'Triiodothyronine libre', '2.0-4.4', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 2),
('T4 libre', 'Thyroxine libre', '0.93-1.7', 'ng/dL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 3),
('Cortisol', 'Hormone du stress', '6.2-19.4 μg/dL (matin)', 'μg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 4),
('Insuline', 'Hormone pancréatique', '2.6-24.9', 'μUI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 5),
('Testostérone', 'Hormone masculine', 'H: 264-916 ng/dL', 'ng/dL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 6),
('Œstradiol', 'Hormone féminine', 'Variable selon cycle', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 7),
('Progestérone', 'Hormone de grossesse', 'Variable selon cycle', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 8),
('FSH', 'Hormone folliculo-stimulante', 'Variable selon âge/sexe', 'mUI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 9),
('LH', 'Hormone lutéinisante', 'Variable selon âge/sexe', 'mUI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 10),
('Prolactine', 'Hormone lactogène', 'H: 4.0-15.2 ng/mL, F: 4.8-23.3 ng/mL', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 11),
('Hormone de croissance', 'GH - Somatotropine', '0.0-10.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 12),
('IGF-1', 'Facteur de croissance', 'Variable selon âge', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Endocrinologie'), 13);

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

-- IMMUNOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('CRP', 'Protéine C-réactive', '<3.0', 'mg/L', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 1),
('CRP ultra-sensible', 'CRP haute sensibilité', '<1.0', 'mg/L', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 2),
('Facteur rhumatoïde', 'Auto-anticorps', '<14', 'UI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 3),
('Anticorps anti-CCP', 'Peptides citrullinés cycliques', '<20', 'U/mL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 4),
('ANA', 'Anticorps anti-nucléaires', 'Négatif', 'Titre', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 5),
('Anti-DNA', 'Anticorps anti-ADN natif', '<7', 'UI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 6),
('Complément C3', 'Fraction du complément', '90-180', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 7),
('Complément C4', 'Fraction du complément', '10-40', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 8),
('IgG', 'Immunoglobulines G', '700-1600', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 9),
('IgA', 'Immunoglobulines A', '70-400', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 10),
('IgM', 'Immunoglobulines M', '40-230', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 11),
('IgE totales', 'Immunoglobulines E', '<100', 'UI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Immunologie'), 12);

-- MARQUEURS TUMORAUX
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA', 'Antigène prostatique spécifique', '<4.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 1),
('CEA', 'Antigène carcino-embryonnaire', '<5.0', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 2),
('CA 19-9', 'Marqueur pancréatique', '<37', 'U/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 3),
('CA 125', 'Marqueur ovarien', '<35', 'U/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 4),
('CA 15-3', 'Marqueur mammaire', '<30', 'U/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 5),
('AFP', 'Alpha-fœtoprotéine', '<10', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 6),
('Beta-HCG', 'Gonadotrophine chorionique', '<5', 'mUI/mL', (SELECT id FROM categories_analyses WHERE nom = 'Marqueurs Tumoraux'), 7);

-- CARDIOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Troponine I', 'Marqueur d\'infarctus', '<0.04', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 1),
('Troponine T', 'Marqueur cardiaque', '<0.01', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 2),
('CK-MB', 'Créatine kinase MB', '<6.3', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 3),
('Myoglobine', 'Protéine musculaire', 'H: 28-72 ng/mL, F: 25-58 ng/mL', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 4),
('BNP', 'Peptide natriurétique', '<100', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 5),
('NT-proBNP', 'Pro-peptide natriurétique', '<125', 'pg/mL', (SELECT id FROM categories_analyses WHERE nom = 'Cardiologie'), 6);

-- COAGULATION
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TP', 'Temps de prothrombine', '70-100', '%', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 1),
('INR', 'Rapport normalisé international', '0.8-1.2', 'Ratio', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 2),
('TCA', 'Temps de céphaline activée', '25-35', 'sec', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 3),
('Fibrinogène', 'Facteur de coagulation', '200-400', 'mg/dL', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 4),
('D-Dimères', 'Produits de dégradation', '<500', 'ng/mL', (SELECT id FROM categories_analyses WHERE nom = 'Coagulation'), 5);

-- UROLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Protéinurie', 'Protéines urinaires', '<150', 'mg/24h', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 1),
('Microalbuminurie', 'Albumine urinaire', '<30', 'mg/g créat', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 2),
('Clairance créatinine', 'Fonction rénale', '>90', 'mL/min/1.73m²', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 3),
('Sodium urinaire', 'Électrolyte urinaire', '40-220', 'mEq/24h', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 4),
('Potassium urinaire', 'Électrolyte urinaire', '25-125', 'mEq/24h', (SELECT id FROM categories_analyses WHERE nom = 'Urologie'), 5);

-- MICROBIOLOGIE
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoculture', 'Culture sanguine', 'Stérile', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 1),
('ECBU', 'Examen cytobactériologique urinaire', '<10⁴ UFC/mL', 'UFC/mL', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 2),
('Coproculture', 'Culture des selles', 'Flore normale', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 3),
('Prélèvement gorge', 'Culture pharyngée', 'Flore normale', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 4),
('Antibiogramme', 'Test de sensibilité aux antibiotiques', 'Variable', 'Qualitatif', (SELECT id FROM categories_analyses WHERE nom = 'Microbiologie'), 5); 
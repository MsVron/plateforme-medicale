-- OTHER ANALYSIS TYPES
-- Endocrinology, immunology, vitamins, tumor markers, cardiology, coagulation, urology, microbiology

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
('IGF-1', 'Facteur de croissance', 'Variable selon âge', 'ng/mL', 3, 13),
('ACTH', 'Hormone adrénocorticotrope', '7-63 pg/mL', 'pg/mL', 3, 14),
('Parathormone (PTH)', 'Hormone parathyroïdienne', '15-65 pg/mL', 'pg/mL', 3, 15);

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
('IgE totales', 'Immunoglobulines E', '<100', 'UI/mL', 4, 12),
('Anticorps anti-nucléaires (AAN)', 'Auto-anticorps', '<1/80', 'titre', 4, 13),
('Anticorps anti-DNA natif', 'Auto-anticorps spécifiques', '<7 UI/mL', 'UI/mL', 4, 14),
('Immunoglobulines IgG', 'Anticorps de défense', '700-1600 mg/dL', 'mg/dL', 4, 17),
('Immunoglobulines IgA', 'Anticorps de défense', '70-400 mg/dL', 'mg/dL', 4, 18),
('Immunoglobulines IgM', 'Anticorps de défense', '40-230 mg/dL', 'mg/dL', 4, 19),
('Immunoglobulines IgE', 'Anticorps d\'allergie', '<100 UI/mL', 'UI/mL', 4, 20);

-- MICROBIOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Hémoculture', 'Culture sanguine', 'Stérile', 'Qualitatif', 5, 1),
('ECBU', 'Examen cytobactériologique urinaire', '<10⁴ UFC/mL', 'UFC/mL', 5, 2),
('Coproculture', 'Culture des selles', 'Flore normale', 'Qualitatif', 5, 3),
('Prélèvement gorge', 'Culture pharyngée', 'Flore normale', 'Qualitatif', 5, 4),
('Antibiogramme', 'Test de sensibilité aux antibiotiques', 'Variable', 'Qualitatif', 5, 5),
('Procalcitonine', 'Marqueur d\'infection bactérienne', '<0.25 ng/mL', 'ng/mL', 5, 6),
('Sérologie VIH', 'Anticorps anti-VIH', 'Négatif', '', 5, 7),
('Sérologie Hépatite B (HBs Ag)', 'Antigène de surface hépatite B', 'Négatif', '', 5, 8),
('Sérologie Hépatite C', 'Anticorps anti-VHC', 'Négatif', '', 5, 9),
('Sérologie Toxoplasmose IgG', 'Immunité toxoplasmose', 'Variable', 'UI/mL', 5, 10),
('Sérologie Toxoplasmose IgM', 'Infection récente toxoplasmose', 'Négatif', '', 5, 11),
('Sérologie Rubéole IgG', 'Immunité rubéole', '>10 UI/mL', 'UI/mL', 5, 12),
('Sérologie CMV IgG', 'Immunité cytomégalovirus', 'Variable', 'UA/mL', 5, 13),
('Sérologie CMV IgM', 'Infection récente CMV', 'Négatif', '', 5, 14);

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
('Sélénium', 'Oligo-élément antioxydant', '70-150', 'μg/L', 6, 17),
('Folates (Vitamine B9)', 'Acide folique', '3-17 ng/mL', 'ng/mL', 6, 18),
('Vitamine B1 (Thiamine)', 'Vitamine B1', '70-180 nmol/L', 'nmol/L', 6, 19),
('Cuivre', 'Oligo-élément', '70-140 μg/dL', 'μg/dL', 6, 24),
('Coefficient de saturation de la transferrine', 'Saturation en fer', '20-50%', '%', 6, 27);

-- MARQUEURS TUMORAUX
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA', 'Antigène prostatique spécifique', '<4.0', 'ng/mL', 7, 1),
('CEA', 'Antigène carcino-embryonnaire', '<5.0', 'ng/mL', 7, 2),
('CA 19-9', 'Marqueur pancréatique', '<37', 'U/mL', 7, 3),
('CA 125', 'Marqueur ovarien', '<35', 'U/mL', 7, 4),
('CA 15-3', 'Marqueur mammaire', '<30', 'U/mL', 7, 5),
('AFP', 'Alpha-fœtoprotéine', '<10', 'ng/mL', 7, 6),
('Beta-HCG', 'Gonadotrophine chorionique', '<5', 'mUI/mL', 7, 7),
('PSA libre', 'PSA libre', 'Ratio libre/total >15%', 'ng/mL', 7, 8),
('Calcitonine', 'Marqueur thyroïdien', 'H: <11.5 pg/mL, F: <4.6 pg/mL', 'pg/mL', 7, 9),
('Thyroglobuline', 'Marqueur thyroïdien', '<55 ng/mL', 'ng/mL', 7, 10);

-- CARDIOLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Troponine I', 'Marqueur d\'infarctus', '<0.04', 'ng/mL', 8, 1),
('Troponine T', 'Marqueur cardiaque', '<0.01', 'ng/mL', 8, 2),
('CK-MB', 'Créatine kinase MB', '<6.3', 'ng/mL', 8, 3),
('Myoglobine', 'Protéine musculaire', 'H: 28-72 ng/mL, F: 25-58 ng/mL', 'ng/mL', 8, 4),
('BNP', 'Peptide natriurétique', '<100', 'pg/mL', 8, 5),
('NT-proBNP', 'Pro-peptide natriurétique', '<125', 'pg/mL', 8, 6),
('LDH1', 'Isoforme cardiaque de LDH', '45-90 UI/L', 'UI/L', 8, 7),
('Homocystéine', 'Facteur de risque cardiovasculaire', '<15 μmol/L', 'μmol/L', 8, 8);

-- COAGULATION
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('TP', 'Temps de prothrombine', '70-100', '%', 9, 1),
('INR', 'Rapport normalisé international', '0.8-1.2', 'Ratio', 9, 2),
('TCA', 'Temps de céphaline activée', '25-35', 'sec', 9, 3),
('Fibrinogène', 'Facteur de coagulation', '200-400', 'mg/dL', 9, 4),
('D-Dimères', 'Produits de dégradation', '<500', 'ng/mL', 9, 5),
('Antithrombine III', 'Inhibiteur de coagulation', '80-120%', '%', 9, 6),
('Protéine C', 'Anticoagulant naturel', '70-140%', '%', 9, 7),
('Protéine S', 'Anticoagulant naturel', '60-140%', '%', 9, 8),
('Facteur V Leiden', 'Mutation thrombophilique', 'Absent', '', 9, 9);

-- UROLOGIE
INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Protéinurie', 'Protéines urinaires', '<150', 'mg/24h', 10, 1),
('Microalbuminurie', 'Albumine urinaire', '<30', 'mg/g créat', 10, 2),
('Clairance créatinine', 'Fonction rénale', '>90', 'mL/min/1.73m²', 10, 3),
('Sodium urinaire', 'Électrolyte urinaire', '40-220', 'mEq/24h', 10, 4),
('Potassium urinaire', 'Électrolyte urinaire', '25-125', 'mEq/24h', 10, 5),
('Créatinine urinaire', 'Créatinine dans les urines', '0.8-1.8 g/24h', 'g/24h', 10, 6),
('Débit de filtration glomérulaire (DFG)', 'Fonction rénale estimée', '>90 mL/min/1.73m²', 'mL/min/1.73m²', 10, 7),
('Sédiment urinaire', 'Examen microscopique des urines', 'Normal', '', 10, 8),
('Nitrites urinaires', 'Marqueur d\'infection urinaire', 'Négatif', '', 10, 9),
('Leucocytes urinaires', 'Globules blancs dans les urines', '<10/μL', '/μL', 10, 10),
('Hématies urinaires', 'Globules rouges dans les urines', '<5/μL', '/μL', 10, 11),
('Glucose urinaire', 'Sucre dans les urines', 'Négatif', '', 10, 12),
('Cétones urinaires', 'Corps cétoniques', 'Négatif', '', 10, 13); 
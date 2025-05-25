-- ========================================
-- COMPREHENSIVE ANALYSIS TYPES MIGRATION
-- ========================================
-- Migration: add_comprehensive_analysis_types.sql
-- Description: Adds comprehensive analysis types to expand medical testing capabilities
-- Date: 2024-12-19
-- Author: Medical Platform Team

-- Additional comprehensive analysis types to expand the medical testing capabilities

-- HÉMATOLOGIE - Additional blood tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Vitesse de sédimentation (VS)', 'Vitesse de chute des globules rouges', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', 3, 11),
('Polynucléaires neutrophiles', 'Type de globules blancs', '1.8-7.7 10³/μL', '10³/μL', 3, 12),
('Polynucléaires éosinophiles', 'Type de globules blancs', '0.05-0.5 10³/μL', '10³/μL', 3, 13),
('Polynucléaires basophiles', 'Type de globules blancs', '0.01-0.1 10³/μL', '10³/μL', 3, 14),
('Lymphocytes', 'Type de globules blancs', '1.0-4.0 10³/μL', '10³/μL', 3, 15),
('Monocytes', 'Type de globules blancs', '0.2-1.0 10³/μL', '10³/μL', 3, 16);

-- BIOCHIMIE - Additional biochemistry tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Sodium', 'Électrolyte principal', '136-145 mmol/L', 'mmol/L', 4, 19),
('Potassium', 'Électrolyte intracellulaire', '3.5-5.1 mmol/L', 'mmol/L', 4, 20),
('Chlore', 'Électrolyte', '98-107 mmol/L', 'mmol/L', 4, 21),
('Calcium', 'Minéral osseux', '8.5-10.5 mg/dL', 'mg/dL', 4, 22),
('Phosphore', 'Minéral osseux', '2.5-4.5 mg/dL', 'mg/dL', 4, 23),
('Magnésium', 'Minéral essentiel', '1.7-2.2 mg/dL', 'mg/dL', 4, 24);

-- ENDOCRINOLOGIE - Additional hormones
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('ACTH', 'Hormone adrénocorticotrope', '7-63 pg/mL', 'pg/mL', 5, 14),
('Parathormone (PTH)', 'Hormone parathyroïdienne', '15-65 pg/mL', 'pg/mL', 5, 15);

-- IMMUNOLOGIE - Additional immunological tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Anticorps anti-nucléaires (AAN)', 'Auto-anticorps', '<1/80', 'titre', 6, 13),
('Anticorps anti-DNA natif', 'Auto-anticorps spécifiques', '<7 UI/mL', 'UI/mL', 6, 14),
('Complément C3', 'Protéine du complément', '90-180 mg/dL', 'mg/dL', 6, 15),
('Complément C4', 'Protéine du complément', '10-40 mg/dL', 'mg/dL', 6, 16),
('Immunoglobulines IgG', 'Anticorps de défense', '700-1600 mg/dL', 'mg/dL', 6, 17),
('Immunoglobulines IgA', 'Anticorps de défense', '70-400 mg/dL', 'mg/dL', 6, 18),
('Immunoglobulines IgM', 'Anticorps de défense', '40-230 mg/dL', 'mg/dL', 6, 19),
('Immunoglobulines IgE', 'Anticorps d\'allergie', '<100 UI/mL', 'UI/mL', 6, 20);

-- MICROBIOLOGIE - Infectious disease tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Procalcitonine', 'Marqueur d\'infection bactérienne', '<0.25 ng/mL', 'ng/mL', 7, 6),
('Sérologie VIH', 'Anticorps anti-VIH', 'Négatif', '', 7, 7),
('Sérologie Hépatite B (HBs Ag)', 'Antigène de surface hépatite B', 'Négatif', '', 7, 8),
('Sérologie Hépatite C', 'Anticorps anti-VHC', 'Négatif', '', 7, 9),
('Sérologie Toxoplasmose IgG', 'Immunité toxoplasmose', 'Variable', 'UI/mL', 7, 10),
('Sérologie Toxoplasmose IgM', 'Infection récente toxoplasmose', 'Négatif', '', 7, 11),
('Sérologie Rubéole IgG', 'Immunité rubéole', '>10 UI/mL', 'UI/mL', 7, 12),
('Sérologie CMV IgG', 'Immunité cytomégalovirus', 'Variable', 'UA/mL', 7, 13),
('Sérologie CMV IgM', 'Infection récente CMV', 'Négatif', '', 7, 14);

-- VITAMINES ET MINÉRAUX - Additional vitamins and minerals
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Folates (Vitamine B9)', 'Acide folique', '3-17 ng/mL', 'ng/mL', 8, 18),
('Vitamine B1 (Thiamine)', 'Vitamine B1', '70-180 nmol/L', 'nmol/L', 8, 19),
('Vitamine B6', 'Pyridoxine', '5-50 ng/mL', 'ng/mL', 8, 20),
('Vitamine C', 'Acide ascorbique', '0.4-2.0 mg/dL', 'mg/dL', 8, 21),
('Vitamine E', 'Tocophérol', '5-18 mg/L', 'mg/L', 8, 22),
('Vitamine A', 'Rétinol', '30-65 μg/dL', 'μg/dL', 8, 23),
('Cuivre', 'Oligo-élément', '70-140 μg/dL', 'μg/dL', 8, 24),
('Sélénium', 'Oligo-élément antioxydant', '70-150 μg/L', 'μg/L', 8, 25),
('Transferrine', 'Protéine de transport du fer', '200-360 mg/dL', 'mg/dL', 8, 26),
('Coefficient de saturation de la transferrine', 'Saturation en fer', '20-50%', '%', 8, 27);

-- MARQUEURS TUMORAUX - Additional cancer markers
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('PSA libre', 'PSA libre', 'Ratio libre/total >15%', 'ng/mL', 9, 8),
('Calcitonine', 'Marqueur thyroïdien', 'H: <11.5 pg/mL, F: <4.6 pg/mL', 'pg/mL', 9, 9),
('Thyroglobuline', 'Marqueur thyroïdien', '<55 ng/mL', 'ng/mL', 9, 10);

-- CARDIOLOGIE - Additional cardiac markers
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('LDH1', 'Isoforme cardiaque de LDH', '45-90 UI/L', 'UI/L', 10, 7),
('Homocystéine', 'Facteur de risque cardiovasculaire', '<15 μmol/L', 'μmol/L', 10, 8);

-- COAGULATION - Additional coagulation tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Antithrombine III', 'Inhibiteur de coagulation', '80-120%', '%', 11, 6),
('Protéine C', 'Anticoagulant naturel', '70-140%', '%', 11, 7),
('Protéine S', 'Anticoagulant naturel', '60-140%', '%', 11, 8),
('Facteur V Leiden', 'Mutation thrombophilique', 'Absent', '', 11, 9);

-- UROLOGIE - Additional urine tests
INSERT IGNORE INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage) VALUES
('Créatinine urinaire', 'Créatinine dans les urines', '0.8-1.8 g/24h', 'g/24h', 12, 6),
('Débit de filtration glomérulaire (DFG)', 'Fonction rénale estimée', '>90 mL/min/1.73m²', 'mL/min/1.73m²', 12, 7),
('Sédiment urinaire', 'Examen microscopique des urines', 'Normal', '', 12, 8),
('Nitrites urinaires', 'Marqueur d\'infection urinaire', 'Négatif', '', 12, 9),
('Leucocytes urinaires', 'Globules blancs dans les urines', '<10/μL', '/μL', 12, 10),
('Hématies urinaires', 'Globules rouges dans les urines', '<5/μL', '/μL', 12, 11),
('Glucose urinaire', 'Sucre dans les urines', 'Négatif', '', 12, 12),
('Cétones urinaires', 'Corps cétoniques', 'Négatif', '', 12, 13);

-- Verify the migration
SELECT 'Migration completed successfully. Total analysis types:' as message, COUNT(*) as total_count FROM types_analyses;

-- Show count by category after migration
SELECT 
    ca.nom as categorie, 
    COUNT(ta.id) as count
FROM categories_analyses ca
LEFT JOIN types_analyses ta ON ca.id = ta.categorie_id
GROUP BY ca.id, ca.nom
ORDER BY ca.ordre_affichage; 
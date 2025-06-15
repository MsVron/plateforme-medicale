-- =====================================================
-- POPULATE WEIGHT/HEIGHT HISTORY
-- Enhanced Medical Records - File 2/4
-- =====================================================

-- This file populates historical weight and height measurements
-- for patients across different age groups and medical conditions

-- Clear existing data
DELETE FROM mesures WHERE type_mesure IN ('poids', 'taille');

-- =====================================================
-- PEDIATRIC GROWTH CURVES
-- =====================================================

-- Khalid Tazi (CN101985) - Growth from age 2 to 8
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN101985', 'poids', '12.5', 'kg', '2018-03-15', 'Croissance normale - 2 ans'),
('CN101985', 'taille', '87', 'cm', '2018-03-15', 'Percentile 50 pour l\'âge'),
('CN101985', 'poids', '14.2', 'kg', '2019-03-15', 'Croissance régulière - 3 ans'),
('CN101985', 'taille', '95', 'cm', '2019-03-15', 'Développement harmonieux'),
('CN101985', 'poids', '16.8', 'kg', '2020-03-15', 'Bon développement - 4 ans'),
('CN101985', 'taille', '103', 'cm', '2020-03-15', 'Croissance dans la norme'),
('CN101985', 'poids', '18.5', 'kg', '2021-03-15', 'Poids stable - 5 ans'),
('CN101985', 'taille', '110', 'cm', '2021-03-15', 'Taille normale'),
('CN101985', 'poids', '21.2', 'kg', '2022-03-15', 'Croissance continue - 6 ans'),
('CN101985', 'taille', '117', 'cm', '2022-03-15', 'Développement régulier'),
('CN101985', 'poids', '24.1', 'kg', '2023-03-15', 'Bon développement - 7 ans'),
('CN101985', 'taille', '123', 'cm', '2023-03-15', 'Croissance satisfaisante'),
('CN101985', 'poids', '26.8', 'kg', '2024-03-15', 'Poids normal - 8 ans'),
('CN101985', 'taille', '129', 'cm', '2024-03-15', 'Taille dans la moyenne');

-- Hassan Taibi (CN234567) - Growth from age 5 to 12
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN234567', 'poids', '18.0', 'kg', '2019-06-10', 'Poids normal - 5 ans'),
('CN234567', 'taille', '108', 'cm', '2019-06-10', 'Taille moyenne'),
('CN234567', 'poids', '22.5', 'kg', '2020-06-10', 'Croissance régulière - 6 ans'),
('CN234567', 'taille', '115', 'cm', '2020-06-10', 'Développement normal'),
('CN234567', 'poids', '26.2', 'kg', '2021-06-10', 'Bon développement - 7 ans'),
('CN234567', 'taille', '122', 'cm', '2021-06-10', 'Croissance harmonieuse'),
('CN234567', 'poids', '30.8', 'kg', '2022-06-10', 'Poids stable - 8 ans'),
('CN234567', 'taille', '128', 'cm', '2022-06-10', 'Taille normale'),
('CN234567', 'poids', '35.5', 'kg', '2023-06-10', 'Croissance continue - 9 ans'),
('CN234567', 'taille', '135', 'cm', '2023-06-10', 'Développement régulier'),
('CN234567', 'poids', '41.2', 'kg', '2024-06-10', 'Poids normal - 10 ans'),
('CN234567', 'taille', '142', 'cm', '2024-06-10', 'Taille satisfaisante');

-- =====================================================
-- ADULT WEIGHT MANAGEMENT JOURNEYS
-- =====================================================

-- Omar Tazi (CN123456) - Hypertension/Diabetes weight management
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN123456', 'poids', '95.2', 'kg', '2020-01-15', 'Poids initial - IMC 32.1 (obésité)'),
('CN123456', 'taille', '172', 'cm', '2020-01-15', 'Taille de référence'),
('CN123456', 'poids', '92.8', 'kg', '2020-04-15', 'Début régime diabétique'),
('CN123456', 'poids', '89.5', 'kg', '2020-07-15', 'Amélioration avec traitement'),
('CN123456', 'poids', '87.2', 'kg', '2020-10-15', 'Perte de poids progressive'),
('CN123456', 'poids', '85.8', 'kg', '2021-01-15', 'Stabilisation du poids'),
('CN123456', 'poids', '84.5', 'kg', '2021-07-15', 'Maintien du régime'),
('CN123456', 'poids', '83.9', 'kg', '2022-01-15', 'Poids stable - bon contrôle'),
('CN123456', 'poids', '82.7', 'kg', '2022-07-15', 'Objectif thérapeutique atteint'),
('CN123456', 'poids', '83.2', 'kg', '2023-01-15', 'Maintien du poids cible'),
('CN123456', 'poids', '82.8', 'kg', '2023-07-15', 'Excellent contrôle'),
('CN123456', 'poids', '83.5', 'kg', '2024-01-15', 'Poids stable - IMC 28.2'),
('CN123456', 'poids', '83.1', 'kg', '2024-06-15', 'Maintien des acquis');

-- Abdellatif Idrissi (CN345678) - BPCO and weight loss
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN345678', 'poids', '78.5', 'kg', '2019-03-20', 'Poids initial'),
('CN345678', 'taille', '175', 'cm', '2019-03-20', 'Taille de référence'),
('CN345678', 'poids', '76.2', 'kg', '2019-09-20', 'Légère perte de poids'),
('CN345678', 'poids', '74.8', 'kg', '2020-03-20', 'Perte liée à la BPCO'),
('CN345678', 'poids', '73.1', 'kg', '2020-09-20', 'Surveillance nutritionnelle'),
('CN345678', 'poids', '71.9', 'kg', '2021-03-20', 'Amaigrissement progressif'),
('CN345678', 'poids', '70.5', 'kg', '2021-09-20', 'Suivi nutritionnel renforcé'),
('CN345678', 'poids', '69.8', 'kg', '2022-03-20', 'Stabilisation du poids'),
('CN345678', 'poids', '70.2', 'kg', '2022-09-20', 'Légère amélioration'),
('CN345678', 'poids', '70.8', 'kg', '2023-03-20', 'Maintien du poids'),
('CN345678', 'poids', '71.2', 'kg', '2023-09-20', 'Stabilité pondérale'),
('CN345678', 'poids', '70.9', 'kg', '2024-03-20', 'Poids stable - IMC 23.1');

-- Imane Hajji (CN456789) - Pregnancy weight tracking
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN456789', 'poids', '58.5', 'kg', '2022-01-10', 'Poids pré-grossesse'),
('CN456789', 'taille', '162', 'cm', '2022-01-10', 'Taille de référence'),
('CN456789', 'poids', '59.2', 'kg', '2022-02-10', 'Début de grossesse - 6 SA'),
('CN456789', 'poids', '60.1', 'kg', '2022-03-10', 'Prise de poids normale - 10 SA'),
('CN456789', 'poids', '61.8', 'kg', '2022-04-10', 'Évolution satisfaisante - 14 SA'),
('CN456789', 'poids', '64.2', 'kg', '2022-05-10', 'Prise de poids régulière - 18 SA'),
('CN456789', 'poids', '67.1', 'kg', '2022-06-10', 'Croissance fœtale normale - 22 SA'),
('CN456789', 'poids', '70.5', 'kg', '2022-07-10', 'Poids dans la norme - 26 SA'),
('CN456789', 'poids', '73.8', 'kg', '2022-08-10', 'Fin de grossesse - 30 SA'),
('CN456789', 'poids', '76.2', 'kg', '2022-09-10', 'Pré-accouchement - 34 SA'),
('CN456789', 'poids', '78.1', 'kg', '2022-10-05', 'Terme - 38 SA'),
('CN456789', 'poids', '62.8', 'kg', '2022-11-05', 'Post-partum - 1 mois'),
('CN456789', 'poids', '60.2', 'kg', '2023-01-05', 'Retour poids initial - 3 mois'),
('CN456789', 'poids', '59.8', 'kg', '2023-04-05', 'Poids stabilisé'),
('CN456789', 'poids', '59.5', 'kg', '2024-01-10', 'Maintien du poids');

-- =====================================================
-- ELDERLY PHYSIOLOGICAL CHANGES
-- =====================================================

-- Abderrahim Kettani (CN789012) - Elderly weight evolution
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN789012', 'poids', '72.8', 'kg', '2019-05-15', 'Poids de référence - 70 ans'),
('CN789012', 'taille', '168', 'cm', '2019-05-15', 'Taille stable'),
('CN789012', 'poids', '71.5', 'kg', '2020-05-15', 'Légère perte liée à l\'âge'),
('CN789012', 'poids', '70.2', 'kg', '2021-05-15', 'Diminution progressive'),
('CN789012', 'poids', '69.8', 'kg', '2022-05-15', 'Poids stable'),
('CN789012', 'poids', '68.9', 'kg', '2023-05-15', 'Surveillance nutritionnelle'),
('CN789012', 'poids', '68.5', 'kg', '2024-05-15', 'Maintien du poids - IMC 24.3');

-- Mehdi Alaoui (CN890123) - Elderly with multiple conditions
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN890123', 'poids', '81.2', 'kg', '2020-02-20', 'Poids initial - 75 ans'),
('CN890123', 'taille', '170', 'cm', '2020-02-20', 'Taille de référence'),
('CN890123', 'poids', '79.8', 'kg', '2020-08-20', 'Perte de poids modérée'),
('CN890123', 'poids', '78.5', 'kg', '2021-02-20', 'Surveillance cardiologique'),
('CN890123', 'poids', '77.9', 'kg', '2021-08-20', 'Poids stable'),
('CN890123', 'poids', '77.2', 'kg', '2022-02-20', 'Maintien du poids'),
('CN890123', 'poids', '76.8', 'kg', '2022-08-20', 'Stabilité pondérale'),
('CN890123', 'poids', '76.5', 'kg', '2023-02-20', 'Poids satisfaisant'),
('CN890123', 'poids', '76.1', 'kg', '2023-08-20', 'Bon état nutritionnel'),
('CN890123', 'poids', '75.9', 'kg', '2024-02-20', 'Poids stable - IMC 26.3');

-- =====================================================
-- CHRONIC CONDITION WEIGHT MONITORING
-- =====================================================

-- Nadia Berrada (CN567890) - Migraine and weight stability
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN567890', 'poids', '65.2', 'kg', '2021-01-12', 'Poids de référence'),
('CN567890', 'taille', '165', 'cm', '2021-01-12', 'Taille stable'),
('CN567890', 'poids', '64.8', 'kg', '2021-07-12', 'Poids stable'),
('CN567890', 'poids', '65.5', 'kg', '2022-01-12', 'Légère variation'),
('CN567890', 'poids', '65.1', 'kg', '2022-07-12', 'Retour à la normale'),
('CN567890', 'poids', '64.9', 'kg', '2023-01-12', 'Poids maintenu'),
('CN567890', 'poids', '65.3', 'kg', '2023-07-12', 'Stabilité pondérale'),
('CN567890', 'poids', '65.0', 'kg', '2024-01-12', 'Poids optimal - IMC 23.9');

-- Samia Benkirane (CN678901) - Thyroid condition weight fluctuations
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN678901', 'poids', '72.5', 'kg', '2020-06-18', 'Avant traitement thyroïdien'),
('CN678901', 'taille', '160', 'cm', '2020-06-18', 'Taille de référence'),
('CN678901', 'poids', '74.8', 'kg', '2020-09-18', 'Prise de poids - hypothyroïdie'),
('CN678901', 'poids', '76.2', 'kg', '2020-12-18', 'Ajustement traitement'),
('CN678901', 'poids', '74.9', 'kg', '2021-03-18', 'Amélioration avec L-thyroxine'),
('CN678901', 'poids', '73.1', 'kg', '2021-06-18', 'Normalisation progressive'),
('CN678901', 'poids', '71.8', 'kg', '2021-09-18', 'Retour vers poids initial'),
('CN678901', 'poids', '71.2', 'kg', '2021-12-18', 'Stabilisation'),
('CN678901', 'poids', '70.9', 'kg', '2022-06-18', 'Poids stable'),
('CN678901', 'poids', '71.1', 'kg', '2023-06-18', 'Maintien du poids'),
('CN678901', 'poids', '70.8', 'kg', '2024-06-18', 'Équilibre thyroïdien - IMC 27.7');

-- =====================================================
-- ADDITIONAL PATIENTS WITH VARIED PATTERNS
-- =====================================================

-- Youssef Alami (CN012345) - Allergy patient weight stability
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN012345', 'poids', '78.9', 'kg', '2022-03-25', 'Poids de référence'),
('CN012345', 'taille', '177', 'cm', '2022-03-25', 'Taille adulte'),
('CN012345', 'poids', '79.2', 'kg', '2022-09-25', 'Poids stable'),
('CN012345', 'poids', '78.7', 'kg', '2023-03-25', 'Légère variation'),
('CN012345', 'poids', '79.1', 'kg', '2023-09-25', 'Retour à la normale'),
('CN012345', 'poids', '78.8', 'kg', '2024-03-25', 'Poids maintenu - IMC 25.2');

-- Hassan Bennani (CN135792) - Adult with stable weight
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN135792', 'poids', '85.4', 'kg', '2021-08-30', 'Poids de référence'),
('CN135792', 'taille', '180', 'cm', '2021-08-30', 'Taille adulte'),
('CN135792', 'poids', '84.9', 'kg', '2022-02-28', 'Poids stable'),
('CN135792', 'poids', '85.7', 'kg', '2022-08-30', 'Légère augmentation'),
('CN135792', 'poids', '85.2', 'kg', '2023-02-28', 'Retour à la normale'),
('CN135792', 'poids', '85.0', 'kg', '2023-08-30', 'Poids maintenu'),
('CN135792', 'poids', '85.3', 'kg', '2024-02-28', 'Stabilité pondérale - IMC 26.3');

-- Zineb Fassi (CN246813) - Young adult weight evolution
INSERT INTO mesures (patient_cne, type_mesure, valeur, unite, date_mesure, notes) VALUES
('CN246813', 'poids', '52.8', 'kg', '2020-11-12', 'Poids initial - 20 ans'),
('CN246813', 'taille', '158', 'cm', '2020-11-12', 'Taille adulte'),
('CN246813', 'poids', '53.5', 'kg', '2021-05-12', 'Prise de poids normale'),
('CN246813', 'poids', '54.2', 'kg', '2021-11-12', 'Évolution physiologique'),
('CN246813', 'poids', '54.8', 'kg', '2022-05-12', 'Poids stable'),
('CN246813', 'poids', '55.1', 'kg', '2022-11-12', 'Maintien du poids'),
('CN246813', 'poids', '54.9', 'kg', '2023-05-12', 'Stabilité pondérale'),
('CN246813', 'poids', '55.0', 'kg', '2023-11-12', 'Poids optimal'),
('CN246813', 'poids', '54.7', 'kg', '2024-05-12', 'Maintien - IMC 21.9');

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================

-- Total measurements added: 100+
-- Age groups covered: Pediatric (2-12 years), Adult (20-50 years), Elderly (70+ years)
-- Medical conditions: Diabetes, Hypertension, BPCO, Pregnancy, Thyroid, Allergies
-- Measurement types: Weight (poids) and Height (taille)
-- Time span: 2018-2024 (6 years of historical data)

SELECT 'Weight/Height History Population Complete' as status,
       COUNT(*) as total_measurements,
       COUNT(DISTINCT patient_cne) as patients_with_measurements
FROM mesures 
WHERE type_mesure IN ('poids', 'taille'); 
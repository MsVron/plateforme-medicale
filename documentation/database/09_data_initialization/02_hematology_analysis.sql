-- HEMATOLOGY ANALYSIS TYPES
-- Blood analysis types and normal values

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
('Vitesse de sédimentation', 'VS - Vitesse de sédimentation', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', 1, 10),
('Vitesse de sédimentation (VS)', 'Vitesse de chute des globules rouges', 'H: <15 mm/h, F: <20 mm/h', 'mm/h', 1, 11),
('Polynucléaires neutrophiles', 'Type de globules blancs', '1.8-7.7 10³/μL', '10³/μL', 1, 12),
('Polynucléaires éosinophiles', 'Type de globules blancs', '0.05-0.5 10³/μL', '10³/μL', 1, 13),
('Polynucléaires basophiles', 'Type de globules blancs', '0.01-0.1 10³/μL', '10³/μL', 1, 14),
('Lymphocytes', 'Type de globules blancs', '1.0-4.0 10³/μL', '10³/μL', 1, 15),
('Monocytes', 'Type de globules blancs', '0.2-1.0 10³/μL', '10³/μL', 1, 16); 
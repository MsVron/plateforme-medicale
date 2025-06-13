-- MEDICAL ANALYSIS CATEGORIES DATA
-- Initial data for analysis categories

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
-- BIOCHEMISTRY ANALYSIS TYPES
-- Biochemical and metabolic analysis types

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
('LDH', 'Lactate déshydrogénase', '140-280', 'UI/L', 2, 18),
('Sodium', 'Électrolyte principal', '136-145 mmol/L', 'mmol/L', 2, 19),
('Potassium', 'Électrolyte intracellulaire', '3.5-5.1 mmol/L', 'mmol/L', 2, 20),
('Chlore', 'Électrolyte', '98-107 mmol/L', 'mmol/L', 2, 21),
('Calcium', 'Minéral osseux', '8.5-10.5 mg/dL', 'mg/dL', 2, 22),
('Phosphore', 'Minéral osseux', '2.5-4.5 mg/dL', 'mg/dL', 2, 23),
('Magnésium', 'Minéral essentiel', '1.7-2.2 mg/dL', 'mg/dL', 2, 24); 
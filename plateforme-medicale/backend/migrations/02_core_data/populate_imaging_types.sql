-- Migration: Populate imaging types
-- Date: 2024
-- Description: Insert comprehensive medical imaging types

-- Insert imaging types
INSERT IGNORE INTO types_imagerie (nom, description) VALUES
-- RADIOLOGIE CONVENTIONNELLE
('Radiographie thoracique', 'Examen radiologique du thorax (poumons, cœur, côtes)'),
('Radiographie abdominale', 'Examen radiologique de l\'abdomen sans préparation'),
('Radiographie des membres', 'Examen radiologique des os et articulations des membres'),
('Radiographie du rachis', 'Examen radiologique de la colonne vertébrale'),
('Radiographie du bassin', 'Examen radiologique du bassin et des hanches'),
('Radiographie dentaire', 'Examen radiologique dentaire (panoramique ou rétro-alvéolaire)'),

-- ÉCHOGRAPHIE
('Échographie abdominale', 'Examen échographique des organes abdominaux'),
('Échographie pelvienne', 'Examen échographique des organes pelviens'),
('Échographie obstétricale', 'Suivi échographique de la grossesse'),
('Échographie cardiaque (Échocardiographie)', 'Examen échographique du cœur et des valves cardiaques'),
('Échographie thyroïdienne', 'Examen échographique de la glande thyroïde'),
('Échographie mammaire', 'Examen échographique des seins'),
('Échographie des parties molles', 'Examen échographique des tissus mous'),
('Échographie doppler vasculaire', 'Examen doppler des vaisseaux sanguins'),
('Échographie rénale et vésicale', 'Examen échographique des reins et de la vessie'),
('Échographie hépatobiliaire', 'Examen échographique du foie et des voies biliaires'),

-- TOMODENSITOMÉTRIE (SCANNER)
('Scanner cérébral', 'Tomodensitométrie de l\'encéphale'),
('Scanner thoracique', 'Tomodensitométrie du thorax'),
('Scanner abdomino-pelvien', 'Tomodensitométrie de l\'abdomen et du pelvis'),
('Scanner des sinus', 'Tomodensitométrie des sinus de la face'),
('Scanner du rachis', 'Tomodensitométrie de la colonne vertébrale'),
('Scanner des membres', 'Tomodensitométrie des membres (ostéo-articulaire)'),
('Angio-scanner', 'Scanner avec injection de produit de contraste vasculaire'),

-- IRM (IMAGERIE PAR RÉSONANCE MAGNÉTIQUE)
('IRM cérébrale', 'Imagerie par résonance magnétique de l\'encéphale'),
('IRM rachidienne', 'Imagerie par résonance magnétique de la colonne vertébrale'),
('IRM articulaire', 'Imagerie par résonance magnétique des articulations'),
('IRM abdominale', 'Imagerie par résonance magnétique de l\'abdomen'),
('IRM pelvienne', 'Imagerie par résonance magnétique du pelvis'),
('IRM cardiaque', 'Imagerie par résonance magnétique du cœur'),
('IRM mammaire', 'Imagerie par résonance magnétique des seins'),
('Angio-IRM', 'IRM avec séquences angiographiques'),

-- IMAGERIE SPÉCIALISÉE
('Mammographie', 'Examen radiologique spécialisé des seins'),
('Densitométrie osseuse', 'Mesure de la densité minérale osseuse (ostéodensitométrie)'),
('Scintigraphie osseuse', 'Imagerie scintigraphique du squelette'),
('Scintigraphie thyroïdienne', 'Imagerie scintigraphique de la thyroïde'),
('Scintigraphie cardiaque', 'Imagerie scintigraphique du myocarde'),
('PET-Scan', 'Tomographie par émission de positrons'),

-- ENDOSCOPIE ET IMAGERIE INTERVENTIONNELLE
('Endoscopie digestive haute', 'Fibroscopie œso-gastro-duodénale'),
('Coloscopie', 'Endoscopie du côlon'),
('Bronchoscopie', 'Endoscopie des voies respiratoires'),
('Arthroscopie', 'Endoscopie articulaire'),
('Hystéroscopie', 'Endoscopie de l\'utérus'),

-- IMAGERIE VASCULAIRE
('Angiographie', 'Imagerie des vaisseaux sanguins'),
('Artériographie', 'Imagerie des artères'),
('Phlébographie', 'Imagerie des veines'),
('Échographie doppler carotidien', 'Doppler des artères carotides'),
('Échographie doppler des membres inférieurs', 'Doppler veineux et artériel des jambes');

-- Verification
SELECT 'Migration completed successfully. Total imaging types:' as message, COUNT(*) as total_count FROM types_imagerie; 
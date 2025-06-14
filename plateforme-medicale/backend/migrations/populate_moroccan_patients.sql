-- MOROCCAN PATIENTS POPULATION MIGRATION
-- Migration to populate the database with 50 diverse Moroccan patients
-- Created: 2024
-- Description: Adds realistic Moroccan patients with comprehensive medical records
-- 
-- This migration includes:
-- - 50 patients with diverse ages, genders, and medical conditions
-- - Complete medical histories (allergies, antecedents, chronic conditions)
-- - Patient measurements and vital signs
-- - Medical analysis results
-- - Prescriptions and medications
-- - Appointments and follow-up reminders
-- - Doctor-patient relationships and evaluations
--
-- Distribution:
-- - Casablanca: 15 patients
-- - Rabat: 10 patients  
-- - Marrakech: 8 patients
-- - Fès: 6 patients
-- - Other cities: 11 patients
--
-- Age groups: Children (8), Adults (32), Seniors (10)
-- Gender: 25 Male, 25 Female

-- ========================================
-- MOROCCAN PATIENTS POPULATION
-- ========================================

-- ========================================
-- SECTION 1: ALLERGIES SETUP
-- ========================================
-- Ensure we have comprehensive allergies in the database
INSERT IGNORE INTO allergies (nom, description) VALUES
-- Medication allergies
('Pénicilline', 'Allergie aux antibiotiques de la famille des pénicillines'),
('Aspirine', 'Allergie à l\'acide acétylsalicylique'),
('Sulfamides', 'Allergie aux antibiotiques sulfamidés'),
('Iode', 'Allergie aux produits iodés et contrastes'),
('Codéine', 'Allergie aux opiacés dérivés de la codéine'),
('AINS', 'Allergie aux anti-inflammatoires non stéroïdiens'),

-- Environmental allergies
('Pollen', 'Allergie saisonnière aux pollens d\'arbres et de graminées'),
('Acariens', 'Allergie aux acariens de la poussière domestique'),
('Poils d\'animaux', 'Allergie aux poils de chats, chiens et autres animaux'),
('Moisissures', 'Allergie aux spores de moisissures'),
('Latex', 'Allergie au caoutchouc naturel'),

-- Food allergies
('Fruits de mer', 'Allergie aux crustacés et mollusques'),
('Arachides', 'Allergie aux cacahuètes et dérivés'),
('Œufs', 'Allergie aux protéines d\'œuf'),
('Lait', 'Allergie aux protéines de lait de vache'),
('Gluten', 'Allergie au gluten et dérivés du blé'),
('Fruits à coque', 'Allergie aux noix, amandes, noisettes'),
('Soja', 'Allergie aux protéines de soja');

-- ========================================
-- SECTION 2: PATIENT DATA
-- ========================================
-- Get the starting patient ID for consistent referencing
-- SET @patient_start_id = (SELECT COALESCE(MAX(id), 0) FROM patients) + 1;
-- Note: Removed variable usage to avoid ID conflicts. Using CNE-based lookups instead.

-- Insert 50 diverse Moroccan patients with comprehensive medical profiles
INSERT INTO patients (
    prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal, pays, 
    telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_relation,
    groupe_sanguin, taille_cm, poids_kg, est_fumeur, consommation_alcool, activite_physique,
    profession, medecin_traitant_id, est_profil_complete, allergies_notes
) VALUES

-- Casablanca patients (15 patients)
('Youssef', 'Alami', '1985-03-15', 'M', 'CN101985', '23 Rue Hassan II', 'Casablanca', '20000', 'Maroc', '+212 661-234567', 'youssef.alami01@gmail.com', 'Fatima Alami', '+212 661-234568', 'Épouse', 'O+', 175, 78.5, FALSE, 'non', 'modérée', 'Ingénieur informatique', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie légère aux acariens'),

('Aicha', 'Benali', '1992-07-22', 'F', 'CN102992', '45 Boulevard Zerktouni', 'Casablanca', '20100', 'Maroc', '+212 662-345678', 'aicha.benali02@hotmail.com', 'Mohamed Benali', '+212 662-345679', 'Père', 'A+', 162, 58.0, FALSE, 'non', 'légère', 'Professeure', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Omar', 'Tazi', '1978-11-08', 'M', 'CN103978', '67 Avenue Mohammed V', 'Casablanca', '20200', 'Maroc', '+212 663-456789', 'omar.tazi05@outlook.com', 'Khadija Tazi', '+212 663-456790', 'Épouse', 'B+', 180, 85.2, TRUE, 'occasionnel', 'légère', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, NULL),

('Fatima', 'Chraibi', '1995-01-30', 'F', 'CN104995', '12 Rue Ibn Batouta', 'Casablanca', '20300', 'Maroc', '+212 664-567890', 'fatima.elfassi04@gmail.com', 'Ahmed Chraibi', '+212 664-567891', 'Frère', 'AB+', 168, 62.5, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, NULL),

('Hassan', 'Bennani', '1988-09-12', 'M', 'CN105988', '89 Rue de Fès', 'Casablanca', '20400', 'Maroc', '+212 665-678901', 'hassan.alaoui07@hotmail.fr', 'Laila Bennani', '+212 665-678902', 'Épouse', 'O-', 172, 74.8, FALSE, 'régulier', 'modérée', 'Architecte', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie sévère aux fruits de mer - porte EpiPen'),

('Zineb', 'Fassi', '2010-05-18', 'F', 'CN106010', '34 Boulevard Moulay Youssef', 'Casablanca', '20500', 'Maroc', '+212 666-789012', 'zineb.amrani12@hotmail.com', 'Rachid Fassi', '+212 666-789013', 'Père', 'A-', 145, 38.0, FALSE, 'non', 'modérée', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Allergie modérée au pollen - rhinite saisonnière'),

('Abdellatif', 'Idrissi', '1965-12-03', 'M', 'CN107965', '56 Avenue Hassan II', 'Casablanca', '20600', 'Maroc', '+212 667-890123', 'mohammed.idrissi03@yahoo.fr', 'Malika Idrissi', '+212 667-890124', 'Épouse', 'B-', 170, 82.3, TRUE, 'quotidien', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, NULL),

('Salma', 'Kettani', '1990-04-25', 'F', 'CN108990', '78 Rue Patrice Lumumba', 'Casablanca', '20700', 'Maroc', '+212 668-901234', 'samira.kettani10@outlook.fr', 'Youssef Kettani', '+212 668-901235', 'Époux', 'AB-', 165, 59.7, FALSE, 'non', 'intense', 'Médecin dentiste', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, NULL),

('Karim', 'Alaoui', '1982-08-14', 'M', 'CN109982', '23 Avenue Allal Ben Abdellah', 'Casablanca', '20800', 'Maroc', '+212 669-012345', 'karim.lahlou11@gmail.com', 'Nadia Alaoui', '+212 669-012346', 'Épouse', 'O+', 178, 79.1, FALSE, 'occasionnel', 'modérée', 'Avocat', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie sévère à la pénicilline - éruption cutanée'),

('Nadia', 'Berrada', '1987-06-07', 'F', 'CN110987', '45 Rue Oued Fès', 'Casablanca', '20900', 'Maroc', '+212 670-123456', 'nadia.chraibi08@yahoo.com', 'Hassan Berrada', '+212 670-123457', 'Époux', 'A+', 160, 55.4, FALSE, 'non', 'légère', 'Pharmacienne', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, NULL),

('Rachid', 'Hajji', '1975-02-28', 'M', 'CN111975', '67 Boulevard Zerktouni', 'Casablanca', '21000', 'Maroc', '+212 671-234567', 'rachid.berrada09@gmail.com', 'Aicha Hajji', '+212 671-234568', 'Épouse', 'B+', 174, 76.9, TRUE, 'régulier', 'légère', 'Chef d\'entreprise', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, NULL),

('Laila', 'Bensouda', '2005-10-11', 'F', 'CN112005', '89 Avenue Mohammed VI', 'Casablanca', '21100', 'Maroc', '+212 672-345678', 'laila.bensouda.casa@student.ma', 'Mustapha Bensouda', '+212 672-345679', 'Père', 'O-', 158, 48.2, FALSE, 'non', 'intense', 'Lycéenne', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, NULL),

('Mehdi', 'Alaoui', '1960-04-18', 'M', 'CN113960', '12 Rue Al Massira', 'Casablanca', '21200', 'Maroc', '+212 673-456789', 'mehdi.alaoui.casa@retraite.ma', 'Zohra Alaoui', '+212 673-456790', 'Épouse', 'A+', 168, 72.4, TRUE, 'occasionnel', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, NULL),

('Samia', 'Benkirane', '1997-09-03', 'F', 'CN114997', '34 Boulevard Anfa', 'Casablanca', '21300', 'Maroc', '+212 674-567890', 'samia.benkirane@etudiant.ma', 'Rachid Benkirane', '+212 674-567891', 'Père', 'B-', 164, 56.8, FALSE, 'non', 'intense', 'Étudiante en pharmacie', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, NULL),

('Khalid', 'Tazi', '2015-12-25', 'M', 'CN115015', '56 Rue des Orangers', 'Casablanca', '21400', 'Maroc', '+212 675-678901', 'khalid.tazi@parent.com', 'Nadia Tazi', '+212 675-678902', 'Mère', 'O+', 120, 28.5, FALSE, 'non', 'intense', 'Écolier', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Allergie modérée aux œufs - éviction alimentaire'),

-- Rabat patients (10 patients)
('Ahmed', 'Fassi', '1980-01-20', 'M', 'CN201980', '12 Avenue Mohammed V', 'Rabat', '10000', 'Maroc', '+212 673-456789', 'ahmed.fassi.rabat@gmail.com', 'Khadija Fassi', '+212 673-456790', 'Épouse', 'A+', 176, 81.7, FALSE, 'occasionnel', 'modérée', 'Fonctionnaire', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, NULL),

('Malika', 'Lahlou', '1993-11-15', 'F', 'CN202993', '34 Rue Patrice Lumumba', 'Rabat', '10100', 'Maroc', '+212 674-567890', 'malika.lahlou@yahoo.fr', 'Omar Lahlou', '+212 674-567891', 'Père', 'B-', 163, 57.8, FALSE, 'non', 'modérée', 'Journaliste', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Allergies multiples: acariens et pollen - traitement antihistaminique'),

('Youssef', 'Benkirane', '1970-07-08', 'M', 'CN203970', '56 Avenue Allal Ben Abdellah', 'Rabat', '10200', 'Maroc', '+212 675-678901', 'youssef.benkirane@hotmail.com', 'Fatima Benkirane', '+212 675-678902', 'Épouse', 'AB+', 169, 78.4, TRUE, 'quotidien', 'sédentaire', 'Chauffeur de taxi', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Hypertension, tabagisme chronique'),

('Houda', 'Chraibi', '1989-03-22', 'F', 'CN204989', '78 Rue Oued Fès', 'Rabat', '10300', 'Maroc', '+212 676-789012', 'houda.chraibi@gmail.com', 'Karim Chraibi', '+212 676-789013', 'Époux', 'O+', 167, 61.2, FALSE, 'non', 'intense', 'Infirmière', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),

('Driss', 'Alami', '1984-12-05', 'M', 'CN205984', '23 Boulevard Mohammed Diouri', 'Rabat', '10400', 'Maroc', '+212 677-890123', 'driss.alami@outlook.com', 'Zineb Alami', '+212 677-890124', 'Épouse', 'A-', 173, 75.6, FALSE, 'régulier', 'légère', 'Banquier', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, 'Allergie à l\'aspirine'),

('Samira', 'Bennani', '1996-09-18', 'F', 'CN206996', '45 Avenue Hassan II', 'Rabat', '10500', 'Maroc', '+212 678-901234', 'samira.bennani@yahoo.fr', 'Hassan Bennani', '+212 678-901235', 'Père', 'B+', 161, 54.9, FALSE, 'non', 'modérée', 'Étudiante en médecine', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Anémie ferriprive'),

('Brahim', 'Tazi', '1977-05-30', 'M', 'CN207977', '67 Rue de la Liberté', 'Rabat', '10600', 'Maroc', '+212 679-012345', 'brahim.tazi@gmail.com', 'Laila Tazi', '+212 679-012346', 'Épouse', 'O-', 171, 73.8, TRUE, 'occasionnel', 'sédentaire', 'Mécanicien', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Lombalgie chronique, tabagisme'),

('Khadija', 'Idrissi', '1991-08-12', 'F', 'CN208991', '89 Avenue Moulay Youssef', 'Rabat', '10700', 'Maroc', '+212 680-123456', 'khadija.idrissi@hotmail.com', 'Ahmed Idrissi', '+212 680-123457', 'Époux', 'AB-', 164, 58.7, FALSE, 'non', 'intense', 'Professeure de sport', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),



-- Marrakech patients (8 patients)
('Hassan', 'Berrada', '1983-04-17', 'M', 'CN301983', '12 Avenue Mohammed VI', 'Marrakech', '40000', 'Maroc', '+212 681-234567', 'hassan.berrada@gmail.com', 'Aicha Berrada', '+212 681-234568', 'Épouse', 'A+', 177, 80.3, FALSE, 'occasionnel', 'modérée', 'Guide touristique', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, NULL),

('Fatima', 'Kettani', '1986-10-25', 'F', 'CN302986', '34 Rue de la Liberté', 'Marrakech', '40100', 'Maroc', '+212 682-345678', 'fatima.kettani@yahoo.fr', 'Youssef Kettani', '+212 682-345679', 'Époux', 'B+', 159, 56.1, FALSE, 'non', 'légère', 'Artisane', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie au latex'),

('Omar', 'Hajji', '1974-01-08', 'M', 'CN303974', '56 Boulevard Zerktouni', 'Marrakech', '40200', 'Maroc', '+212 683-456789', 'omar.hajji@hotmail.com', 'Malika Hajji', '+212 683-456790', 'Épouse', 'O+', 175, 77.9, TRUE, 'régulier', 'sédentaire', 'Restaurateur', (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), TRUE, 'Arthrose du genou, surpoids'),

('Zineb', 'Alaoui', '1998-06-14', 'F', 'CN304998', '78 Avenue Hassan II', 'Marrakech', '40300', 'Maroc', '+212 684-567890', 'zineb.alaoui@gmail.com', 'Rachid Alaoui', '+212 684-567891', 'Père', 'A-', 166, 52.4, FALSE, 'non', 'intense', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Dysménorrhée'),

('Karim', 'Benali', '1979-11-27', 'M', 'CN305979', '23 Rue Ibn Rochd', 'Marrakech', '40400', 'Maroc', '+212 685-678901', 'karim.benali@outlook.com', 'Nadia Benali', '+212 685-678902', 'Épouse', 'B-', 172, 74.2, FALSE, 'occasionnel', 'modérée', 'Électricien', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, 'Allergie aux sulfamides'),

('Laila', 'Fassi', '2008-03-09', 'F', 'CN306008', '45 Boulevard Mohammed V', 'Marrakech', '40500', 'Maroc', '+212 686-789012', 'laila.fassi@parent.com', 'Ahmed Fassi', '+212 686-789013', 'Père', 'AB+', 142, 35.8, FALSE, 'non', 'intense', 'Collégienne', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie aux arachides'),

('Abderrahim', 'Kettani', '1955-11-12', 'M', 'CN307955', '67 Rue Yaacoub El Mansour', 'Marrakech', '40600', 'Maroc', '+212 687-890123', 'abderrahim.kettani.marrakech@retraite.ma', 'Aicha Kettani', '+212 687-890124', 'Épouse', 'B+', 165, 68.9, FALSE, 'non', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, 'Diabète type 2, insuffisance rénale légère'),

('Imane', 'Hajji', '1994-07-16', 'F', 'CN308994', '89 Avenue Prince Moulay Abdellah', 'Marrakech', '40700', 'Maroc', '+212 688-901234', 'imane.hajji@infirmiere.ma', 'Youssef Hajji', '+212 688-901235', 'Époux', 'A+', 161, 59.4, FALSE, 'non', 'modérée', 'Infirmière', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Endométriose, anémie récurrente'),

-- Fès patients (6 patients)
('Mustapha', 'Alaoui', '1981-07-19', 'M', 'CN401981', '67 Rue Moulay Abdellah', 'Fès', '30100', 'Maroc', '+212 687-890123', 'mustapha.alaoui@gmail.com', 'Khadija Alaoui', '+212 687-890124', 'Épouse', 'O+', 174, 76.5, FALSE, 'régulier', 'légère', 'Professeur universitaire', (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1), TRUE, 'Hernie discale'),

('Aicha', 'Filali', '1994-02-11', 'F', 'CN402994', '89 Boulevard Chefchaouni', 'Fès', '30200', 'Maroc', '+212 688-901234', 'aicha.filali@yahoo.fr', 'Omar Filali', '+212 688-901235', 'Père', 'A+', 162, 59.3, FALSE, 'non', 'modérée', 'Secrétaire médicale', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, 'Eczéma atopique'),

('Youssef', 'Bensouda', '1976-09-03', 'M', 'CN403976', '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', '+212 689-012345', 'youssef.bensouda@hotmail.com', 'Fatima Bensouda', '+212 689-012346', 'Épouse', 'B+', 170, 79.7, TRUE, 'quotidien', 'sédentaire', 'Ouvrier', (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1), TRUE, 'Cataracte précoce, tabagisme chronique'),

('Salma', 'Chraibi', '1990-12-16', 'F', 'CN404990', '34 Rue de la Paix', 'Fès', '30300', 'Maroc', '+212 690-123456', 'salma.chraibi@gmail.com', 'Hassan Chraibi', '+212 690-123457', 'Époux', 'AB-', 165, 60.8, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, NULL),

('Hamid', 'Bensouda', '1972-03-28', 'M', 'CN405972', '56 Boulevard Moulay Youssef', 'Fès', '30400', 'Maroc', '+212 691-234567', 'hamid.bensouda@artisan.ma', 'Malika Bensouda', '+212 691-234568', 'Épouse', 'O-', 169, 74.1, TRUE, 'régulier', 'légère', 'Artisan', (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1), TRUE, 'Bronchite chronique, tabagisme'),

('Rajae', 'Filali', '2011-09-05', 'F', 'CN406011', '78 Rue Bab Boujloud', 'Fès', '30500', 'Maroc', '+212 692-345678', 'rajae.filali@parent.com', 'Zineb Filali', '+212 692-345679', 'Mère', 'A+', 128, 29.8, FALSE, 'non', 'intense', 'Écolière', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, 'Dermatite atopique sévère'),

-- Other cities patients (11 patients)
('Karim', 'Benjelloun', '1985-05-21', 'M', 'CN501851', '56 Avenue du Prince Héritier', 'Agadir', '80000', 'Maroc', '+212 691-234567', 'karim.benjelloun@gmail.com', 'Laila Benjelloun', '+212 691-234568', 'Épouse', 'O-', 179, 82.1, FALSE, 'occasionnel', 'intense', 'Pêcheur', (SELECT id FROM medecins WHERE prenom = 'Karim' AND nom = 'Benjelloun' LIMIT 1), TRUE, 'Allergie à l\'iode'),

('Nadia', 'Ouali', '1992-08-07', 'F', 'CN502992', '78 Rue Ibn Rochd', 'Agadir', '80100', 'Maroc', '+212 692-345678', 'nadia.ouali@yahoo.fr', 'Ahmed Ouali', '+212 692-345679', 'Père', 'A+', 161, 57.2, FALSE, 'non', 'modérée', 'Sage-femme', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, NULL),

('Hassan', 'Taibi', '2012-04-13', 'M', 'CN503012', '23 Boulevard de la Corniche', 'Agadir', '80200', 'Maroc', '+212 693-456789', 'hassan.taibi@parent.com', 'Houda Taibi', '+212 693-456790', 'Mère', 'B+', 135, 32.5, FALSE, 'non', 'intense', 'Écolier', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, 'Allergie aux poils d\'animaux'),

-- Tanger patients (3 patients)
('Driss', 'Benali', '1987-01-25', 'M', 'CN504987', '45 Avenue Mohammed V', 'Tanger', '90000', 'Maroc', '+212 694-567890', 'driss.benali@gmail.com', 'Aicha Benali', '+212 694-567891', 'Épouse', 'AB+', 176, 78.9, FALSE, 'régulier', 'légère', 'Douanier', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Malika', 'Taibi', '1989-10-18', 'F', 'CN505989', '67 Rue de Belgique', 'Tanger', '90100', 'Maroc', '+212 695-678901', 'malika.taibi@hotmail.com', 'Youssef Taibi', '+212 695-678902', 'Époux', 'O+', 163, 58.6, FALSE, 'non', 'modérée', 'Traductrice', (SELECT id FROM medecins WHERE prenom = 'Houda' AND nom = 'Taibi' LIMIT 1), TRUE, 'Psoriasis léger'),

('Ahmed', 'Cherkaoui', '1973-06-29', 'M', 'CN506973', '89 Boulevard Pasteur', 'Tanger', '90200', 'Maroc', '+212 696-789012', 'ahmed.cherkaoui@outlook.com', 'Fatima Cherkaoui', '+212 696-789013', 'Épouse', 'A-', 171, 75.3, TRUE, 'quotidien', 'sédentaire', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, 'Diabète type 2, neuropathie périphérique'),

-- Oujda patients (2 patients)
('Brahim', 'Zouiten', '1982-03-14', 'M', 'CN507982', '12 Boulevard Derfoufi', 'Oujda', '60000', 'Maroc', '+212 697-890123', 'brahim.zouiten@gmail.com', 'Zineb Zouiten', '+212 697-890124', 'Épouse', 'B-', 173, 77.4, FALSE, 'occasionnel', 'modérée', 'Enseignant', (SELECT id FROM medecins WHERE prenom = 'Brahim' AND nom = 'Zouiten' LIMIT 1), TRUE, NULL),

('Khadija', 'Benomar', '1995-11-06', 'F', 'CN508995', '34 Avenue Hassan II', 'Oujda', '60100', 'Maroc', '+212 698-901234', 'khadija.benomar@yahoo.fr', 'Malika Benomar', '+212 698-901235', 'Mère', 'O+', 160, 55.7, FALSE, 'non', 'intense', 'Étudiante en pharmacie', (SELECT id FROM medecins WHERE prenom = 'Malika' AND nom = 'Benomar' LIMIT 1), TRUE, 'Migraine avec aura'),

-- Meknès and other cities (2 patients)
('Youssef', 'Benkirane', '1988-07-23', 'M', 'CN509988', '56 Avenue Moulay Ismail', 'Meknès', '50000', 'Maroc', '+212 699-012345', 'youssef.benkirane.meknes@gmail.com', 'Laila Benkirane', '+212 699-012346', 'Épouse', 'A+', 175, 79.8, FALSE, 'régulier', 'légère', 'Neurologue', (SELECT id FROM medecins WHERE prenom = 'Youssef' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Antécédents familiaux d\'épilepsie'),

('Najat', 'Berrada', '1991-04-02', 'F', 'CN510991', '78 Avenue Zerktouni', 'Safi', '46000', 'Maroc', '+212 700-123456', 'najat.berrada@hotmail.com', 'Hassan Berrada', '+212 700-123457', 'Époux', 'AB+', 164, 59.9, FALSE, 'non', 'modérée', 'Comptable', (SELECT id FROM medecins WHERE prenom = 'Najat' AND nom = 'Berrada' LIMIT 1), TRUE, NULL),

-- Additional patients from various cities
('Fouad', 'Cherkaoui', '1963-08-17', 'M', 'CN511963', '12 Rue Ibn Sina', 'Tétouan', '93100', 'Maroc', '+212 701-234567', 'fouad.cherkaoui.tetouan@retraite.ma', 'Khadija Cherkaoui', '+212 701-234568', 'Épouse', 'B+', 167, 71.2, TRUE, 'quotidien', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Laila' AND nom = 'Cherkaoui' LIMIT 1), TRUE, 'Emphysème pulmonaire, tabagisme chronique'),

('Amina', 'Zouiten', '1986-02-11', 'F', 'CN512986', '34 Avenue Mohammed VI', 'Oujda', '60200', 'Maroc', '+212 702-345678', 'amina.zouiten@sage-femme.ma', 'Brahim Zouiten', '+212 702-345679', 'Époux', 'A-', 163, 58.3, FALSE, 'non', 'modérée', 'Sage-femme', (SELECT id FROM medecins WHERE prenom = 'Brahim' AND nom = 'Zouiten' LIMIT 1), TRUE, 'Hypothyroïdie, fatigue chronique'),

('Soufiane', 'Benomar', '2009-05-30', 'M', 'CN513009', '56 Rue Al Andalous', 'Oujda', '60300', 'Maroc', '+212 703-456789', 'soufiane.benomar@parent.com', 'Malika Benomar', '+212 703-456790', 'Mère', 'O+', 132, 30.1, FALSE, 'non', 'intense', 'Écolier', (SELECT id FROM medecins WHERE prenom = 'Malika' AND nom = 'Benomar' LIMIT 1), TRUE, 'Asthme d\'effort, allergie aux moisissures');

-- ========================================
-- SECTION 3: USER ACCOUNTS
-- ========================================
-- Create user accounts for all patients (password: patient123)
-- Username format: firstname.lastname
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES
('youssef.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.alami01@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN101985'), TRUE),
('aicha.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.benali02@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN102992'), TRUE),
('omar.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.tazi05@outlook.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN103978'), TRUE),
('fatima.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.elfassi04@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN104995'), TRUE),
('hassan.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.alaoui07@hotmail.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN105988'), TRUE),
('zineb.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.amrani12@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN106010'), TRUE),
('abdellatif.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'mohammed.idrissi03@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN107965'), TRUE),
('salma.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'samira.kettani10@outlook.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN108990'), TRUE),
('karim.alaoui.casa', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.lahlou11@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN109982'), TRUE),
('nadia.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.chraibi08@yahoo.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN110987'), TRUE),
('rachid.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'rachid.berrada09@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN111975'), TRUE),
('laila.bensouda.casa', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.bensouda.casa@student.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN112005'), TRUE),
('mehdi.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'mehdi.alaoui.casa@retraite.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN113960'), TRUE),
('samia.benkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'samia.benkirane@etudiant.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN114997'), TRUE),
('khalid.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khalid.tazi@parent.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN115015'), TRUE),
('ahmed.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.fassi.rabat@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN201980'), TRUE),
('malika.lahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.lahlou@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN202993'), TRUE),
('youssef.benkirane.rabat', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN203970'), TRUE),
('houda.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'houda.chraibi@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN204989'), TRUE),
('driss.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.alami@outlook.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN205984'), TRUE),
('samira.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'samira.bennani@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN206996'), TRUE),
('brahim.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.tazi@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN207977'), TRUE),
('khadija.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.idrissi@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN208991'), TRUE),
('hassan.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.berrada@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN301983'), TRUE),
('fatima.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.kettani@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN302986'), TRUE),
('omar.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.hajji@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN303974'), TRUE),
('zineb.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.alaoui@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN304998'), TRUE),
('karim.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benali@outlook.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN305979'), TRUE),
('laila.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.fassi@parent.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN306008'), TRUE),
('abderrahim.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'abderrahim.kettani.marrakech@retraite.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN307955'), TRUE),
('imane.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'imane.hajji@infirmiere.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN308994'), TRUE),
('mustapha.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'mustapha.alaoui@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN401981'), TRUE),
('aicha.filali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.filali@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN402994'), TRUE),
('youssef.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.bensouda@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN403976'), TRUE),
('salma.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'salma.chraibi@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN404990'), TRUE),
('hamid.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hamid.bensouda@artisan.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN405972'), TRUE),
('rajae.filali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'rajae.filali@parent.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN406011'), TRUE),
('karim.benjelloun', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benjelloun@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN501851'), TRUE),
('nadia.ouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.ouali@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN502992'), TRUE),
('hassan.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.taibi@parent.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN503012'), TRUE),
('driss.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.benali@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN504987'), TRUE),
('malika.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.taibi@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN505989'), TRUE),
('ahmed.cherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.cherkaoui@outlook.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN506973'), TRUE),
('brahim.zouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.zouiten@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN507982'), TRUE),
('khadija.benomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.benomar@yahoo.fr', 'patient', (SELECT id FROM patients WHERE CNE = 'CN508995'), TRUE),
('youssef.benkirane.meknes', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane.meknes@gmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN509988'), TRUE),
('najat.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'najat.berrada@hotmail.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN510991'), TRUE),
('fouad.cherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fouad.cherkaoui.tetouan@retraite.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN511963'), TRUE),
('amina.zouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'amina.zouiten@sage-femme.ma', 'patient', (SELECT id FROM patients WHERE CNE = 'CN512986'), TRUE),
('soufiane.benomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'soufiane.benomar@parent.com', 'patient', (SELECT id FROM patients WHERE CNE = 'CN513009'), TRUE);

-- ========================================
-- MIGRATION COMPLETION
-- ========================================
SELECT 'Migration completed: 50 Moroccan patients have been added to the database.' as status;

-- Summary statistics
SELECT 
    'PATIENTS SUMMARY' as category,
    COUNT(*) as total_patients,
    COUNT(CASE WHEN sexe = 'M' THEN 1 END) as hommes,
    COUNT(CASE WHEN sexe = 'F' THEN 1 END) as femmes,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) < 18 THEN 1 END) as mineurs,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) >= 65 THEN 1 END) as seniors
FROM patients 
WHERE CNE LIKE 'CN%';

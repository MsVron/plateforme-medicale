-- MOROCCAN PATIENTS POPULATION MIGRATION
-- Migration to populate the database with 40 diverse Moroccan patients
-- Created: 2024
-- Description: Adds realistic Moroccan patients with comprehensive medical records

-- ========================================
-- MOROCCAN PATIENTS POPULATION
-- ========================================

-- First, ensure we have common allergies in the database
INSERT IGNORE INTO allergies (nom, description) VALUES
('Pénicilline', 'Allergie aux antibiotiques de la famille des pénicillines'),
('Aspirine', 'Allergie à l\'acide acétylsalicylique'),
('Pollen', 'Allergie saisonnière aux pollens d\'arbres et de graminées'),
('Acariens', 'Allergie aux acariens de la poussière domestique'),
('Fruits de mer', 'Allergie aux crustacés et mollusques'),
('Arachides', 'Allergie aux cacahuètes et dérivés'),
('Latex', 'Allergie au caoutchouc naturel'),
('Iode', 'Allergie aux produits iodés et contrastes'),
('Sulfamides', 'Allergie aux antibiotiques sulfamidés'),
('Poils d\'animaux', 'Allergie aux poils de chats, chiens et autres animaux');

-- Get the starting patient ID for consistent referencing
SET @patient_start_id = (SELECT COALESCE(MAX(id), 0) FROM patients) + 1;

-- Insert 40 diverse Moroccan patients
INSERT INTO patients (
    prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal, pays, 
    telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_relation,
    groupe_sanguin, taille_cm, poids_kg, est_fumeur, consommation_alcool, activite_physique,
    profession, medecin_traitant_id, est_profil_complete, allergies_notes
) VALUES

-- Casablanca patients (12 patients)
('Youssef', 'Alami', '1985-03-15', 'M', 'CNE001985', '23 Rue Hassan II', 'Casablanca', '20000', 'Maroc', '+212 661-234567', 'youssef.alami@gmail.com', 'Fatima Alami', '+212 661-234568', 'Épouse', 'O+', 175, 78.5, FALSE, 'non', 'modérée', 'Ingénieur informatique', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie légère aux acariens'),

('Aicha', 'Benali', '1992-07-22', 'F', 'CNE002992', '45 Boulevard Zerktouni', 'Casablanca', '20100', 'Maroc', '+212 662-345678', 'aicha.benali@hotmail.com', 'Mohamed Benali', '+212 662-345679', 'Père', 'A+', 162, 58.0, FALSE, 'non', 'légère', 'Professeure', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Omar', 'Tazi', '1978-11-08', 'M', 'CNE003978', '67 Avenue Mohammed V', 'Casablanca', '20200', 'Maroc', '+212 663-456789', 'omar.tazi@yahoo.fr', 'Khadija Tazi', '+212 663-456790', 'Épouse', 'B+', 180, 85.2, TRUE, 'occasionnel', 'légère', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Hypertension artérielle, antécédents familiaux de diabète'),

('Fatima', 'Chraibi', '1995-01-30', 'F', 'CNE004995', '12 Rue Ibn Batouta', 'Casablanca', '20300', 'Maroc', '+212 664-567890', 'fatima.chraibi@gmail.com', 'Ahmed Chraibi', '+212 664-567891', 'Frère', 'AB+', 168, 62.5, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, NULL),

('Hassan', 'Bennani', '1988-09-12', 'M', 'CNE005988', '89 Rue de Fès', 'Casablanca', '20400', 'Maroc', '+212 665-678901', 'hassan.bennani@outlook.com', 'Laila Bennani', '+212 665-678902', 'Épouse', 'O-', 172, 74.8, FALSE, 'régulier', 'modérée', 'Architecte', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie aux fruits de mer'),

('Zineb', 'Fassi', '2010-05-18', 'F', 'CNE006010', '34 Boulevard Moulay Youssef', 'Casablanca', '20500', 'Maroc', '+212 666-789012', 'zineb.fassi@parent.com', 'Rachid Fassi', '+212 666-789013', 'Père', 'A-', 145, 38.0, FALSE, 'non', 'modérée', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Asthme léger, allergie au pollen'),

('Abdellatif', 'Idrissi', '1965-12-03', 'M', 'CNE007965', '56 Avenue Hassan II', 'Casablanca', '20600', 'Maroc', '+212 667-890123', 'abdellatif.idrissi@gmail.com', 'Malika Idrissi', '+212 667-890124', 'Épouse', 'B-', 170, 82.3, TRUE, 'quotidien', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Diabète type 2, hypertension, BPCO'),

('Salma', 'Kettani', '1990-04-25', 'F', 'CNE008990', '78 Rue Patrice Lumumba', 'Casablanca', '20700', 'Maroc', '+212 668-901234', 'salma.kettani@yahoo.fr', 'Youssef Kettani', '+212 668-901235', 'Époux', 'AB-', 165, 59.7, FALSE, 'non', 'intense', 'Médecin dentiste', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, NULL),

('Karim', 'Alaoui', '1982-08-14', 'M', 'CNE009982', '23 Avenue Allal Ben Abdellah', 'Casablanca', '20800', 'Maroc', '+212 669-012345', 'karim.alaoui@hotmail.com', 'Nadia Alaoui', '+212 669-012346', 'Épouse', 'O+', 178, 79.1, FALSE, 'occasionnel', 'modérée', 'Avocat', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie à la pénicilline'),

('Nadia', 'Berrada', '1987-06-07', 'F', 'CNE010987', '45 Rue Oued Fès', 'Casablanca', '20900', 'Maroc', '+212 670-123456', 'nadia.berrada@gmail.com', 'Hassan Berrada', '+212 670-123457', 'Époux', 'A+', 160, 55.4, FALSE, 'non', 'légère', 'Pharmacienne', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, 'Migraine chronique'),

('Rachid', 'Hajji', '1975-02-28', 'M', 'CNE011975', '67 Boulevard Zerktouni', 'Casablanca', '21000', 'Maroc', '+212 671-234567', 'rachid.hajji@outlook.com', 'Aicha Hajji', '+212 671-234568', 'Épouse', 'B+', 174, 76.9, TRUE, 'régulier', 'légère', 'Chef d\'entreprise', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Antécédents de crise cardiaque, cholestérol élevé'),

('Laila', 'Bensouda', '2005-10-11', 'F', 'CNE012005', '89 Avenue Mohammed VI', 'Casablanca', '21100', 'Maroc', '+212 672-345678', 'laila.bensouda@student.ma', 'Mustapha Bensouda', '+212 672-345679', 'Père', 'O-', 158, 48.2, FALSE, 'non', 'intense', 'Lycéenne', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Scoliose légère'),

-- Rabat patients (8 patients)
('Ahmed', 'Fassi', '1980-01-20', 'M', 'CNE013980', '12 Avenue Mohammed V', 'Rabat', '10000', 'Maroc', '+212 673-456789', 'ahmed.fassi@gmail.com', 'Khadija Fassi', '+212 673-456790', 'Épouse', 'A+', 176, 81.7, FALSE, 'occasionnel', 'modérée', 'Fonctionnaire', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, NULL),

('Malika', 'Lahlou', '1993-11-15', 'F', 'CNE014993', '34 Rue Patrice Lumumba', 'Rabat', '10100', 'Maroc', '+212 674-567890', 'malika.lahlou@yahoo.fr', 'Omar Lahlou', '+212 674-567891', 'Père', 'B-', 163, 57.8, FALSE, 'non', 'modérée', 'Journaliste', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Allergie aux acariens et au pollen'),

('Youssef', 'Benkirane', '1970-07-08', 'M', 'CNE015970', '56 Avenue Allal Ben Abdellah', 'Rabat', '10200', 'Maroc', '+212 675-678901', 'youssef.benkirane@hotmail.com', 'Fatima Benkirane', '+212 675-678902', 'Épouse', 'AB+', 169, 78.4, TRUE, 'quotidien', 'sédentaire', 'Chauffeur de taxi', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Hypertension, tabagisme chronique'),

('Houda', 'Chraibi', '1989-03-22', 'F', 'CNE016989', '78 Rue Oued Fès', 'Rabat', '10300', 'Maroc', '+212 676-789012', 'houda.chraibi@gmail.com', 'Karim Chraibi', '+212 676-789013', 'Époux', 'O+', 167, 61.2, FALSE, 'non', 'intense', 'Infirmière', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),

('Driss', 'Alami', '1984-12-05', 'M', 'CNE017984', '23 Boulevard Mohammed Diouri', 'Rabat', '10400', 'Maroc', '+212 677-890123', 'driss.alami@outlook.com', 'Zineb Alami', '+212 677-890124', 'Épouse', 'A-', 173, 75.6, FALSE, 'régulier', 'légère', 'Banquier', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, 'Allergie à l\'aspirine'),

('Samira', 'Bennani', '1996-09-18', 'F', 'CNE018996', '45 Avenue Hassan II', 'Rabat', '10500', 'Maroc', '+212 678-901234', 'samira.bennani@yahoo.fr', 'Hassan Bennani', '+212 678-901235', 'Père', 'B+', 161, 54.9, FALSE, 'non', 'modérée', 'Étudiante en médecine', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Anémie ferriprive'),

('Brahim', 'Tazi', '1977-05-30', 'M', 'CNE019977', '67 Rue de la Liberté', 'Rabat', '10600', 'Maroc', '+212 679-012345', 'brahim.tazi@gmail.com', 'Laila Tazi', '+212 679-012346', 'Épouse', 'O-', 171, 73.8, TRUE, 'occasionnel', 'sédentaire', 'Mécanicien', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Lombalgie chronique, tabagisme'),

('Khadija', 'Idrissi', '1991-08-12', 'F', 'CNE020991', '89 Avenue Moulay Youssef', 'Rabat', '10700', 'Maroc', '+212 680-123456', 'khadija.idrissi@hotmail.com', 'Ahmed Idrissi', '+212 680-123457', 'Époux', 'AB-', 164, 58.7, FALSE, 'non', 'intense', 'Professeure de sport', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),

-- Marrakech patients (6 patients)
('Hassan', 'Berrada', '1983-04-17', 'M', 'CNE021983', '12 Avenue Mohammed VI', 'Marrakech', '40000', 'Maroc', '+212 681-234567', 'hassan.berrada@gmail.com', 'Aicha Berrada', '+212 681-234568', 'Épouse', 'A+', 177, 80.3, FALSE, 'occasionnel', 'modérée', 'Guide touristique', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, NULL),

('Fatima', 'Kettani', '1986-10-25', 'F', 'CNE022986', '34 Rue de la Liberté', 'Marrakech', '40100', 'Maroc', '+212 682-345678', 'fatima.kettani@yahoo.fr', 'Youssef Kettani', '+212 682-345679', 'Époux', 'B+', 159, 56.1, FALSE, 'non', 'légère', 'Artisane', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie au latex'),

('Omar', 'Hajji', '1974-01-08', 'M', 'CNE023974', '56 Boulevard Zerktouni', 'Marrakech', '40200', 'Maroc', '+212 683-456789', 'omar.hajji@hotmail.com', 'Malika Hajji', '+212 683-456790', 'Épouse', 'O+', 175, 77.9, TRUE, 'régulier', 'sédentaire', 'Restaurateur', (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), TRUE, 'Arthrose du genou, surpoids'),

('Zineb', 'Alaoui', '1998-06-14', 'F', 'CNE024998', '78 Avenue Hassan II', 'Marrakech', '40300', 'Maroc', '+212 684-567890', 'zineb.alaoui@gmail.com', 'Rachid Alaoui', '+212 684-567891', 'Père', 'A-', 166, 52.4, FALSE, 'non', 'intense', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Dysménorrhée'),

('Karim', 'Benali', '1979-11-27', 'M', 'CNE025979', '23 Rue Ibn Rochd', 'Marrakech', '40400', 'Maroc', '+212 685-678901', 'karim.benali@outlook.com', 'Nadia Benali', '+212 685-678902', 'Épouse', 'B-', 172, 74.2, FALSE, 'occasionnel', 'modérée', 'Électricien', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, 'Allergie aux sulfamides'),

('Laila', 'Fassi', '2008-03-09', 'F', 'CNE026008', '45 Boulevard Mohammed V', 'Marrakech', '40500', 'Maroc', '+212 686-789012', 'laila.fassi@parent.com', 'Ahmed Fassi', '+212 686-789013', 'Père', 'AB+', 142, 35.8, FALSE, 'non', 'intense', 'Collégienne', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie aux arachides'),

-- Fès patients (4 patients)
('Mustapha', 'Alaoui', '1981-07-19', 'M', 'CNE027981', '67 Rue Moulay Abdellah', 'Fès', '30100', 'Maroc', '+212 687-890123', 'mustapha.alaoui@gmail.com', 'Khadija Alaoui', '+212 687-890124', 'Épouse', 'O+', 174, 76.5, FALSE, 'régulier', 'légère', 'Professeur universitaire', (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1), TRUE, 'Hernie discale'),

('Aicha', 'Filali', '1994-02-11', 'F', 'CNE028994', '89 Boulevard Chefchaouni', 'Fès', '30200', 'Maroc', '+212 688-901234', 'aicha.filali@yahoo.fr', 'Omar Filali', '+212 688-901235', 'Père', 'A+', 162, 59.3, FALSE, 'non', 'modérée', 'Secrétaire médicale', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, 'Eczéma atopique'),

('Youssef', 'Bensouda', '1976-09-03', 'M', 'CNE029976', '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', '+212 689-012345', 'youssef.bensouda@hotmail.com', 'Fatima Bensouda', '+212 689-012346', 'Épouse', 'B+', 170, 79.7, TRUE, 'quotidien', 'sédentaire', 'Ouvrier', (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1), TRUE, 'Cataracte précoce, tabagisme chronique'),

('Salma', 'Chraibi', '1990-12-16', 'F', 'CNE030990', '34 Rue de la Paix', 'Fès', '30300', 'Maroc', '+212 690-123456', 'salma.chraibi@gmail.com', 'Hassan Chraibi', '+212 690-123457', 'Époux', 'AB-', 165, 60.8, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, NULL),

-- Agadir patients (3 patients)
('Karim', 'Benjelloun', '1985-05-21', 'M', 'CNE031985', '56 Avenue du Prince Héritier', 'Agadir', '80000', 'Maroc', '+212 691-234567', 'karim.benjelloun@gmail.com', 'Laila Benjelloun', '+212 691-234568', 'Épouse', 'O-', 179, 82.1, FALSE, 'occasionnel', 'intense', 'Pêcheur', (SELECT id FROM medecins WHERE prenom = 'Karim' AND nom = 'Benjelloun' LIMIT 1), TRUE, 'Allergie à l\'iode'),

('Nadia', 'Ouali', '1992-08-07', 'F', 'CNE032992', '78 Rue Ibn Rochd', 'Agadir', '80100', 'Maroc', '+212 692-345678', 'nadia.ouali@yahoo.fr', 'Ahmed Ouali', '+212 692-345679', 'Père', 'A+', 161, 57.2, FALSE, 'non', 'modérée', 'Sage-femme', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, NULL),

('Hassan', 'Taibi', '2012-04-13', 'M', 'CNE033012', '23 Boulevard de la Corniche', 'Agadir', '80200', 'Maroc', '+212 693-456789', 'hassan.taibi@parent.com', 'Houda Taibi', '+212 693-456790', 'Mère', 'B+', 135, 32.5, FALSE, 'non', 'intense', 'Écolier', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, 'Allergie aux poils d\'animaux'),

-- Tanger patients (3 patients)
('Driss', 'Benali', '1987-01-25', 'M', 'CNE034987', '45 Avenue Mohammed V', 'Tanger', '90000', 'Maroc', '+212 694-567890', 'driss.benali@gmail.com', 'Aicha Benali', '+212 694-567891', 'Épouse', 'AB+', 176, 78.9, FALSE, 'régulier', 'légère', 'Douanier', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Malika', 'Taibi', '1989-10-18', 'F', 'CNE035989', '67 Rue de Belgique', 'Tanger', '90100', 'Maroc', '+212 695-678901', 'malika.taibi@hotmail.com', 'Youssef Taibi', '+212 695-678902', 'Époux', 'O+', 163, 58.6, FALSE, 'non', 'modérée', 'Traductrice', (SELECT id FROM medecins WHERE prenom = 'Houda' AND nom = 'Taibi' LIMIT 1), TRUE, 'Psoriasis léger'),

('Ahmed', 'Cherkaoui', '1973-06-29', 'M', 'CNE036973', '89 Boulevard Pasteur', 'Tanger', '90200', 'Maroc', '+212 696-789012', 'ahmed.cherkaoui@outlook.com', 'Fatima Cherkaoui', '+212 696-789013', 'Épouse', 'A-', 171, 75.3, TRUE, 'quotidien', 'sédentaire', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, 'Diabète type 2, neuropathie périphérique'),

-- Oujda patients (2 patients)
('Brahim', 'Zouiten', '1982-03-14', 'M', 'CNE037982', '12 Boulevard Derfoufi', 'Oujda', '60000', 'Maroc', '+212 697-890123', 'brahim.zouiten@gmail.com', 'Zineb Zouiten', '+212 697-890124', 'Épouse', 'B-', 173, 77.4, FALSE, 'occasionnel', 'modérée', 'Enseignant', (SELECT id FROM medecins WHERE prenom = 'Brahim' AND nom = 'Zouiten' LIMIT 1), TRUE, NULL),

('Khadija', 'Benomar', '1995-11-06', 'F', 'CNE038995', '34 Avenue Hassan II', 'Oujda', '60100', 'Maroc', '+212 698-901234', 'khadija.benomar@yahoo.fr', 'Malika Benomar', '+212 698-901235', 'Mère', 'O+', 160, 55.7, FALSE, 'non', 'intense', 'Étudiante en pharmacie', (SELECT id FROM medecins WHERE prenom = 'Malika' AND nom = 'Benomar' LIMIT 1), TRUE, 'Migraine avec aura'),

-- Meknès and other cities (2 patients)
('Youssef', 'Benkirane', '1988-07-23', 'M', 'CNE039988', '56 Avenue Moulay Ismail', 'Meknès', '50000', 'Maroc', '+212 699-012345', 'youssef.benkirane@gmail.com', 'Laila Benkirane', '+212 699-012346', 'Épouse', 'A+', 175, 79.8, FALSE, 'régulier', 'légère', 'Neurologue', (SELECT id FROM medecins WHERE prenom = 'Youssef' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Antécédents familiaux d\'épilepsie'),

('Najat', 'Berrada', '1991-04-02', 'F', 'CNE040991', '78 Avenue Zerktouni', 'Safi', '46000', 'Maroc', '+212 700-123456', 'najat.berrada@hotmail.com', 'Hassan Berrada', '+212 700-123457', 'Époux', 'AB+', 164, 59.9, FALSE, 'non', 'modérée', 'Comptable', (SELECT id FROM medecins WHERE prenom = 'Najat' AND nom = 'Berrada' LIMIT 1), TRUE, NULL);

-- Create user accounts for all patients (password: patient123)
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES
('youssef.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.alami@gmail.com', 'patient', @patient_start_id + 0, TRUE),
('aicha.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.benali@hotmail.com', 'patient', @patient_start_id + 1, TRUE),
('omar.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.tazi@yahoo.fr', 'patient', @patient_start_id + 2, TRUE),
('fatima.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.chraibi@gmail.com', 'patient', @patient_start_id + 3, TRUE),
('hassan.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.bennani@outlook.com', 'patient', @patient_start_id + 4, TRUE),
('zineb.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.fassi@parent.com', 'patient', @patient_start_id + 5, TRUE),
('abdellatif.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'abdellatif.idrissi@gmail.com', 'patient', @patient_start_id + 6, TRUE),
('salma.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'salma.kettani@yahoo.fr', 'patient', @patient_start_id + 7, TRUE),
('karim.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.alaoui@hotmail.com', 'patient', @patient_start_id + 8, TRUE),
('nadia.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.berrada@gmail.com', 'patient', @patient_start_id + 9, TRUE),
('rachid.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'rachid.hajji@outlook.com', 'patient', @patient_start_id + 10, TRUE),
('laila.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.bensouda@student.ma', 'patient', @patient_start_id + 11, TRUE),
('ahmed.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.fassi@gmail.com', 'patient', @patient_start_id + 12, TRUE),
('malika.lahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.lahlou@yahoo.fr', 'patient', @patient_start_id + 13, TRUE),
('youssef.benkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane@hotmail.com', 'patient', @patient_start_id + 14, TRUE),
('houda.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'houda.chraibi@gmail.com', 'patient', @patient_start_id + 15, TRUE),
('driss.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.alami@outlook.com', 'patient', @patient_start_id + 16, TRUE),
('samira.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'samira.bennani@yahoo.fr', 'patient', @patient_start_id + 17, TRUE),
('brahim.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.tazi@gmail.com', 'patient', @patient_start_id + 18, TRUE),
('khadija.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.idrissi@hotmail.com', 'patient', @patient_start_id + 19, TRUE),
('hassan.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.berrada@gmail.com', 'patient', @patient_start_id + 20, TRUE),
('fatima.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.kettani@yahoo.fr', 'patient', @patient_start_id + 21, TRUE),
('omar.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.hajji@hotmail.com', 'patient', @patient_start_id + 22, TRUE),
('zineb.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.alaoui@gmail.com', 'patient', @patient_start_id + 23, TRUE),
('karim.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benali@outlook.com', 'patient', @patient_start_id + 24, TRUE),
('laila.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.fassi@parent.com', 'patient', @patient_start_id + 25, TRUE),
('mustapha.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'mustapha.alaoui@gmail.com', 'patient', @patient_start_id + 26, TRUE),
('aicha.filali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.filali@yahoo.fr', 'patient', @patient_start_id + 27, TRUE),
('youssef.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.bensouda@hotmail.com', 'patient', @patient_start_id + 28, TRUE),
('salma.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'salma.chraibi@gmail.com', 'patient', @patient_start_id + 29, TRUE),
('karim.benjelloun', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benjelloun@gmail.com', 'patient', @patient_start_id + 30, TRUE),
('nadia.ouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.ouali@yahoo.fr', 'patient', @patient_start_id + 31, TRUE),
('hassan.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.taibi@parent.com', 'patient', @patient_start_id + 32, TRUE),
('driss.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.benali@gmail.com', 'patient', @patient_start_id + 33, TRUE),
('malika.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.taibi@hotmail.com', 'patient', @patient_start_id + 34, TRUE),
('ahmed.cherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.cherkaoui@outlook.com', 'patient', @patient_start_id + 35, TRUE),
('brahim.zouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.zouiten@gmail.com', 'patient', @patient_start_id + 36, TRUE),
('khadija.benomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.benomar@yahoo.fr', 'patient', @patient_start_id + 37, TRUE),
('youssef.benkirane2', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane@gmail.com', 'patient', @patient_start_id + 38, TRUE),
('najat.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'najat.berrada@hotmail.com', 'patient', @patient_start_id + 39, TRUE);


-- MOROCCAN PATIENTS POPULATION MIGRATION
-- Migration to populate the database with 40 diverse Moroccan patients
-- Created: 2024
-- Description: Adds realistic Moroccan patients with comprehensive medical records

-- ========================================
-- MOROCCAN PATIENTS POPULATION
-- ========================================

-- First, ensure we have common allergies in the database
INSERT IGNORE INTO allergies (nom, description) VALUES
('Pénicilline', 'Allergie aux antibiotiques de la famille des pénicillines'),
('Aspirine', 'Allergie à l\'acide acétylsalicylique'),
('Pollen', 'Allergie saisonnière aux pollens d\'arbres et de graminées'),
('Acariens', 'Allergie aux acariens de la poussière domestique'),
('Fruits de mer', 'Allergie aux crustacés et mollusques'),
('Arachides', 'Allergie aux cacahuètes et dérivés'),
('Latex', 'Allergie au caoutchouc naturel'),
('Iode', 'Allergie aux produits iodés et contrastes'),
('Sulfamides', 'Allergie aux antibiotiques sulfamidés'),
('Poils d\'animaux', 'Allergie aux poils de chats, chiens et autres animaux');

-- Get the starting patient ID for consistent referencing
SET @patient_start_id = (SELECT COALESCE(MAX(id), 0) FROM patients) + 1;

-- Insert 40 diverse Moroccan patients
INSERT INTO patients (
    prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal, pays, 
    telephone, email, contact_urgence_nom, contact_urgence_telephone, contact_urgence_relation,
    groupe_sanguin, taille_cm, poids_kg, est_fumeur, consommation_alcool, activite_physique,
    profession, medecin_traitant_id, est_profil_complete, allergies_notes
) VALUES

-- Casablanca patients (12 patients)
('Youssef', 'Alami', '1985-03-15', 'M', 'CNE001985', '23 Rue Hassan II', 'Casablanca', '20000', 'Maroc', '+212 661-234567', 'youssef.alami@gmail.com', 'Fatima Alami', '+212 661-234568', 'Épouse', 'O+', 175, 78.5, FALSE, 'non', 'modérée', 'Ingénieur informatique', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie légère aux acariens'),

('Aicha', 'Benali', '1992-07-22', 'F', 'CNE002992', '45 Boulevard Zerktouni', 'Casablanca', '20100', 'Maroc', '+212 662-345678', 'aicha.benali@hotmail.com', 'Mohamed Benali', '+212 662-345679', 'Père', 'A+', 162, 58.0, FALSE, 'non', 'légère', 'Professeure', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Omar', 'Tazi', '1978-11-08', 'M', 'CNE003978', '67 Avenue Mohammed V', 'Casablanca', '20200', 'Maroc', '+212 663-456789', 'omar.tazi@yahoo.fr', 'Khadija Tazi', '+212 663-456790', 'Épouse', 'B+', 180, 85.2, TRUE, 'occasionnel', 'légère', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Hypertension artérielle, antécédents familiaux de diabète'),

('Fatima', 'Chraibi', '1995-01-30', 'F', 'CNE004995', '12 Rue Ibn Batouta', 'Casablanca', '20300', 'Maroc', '+212 664-567890', 'fatima.chraibi@gmail.com', 'Ahmed Chraibi', '+212 664-567891', 'Frère', 'AB+', 168, 62.5, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, NULL),

('Hassan', 'Bennani', '1988-09-12', 'M', 'CNE005988', '89 Rue de Fès', 'Casablanca', '20400', 'Maroc', '+212 665-678901', 'hassan.bennani@outlook.com', 'Laila Bennani', '+212 665-678902', 'Épouse', 'O-', 172, 74.8, FALSE, 'régulier', 'modérée', 'Architecte', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie aux fruits de mer'),

('Zineb', 'Fassi', '2010-05-18', 'F', 'CNE006010', '34 Boulevard Moulay Youssef', 'Casablanca', '20500', 'Maroc', '+212 666-789012', 'zineb.fassi@parent.com', 'Rachid Fassi', '+212 666-789013', 'Père', 'A-', 145, 38.0, FALSE, 'non', 'modérée', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Asthme léger, allergie au pollen'),

('Abdellatif', 'Idrissi', '1965-12-03', 'M', 'CNE007965', '56 Avenue Hassan II', 'Casablanca', '20600', 'Maroc', '+212 667-890123', 'abdellatif.idrissi@gmail.com', 'Malika Idrissi', '+212 667-890124', 'Épouse', 'B-', 170, 82.3, TRUE, 'quotidien', 'sédentaire', 'Retraité', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Diabète type 2, hypertension, BPCO'),

('Salma', 'Kettani', '1990-04-25', 'F', 'CNE008990', '78 Rue Patrice Lumumba', 'Casablanca', '20700', 'Maroc', '+212 668-901234', 'salma.kettani@yahoo.fr', 'Youssef Kettani', '+212 668-901235', 'Époux', 'AB-', 165, 59.7, FALSE, 'non', 'intense', 'Médecin dentiste', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, NULL),

('Karim', 'Alaoui', '1982-08-14', 'M', 'CNE009982', '23 Avenue Allal Ben Abdellah', 'Casablanca', '20800', 'Maroc', '+212 669-012345', 'karim.alaoui@hotmail.com', 'Nadia Alaoui', '+212 669-012346', 'Épouse', 'O+', 178, 79.1, FALSE, 'occasionnel', 'modérée', 'Avocat', (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), TRUE, 'Allergie à la pénicilline'),

('Nadia', 'Berrada', '1987-06-07', 'F', 'CNE010987', '45 Rue Oued Fès', 'Casablanca', '20900', 'Maroc', '+212 670-123456', 'nadia.berrada@gmail.com', 'Hassan Berrada', '+212 670-123457', 'Époux', 'A+', 160, 55.4, FALSE, 'non', 'légère', 'Pharmacienne', (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), TRUE, 'Migraine chronique'),

('Rachid', 'Hajji', '1975-02-28', 'M', 'CNE011975', '67 Boulevard Zerktouni', 'Casablanca', '21000', 'Maroc', '+212 671-234567', 'rachid.hajji@outlook.com', 'Aicha Hajji', '+212 671-234568', 'Épouse', 'B+', 174, 76.9, TRUE, 'régulier', 'légère', 'Chef d\'entreprise', (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), TRUE, 'Antécédents de crise cardiaque, cholestérol élevé'),

('Laila', 'Bensouda', '2005-10-11', 'F', 'CNE012005', '89 Avenue Mohammed VI', 'Casablanca', '21100', 'Maroc', '+212 672-345678', 'laila.bensouda@student.ma', 'Mustapha Bensouda', '+212 672-345679', 'Père', 'O-', 158, 48.2, FALSE, 'non', 'intense', 'Lycéenne', (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), TRUE, 'Scoliose légère'),

-- Rabat patients (8 patients)
('Ahmed', 'Fassi', '1980-01-20', 'M', 'CNE013980', '12 Avenue Mohammed V', 'Rabat', '10000', 'Maroc', '+212 673-456789', 'ahmed.fassi@gmail.com', 'Khadija Fassi', '+212 673-456790', 'Épouse', 'A+', 176, 81.7, FALSE, 'occasionnel', 'modérée', 'Fonctionnaire', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, NULL),

('Malika', 'Lahlou', '1993-11-15', 'F', 'CNE014993', '34 Rue Patrice Lumumba', 'Rabat', '10100', 'Maroc', '+212 674-567890', 'malika.lahlou@yahoo.fr', 'Omar Lahlou', '+212 674-567891', 'Père', 'B-', 163, 57.8, FALSE, 'non', 'modérée', 'Journaliste', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Allergie aux acariens et au pollen'),

('Youssef', 'Benkirane', '1970-07-08', 'M', 'CNE015970', '56 Avenue Allal Ben Abdellah', 'Rabat', '10200', 'Maroc', '+212 675-678901', 'youssef.benkirane@hotmail.com', 'Fatima Benkirane', '+212 675-678902', 'Épouse', 'AB+', 169, 78.4, TRUE, 'quotidien', 'sédentaire', 'Chauffeur de taxi', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Hypertension, tabagisme chronique'),

('Houda', 'Chraibi', '1989-03-22', 'F', 'CNE016989', '78 Rue Oued Fès', 'Rabat', '10300', 'Maroc', '+212 676-789012', 'houda.chraibi@gmail.com', 'Karim Chraibi', '+212 676-789013', 'Époux', 'O+', 167, 61.2, FALSE, 'non', 'intense', 'Infirmière', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),

('Driss', 'Alami', '1984-12-05', 'M', 'CNE017984', '23 Boulevard Mohammed Diouri', 'Rabat', '10400', 'Maroc', '+212 677-890123', 'driss.alami@outlook.com', 'Zineb Alami', '+212 677-890124', 'Épouse', 'A-', 173, 75.6, FALSE, 'régulier', 'légère', 'Banquier', (SELECT id FROM medecins WHERE prenom = 'Ahmed' AND nom = 'Fassi' LIMIT 1), TRUE, 'Allergie à l\'aspirine'),

('Samira', 'Bennani', '1996-09-18', 'F', 'CNE018996', '45 Avenue Hassan II', 'Rabat', '10500', 'Maroc', '+212 678-901234', 'samira.bennani@yahoo.fr', 'Hassan Bennani', '+212 678-901235', 'Père', 'B+', 161, 54.9, FALSE, 'non', 'modérée', 'Étudiante en médecine', (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), TRUE, 'Anémie ferriprive'),

('Brahim', 'Tazi', '1977-05-30', 'M', 'CNE019977', '67 Rue de la Liberté', 'Rabat', '10600', 'Maroc', '+212 679-012345', 'brahim.tazi@gmail.com', 'Laila Tazi', '+212 679-012346', 'Épouse', 'O-', 171, 73.8, TRUE, 'occasionnel', 'sédentaire', 'Mécanicien', (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Lombalgie chronique, tabagisme'),

('Khadija', 'Idrissi', '1991-08-12', 'F', 'CNE020991', '89 Avenue Moulay Youssef', 'Rabat', '10700', 'Maroc', '+212 680-123456', 'khadija.idrissi@hotmail.com', 'Ahmed Idrissi', '+212 680-123457', 'Époux', 'AB-', 164, 58.7, FALSE, 'non', 'intense', 'Professeure de sport', (SELECT id FROM medecins WHERE prenom = 'Nadia' AND nom = 'Chraibi' LIMIT 1), TRUE, NULL),

-- Marrakech patients (6 patients)
('Hassan', 'Berrada', '1983-04-17', 'M', 'CNE021983', '12 Avenue Mohammed VI', 'Marrakech', '40000', 'Maroc', '+212 681-234567', 'hassan.berrada@gmail.com', 'Aicha Berrada', '+212 681-234568', 'Épouse', 'A+', 177, 80.3, FALSE, 'occasionnel', 'modérée', 'Guide touristique', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, NULL),

('Fatima', 'Kettani', '1986-10-25', 'F', 'CNE022986', '34 Rue de la Liberté', 'Marrakech', '40100', 'Maroc', '+212 682-345678', 'fatima.kettani@yahoo.fr', 'Youssef Kettani', '+212 682-345679', 'Époux', 'B+', 159, 56.1, FALSE, 'non', 'légère', 'Artisane', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie au latex'),

('Omar', 'Hajji', '1974-01-08', 'M', 'CNE023974', '56 Boulevard Zerktouni', 'Marrakech', '40200', 'Maroc', '+212 683-456789', 'omar.hajji@hotmail.com', 'Malika Hajji', '+212 683-456790', 'Épouse', 'O+', 175, 77.9, TRUE, 'régulier', 'sédentaire', 'Restaurateur', (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), TRUE, 'Arthrose du genou, surpoids'),

('Zineb', 'Alaoui', '1998-06-14', 'F', 'CNE024998', '78 Avenue Hassan II', 'Marrakech', '40300', 'Maroc', '+212 684-567890', 'zineb.alaoui@gmail.com', 'Rachid Alaoui', '+212 684-567891', 'Père', 'A-', 166, 52.4, FALSE, 'non', 'intense', 'Étudiante', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Dysménorrhée'),

('Karim', 'Benali', '1979-11-27', 'M', 'CNE025979', '23 Rue Ibn Rochd', 'Marrakech', '40400', 'Maroc', '+212 685-678901', 'karim.benali@outlook.com', 'Nadia Benali', '+212 685-678902', 'Épouse', 'B-', 172, 74.2, FALSE, 'occasionnel', 'modérée', 'Électricien', (SELECT id FROM medecins WHERE prenom = 'Hassan' AND nom = 'Berrada' LIMIT 1), TRUE, 'Allergie aux sulfamides'),

('Laila', 'Fassi', '2008-03-09', 'F', 'CNE026008', '45 Boulevard Mohammed V', 'Marrakech', '40500', 'Maroc', '+212 686-789012', 'laila.fassi@parent.com', 'Ahmed Fassi', '+212 686-789013', 'Père', 'AB+', 142, 35.8, FALSE, 'non', 'intense', 'Collégienne', (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1), TRUE, 'Allergie aux arachides'),

-- Fès patients (4 patients)
('Mustapha', 'Alaoui', '1981-07-19', 'M', 'CNE027981', '67 Rue Moulay Abdellah', 'Fès', '30100', 'Maroc', '+212 687-890123', 'mustapha.alaoui@gmail.com', 'Khadija Alaoui', '+212 687-890124', 'Épouse', 'O+', 174, 76.5, FALSE, 'régulier', 'légère', 'Professeur universitaire', (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1), TRUE, 'Hernie discale'),

('Aicha', 'Filali', '1994-02-11', 'F', 'CNE028994', '89 Boulevard Chefchaouni', 'Fès', '30200', 'Maroc', '+212 688-901234', 'aicha.filali@yahoo.fr', 'Omar Filali', '+212 688-901235', 'Père', 'A+', 162, 59.3, FALSE, 'non', 'modérée', 'Secrétaire médicale', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, 'Eczéma atopique'),

('Youssef', 'Bensouda', '1976-09-03', 'M', 'CNE029976', '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', '+212 689-012345', 'youssef.bensouda@hotmail.com', 'Fatima Bensouda', '+212 689-012346', 'Épouse', 'B+', 170, 79.7, TRUE, 'quotidien', 'sédentaire', 'Ouvrier', (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1), TRUE, 'Cataracte précoce, tabagisme chronique'),

('Salma', 'Chraibi', '1990-12-16', 'F', 'CNE030990', '34 Rue de la Paix', 'Fès', '30300', 'Maroc', '+212 690-123456', 'salma.chraibi@gmail.com', 'Hassan Chraibi', '+212 690-123457', 'Époux', 'AB-', 165, 60.8, FALSE, 'non', 'intense', 'Kinésithérapeute', (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), TRUE, NULL),

-- Agadir patients (3 patients)
('Karim', 'Benjelloun', '1985-05-21', 'M', 'CNE031985', '56 Avenue du Prince Héritier', 'Agadir', '80000', 'Maroc', '+212 691-234567', 'karim.benjelloun@gmail.com', 'Laila Benjelloun', '+212 691-234568', 'Épouse', 'O-', 179, 82.1, FALSE, 'occasionnel', 'intense', 'Pêcheur', (SELECT id FROM medecins WHERE prenom = 'Karim' AND nom = 'Benjelloun' LIMIT 1), TRUE, 'Allergie à l\'iode'),

('Nadia', 'Ouali', '1992-08-07', 'F', 'CNE032992', '78 Rue Ibn Rochd', 'Agadir', '80100', 'Maroc', '+212 692-345678', 'nadia.ouali@yahoo.fr', 'Ahmed Ouali', '+212 692-345679', 'Père', 'A+', 161, 57.2, FALSE, 'non', 'modérée', 'Sage-femme', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, NULL),

('Hassan', 'Taibi', '2012-04-13', 'M', 'CNE033012', '23 Boulevard de la Corniche', 'Agadir', '80200', 'Maroc', '+212 693-456789', 'hassan.taibi@parent.com', 'Houda Taibi', '+212 693-456790', 'Mère', 'B+', 135, 32.5, FALSE, 'non', 'intense', 'Écolier', (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1), TRUE, 'Allergie aux poils d\'animaux'),

-- Tanger patients (3 patients)
('Driss', 'Benali', '1987-01-25', 'M', 'CNE034987', '45 Avenue Mohammed V', 'Tanger', '90000', 'Maroc', '+212 694-567890', 'driss.benali@gmail.com', 'Aicha Benali', '+212 694-567891', 'Épouse', 'AB+', 176, 78.9, FALSE, 'régulier', 'légère', 'Douanier', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, NULL),

('Malika', 'Taibi', '1989-10-18', 'F', 'CNE035989', '67 Rue de Belgique', 'Tanger', '90100', 'Maroc', '+212 695-678901', 'malika.taibi@hotmail.com', 'Youssef Taibi', '+212 695-678902', 'Époux', 'O+', 163, 58.6, FALSE, 'non', 'modérée', 'Traductrice', (SELECT id FROM medecins WHERE prenom = 'Houda' AND nom = 'Taibi' LIMIT 1), TRUE, 'Psoriasis léger'),

('Ahmed', 'Cherkaoui', '1973-06-29', 'M', 'CNE036973', '89 Boulevard Pasteur', 'Tanger', '90200', 'Maroc', '+212 696-789012', 'ahmed.cherkaoui@outlook.com', 'Fatima Cherkaoui', '+212 696-789013', 'Épouse', 'A-', 171, 75.3, TRUE, 'quotidien', 'sédentaire', 'Commerçant', (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), TRUE, 'Diabète type 2, neuropathie périphérique'),

-- Oujda patients (2 patients)
('Brahim', 'Zouiten', '1982-03-14', 'M', 'CNE037982', '12 Boulevard Derfoufi', 'Oujda', '60000', 'Maroc', '+212 697-890123', 'brahim.zouiten@gmail.com', 'Zineb Zouiten', '+212 697-890124', 'Épouse', 'B-', 173, 77.4, FALSE, 'occasionnel', 'modérée', 'Enseignant', (SELECT id FROM medecins WHERE prenom = 'Brahim' AND nom = 'Zouiten' LIMIT 1), TRUE, NULL),

('Khadija', 'Benomar', '1995-11-06', 'F', 'CNE038995', '34 Avenue Hassan II', 'Oujda', '60100', 'Maroc', '+212 698-901234', 'khadija.benomar@yahoo.fr', 'Malika Benomar', '+212 698-901235', 'Mère', 'O+', 160, 55.7, FALSE, 'non', 'intense', 'Étudiante en pharmacie', (SELECT id FROM medecins WHERE prenom = 'Malika' AND nom = 'Benomar' LIMIT 1), TRUE, 'Migraine avec aura'),

-- Meknès and other cities (2 patients)
('Youssef', 'Benkirane', '1988-07-23', 'M', 'CNE039988', '56 Avenue Moulay Ismail', 'Meknès', '50000', 'Maroc', '+212 699-012345', 'youssef.benkirane@gmail.com', 'Laila Benkirane', '+212 699-012346', 'Épouse', 'A+', 175, 79.8, FALSE, 'régulier', 'légère', 'Neurologue', (SELECT id FROM medecins WHERE prenom = 'Youssef' AND nom = 'Benkirane' LIMIT 1), TRUE, 'Antécédents familiaux d\'épilepsie'),

('Najat', 'Berrada', '1991-04-02', 'F', 'CNE040991', '78 Avenue Zerktouni', 'Safi', '46000', 'Maroc', '+212 700-123456', 'najat.berrada@hotmail.com', 'Hassan Berrada', '+212 700-123457', 'Époux', 'AB+', 164, 59.9, FALSE, 'non', 'modérée', 'Comptable', (SELECT id FROM medecins WHERE prenom = 'Najat' AND nom = 'Berrada' LIMIT 1), TRUE, NULL);

-- Create user accounts for all patients (password: patient123)
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES
('youssef.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.alami@gmail.com', 'patient', @patient_start_id + 0, TRUE),
('aicha.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.benali@hotmail.com', 'patient', @patient_start_id + 1, TRUE),
('omar.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.tazi@yahoo.fr', 'patient', @patient_start_id + 2, TRUE),
('fatima.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.chraibi@gmail.com', 'patient', @patient_start_id + 3, TRUE),
('hassan.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.bennani@outlook.com', 'patient', @patient_start_id + 4, TRUE),
('zineb.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.fassi@parent.com', 'patient', @patient_start_id + 5, TRUE),
('abdellatif.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'abdellatif.idrissi@gmail.com', 'patient', @patient_start_id + 6, TRUE),
('salma.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'salma.kettani@yahoo.fr', 'patient', @patient_start_id + 7, TRUE),
('karim.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.alaoui@hotmail.com', 'patient', @patient_start_id + 8, TRUE),
('nadia.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.berrada@gmail.com', 'patient', @patient_start_id + 9, TRUE),
('rachid.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'rachid.hajji@outlook.com', 'patient', @patient_start_id + 10, TRUE),
('laila.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.bensouda@student.ma', 'patient', @patient_start_id + 11, TRUE),
('ahmed.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.fassi@gmail.com', 'patient', @patient_start_id + 12, TRUE),
('malika.lahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.lahlou@yahoo.fr', 'patient', @patient_start_id + 13, TRUE),
('youssef.benkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane@hotmail.com', 'patient', @patient_start_id + 14, TRUE),
('houda.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'houda.chraibi@gmail.com', 'patient', @patient_start_id + 15, TRUE),
('driss.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.alami@outlook.com', 'patient', @patient_start_id + 16, TRUE),
('samira.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'samira.bennani@yahoo.fr', 'patient', @patient_start_id + 17, TRUE),
('brahim.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.tazi@gmail.com', 'patient', @patient_start_id + 18, TRUE),
('khadija.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.idrissi@hotmail.com', 'patient', @patient_start_id + 19, TRUE),
('hassan.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.berrada@gmail.com', 'patient', @patient_start_id + 20, TRUE),
('fatima.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fatima.kettani@yahoo.fr', 'patient', @patient_start_id + 21, TRUE),
('omar.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'omar.hajji@hotmail.com', 'patient', @patient_start_id + 22, TRUE),
('zineb.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'zineb.alaoui@gmail.com', 'patient', @patient_start_id + 23, TRUE),
('karim.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benali@outlook.com', 'patient', @patient_start_id + 24, TRUE),
('laila.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'laila.fassi@parent.com', 'patient', @patient_start_id + 25, TRUE),
('mustapha.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'mustapha.alaoui@gmail.com', 'patient', @patient_start_id + 26, TRUE),
('aicha.filali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'aicha.filali@yahoo.fr', 'patient', @patient_start_id + 27, TRUE),
('youssef.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.bensouda@hotmail.com', 'patient', @patient_start_id + 28, TRUE),
('salma.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'salma.chraibi@gmail.com', 'patient', @patient_start_id + 29, TRUE),
('karim.benjelloun', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'karim.benjelloun@gmail.com', 'patient', @patient_start_id + 30, TRUE),
('nadia.ouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'nadia.ouali@yahoo.fr', 'patient', @patient_start_id + 31, TRUE),
('hassan.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'hassan.taibi@parent.com', 'patient', @patient_start_id + 32, TRUE),
('driss.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'driss.benali@gmail.com', 'patient', @patient_start_id + 33, TRUE),
('malika.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'malika.taibi@hotmail.com', 'patient', @patient_start_id + 34, TRUE),
('ahmed.cherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'ahmed.cherkaoui@outlook.com', 'patient', @patient_start_id + 35, TRUE),
('brahim.zouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'brahim.zouiten@gmail.com', 'patient', @patient_start_id + 36, TRUE),
('khadija.benomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'khadija.benomar@yahoo.fr', 'patient', @patient_start_id + 37, TRUE),
('youssef.benkirane2', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'youssef.benkirane@gmail.com', 'patient', @patient_start_id + 38, TRUE),
('najat.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'najat.berrada@hotmail.com', 'patient', @patient_start_id + 39, TRUE);

-- Add patient allergies
INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) VALUES
-- Patient with dust mite allergy
(@patient_start_id + 0, (SELECT id FROM allergies WHERE nom = 'Acariens'), '2020-03-15', 'légère', 'Réaction saisonnière, amélioration avec antihistaminiques'),
-- Patient with seafood allergy
(@patient_start_id + 4, (SELECT id FROM allergies WHERE nom = 'Fruits de mer'), '2018-07-22', 'sévère', 'Réaction anaphylactique aux crustacés, porte toujours un EpiPen'),
-- Patient with pollen allergy
(@patient_start_id + 5, (SELECT id FROM allergies WHERE nom = 'Pollen'), '2015-04-10', 'modérée', 'Rhinite allergique printanière'),
-- Patient with penicillin allergy
(@patient_start_id + 8, (SELECT id FROM allergies WHERE nom = 'Pénicilline'), '2019-11-05', 'sévère', 'Éruption cutanée généralisée lors du dernier traitement'),
-- Patient with dust mites and pollen
(@patient_start_id + 13, (SELECT id FROM allergies WHERE nom = 'Acariens'), '2021-02-18', 'modérée', 'Asthme allergique'),
(@patient_start_id + 13, (SELECT id FROM allergies WHERE nom = 'Pollen'), '2021-02-18', 'modérée', 'Conjonctivite allergique saisonnière'),
-- Patient with aspirin allergy
(@patient_start_id + 16, (SELECT id FROM allergies WHERE nom = 'Aspirine'), '2020-09-12', 'modérée', 'Urticaire et œdème facial'),
-- Patient with latex allergy
(@patient_start_id + 21, (SELECT id FROM allergies WHERE nom = 'Latex'), '2019-06-30', 'légère', 'Dermatite de contact lors de l utilisation de gants'),
-- Patient with sulfamides allergy
(@patient_start_id + 24, (SELECT id FROM allergies WHERE nom = 'Sulfamides'), '2018-12-14', 'modérée', 'Réaction cutanée avec fièvre'),

-- Patient with peanut allergy
(@patient_start_id + 25, (SELECT id FROM allergies WHERE nom = 'Arachides'), '2016-05-20', 'sévère', 'Allergie alimentaire grave, éviction stricte'),
-- Patient with iodine allergy
(@patient_start_id + 30, (SELECT id FROM allergies WHERE nom = 'Iode'), '2020-01-15', 'modérée', 'Réaction lors d\'examens avec produit de contraste'),
-- Patient with animal hair allergy
(@patient_start_id + 32, (SELECT id FROM allergies WHERE nom = 'Poils d\'animaux'), '2019-08-30', 'légère', 'Rhinite et conjonctivite en présence de chats');

-- Add medical antecedents for patients with chronic conditions
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) VALUES
-- Hypertension and diabetes family history
(@patient_start_id + 2, 'familial', 'Antécédents familiaux de diabète type 2 (père et grand-père maternel)', '2018-01-01', FALSE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),
(@patient_start_id + 2, 'medical', 'Hypertension artérielle diagnostiquée', '2020-06-15', TRUE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),

-- Diabetes and COPD
(@patient_start_id + 6, 'medical', 'Diabète type 2', '2015-03-20', TRUE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),
(@patient_start_id + 6, 'medical', 'BPCO (Bronchopneumopathie Chronique Obstructive)', '2018-11-10', TRUE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),
(@patient_start_id + 6, 'medical', 'Hypertension artérielle', '2016-08-05', TRUE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),

-- Chronic migraines
(@patient_start_id + 9, 'medical', 'Migraine chronique avec aura', '2019-02-14', TRUE, (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1)),

-- Heart attack history
(@patient_start_id + 10, 'medical', 'Infarctus du myocarde', '2021-09-18', FALSE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),
(@patient_start_id + 10, 'medical', 'Hypercholestérolémie', '2020-01-10', TRUE, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),

-- Scoliosis
(@patient_start_id + 11, 'medical', 'Scoliose légère', '2018-06-12', TRUE, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1)),

-- Hypertension and smoking
(@patient_start_id + 14, 'medical', 'Hypertension artérielle', '2019-04-22', TRUE, (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1)),

-- Iron deficiency anemia
(@patient_start_id + 17, 'medical', 'Anémie ferriprive', '2021-01-15', FALSE, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1)),

-- Chronic back pain
(@patient_start_id + 18, 'medical', 'Lombalgie chronique', '2020-03-08', TRUE, (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1)),

-- Knee arthritis
(@patient_start_id + 22, 'medical', 'Arthrose du genou bilatérale', '2019-11-25', TRUE, (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1)),

-- Dysmenorrhea
(@patient_start_id + 23, 'medical', 'Dysménorrhée primaire', '2018-09-10', TRUE, (SELECT id FROM medecins WHERE prenom = 'Salma' AND nom = 'Kettani' LIMIT 1)),

-- Herniated disc
(@patient_start_id + 26, 'medical', 'Hernie discale L4-L5', '2020-07-30', TRUE, (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1)),

-- Atopic eczema
(@patient_start_id + 27, 'medical', 'Eczéma atopique', '2019-05-18', TRUE, (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1)),

-- Early cataract
(@patient_start_id + 28, 'medical', 'Cataracte précoce bilatérale', '2021-03-12', TRUE, (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1)),

-- Psoriasis
(@patient_start_id + 34, 'medical', 'Psoriasis en plaques', '2020-08-20', TRUE, (SELECT id FROM medecins WHERE prenom = 'Houda' AND nom = 'Taibi' LIMIT 1)),

-- Diabetes with neuropathy
(@patient_start_id + 35, 'medical', 'Diabète type 2', '2018-04-15', TRUE, (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1)),
(@patient_start_id + 35, 'medical', 'Neuropathie diabétique périphérique', '2021-06-08', TRUE, (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1)),

-- Migraine with aura
(@patient_start_id + 37, 'medical', 'Migraine avec aura visuelle', '2020-12-03', TRUE, (SELECT id FROM medecins WHERE prenom = 'Malika' AND nom = 'Benomar' LIMIT 1)),

-- Family history of epilepsy
(@patient_start_id + 38, 'familial', 'Antécédents familiaux d\'épilepsie (frère)', '2021-01-20', FALSE, (SELECT id FROM medecins WHERE prenom = 'Youssef' AND nom = 'Benkirane' LIMIT 1));

-- Add patient notes from doctors
INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) VALUES
-- Important notes for chronic patients
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Patient très coopératif dans le suivi de son hypertension. Bonne observance thérapeutique.', FALSE, 'suivi'),
(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Diabète bien équilibré sous metformine. Surveillance régulière de la fonction rénale nécessaire.', TRUE, 'traitement'),
(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'BPCO stable. Encourager l\'arrêt du tabac. Vaccination antigrippale annuelle recommandée.', TRUE, 'prevention'),
(@patient_start_id + 9, (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), 'Migraines bien contrôlées avec traitement préventif. Éviter les facteurs déclenchants identifiés.', FALSE, 'suivi'),
(@patient_start_id + 10, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Post-infarctus. Excellent suivi cardiologique. Réadaptation cardiaque terminée avec succès.', TRUE, 'antecedents'),
(@patient_start_id + 11, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), 'Scoliose stable. Kinésithérapie régulière. Surveillance orthopédique annuelle.', FALSE, 'suivi'),
(@patient_start_id + 14, (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1), 'HTA bien contrôlée. Encourager la poursuite de l\'activité physique et du régime hyposodé.', FALSE, 'suivi'),
(@patient_start_id + 17, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), 'Anémie corrigée après supplémentation en fer. Surveillance biologique trimestrielle.', FALSE, 'suivi'),
(@patient_start_id + 22, (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), 'Arthrose du genou. Perte de poids recommandée. Kinésithérapie et infiltrations si nécessaire.', TRUE, 'traitement'),
(@patient_start_id + 26, (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1), 'Hernie discale. Amélioration avec kinésithérapie. Éviter les efforts de soulèvement.', FALSE, 'suivi'),
(@patient_start_id + 27, (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), 'Eczéma atopique bien contrôlé avec émollients et dermocorticoïdes en cure courte.', FALSE, 'traitement'),
(@patient_start_id + 35, (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), 'Diabète avec neuropathie. Contrôle glycémique strict nécessaire. Soins podologiques réguliers.', TRUE, 'complications');

-- Add some patient measurements
INSERT INTO mesures_patient (patient_id, medecin_id, type_mesure, valeur, unite, date_mesure, notes) VALUES
-- Blood pressure measurements
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Tension artérielle systolique', 135, 'mmHg', '2024-01-15 10:30:00', 'Légèrement élevée, ajustement posologique'),
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Tension artérielle diastolique', 85, 'mmHg', '2024-01-15 10:30:00', NULL),

-- Diabetes monitoring
(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Glycémie à jeun', 1.25, 'g/L', '2024-01-10 08:00:00', 'Objectif atteint'),
(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'HbA1c', 7.2, '%', '2024-01-10 08:00:00', 'Bon contrôle glycémique'),

-- Pediatric growth measurements
(@patient_start_id + 5, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), 'Taille', 145, 'cm', '2024-01-20 14:00:00', 'Croissance normale pour l\'âge'),
(@patient_start_id + 5, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), 'Poids', 38, 'kg', '2024-01-20 14:00:00', 'IMC dans la normale'),

-- Cholesterol levels
(@patient_start_id + 10, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'Cholestérol total', 1.85, 'g/L', '2024-01-12 09:15:00', 'Objectif atteint sous statines'),
(@patient_start_id + 10, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 'LDL cholestérol', 1.05, 'g/L', '2024-01-12 09:15:00', 'Bon contrôle'),

-- Hemoglobin levels
(@patient_start_id + 17, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), 'Hémoglobine', 12.8, 'g/dL', '2024-01-18 11:00:00', 'Normalisation après traitement');

-- Add some follow-up reminders
INSERT INTO rappels_suivi (patient_id, medecin_id, date_rappel, motif, description) VALUES
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), '2024-04-15', 'Contrôle tension artérielle', 'Vérification de l\'efficacité du nouveau traitement antihypertenseur'),
(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), '2024-04-10', 'Bilan diabétologique', 'HbA1c, créatininémie, fond d\'œil'),
(@patient_start_id + 10, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), '2024-03-20', 'Consultation cardiologique', 'Suivi post-infarctus, ECG et échocardiographie'),
(@patient_start_id + 11, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), '2024-06-15', 'Contrôle orthopédique', 'Surveillance de l\'évolution de la scoliose'),
(@patient_start_id + 17, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), '2024-05-01', 'Contrôle NFS', 'Vérification du taux d\'hémoglobine'),
(@patient_start_id + 22, (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), '2024-07-10', 'Consultation orthopédique', 'Évaluation de l\'arthrose, possibilité d\'infiltration'),
(@patient_start_id + 26, (SELECT id FROM medecins WHERE prenom = 'Mustapha' AND nom = 'Alaoui' LIMIT 1), '2024-08-20', 'IRM lombaire', 'Contrôle de l\'évolution de la hernie discale'),
(@patient_start_id + 35, (SELECT id FROM medecins WHERE prenom = 'Driss' AND nom = 'Benali' LIMIT 1), '2024-03-30', 'Consultation diabétologie', 'Ajustement thérapeutique, surveillance neuropathie');

-- Add some sample appointments (recent and upcoming)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, createur_id) VALUES
-- Recent completed appointments
(@patient_start_id + 0, (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), '2024-01-15 09:00:00', '2024-01-15 09:30:00', 'Consultation de routine', 'terminé', 'Contrôle général, tout va bien', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'youssef.alami' LIMIT 1)),

(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), '2024-01-15 10:30:00', '2024-01-15 11:15:00', 'Suivi hypertension', 'terminé', 'Tension un peu élevée ce matin', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'omar.tazi' LIMIT 1)),

(@patient_start_id + 6, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), '2024-01-10 08:30:00', '2024-01-10 09:15:00', 'Contrôle diabète', 'terminé', 'Résultats d\'analyses à discuter', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'abdellatif.idrissi' LIMIT 1)),

-- Upcoming appointments
(@patient_start_id + 1, (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), '2024-02-20 14:00:00', '2024-02-20 14:30:00', 'Consultation préventive', 'confirmé', 'Bilan de santé annuel', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'aicha.benali' LIMIT 1)),

(@patient_start_id + 5, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), '2024-02-25 16:00:00', '2024-02-25 16:30:00', 'Suivi pédiatrique', 'planifié', 'Contrôle croissance et vaccinations', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'zineb.fassi' LIMIT 1)),

(@patient_start_id + 9, (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), (SELECT institution_id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), '2024-03-05 11:00:00', '2024-03-05 11:40:00', 'Suivi gynécologique', 'confirmé', 'Contrôle annuel', (SELECT id FROM utilisateurs WHERE nom_utilisateur = 'nadia.berrada' LIMIT 1));

-- Add some doctor favorites for patients
INSERT INTO favoris_medecins (patient_id, medecin_id) VALUES
(@patient_start_id + 0, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1)),
(@patient_start_id + 1, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1)),
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1)),
(@patient_start_id + 3, (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1)),
(@patient_start_id + 4, (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1)),
(@patient_start_id + 12, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1)),
(@patient_start_id + 13, (SELECT id FROM medecins WHERE prenom = 'Rachid' AND nom = 'Benkirane' LIMIT 1)),
(@patient_start_id + 20, (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1)),
(@patient_start_id + 26, (SELECT id FROM medecins WHERE prenom = 'Leila' AND nom = 'Bensouda' LIMIT 1)),
(@patient_start_id + 30, (SELECT id FROM medecins WHERE prenom = 'Samira' AND nom = 'Ouali' LIMIT 1));

-- Add some doctor evaluations
INSERT INTO evaluations_medecins (patient_id, medecin_id, note, commentaire, est_approuve, est_anonyme) VALUES
(@patient_start_id + 0, (SELECT id FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali' LIMIT 1), 5, 'Excellente médecin, très à l\'écoute et professionnelle. Je la recommande vivement.', TRUE, FALSE),
(@patient_start_id + 2, (SELECT id FROM medecins WHERE prenom = 'Omar' AND nom = 'Tazi' LIMIT 1), 4, 'Très bon cardiologue, explications claires. Délais d\'attente parfois longs.', TRUE, FALSE),
(@patient_start_id + 5, (SELECT id FROM medecins WHERE prenom = 'Fatima Zahra' AND nom = 'Idrissi' LIMIT 1), 5, 'Pédiatre exceptionnelle, ma fille l\'adore. Très douce avec les enfants.', TRUE, FALSE),
(@patient_start_id + 9, (SELECT id FROM medecins WHERE prenom = 'Khadija' AND nom = 'Bennani' LIMIT 1), 4, 'Gynécologue compétente et rassurante. Cabinet bien équipé.', TRUE, TRUE),
(@patient_start_id + 13, (SELECT id FROM medecins WHERE prenom = 'Aicha' AND nom = 'Lahlou' LIMIT 1), 5, 'Pédiatre formidable, très professionnelle et bienveillante.', TRUE, FALSE),
(@patient_start_id + 22, (SELECT id FROM medecins WHERE prenom = 'Abdellatif' AND nom = 'Hajji' LIMIT 1), 4, 'Bon orthopédiste, traitement efficace pour mon arthrose.', TRUE, TRUE),
(@patient_start_id + 27, (SELECT id FROM medecins WHERE prenom = 'Zineb' AND nom = 'Filali' LIMIT 1), 5, 'Dermatologue excellente, mon eczéma est bien contrôlé grâce à elle.', TRUE, FALSE),
(@patient_start_id + 34, (SELECT id FROM medecins WHERE prenom = 'Houda' AND nom = 'Taibi' LIMIT 1), 4, 'Très bonne prise en charge de mon psoriasis. Médecin compétente.', TRUE, TRUE);

-- Migration completed successfully
SELECT 'Migration completed: 40 Moroccan patients with comprehensive medical records have been added to the database.' as status;

-- Summary statistics
SELECT 
    'PATIENTS SUMMARY' as category,
    COUNT(*) as total_patients,
    COUNT(CASE WHEN sexe = 'M' THEN 1 END) as hommes,
    COUNT(CASE WHEN sexe = 'F' THEN 1 END) as femmes,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) < 18 THEN 1 END) as mineurs,
    COUNT(CASE WHEN YEAR(CURDATE()) - YEAR(date_naissance) >= 65 THEN 1 END) as seniors
FROM patients 
WHERE id >= @patient_start_id;

SELECT 
    'MEDICAL CONDITIONS' as category,
    COUNT(DISTINCT patient_id) as patients_with_allergies
FROM patient_allergies 
WHERE patient_id >= @patient_start_id;

SELECT 
    'MEDICAL HISTORY' as category,
    COUNT(DISTINCT patient_id) as patients_with_antecedents
FROM antecedents_medicaux 
WHERE patient_id >= @patient_start_id;

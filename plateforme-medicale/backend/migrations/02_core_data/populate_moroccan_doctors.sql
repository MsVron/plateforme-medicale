-- MOROCCAN DOCTORS POPULATION MIGRATION
-- Migration to populate the database with Moroccan doctors and their private cabinets
-- Created: 2024
-- Description: Adds 25 doctors with realistic Moroccan names, distributed across specialties and cities

-- Ensure we have the required specialties (they should already exist)
-- This is just a safety check - these specialties should already be in the database

-- ========================================
-- MOROCCAN DOCTORS AND PRIVATE CABINETS
-- ========================================

-- First, let's insert the private cabinets (institutions)
-- We'll use variables to store the starting institution ID
SET @institution_start_id = (SELECT COALESCE(MAX(id), 0) FROM institutions) + 1;

INSERT INTO institutions (nom, adresse, ville, code_postal, pays, telephone, email_contact, type, type_institution, latitude, longitude, coordonnees_gps, est_actif, status) VALUES

-- Casablanca (Economic capital)
('Cabinet Dr. Amina Benali', '45 Boulevard Zerktouni', 'Casablanca', '20000', 'Maroc', '+212 522-234567', 'contact@cabinet-benali.ma', 'cabinet privé', 'clinic', 33.5731, -7.5898, '33.5731,-7.5898', TRUE, 'approved'),
('Cabinet Dr. Youssef Alami', '12 Rue Ibn Batouta', 'Casablanca', '20100', 'Maroc', '+212 522-345678', 'dr.alami@medecine.ma', 'cabinet privé', 'clinic', 33.5892, -7.6031, '33.5892,-7.6031', TRUE, 'approved'),
('Cabinet Dr. Fatima Zahra Idrissi', '78 Avenue Hassan II', 'Casablanca', '20200', 'Maroc', '+212 522-456789', 'cabinet.idrissi@gmail.com', 'cabinet privé', 'clinic', 33.5650, -7.6033, '33.5650,-7.6033', TRUE, 'approved'),
('Cabinet Dr. Omar Tazi', '23 Rue de Fès', 'Casablanca', '20300', 'Maroc', '+212 522-567890', 'dr.tazi.cardio@outlook.com', 'cabinet privé', 'clinic', 33.5731, -7.5898, '33.5731,-7.5898', TRUE, 'approved'),
('Cabinet Dr. Khadija Bennani', '56 Boulevard Moulay Youssef', 'Casablanca', '20400', 'Maroc', '+212 522-678901', 'cabinet.bennani@yahoo.fr', 'cabinet privé', 'clinic', 33.5892, -7.6031, '33.5892,-7.6031', TRUE, 'approved'),

-- Rabat (Capital)
('Cabinet Dr. Ahmed Fassi', '34 Avenue Mohammed V', 'Rabat', '10000', 'Maroc', '+212 537-123456', 'dr.fassi@medecin-rabat.ma', 'cabinet privé', 'clinic', 34.0209, -6.8416, '34.0209,-6.8416', TRUE, 'approved'),
('Cabinet Dr. Aicha Lahlou', '67 Rue Patrice Lumumba', 'Rabat', '10100', 'Maroc', '+212 537-234567', 'cabinet.lahlou@gmail.com', 'cabinet privé', 'clinic', 34.0151, -6.8326, '34.0151,-6.8326', TRUE, 'approved'),
('Cabinet Dr. Rachid Benkirane', '89 Avenue Allal Ben Abdellah', 'Rabat', '10200', 'Maroc', '+212 537-345678', 'dr.benkirane.neuro@hotmail.com', 'cabinet privé', 'clinic', 34.0209, -6.8416, '34.0209,-6.8416', TRUE, 'approved'),
('Cabinet Dr. Nadia Chraibi', '12 Rue Oued Fès', 'Rabat', '10300', 'Maroc', '+212 537-456789', 'cabinet.chraibi@medecine.ma', 'cabinet privé', 'clinic', 34.0151, -6.8326, '34.0151,-6.8326', TRUE, 'approved'),

-- Marrakech (Tourist city)
('Cabinet Dr. Hassan Berrada', '45 Avenue Mohammed VI', 'Marrakech', '40000', 'Maroc', '+212 524-123456', 'dr.berrada@cabinet-marrakech.ma', 'cabinet privé', 'clinic', 31.6295, -7.9811, '31.6295,-7.9811', TRUE, 'approved'),
('Cabinet Dr. Salma Kettani', '78 Rue de la Liberté', 'Marrakech', '40100', 'Maroc', '+212 524-234567', 'cabinet.kettani@gmail.com', 'cabinet privé', 'clinic', 31.6340, -8.0089, '31.6340,-8.0089', TRUE, 'approved'),
('Cabinet Dr. Abdellatif Hajji', '23 Boulevard Zerktouni', 'Marrakech', '40200', 'Maroc', '+212 524-345678', 'dr.hajji.ortho@yahoo.fr', 'cabinet privé', 'clinic', 31.6295, -7.9811, '31.6295,-7.9811', TRUE, 'approved'),

-- Fès (Cultural capital)
('Cabinet Dr. Leila Bensouda', '56 Avenue Hassan II', 'Fès', '30000', 'Maroc', '+212 535-123456', 'dr.bensouda@medecine-fes.ma', 'cabinet privé', 'clinic', 34.0181, -5.0078, '34.0181,-5.0078', TRUE, 'approved'),
('Cabinet Dr. Mustapha Alaoui', '34 Rue Moulay Abdellah', 'Fès', '30100', 'Maroc', '+212 535-234567', 'cabinet.alaoui@hotmail.com', 'cabinet privé', 'clinic', 34.0331, -4.9998, '34.0331,-4.9998', TRUE, 'approved'),
('Cabinet Dr. Zineb Filali', '67 Boulevard Chefchaouni', 'Fès', '30200', 'Maroc', '+212 535-345678', 'dr.filali.dermato@gmail.com', 'cabinet privé', 'clinic', 34.0181, -5.0078, '34.0181,-5.0078', TRUE, 'approved'),

-- Agadir (Coastal city)
('Cabinet Dr. Karim Benjelloun', '89 Avenue du Prince Héritier', 'Agadir', '80000', 'Maroc', '+212 528-123456', 'dr.benjelloun@cabinet-agadir.ma', 'cabinet privé', 'clinic', 30.4278, -9.5981, '30.4278,-9.5981', TRUE, 'approved'),
('Cabinet Dr. Samira Ouali', '12 Rue Ibn Rochd', 'Agadir', '80100', 'Maroc', '+212 528-234567', 'cabinet.ouali@yahoo.fr', 'cabinet privé', 'clinic', 30.4202, -9.5982, '30.4202,-9.5982', TRUE, 'approved'),

-- Tangier (Northern city)
('Cabinet Dr. Driss Benali', '45 Avenue Mohammed V', 'Tanger', '90000', 'Maroc', '+212 539-123456', 'dr.benali.tanger@gmail.com', 'cabinet privé', 'clinic', 35.7595, -5.8340, '35.7595,-5.8340', TRUE, 'approved'),
('Cabinet Dr. Houda Taibi', '78 Rue de Belgique', 'Tanger', '90100', 'Maroc', '+212 539-234567', 'cabinet.taibi@medecine.ma', 'cabinet privé', 'clinic', 35.7673, -5.8008, '35.7673,-5.8008', TRUE, 'approved'),

-- Oujda (Eastern city)
('Cabinet Dr. Brahim Zouiten', '23 Boulevard Derfoufi', 'Oujda', '60000', 'Maroc', '+212 536-123456', 'dr.zouiten@cabinet-oujda.ma', 'cabinet privé', 'clinic', 34.6814, -1.9086, '34.6814,-1.9086', TRUE, 'approved'),
('Cabinet Dr. Malika Benomar', '56 Avenue Hassan II', 'Oujda', '60100', 'Maroc', '+212 536-234567', 'cabinet.benomar@hotmail.com', 'cabinet privé', 'clinic', 34.6867, -1.9114, '34.6867,-1.9114', TRUE, 'approved'),

-- Meknes
('Cabinet Dr. Youssef Benkirane', '34 Avenue Moulay Ismail', 'Meknès', '50000', 'Maroc', '+212 535-567890', 'dr.benkirane.meknes@gmail.com', 'cabinet privé', 'clinic', 33.8935, -5.5473, '33.8935,-5.5473', TRUE, 'approved'),

-- Tetouan
('Cabinet Dr. Laila Cherkaoui', '67 Avenue Mohammed V', 'Tétouan', '93000', 'Maroc', '+212 539-567890', 'cabinet.cherkaoui@yahoo.fr', 'cabinet privé', 'clinic', 35.5889, -5.3626, '35.5889,-5.3626', TRUE, 'approved'),

-- Kenitra
('Cabinet Dr. Abderrahim Benali', '89 Boulevard Mohammed Diouri', 'Kénitra', '14000', 'Maroc', '+212 537-567890', 'dr.benali.kenitra@medecine.ma', 'cabinet privé', 'clinic', 34.2610, -6.5802, '34.2610,-6.5802', TRUE, 'approved'),

-- Safi
('Cabinet Dr. Najat Berrada', '12 Avenue Zerktouni', 'Safi', '46000', 'Maroc', '+212 524-567890', 'cabinet.berrada@gmail.com', 'cabinet privé', 'clinic', 32.2994, -9.2372, '32.2994,-9.2372', TRUE, 'approved'),

-- El Jadida
('Cabinet Dr. Mohamed Alami', '45 Rue Mohammed V', 'El Jadida', '24000', 'Maroc', '+212 523-567890', 'dr.alami.eljadida@hotmail.com', 'cabinet privé', 'clinic', 33.2316, -8.5007, '33.2316,-8.5007', TRUE, 'approved');

-- Now insert the doctors with their specialties using dynamic institution IDs
INSERT INTO medecins (prenom, nom, specialite_id, numero_ordre, telephone, email_professionnel, institution_id, adresse, ville, code_postal, pays, latitude, longitude, tarif_consultation, accepte_nouveaux_patients, temps_consultation_moyen, langues_parlees, accepte_patients_walk_in, biographie, est_actif) VALUES

-- Médecine générale (4 doctors)
('Amina', 'Benali', 1, 'MG-CAS-001', '+212 522-234567', 'dr.benali@cabinet-benali.ma', @institution_start_id + 0, '45 Boulevard Zerktouni', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 300.00, TRUE, 30, 'Arabe, Français, Anglais', TRUE, 'Médecin généraliste expérimentée avec 15 ans d\'expérience. Spécialisée dans le suivi des maladies chroniques et la médecine préventive.', TRUE),
('Ahmed', 'Fassi', 1, 'MG-RAB-002', '+212 537-123456', 'dr.fassi@medecin-rabat.ma', @institution_start_id + 5, '34 Avenue Mohammed V', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 280.00, TRUE, 25, 'Arabe, Français', TRUE, 'Médecin de famille dévoué, expert en médecine générale et gériatrie. Consultation personnalisée pour tous âges.', TRUE),
('Hassan', 'Berrada', 1, 'MG-MAR-003', '+212 524-123456', 'dr.berrada@cabinet-marrakech.ma', @institution_start_id + 9, '45 Avenue Mohammed VI', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 250.00, TRUE, 30, 'Arabe, Français, Berbère', TRUE, 'Médecin généraliste passionné par la médecine familiale. Approche holistique du patient.', TRUE),
('Brahim', 'Zouiten', 1, 'MG-OUJ-004', '+212 536-123456', 'dr.zouiten@cabinet-oujda.ma', @institution_start_id + 19, '23 Boulevard Derfoufi', 'Oujda', '60000', 'Maroc', 34.6814, -1.9086, 220.00, TRUE, 30, 'Arabe, Français', TRUE, 'Médecin généraliste avec une approche moderne de la médecine préventive et curative.', TRUE),

-- Cardiologie (3 doctors)
('Omar', 'Tazi', 2, 'CAR-CAS-005', '+212 522-567890', 'dr.tazi.cardio@outlook.com', @institution_start_id + 3, '23 Rue de Fès', 'Casablanca', '20300', 'Maroc', 33.5731, -7.5898, 500.00, TRUE, 45, 'Arabe, Français, Anglais', FALSE, 'Cardiologue interventionnel avec 20 ans d\'expérience. Spécialisé dans les maladies coronariennes et l\'hypertension artérielle.', TRUE),
('Rachid', 'Benkirane', 2, 'CAR-RAB-006', '+212 537-345678', 'dr.benkirane.neuro@hotmail.com', @institution_start_id + 7, '89 Avenue Allal Ben Abdellah', 'Rabat', '10200', 'Maroc', 34.0209, -6.8416, 480.00, TRUE, 40, 'Arabe, Français', FALSE, 'Cardiologue expérimenté, spécialisé dans l\'échocardiographie et les troubles du rythme cardiaque.', TRUE),
('Karim', 'Benjelloun', 2, 'CAR-AGA-007', '+212 528-123456', 'dr.benjelloun@cabinet-agadir.ma', @institution_start_id + 15, '89 Avenue du Prince Héritier', 'Agadir', '80000', 'Maroc', 30.4278, -9.5981, 450.00, TRUE, 45, 'Arabe, Français', FALSE, 'Cardiologue spécialisé dans la prévention cardiovasculaire et le traitement de l\'insuffisance cardiaque.', TRUE),

-- Pédiatrie (3 doctors)
('Fatima Zahra', 'Idrissi', 3, 'PED-CAS-008', '+212 522-456789', 'cabinet.idrissi@gmail.com', @institution_start_id + 2, '78 Avenue Hassan II', 'Casablanca', '20200', 'Maroc', 33.5650, -7.6033, 350.00, TRUE, 30, 'Arabe, Français', TRUE, 'Pédiatre dévouée avec une approche douce et rassurante. Spécialisée dans le développement de l\'enfant et la vaccination.', TRUE),
('Aicha', 'Lahlou', 3, 'PED-RAB-009', '+212 537-234567', 'cabinet.lahlou@gmail.com', @institution_start_id + 6, '67 Rue Patrice Lumumba', 'Rabat', '10100', 'Maroc', 34.0151, -6.8326, 320.00, TRUE, 35, 'Arabe, Français', TRUE, 'Pédiatre expérimentée, spécialisée dans les maladies respiratoires infantiles et l\'allergologie pédiatrique.', TRUE),
('Samira', 'Ouali', 3, 'PED-AGA-010', '+212 528-234567', 'cabinet.ouali@yahoo.fr', @institution_start_id + 16, '12 Rue Ibn Rochd', 'Agadir', '80100', 'Maroc', 30.4202, -9.5982, 300.00, TRUE, 30, 'Arabe, Français', TRUE, 'Pédiatre passionnée par la santé infantile. Expertise en néonatologie et suivi de croissance.', TRUE),

-- Gynécologie-Obstétrique (3 doctors)
('Khadija', 'Bennani', 4, 'GYN-CAS-011', '+212 522-678901', 'cabinet.bennani@yahoo.fr', @institution_start_id + 4, '56 Boulevard Moulay Youssef', 'Casablanca', '20400', 'Maroc', 33.5892, -7.6031, 400.00, TRUE, 40, 'Arabe, Français', FALSE, 'Gynécologue-obstétricienne expérimentée. Spécialisée dans le suivi de grossesse et la chirurgie gynécologique minimalement invasive.', TRUE),
('Nadia', 'Chraibi', 4, 'GYN-RAB-012', '+212 537-456789', 'cabinet.chraibi@medecine.ma', @institution_start_id + 8, '12 Rue Oued Fès', 'Rabat', '10300', 'Maroc', 34.0151, -6.8326, 380.00, TRUE, 35, 'Arabe, Français', FALSE, 'Gynécologue spécialisée dans la médecine de la reproduction et l\'endocrinologie gynécologique.', TRUE),
('Salma', 'Kettani', 4, 'GYN-MAR-013', '+212 524-234567', 'cabinet.kettani@gmail.com', @institution_start_id + 10, '78 Rue de la Liberté', 'Marrakech', '40100', 'Maroc', 31.6340, -8.0089, 360.00, TRUE, 40, 'Arabe, Français, Berbère', FALSE, 'Gynécologue-obstétricienne avec expertise en échographie obstétricale et médecine fœtale.', TRUE),

-- Dermatologie (2 doctors)
('Zineb', 'Filali', 5, 'DER-FES-014', '+212 535-345678', 'dr.filali.dermato@gmail.com', @institution_start_id + 14, '67 Boulevard Chefchaouni', 'Fès', '30200', 'Maroc', 34.0181, -5.0078, 350.00, TRUE, 30, 'Arabe, Français', TRUE, 'Dermatologue spécialisée dans le traitement de l\'acné, du psoriasis et de la dermatologie esthétique.', TRUE),
('Houda', 'Taibi', 5, 'DER-TAN-015', '+212 539-234567', 'cabinet.taibi@medecine.ma', @institution_start_id + 18, '78 Rue de Belgique', 'Tanger', '90100', 'Maroc', 35.7673, -5.8008, 330.00, TRUE, 25, 'Arabe, Français, Espagnol', TRUE, 'Dermatologue experte en dermatologie médicale et chirurgicale. Spécialisée dans le dépistage du cancer de la peau.', TRUE),

-- Ophtalmologie (2 doctors)
('Leila', 'Bensouda', 6, 'OPH-FES-016', '+212 535-123456', 'dr.bensouda@medecine-fes.ma', @institution_start_id + 12, '56 Avenue Hassan II', 'Fès', '30000', 'Maroc', 34.0181, -5.0078, 400.00, TRUE, 35, 'Arabe, Français', FALSE, 'Ophtalmologue spécialisée dans la chirurgie de la cataracte et le traitement du glaucome.', TRUE),
('Driss', 'Benali', 6, 'OPH-TAN-017', '+212 539-123456', 'dr.benali.tanger@gmail.com', @institution_start_id + 17, '45 Avenue Mohammed V', 'Tanger', '90000', 'Maroc', 35.7595, -5.8340, 380.00, TRUE, 30, 'Arabe, Français, Espagnol', FALSE, 'Ophtalmologue avec expertise en chirurgie réfractive et traitement des maladies de la rétine.', TRUE),

-- Orthopédie (2 doctors)
('Abdellatif', 'Hajji', 7, 'ORT-MAR-018', '+212 524-345678', 'dr.hajji.ortho@yahoo.fr', @institution_start_id + 11, '23 Boulevard Zerktouni', 'Marrakech', '40200', 'Maroc', 31.6295, -7.9811, 450.00, TRUE, 45, 'Arabe, Français', FALSE, 'Chirurgien orthopédiste spécialisé dans la traumatologie sportive et la chirurgie arthroscopique.', TRUE),
('Mustapha', 'Alaoui', 7, 'ORT-FES-019', '+212 535-234567', 'cabinet.alaoui@hotmail.com', @institution_start_id + 13, '34 Rue Moulay Abdellah', 'Fès', '30100', 'Maroc', 34.0331, -4.9998, 420.00, TRUE, 40, 'Arabe, Français', FALSE, 'Orthopédiste expérimenté en chirurgie de la colonne vertébrale et des articulations.', TRUE),

-- Neurologie (2 doctors)
('Malika', 'Benomar', 8, 'NEU-OUJ-020', '+212 536-234567', 'cabinet.benomar@hotmail.com', @institution_start_id + 20, '56 Avenue Hassan II', 'Oujda', '60100', 'Maroc', 34.6867, -1.9114, 450.00, TRUE, 45, 'Arabe, Français', FALSE, 'Neurologue spécialisée dans le traitement de l\'épilepsie et des maladies neurodégénératives.', TRUE),
('Youssef', 'Benkirane', 8, 'NEU-MEK-021', '+212 535-567890', 'dr.benkirane.meknes@gmail.com', @institution_start_id + 21, '34 Avenue Moulay Ismail', 'Meknès', '50000', 'Maroc', 33.8935, -5.5473, 430.00, TRUE, 40, 'Arabe, Français', FALSE, 'Neurologue expert en neurologie vasculaire et troubles du mouvement.', TRUE),

-- Psychiatrie (1 doctor)
('Laila', 'Cherkaoui', 9, 'PSY-TET-022', '+212 539-567890', 'cabinet.cherkaoui@yahoo.fr', @institution_start_id + 22, '67 Avenue Mohammed V', 'Tétouan', '93000', 'Maroc', 35.5889, -5.3626, 400.00, TRUE, 50, 'Arabe, Français', FALSE, 'Psychiatre spécialisée dans les troubles anxieux, la dépression et la thérapie cognitivo-comportementale.', TRUE),

-- Radiologie (1 doctor)
('Abderrahim', 'Benali', 10, 'RAD-KEN-023', '+212 537-567890', 'dr.benali.kenitra@medecine.ma', @institution_start_id + 23, '89 Boulevard Mohammed Diouri', 'Kénitra', '14000', 'Maroc', 34.2610, -6.5802, 350.00, TRUE, 30, 'Arabe, Français', FALSE, 'Radiologue spécialisé en imagerie médicale avancée, IRM et scanner.', TRUE),

-- Additional specialties for variety
('Najat', 'Berrada', 1, 'MG-SAF-024', '+212 524-567890', 'cabinet.berrada@gmail.com', @institution_start_id + 24, '12 Avenue Zerktouni', 'Safi', '46000', 'Maroc', 32.2994, -9.2372, 240.00, TRUE, 30, 'Arabe, Français', TRUE, 'Médecin généraliste avec une approche intégrée de la médecine familiale et préventive.', TRUE),
('Mohamed', 'Alami', 1, 'MG-JAD-025', '+212 523-567890', 'dr.alami.eljadida@hotmail.com', @institution_start_id + 25, '45 Rue Mohammed V', 'El Jadida', '24000', 'Maroc', 33.2316, -8.5007, 260.00, TRUE, 30, 'Arabe, Français', TRUE, 'Médecin généraliste expérimenté dans le suivi des patients diabétiques et hypertendus.', TRUE);

-- Get the starting medecin ID for later use
SET @medecin_start_id = (SELECT COALESCE(MAX(id), 0) FROM medecins) - 24;

-- Create user accounts for all doctors
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES
('aminabenali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benali@cabinet-benali.ma', 'medecin', @medecin_start_id + 0, TRUE),
('ahmedfassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.fassi@medecin-rabat.ma', 'medecin', @medecin_start_id + 1, TRUE),
('hassanberrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.berrada@cabinet-marrakech.ma', 'medecin', @medecin_start_id + 2, TRUE),
('brahimzouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.zouiten@cabinet-oujda.ma', 'medecin', @medecin_start_id + 3, TRUE),
('omartazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.tazi.cardio@outlook.com', 'medecin', @medecin_start_id + 4, TRUE),
('rachidbenkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benkirane.neuro@hotmail.com', 'medecin', @medecin_start_id + 5, TRUE),
('karimbenjelloun', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benjelloun@cabinet-agadir.ma', 'medecin', @medecin_start_id + 6, TRUE),
('fatimazahraidrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.idrissi@gmail.com', 'medecin', @medecin_start_id + 7, TRUE),
('aichalahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.lahlou@gmail.com', 'medecin', @medecin_start_id + 8, TRUE),
('samiraouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.ouali@yahoo.fr', 'medecin', @medecin_start_id + 9, TRUE),
('khadijabennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.bennani@yahoo.fr', 'medecin', @medecin_start_id + 10, TRUE),
('nadiachraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.chraibi@medecine.ma', 'medecin', @medecin_start_id + 11, TRUE),
('salmakettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.kettani@gmail.com', 'medecin', @medecin_start_id + 12, TRUE),
('zinebfilali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.filali.dermato@gmail.com', 'medecin', @medecin_start_id + 13, TRUE),
('houdataibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.taibi@medecine.ma', 'medecin', @medecin_start_id + 14, TRUE),
('leilabensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.bensouda@medecine-fes.ma', 'medecin', @medecin_start_id + 15, TRUE),
('drissbenali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benali.tanger@gmail.com', 'medecin', @medecin_start_id + 16, TRUE),
('abdellatifhajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.hajji.ortho@yahoo.fr', 'medecin', @medecin_start_id + 17, TRUE),
('mustaphaalaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.alaoui@hotmail.com', 'medecin', @medecin_start_id + 18, TRUE),
('malikabenomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.benomar@hotmail.com', 'medecin', @medecin_start_id + 19, TRUE),
('youssefbenkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benkirane.meknes@gmail.com', 'medecin', @medecin_start_id + 20, TRUE),
('lailacherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.cherkaoui@yahoo.fr', 'medecin', @medecin_start_id + 21, TRUE),
('abderrahimbenali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.benali.kenitra@medecine.ma', 'medecin', @medecin_start_id + 22, TRUE),
('najatberrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'cabinet.berrada@gmail.com', 'medecin', @medecin_start_id + 23, TRUE),
('mohamedalami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'dr.alami.eljadida@hotmail.com', 'medecin', @medecin_start_id + 24, TRUE);

-- Update institution ownership (link doctors to their private cabinets)
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 0 WHERE id = @institution_start_id + 0;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 1 WHERE id = @institution_start_id + 5;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 2 WHERE id = @institution_start_id + 9;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 3 WHERE id = @institution_start_id + 19;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 4 WHERE id = @institution_start_id + 3;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 5 WHERE id = @institution_start_id + 7;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 6 WHERE id = @institution_start_id + 15;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 7 WHERE id = @institution_start_id + 2;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 8 WHERE id = @institution_start_id + 6;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 9 WHERE id = @institution_start_id + 16;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 10 WHERE id = @institution_start_id + 4;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 11 WHERE id = @institution_start_id + 8;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 12 WHERE id = @institution_start_id + 10;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 13 WHERE id = @institution_start_id + 14;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 14 WHERE id = @institution_start_id + 18;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 15 WHERE id = @institution_start_id + 12;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 16 WHERE id = @institution_start_id + 17;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 17 WHERE id = @institution_start_id + 11;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 18 WHERE id = @institution_start_id + 13;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 19 WHERE id = @institution_start_id + 20;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 20 WHERE id = @institution_start_id + 21;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 21 WHERE id = @institution_start_id + 22;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 22 WHERE id = @institution_start_id + 23;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 23 WHERE id = @institution_start_id + 24;
UPDATE institutions SET medecin_proprietaire_id = @medecin_start_id + 24 WHERE id = @institution_start_id + 25;

-- Create doctor-institution affiliations (each doctor is affiliated with their own cabinet)
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut) VALUES
(@medecin_start_id + 0, @institution_start_id + 0, TRUE, '2020-01-15'),
(@medecin_start_id + 1, @institution_start_id + 5, TRUE, '2018-03-20'),
(@medecin_start_id + 2, @institution_start_id + 9, TRUE, '2019-06-10'),
(@medecin_start_id + 3, @institution_start_id + 19, TRUE, '2021-02-28'),
(@medecin_start_id + 4, @institution_start_id + 3, TRUE, '2017-09-12'),
(@medecin_start_id + 5, @institution_start_id + 7, TRUE, '2019-11-05'),
(@medecin_start_id + 6, @institution_start_id + 15, TRUE, '2020-04-18'),
(@medecin_start_id + 7, @institution_start_id + 2, TRUE, '2018-07-22'),
(@medecin_start_id + 8, @institution_start_id + 6, TRUE, '2020-01-30'),
(@medecin_start_id + 9, @institution_start_id + 16, TRUE, '2019-08-14'),
(@medecin_start_id + 10, @institution_start_id + 4, TRUE, '2017-12-03'),
(@medecin_start_id + 11, @institution_start_id + 8, TRUE, '2018-10-25'),
(@medecin_start_id + 12, @institution_start_id + 10, TRUE, '2019-05-17'),
(@medecin_start_id + 13, @institution_start_id + 14, TRUE, '2020-03-08'),
(@medecin_start_id + 14, @institution_start_id + 18, TRUE, '2018-11-12'),
(@medecin_start_id + 15, @institution_start_id + 12, TRUE, '2017-04-26'),
(@medecin_start_id + 16, @institution_start_id + 17, TRUE, '2019-09-30'),
(@medecin_start_id + 17, @institution_start_id + 11, TRUE, '2018-06-14'),
(@medecin_start_id + 18, @institution_start_id + 13, TRUE, '2020-02-07'),
(@medecin_start_id + 19, @institution_start_id + 20, TRUE, '2019-12-19'),
(@medecin_start_id + 20, @institution_start_id + 21, TRUE, '2018-08-03'),
(@medecin_start_id + 21, @institution_start_id + 22, TRUE, '2020-05-21'),
(@medecin_start_id + 22, @institution_start_id + 23, TRUE, '2019-01-16'),
(@medecin_start_id + 23, @institution_start_id + 24, TRUE, '2018-04-09'),
(@medecin_start_id + 24, @institution_start_id + 25, TRUE, '2020-07-13');

-- Add sample availability schedules for some doctors
INSERT INTO disponibilites_medecin (medecin_id, institution_id, jour_semaine, heure_debut, heure_fin, intervalle_minutes, a_pause_dejeuner, heure_debut_pause, heure_fin_pause) VALUES
-- Dr. Amina Benali (Médecine générale - Casablanca)
(@medecin_start_id + 0, @institution_start_id + 0, 'lundi', '08:00:00', '18:00:00', 30, TRUE, '12:00:00', '14:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'mardi', '08:00:00', '18:00:00', 30, TRUE, '12:00:00', '14:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'mercredi', '08:00:00', '18:00:00', 30, TRUE, '12:00:00', '14:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'jeudi', '08:00:00', '18:00:00', 30, TRUE, '12:00:00', '14:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'vendredi', '08:00:00', '18:00:00', 30, TRUE, '12:00:00', '14:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'samedi', '08:00:00', '13:00:00', 30, FALSE, NULL, NULL),

-- Dr. Omar Tazi (Cardiologie - Casablanca)
(@medecin_start_id + 4, @institution_start_id + 3, 'lundi', '09:00:00', '17:00:00', 45, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 4, @institution_start_id + 3, 'mardi', '09:00:00', '17:00:00', 45, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 4, @institution_start_id + 3, 'mercredi', '09:00:00', '17:00:00', 45, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 4, @institution_start_id + 3, 'jeudi', '09:00:00', '17:00:00', 45, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 4, @institution_start_id + 3, 'vendredi', '09:00:00', '12:00:00', 45, FALSE, NULL, NULL),

-- Dr. Fatima Zahra Idrissi (Pédiatrie - Casablanca)
(@medecin_start_id + 7, @institution_start_id + 2, 'lundi', '08:30:00', '17:30:00', 30, TRUE, '12:30:00', '14:00:00'),
(@medecin_start_id + 7, @institution_start_id + 2, 'mardi', '08:30:00', '17:30:00', 30, TRUE, '12:30:00', '14:00:00'),
(@medecin_start_id + 7, @institution_start_id + 2, 'mercredi', '08:30:00', '17:30:00', 30, TRUE, '12:30:00', '14:00:00'),
(@medecin_start_id + 7, @institution_start_id + 2, 'jeudi', '08:30:00', '17:30:00', 30, TRUE, '12:30:00', '14:00:00'),
(@medecin_start_id + 7, @institution_start_id + 2, 'vendredi', '08:30:00', '17:30:00', 30, TRUE, '12:30:00', '14:00:00'),
(@medecin_start_id + 7, @institution_start_id + 2, 'samedi', '09:00:00', '13:00:00', 30, FALSE, NULL, NULL);

-- Update specialty usage counts
UPDATE specialites SET usage_count = (
    SELECT COUNT(*) FROM medecins WHERE specialite_id = specialites.id
);

-- Add some sample notes for demonstration (only if patients exist)
INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT 1, @medecin_start_id + 0, 'Patient très coopératif, bon suivi des recommandations médicales.', FALSE, 'general'
WHERE EXISTS (SELECT 1 FROM patients WHERE id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT 1, @medecin_start_id + 4, 'Antécédents familiaux de maladies cardiovasculaires à surveiller.', TRUE, 'antecedents'
WHERE EXISTS (SELECT 1 FROM patients WHERE id = 1);

-- Migration completed successfully
SELECT 'Migration completed: 25 Moroccan doctors and their private cabinets have been added to the database.' as status;
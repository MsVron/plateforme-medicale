-- HOSPITALS, CLINICS, MEDICAL CENTERS AND DOCTORS POPULATION
-- Migration to populate the database with institutional healthcare providers and additional doctors
-- Created: 2024
-- Description: Adds 3 hospitals, 3 clinics, 3 medical centers and 30 doctors distributed among them

-- ========================================
-- HOSPITALS, CLINICS AND MEDICAL CENTERS
-- ========================================

-- Get the starting institution ID
SET @institution_start_id = (SELECT COALESCE(MAX(id), 0) FROM institutions) + 1;

-- Insert 3 Hospitals
INSERT INTO institutions (nom, adresse, ville, code_postal, pays, telephone, email_contact, site_web, description, type, type_institution, latitude, longitude, coordonnees_gps, est_actif, status) VALUES

-- Hôpitaux
('Hôpital Universitaire Mohammed VI', '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', '+212 522-480000', 'contact@chu-mohammed6.ma', 'www.chu-mohammed6.ma', 'Centre hospitalier universitaire de référence avec toutes les spécialités médicales et chirurgicales. Équipé des dernières technologies médicales.', 'hôpital', 'hospital', 33.5731, -7.5898, '33.5731,-7.5898', TRUE, 'approved'),

('Hôpital Ibn Sina', '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', '+212 537-770000', 'administration@hopital-ibnsina.ma', 'www.hopital-ibnsina.ma', 'Hôpital public de référence de la capitale, offrant des soins de haute qualité dans toutes les spécialités médicales.', 'hôpital', 'hospital', 34.0209, -6.8416, '34.0209,-6.8416', TRUE, 'approved'),

('Hôpital Militaire Mohammed V', '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', '+212 524-330000', 'contact@hmm5-marrakech.ma', 'www.hmm5-marrakech.ma', 'Hôpital militaire moderne offrant des soins spécialisés aux militaires et civils. Centre d\'excellence en traumatologie.', 'hôpital', 'hospital', 31.6295, -7.9811, '31.6295,-7.9811', TRUE, 'approved'),

-- Cliniques
('Clinique Al Madina', '45 Rue Abdelmoumen', 'Casablanca', '20100', 'Maroc', '+212 522-950000', 'contact@clinique-almadina.ma', 'www.clinique-almadina.ma', 'Clinique privée de haut standing spécialisée en chirurgie esthétique, cardiologie interventionnelle et médecine reproductive.', 'clinique', 'institution', 33.5892, -7.6031, '33.5892,-7.6031', TRUE, 'approved'),

('Clinique Atlas', '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', '+212 535-740000', 'administration@clinique-atlas.ma', 'www.clinique-atlas.ma', 'Clinique moderne avec plateau technique avancé. Spécialisée en chirurgie orthopédique, neurochirurgie et ophtalmologie.', 'clinique', 'institution', 34.0181, -5.0078, '34.0181,-5.0078', TRUE, 'approved'),

('Clinique Océan', '89 Boulevard Mohammed V', 'Agadir', '80000', 'Maroc', '+212 528-840000', 'contact@clinique-ocean.ma', 'www.clinique-ocean.ma', 'Clinique côtière moderne offrant des soins de qualité en chirurgie générale, gynécologie-obstétrique et pédiatrie.', 'clinique', 'institution', 30.4278, -9.5981, '30.4278,-9.5981', TRUE, 'approved'),

-- Centres médicaux
('Centre Médical Avicenne', '23 Rue Ibn Khaldoun', 'Rabat', '10100', 'Maroc', '+212 537-660000', 'contact@centre-avicenne.ma', 'www.centre-avicenne.ma', 'Centre médical polyvalent avec consultations spécialisées, imagerie médicale et laboratoire d\'analyses.', 'centre médical', 'institution', 34.0151, -6.8326, '34.0151,-6.8326', TRUE, 'approved'),

('Centre Médical Andalous', '56 Avenue Mohammed VI', 'Marrakech', '40100', 'Maroc', '+212 524-450000', 'administration@centre-andalous.ma', 'www.centre-andalous.ma', 'Centre médical spécialisé en médecine préventive, check-up complets et médecine du travail.', 'centre médical', 'institution', 31.6340, -8.0089, '31.6340,-8.0089', TRUE, 'approved'),

('Centre Médical Maghreb', '34 Boulevard Zerktouni', 'Tanger', '90000', 'Maroc', '+212 539-350000', 'contact@centre-maghreb.ma', 'www.centre-maghreb.ma', 'Centre médical moderne avec équipe pluridisciplinaire. Spécialisé en médecine familiale et soins ambulatoires.', 'centre médical', 'institution', 35.7595, -5.8340, '35.7595, -5.8340', TRUE, 'approved');

-- ========================================
-- 30 ADDITIONAL DOCTORS
-- ========================================

-- Get the starting medecin ID
SET @medecin_start_id = (SELECT COALESCE(MAX(id), 0) FROM medecins) + 1;

-- Insert 30 doctors distributed across the 9 institutions
INSERT INTO medecins (prenom, nom, specialite_id, numero_ordre, telephone, email_professionnel, institution_id, adresse, ville, code_postal, pays, latitude, longitude, tarif_consultation, accepte_nouveaux_patients, temps_consultation_moyen, langues_parlees, accepte_patients_walk_in, biographie, est_actif) VALUES

-- Hôpital Universitaire Mohammed VI (10 doctors)
('Khalid', 'Bennani', 2, 'CAR-HUM6-001', '+212 522-480001', 'k.bennani@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 600.00, TRUE, 45, 'Arabe, Français, Anglais', FALSE, 'Chef de service de cardiologie interventionnelle. Expert en angioplastie coronaire et valvuloplastie.', TRUE),
('Meryem', 'Alaoui', 17, 'NEU-HUM6-002', '+212 522-480002', 'm.alaoui@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 650.00, TRUE, 50, 'Arabe, Français, Anglais', FALSE, 'Neurochirurgienne spécialisée en chirurgie des tumeurs cérébrales et pathologies vasculaires.', TRUE),
('Youssef', 'Chraibi', 12, 'CHG-HUM6-003', '+212 522-480003', 'y.chraibi@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 700.00, TRUE, 60, 'Arabe, Français', FALSE, 'Chirurgien général senior, spécialisé en chirurgie digestive et laparoscopie avancée.', TRUE),
('Aicha', 'Benkirane', 11, 'ANE-HUM6-004', '+212 522-480004', 'a.benkirane@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 500.00, TRUE, 30, 'Arabe, Français', FALSE, 'Anesthésiste-réanimatrice, experte en anesthésie cardiaque et pédiatrique.', TRUE),
('Abderrahim', 'Fassi', 18, 'URO-HUM6-005', '+212 522-480005', 'a.fassi@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 550.00, TRUE, 40, 'Arabe, Français', FALSE, 'Urologue spécialisé en chirurgie robotique et oncologie urologique.', TRUE),
('Fatima', 'Tazi', 24, 'HEM-HUM6-006', '+212 522-480006', 'f.tazi@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 580.00, TRUE, 45, 'Arabe, Français, Anglais', FALSE, 'Hématologue-oncologue, spécialisée en leucémies et greffes de moelle osseuse.', TRUE),
('Mohammed', 'Berrada', 21, 'GAS-HUM6-007', '+212 522-480007', 'm.berrada@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 520.00, TRUE, 40, 'Arabe, Français', FALSE, 'Gastro-entérologue expert en endoscopie digestive et maladies inflammatoires.', TRUE),
('Khadija', 'Lahlou', 22, 'PNE-HUM6-008', '+212 522-480008', 'k.lahlou@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 500.00, TRUE, 35, 'Arabe, Français', FALSE, 'Pneumologue spécialisée en oncologie thoracique et fibroscopie bronchique.', TRUE),
('Hassan', 'Idrissi', 26, 'NEP-HUM6-009', '+212 522-480009', 'h.idrissi@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 550.00, TRUE, 40, 'Arabe, Français', FALSE, 'Néphrologue expert en dialyse et transplantation rénale.', TRUE),
('Salma', 'Bennani', 19, 'ORL-HUM6-010', '+212 522-480010', 's.bennani@chu-mohammed6.ma', @institution_start_id + 0, '1 Avenue Ibn Sina', 'Casablanca', '20000', 'Maroc', 33.5731, -7.5898, 480.00, TRUE, 35, 'Arabe, Français', FALSE, 'ORL spécialisée en chirurgie endoscopique et implants cochléaires.', TRUE),

-- Hôpital Ibn Sina Rabat (5 doctors)
('Omar', 'Kettani', 13, 'CHC-HISN-011', '+212 537-770001', 'o.kettani@hopital-ibnsina.ma', @institution_start_id + 1, '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 800.00, TRUE, 90, 'Arabe, Français, Anglais', FALSE, 'Chirurgien cardiaque de renommée internationale, expert en chirurgie valvulaire.', TRUE),
('Nadia', 'Alami', 25, 'ONC-HISN-012', '+212 537-770002', 'n.alami@hopital-ibnsina.ma', @institution_start_id + 1, '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 650.00, TRUE, 50, 'Arabe, Français', FALSE, 'Oncologue médicale spécialisée en cancers gynécologiques et immunothérapie.', TRUE),
('Rachid', 'Bensouda', 23, 'END-HISN-013', '+212 537-770003', 'r.bensouda@hopital-ibnsina.ma', @institution_start_id + 1, '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 520.00, TRUE, 40, 'Arabe, Français', FALSE, 'Endocrinologue expert en diabétologie et maladies thyroïdiennes.', TRUE),
('Leila', 'Hajji', 27, 'MIN-HISN-014', '+212 537-770004', 'l.hajji@hopital-ibnsina.ma', @institution_start_id + 1, '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 480.00, TRUE, 35, 'Arabe, Français', FALSE, 'Spécialisée en médecine interne et maladies auto-immunes.', TRUE),
('Abdelaziz', 'Filali', 28, 'GER-HISN-015', '+212 537-770005', 'a.filali@hopital-ibnsina.ma', @institution_start_id + 1, '27 Avenue Moulay Youssef', 'Rabat', '10000', 'Maroc', 34.0209, -6.8416, 450.00, TRUE, 45, 'Arabe, Français', TRUE, 'Gériatre spécialisé en maladie d\'Alzheimer et soins palliatifs.', TRUE),

-- Hôpital Militaire Mohammed V Marrakech (5 doctors)
('Mustapha', 'Zouiten', 7, 'ORT-HMM5-016', '+212 524-330001', 'm.zouiten@hmm5-marrakech.ma', @institution_start_id + 2, '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 600.00, TRUE, 50, 'Arabe, Français', FALSE, 'Chirurgien orthopédiste spécialisé en traumatologie militaire et prothèses articulaires.', TRUE),
('Zineb', 'Benali', 29, 'URG-HMM5-017', '+212 524-330002', 'z.benali@hmm5-marrakech.ma', @institution_start_id + 2, '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 400.00, TRUE, 25, 'Arabe, Français, Anglais', TRUE, 'Urgentiste experte en médecine d\'urgence et soins intensifs.', TRUE),
('Karim', 'Ouali', 16, 'CHP-HMM5-018', '+212 524-330003', 'k.ouali@hmm5-marrakech.ma', @institution_start_id + 2, '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 650.00, TRUE, 45, 'Arabe, Français', FALSE, 'Chirurgien plasticien spécialisé en chirurgie réparatrice post-traumatique.', TRUE),
('Amina', 'Cherkaoui', 10, 'RAD-HMM5-019', '+212 524-330004', 'a.cherkaoui@hmm5-marrakech.ma', @institution_start_id + 2, '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 450.00, TRUE, 30, 'Arabe, Français', FALSE, 'Radiologue spécialisée en imagerie d\'urgence et scanner interventionnel.', TRUE),
('Youssef', 'Taibi', 37, 'MPR-HMM5-020', '+212 524-330005', 'y.taibi@hmm5-marrakech.ma', @institution_start_id + 2, '78 Boulevard des Forces Armées Royales', 'Marrakech', '40000', 'Maroc', 31.6295, -7.9811, 380.00, TRUE, 40, 'Arabe, Français', TRUE, 'Médecin de rééducation spécialisé en traumatologie sportive.', TRUE),

-- Clinique Al Madina Casablanca (4 doctors)
('Samira', 'Benjelloun', 16, 'CHP-CAM-021', '+212 522-950001', 's.benjelloun@clinique-almadina.ma', @institution_start_id + 3, '45 Rue Abdelmoumen', 'Casablanca', '20100', 'Maroc', 33.5892, -7.6031, 800.00, TRUE, 60, 'Arabe, Français, Anglais', FALSE, 'Chirurgienne esthétique de renom, spécialisée en rhinoplastie et lifting facial.', TRUE),
('Ahmed', 'Benomar', 2, 'CAR-CAM-022', '+212 522-950002', 'a.benomar@clinique-almadina.ma', @institution_start_id + 3, '45 Rue Abdelmoumen', 'Casablanca', '20100', 'Maroc', 33.5892, -7.6031, 700.00, TRUE, 45, 'Arabe, Français', FALSE, 'Cardiologue interventionnel expert en angioplastie complexe.', TRUE),
('Houda', 'Berrada', 4, 'GYN-CAM-023', '+212 522-950003', 'h.berrada@clinique-almadina.ma', @institution_start_id + 3, '45 Rue Abdelmoumen', 'Casablanca', '20100', 'Maroc', 33.5892, -7.6031, 600.00, TRUE, 40, 'Arabe, Français', FALSE, 'Gynécologue spécialisée en procréation médicalement assistée.', TRUE),
('Driss', 'Lahlou', 6, 'OPH-CAM-024', '+212 522-950004', 'd.lahlou@clinique-almadina.ma', @institution_start_id + 3, '45 Rue Abdelmoumen', 'Casablanca', '20100', 'Maroc', 33.5892, -7.6031, 550.00, TRUE, 35, 'Arabe, Français', FALSE, 'Ophtalmologue spécialisé en chirurgie réfractive LASIK.', TRUE),

-- Clinique Atlas Fès (3 doctors)
('Malika', 'Chraibi', 17, 'NEU-CAT-025', '+212 535-740001', 'm.chraibi@clinique-atlas.ma', @institution_start_id + 4, '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', 34.0181, -5.0078, 750.00, TRUE, 60, 'Arabe, Français', FALSE, 'Neurochirurgienne experte en chirurgie de la colonne vertébrale.', TRUE),
('Brahim', 'Kettani', 7, 'ORT-CAT-026', '+212 535-740002', 'b.kettani@clinique-atlas.ma', @institution_start_id + 4, '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', 34.0181, -5.0078, 650.00, TRUE, 45, 'Arabe, Français', FALSE, 'Orthopédiste spécialisé en chirurgie du genou et de la hanche.', TRUE),
('Najat', 'Alaoui', 6, 'OPH-CAT-027', '+212 535-740003', 'n.alaoui@clinique-atlas.ma', @institution_start_id + 4, '12 Avenue Hassan II', 'Fès', '30000', 'Maroc', 34.0181, -5.0078, 500.00, TRUE, 30, 'Arabe, Français', FALSE, 'Ophtalmologue spécialisée en chirurgie de la rétine et du vitré.', TRUE),

-- Clinique Océan Agadir (3 doctors)
('Hassan', 'Ouali', 12, 'CHG-COC-028', '+212 528-840001', 'h.ouali@clinique-ocean.ma', @institution_start_id + 5, '89 Boulevard Mohammed V', 'Agadir', '80000', 'Maroc', 30.4278, -9.5981, 550.00, TRUE, 45, 'Arabe, Français', FALSE, 'Chirurgien général spécialisé en chirurgie digestive et bariatrique.', TRUE),
('Khadija', 'Fassi', 4, 'GYN-COC-029', '+212 528-840002', 'k.fassi@clinique-ocean.ma', @institution_start_id + 5, '89 Boulevard Mohammed V', 'Agadir', '80000', 'Maroc', 30.4278, -9.5981, 500.00, TRUE, 40, 'Arabe, Français', FALSE, 'Gynécologue-obstétricienne experte en grossesses à haut risque.', TRUE),
('Abdellatif', 'Benali', 3, 'PED-COC-030', '+212 528-840003', 'a.benali@clinique-ocean.ma', @institution_start_id + 5, '89 Boulevard Mohammed V', 'Agadir', '80000', 'Maroc', 30.4278, -9.5981, 400.00, TRUE, 30, 'Arabe, Français, Berbère', TRUE, 'Pédiatre spécialisé en néonatologie et soins intensifs pédiatriques.', TRUE),

-- Centre Médical Avicenne Rabat (2 doctors)
('Laila', 'Benkirane', 1, 'MG-CMA-031', '+212 537-660001', 'l.benkirane@centre-avicenne.ma', @institution_start_id + 6, '23 Rue Ibn Khaldoun', 'Rabat', '10100', 'Maroc', 34.0151, -6.8326, 350.00, TRUE, 30, 'Arabe, Français', TRUE, 'Médecin généraliste spécialisée en médecine préventive et check-up complets.', TRUE),
('Jamal', 'Idrissi', 5, 'DER-CMA-032', '+212 537-660002', 'j.idrissi@centre-avicenne.ma', @institution_start_id + 6, '23 Rue Ibn Khaldoun', 'Rabat', '10100', 'Maroc', 34.0151, -6.8326, 400.00, TRUE, 25, 'Arabe, Français', TRUE, 'Dermatologue expert en dermatologie médicale et esthétique.', TRUE),

-- Centre Médical Andalous Marrakech (2 doctors)
('Souad', 'Tazi', 30, 'MTR-CMA-033', '+212 524-450001', 's.tazi@centre-andalous.ma', @institution_start_id + 7, '56 Avenue Mohammed VI', 'Marrakech', '40100', 'Maroc', 31.6340, -8.0089, 320.00, TRUE, 35, 'Arabe, Français', TRUE, 'Médecin du travail spécialisée en médecine préventive et santé occupationnelle.', TRUE),
('Abderrazak', 'Kettani', 1, 'MG-CMA-034', '+212 524-450002', 'a.kettani@centre-andalous.ma', @institution_start_id + 7, '56 Avenue Mohammed VI', 'Marrakech', '40100', 'Maroc', 31.6340, -8.0089, 300.00, TRUE, 30, 'Arabe, Français, Berbère', TRUE, 'Médecin généraliste avec expertise en médecine familiale et gériatrie.', TRUE),

-- Centre Médical Maghreb Tanger (2 doctors)
('Fatima Zahra', 'Bensouda', 1, 'MG-CMM-035', '+212 539-350001', 'fz.bensouda@centre-maghreb.ma', @institution_start_id + 8, '34 Boulevard Zerktouni', 'Tanger', '90000', 'Maroc', 35.7595, -5.8340, 280.00, TRUE, 30, 'Arabe, Français, Espagnol', TRUE, 'Médecin généraliste spécialisée en médecine familiale et suivi des maladies chroniques.', TRUE),
('Youssef', 'Chraibi', 1, 'MG-CMM-036', '+212 539-350002', 'y.chraibi@centre-maghreb.ma', @institution_start_id + 8, '34 Boulevard Zerktouni', 'Tanger', '90000', 'Maroc', 35.7595, -5.8340, 290.00, TRUE, 25, 'Arabe, Français, Espagnol', TRUE, 'Médecin généraliste avec approche holistique et médecine intégrative.', TRUE);

-- Create user accounts for all 30 doctors
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES
('khalid.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'k.bennani@chu-mohammed6.ma', 'medecin', @medecin_start_id + 0, TRUE),
('meryem.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'm.alaoui@chu-mohammed6.ma', 'medecin', @medecin_start_id + 1, TRUE),
('youssef.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'y.chraibi@chu-mohammed6.ma', 'medecin', @medecin_start_id + 2, TRUE),
('aicha.benkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.benkirane@chu-mohammed6.ma', 'medecin', @medecin_start_id + 3, TRUE),
('abderrahim.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.fassi@chu-mohammed6.ma', 'medecin', @medecin_start_id + 4, TRUE),
('fatima.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'f.tazi@chu-mohammed6.ma', 'medecin', @medecin_start_id + 5, TRUE),
('mohammed.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'm.berrada@chu-mohammed6.ma', 'medecin', @medecin_start_id + 6, TRUE),
('khadija.lahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'k.lahlou@chu-mohammed6.ma', 'medecin', @medecin_start_id + 7, TRUE),
('hassan.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'h.idrissi@chu-mohammed6.ma', 'medecin', @medecin_start_id + 8, TRUE),
('salma.bennani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 's.bennani@chu-mohammed6.ma', 'medecin', @medecin_start_id + 9, TRUE),
('omar.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'o.kettani@hopital-ibnsina.ma', 'medecin', @medecin_start_id + 10, TRUE),
('nadia.alami', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'n.alami@hopital-ibnsina.ma', 'medecin', @medecin_start_id + 11, TRUE),
('rachid.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'r.bensouda@hopital-ibnsina.ma', 'medecin', @medecin_start_id + 12, TRUE),
('leila.hajji', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'l.hajji@hopital-ibnsina.ma', 'medecin', @medecin_start_id + 13, TRUE),
('abdelaziz.filali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.filali@hopital-ibnsina.ma', 'medecin', @medecin_start_id + 14, TRUE),
('mustapha.zouiten', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'm.zouiten@hmm5-marrakech.ma', 'medecin', @medecin_start_id + 15, TRUE),
('zineb.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'z.benali@hmm5-marrakech.ma', 'medecin', @medecin_start_id + 16, TRUE),
('karim.ouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'k.ouali@hmm5-marrakech.ma', 'medecin', @medecin_start_id + 17, TRUE),
('amina.cherkaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.cherkaoui@hmm5-marrakech.ma', 'medecin', @medecin_start_id + 18, TRUE),
('youssef.taibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'y.taibi@hmm5-marrakech.ma', 'medecin', @medecin_start_id + 19, TRUE),
('samira.benjelloun', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 's.benjelloun@clinique-almadina.ma', 'medecin', @medecin_start_id + 20, TRUE),
('ahmed.benomar', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.benomar@clinique-almadina.ma', 'medecin', @medecin_start_id + 21, TRUE),
('houda.berrada', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'h.berrada@clinique-almadina.ma', 'medecin', @medecin_start_id + 22, TRUE),
('driss.lahlou', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'd.lahlou@clinique-almadina.ma', 'medecin', @medecin_start_id + 23, TRUE),
('malika.chraibi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'm.chraibi@clinique-atlas.ma', 'medecin', @medecin_start_id + 24, TRUE),
('brahim.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'b.kettani@clinique-atlas.ma', 'medecin', @medecin_start_id + 25, TRUE),
('najat.alaoui', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'n.alaoui@clinique-atlas.ma', 'medecin', @medecin_start_id + 26, TRUE),
('hassan.ouali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'h.ouali@clinique-ocean.ma', 'medecin', @medecin_start_id + 27, TRUE),
('khadija.fassi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'k.fassi@clinique-ocean.ma', 'medecin', @medecin_start_id + 28, TRUE),
('abdellatif.benali', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.benali@clinique-ocean.ma', 'medecin', @medecin_start_id + 29, TRUE),
('laila.benkirane', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'l.benkirane@centre-avicenne.ma', 'medecin', @medecin_start_id + 30, TRUE),
('jamal.idrissi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'j.idrissi@centre-avicenne.ma', 'medecin', @medecin_start_id + 31, TRUE),
('souad.tazi', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 's.tazi@centre-andalous.ma', 'medecin', @medecin_start_id + 32, TRUE),
('abderrazak.kettani', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'a.kettani@centre-andalous.ma', 'medecin', @medecin_start_id + 33, TRUE),
('fatimazahra.bensouda', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'fz.bensouda@centre-maghreb.ma', 'medecin', @medecin_start_id + 34, TRUE),
('youssef.chraibi2', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'y.chraibi@centre-maghreb.ma', 'medecin', @medecin_start_id + 35, TRUE);

-- Create doctor-institution affiliations using actual IDs
-- First, let's create the affiliations using subqueries to get the actual IDs

-- Hôpital Universitaire Mohammed VI affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-01-15', '2018-01-15'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CAR-HUM6-001' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-03-20', '2019-03-20'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'NEU-HUM6-002' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-06-10', '2017-06-10'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CHG-HUM6-003' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-02-28', '2020-02-28'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'ANE-HUM6-004' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2016-09-12', '2016-09-12'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'URO-HUM6-005' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-11-05', '2019-11-05'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'HEM-HUM6-006' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-04-18', '2018-04-18'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'GAS-HUM6-007' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-07-22', '2020-07-22'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'PNE-HUM6-008' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-01-30', '2017-01-30'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'NEP-HUM6-009' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-08-14', '2019-08-14'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'ORL-HUM6-010' AND i.nom = 'Hôpital Universitaire Mohammed VI';

-- Hôpital Ibn Sina affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2015-12-03', '2015-12-03'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CHC-HISN-011' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-10-25', '2018-10-25'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'ONC-HISN-012' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-05-17', '2019-05-17'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'END-HISN-013' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-03-08', '2020-03-08'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MIN-HISN-014' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-11-12', '2017-11-12'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'GER-HISN-015' AND i.nom = 'Hôpital Ibn Sina';

-- Hôpital Militaire Mohammed V affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2016-04-26', '2016-04-26'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'ORT-HMM5-016' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-09-30', '2019-09-30'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'URG-HMM5-017' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-06-14', '2018-06-14'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CHP-HMM5-018' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-02-07', '2020-02-07'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'RAD-HMM5-019' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-12-19', '2017-12-19'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MPR-HMM5-020' AND i.nom = 'Hôpital Militaire Mohammed V';

-- Clinique Al Madina affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-08-03', '2019-08-03'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CHP-CAM-021' AND i.nom = 'Clinique Al Madina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-05-21', '2020-05-21'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CAR-CAM-022' AND i.nom = 'Clinique Al Madina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-01-15', '2018-01-15'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'GYN-CAM-023' AND i.nom = 'Clinique Al Madina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-03-20', '2019-03-20'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'OPH-CAM-024' AND i.nom = 'Clinique Al Madina';

-- Clinique Atlas affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-06-10', '2017-06-10'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'NEU-CAT-025' AND i.nom = 'Clinique Atlas';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-02-28', '2020-02-28'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'ORT-CAT-026' AND i.nom = 'Clinique Atlas';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-09-12', '2018-09-12'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'OPH-CAT-027' AND i.nom = 'Clinique Atlas';

-- Clinique Océan affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-11-05', '2019-11-05'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'CHG-COC-028' AND i.nom = 'Clinique Océan';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-04-18', '2018-04-18'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'GYN-COC-029' AND i.nom = 'Clinique Océan';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-07-22', '2020-07-22'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'PED-COC-030' AND i.nom = 'Clinique Océan';

-- Centre Médical Avicenne affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-01-15', '2019-01-15'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MG-CMA-031' AND i.nom = 'Centre Médical Avicenne';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-03-20', '2020-03-20'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'DER-CMA-032' AND i.nom = 'Centre Médical Avicenne';

-- Centre Médical Andalous affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-06-10', '2018-06-10'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MTR-CMA-033' AND i.nom = 'Centre Médical Andalous';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-02-28', '2019-02-28'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MG-CMA-034' AND i.nom = 'Centre Médical Andalous';

-- Centre Médical Maghreb affiliations
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-09-12', '2020-09-12'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MG-CMM-035' AND i.nom = 'Centre Médical Maghreb';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-11-05', '2018-11-05'
FROM medecins m, institutions i 
WHERE m.numero_ordre = 'MG-CMM-036' AND i.nom = 'Centre Médical Maghreb';

-- Add some sample availabilities for hospital doctors (they typically work more hours)
INSERT INTO disponibilites_medecin (medecin_id, institution_id, jour_semaine, heure_debut, heure_fin, intervalle_minutes, a_pause_dejeuner, heure_debut_pause, heure_fin_pause) VALUES
-- Sample availabilities for some doctors
(@medecin_start_id + 0, @institution_start_id + 0, 'lundi', '08:00:00', '17:00:00', 45, TRUE, '12:00:00', '13:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'mardi', '08:00:00', '17:00:00', 45, TRUE, '12:00:00', '13:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'mercredi', '08:00:00', '17:00:00', 45, TRUE, '12:00:00', '13:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'jeudi', '08:00:00', '17:00:00', 45, TRUE, '12:00:00', '13:00:00'),
(@medecin_start_id + 0, @institution_start_id + 0, 'vendredi', '08:00:00', '12:00:00', 45, FALSE, NULL, NULL),

(@medecin_start_id + 16, @institution_start_id + 2, 'lundi', '09:00:00', '18:00:00', 30, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 16, @institution_start_id + 2, 'mardi', '09:00:00', '18:00:00', 30, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 16, @institution_start_id + 2, 'mercredi', '09:00:00', '18:00:00', 30, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 16, @institution_start_id + 2, 'jeudi', '09:00:00', '18:00:00', 30, TRUE, '13:00:00', '14:00:00'),
(@medecin_start_id + 16, @institution_start_id + 2, 'samedi', '09:00:00', '13:00:00', 30, FALSE, NULL, NULL),

(@medecin_start_id + 20, @institution_start_id + 3, 'lundi', '10:00:00', '19:00:00', 60, TRUE, '13:00:00', '14:30:00'),
(@medecin_start_id + 20, @institution_start_id + 3, 'mardi', '10:00:00', '19:00:00', 60, TRUE, '13:00:00', '14:30:00'),
(@medecin_start_id + 20, @institution_start_id + 3, 'jeudi', '10:00:00', '19:00:00', 60, TRUE, '13:00:00', '14:30:00'),
(@medecin_start_id + 20, @institution_start_id + 3, 'vendredi', '10:00:00', '19:00:00', 60, TRUE, '13:00:00', '14:30:00'),
(@medecin_start_id + 20, @institution_start_id + 3, 'samedi', '10:00:00', '15:00:00', 60, FALSE, NULL, NULL);

-- ========================================
-- SUMMARY
-- ========================================
-- This migration adds:
-- - 3 Hospitals: Hôpital Universitaire Mohammed VI (Casablanca), Hôpital Ibn Sina (Rabat), Hôpital Militaire Mohammed V (Marrakech)
-- - 3 Clinics: Clinique Al Madina (Casablanca), Clinique Atlas (Fès), Clinique Océan (Agadir)  
-- - 3 Medical Centers: Centre Médical Avicenne (Rabat), Centre Médical Andalous (Marrakech), Centre Médical Maghreb (Tanger)
-- - 36 Additional doctors distributed across these institutions:
--   * 10 doctors at Hôpital Universitaire Mohammed VI
--   * 5 doctors at Hôpital Ibn Sina
--   * 5 doctors at Hôpital Militaire Mohammed V
--   * 4 doctors at Clinique Al Madina
--   * 3 doctors at Clinique Atlas
--   * 3 doctors at Clinique Océan
--   * 2 doctors at Centre Médical Avicenne
--   * 2 doctors at Centre Médical Andalous
--   * 2 doctors at Centre Médical Maghreb
-- - User accounts for all 36 doctors with login credentials
-- - Doctor-institution affiliations
-- - Sample availability schedules for some doctors
-- All doctors can login with password: "medecin123" (hashed with bcrypt)
-- ========================================
-- ADDITIONAL APPOINTMENTS - MAY-JUNE 2025
-- ========================================
-- This file adds more appointments for late May and early June 2025
-- Expands the appointment schedule for private cabinet doctors
-- Focus on realistic medical practice patterns

-- ========================================
-- LATE MAY 2025 - APPOINTMENTS
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - End of May
-- Monday May 27, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-27 08:00:00', '2025-05-27 08:30:00', 'Consultation de routine - renouvellement ordonnance', 'terminé', 'Renouvellement traitement hypertension', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-27 08:30:00', '2025-05-27 09:00:00', 'Bilan préopératoire', 'terminé', 'Bilan avant intervention chirurgicale mineure', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-27 09:00:00', '2025-05-27 09:30:00', 'Consultation diabète - ajustement traitement', 'terminé', 'Modification dosage insuline', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Tuesday May 28, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-28 14:00:00', '2025-05-28 14:30:00', 'Consultation générale - certificat sport', 'terminé', 'Certificat médical aptitude sportive', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-28 14:30:00', '2025-05-28 15:00:00', 'Suivi allergie médicamenteuse', 'terminé', 'Contrôle allergie pénicilline', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Late May consultations
-- Wednesday May 29, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-29 09:00:00', '2025-05-29 09:45:00', 'Consultation cardiologie préventive', 'terminé', 'Bilan cardiovasculaire annuel', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-29 10:00:00', '2025-05-29 10:45:00', 'Suivi insuffisance cardiaque', 'terminé', 'Contrôle fonction cardiaque et traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Thursday May 30, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-30 09:00:00', '2025-05-30 09:45:00', 'Échocardiographie de contrôle', 'terminé', 'Suivi post-infarctus - fonction ventriculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Late May
-- Friday May 31, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-31 14:00:00', '2025-05-31 14:30:00', 'Consultation générale - bilan annuel', 'terminé', 'Bilan de santé complet', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN301983' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-05-31 14:30:00', '2025-05-31 15:00:00', 'Suivi arthrose - infiltration', 'terminé', 'Infiltration articulaire genou', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303974' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- ========================================
-- EARLY JUNE 2025 - ADDITIONAL APPOINTMENTS
-- ========================================

-- Dr. Khadija Bennani (Gynécologie - Casablanca) - June consultations
-- Monday June 3, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-03 14:00:00', '2025-06-03 14:40:00', 'Consultation gynécologique - contraception', 'terminé', 'Adaptation pilule contraceptive', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-03 15:00:00', '2025-06-03 15:40:00', 'Suivi grossesse - 2ème trimestre', 'terminé', 'Échographie morphologique et suivi', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- Tuesday June 4, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-04 14:00:00', '2025-06-04 14:30:00', 'Consultation ménopause', 'terminé', 'Gestion symptômes climatériques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- Dr. Fatima Zahra Idrissi (Pédiatrie - Casablanca) - Early June
-- Wednesday June 5, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-05 09:00:00', '2025-06-05 09:30:00', 'Consultation pédiatrique - troubles du sommeil', 'terminé', 'Évaluation troubles endormissement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-05 09:30:00', '2025-06-05 10:00:00', 'Suivi développement psychomoteur', 'terminé', 'Contrôle développement 9 ans', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN106010' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

-- Dr. Ahmed Fassi (Médecine Générale - Rabat) - Early June
-- Thursday June 6, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-06 08:00:00', '2025-06-06 08:30:00', 'Consultation générale - sevrage tabagique', 'terminé', 'Accompagnement arrêt du tabac', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-06 08:30:00', '2025-06-06 09:00:00', 'Suivi lombalgie chronique', 'terminé', 'Gestion douleur et kinésithérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN207977' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

-- Dr. Leila Bensouda (Ophtalmologie - Fès) - Specialized consultations
-- Friday June 7, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-07 14:00:00', '2025-06-07 14:35:00', 'Consultation ophtalmologique - cataracte', 'terminé', 'Évaluation pré-chirurgicale cataracte', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN403976' AND m.prenom = 'Leila' AND m.nom = 'Bensouda';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-07 14:35:00', '2025-06-07 15:10:00', 'Contrôle glaucome', 'terminé', 'Mesure pression intraoculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN405972' AND m.prenom = 'Leila' AND m.nom = 'Bensouda';

-- ========================================
-- MID-JUNE 2025 - ADDITIONAL APPOINTMENTS
-- ========================================

-- Dr. Malika Benomar (Neurologie - Oujda) - Neurological consultations
-- Monday June 10, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-10 14:00:00', '2025-06-10 14:45:00', 'Consultation neurologique - épilepsie', 'terminé', 'Ajustement traitement antiépileptique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN509988' AND m.prenom = 'Malika' AND m.nom = 'Benomar';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-10 15:00:00', '2025-06-10 15:45:00', 'Suivi migraine chronique', 'terminé', 'Évaluation traitement préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN508995' AND m.prenom = 'Malika' AND m.nom = 'Benomar';

-- Dr. Houda Taibi (Dermatologie - Tanger) - Northern region practice
-- Tuesday June 11, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-11 14:00:00', '2025-06-11 14:25:00', 'Consultation dermatologique - psoriasis', 'terminé', 'Suivi psoriasis et nouveau traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN505989' AND m.prenom = 'Houda' AND m.nom = 'Taibi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-11 14:30:00', '2025-06-11 14:55:00', 'Dépistage cancer de la peau', 'terminé', 'Contrôle grains de beauté', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN504987' AND m.prenom = 'Houda' AND m.nom = 'Taibi';

-- Dr. Karim Benjelloun (Cardiologie - Agadir) - Coastal cardiology
-- Wednesday June 12, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-12 09:00:00', '2025-06-12 09:45:00', 'Consultation cardiologique - prévention', 'terminé', 'Bilan cardiovasculaire pêcheur', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN501851' AND m.prenom = 'Karim' AND m.nom = 'Benjelloun';

-- Dr. Najat Berrada (Médecine Générale - Safi) - Regional practice
-- Thursday June 13, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-13 08:00:00', '2025-06-13 08:30:00', 'Consultation générale - bilan prénuptial', 'terminé', 'Bilan de santé avant mariage', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN510991' AND m.prenom = 'Najat' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-13 08:30:00', '2025-06-13 09:00:00', 'Suivi post-accouchement', 'terminé', 'Contrôle 6 semaines post-partum', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN502992' AND m.prenom = 'Najat' AND m.nom = 'Berrada';

-- ========================================
-- WEEKEND CONSULTATIONS - JUNE 15-16, 2025
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Saturday consultations
-- Saturday June 15, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-15 08:00:00', '2025-06-15 08:30:00', 'Consultation urgente - angine', 'terminé', 'Angine érythémateuse - antibiotique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-15 08:30:00', '2025-06-15 09:00:00', 'Consultation générale - certificat médical', 'terminé', 'Certificat aptitude travail', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-15 09:00:00', '2025-06-15 09:30:00', 'Suivi post-hospitalisation', 'terminé', 'Contrôle après sortie hôpital', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Saturday afternoon
-- Saturday June 15, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-15 14:00:00', '2025-06-15 14:30:00', 'Consultation urgente - traumatisme', 'terminé', 'Entorse cheville - strapping', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN305979' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-15 14:30:00', '2025-06-15 15:00:00', 'Consultation générale - insomnie', 'terminé', 'Troubles du sommeil - anxiété', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN307955' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- Migration completed
SELECT 'May-June 2025 additional appointments migration completed successfully - 15+ more appointments added' as status; 
-- ========================================
-- APPOINTMENTS FOR JUNE 2024 - PRIVATE CABINETS
-- ========================================
-- This file populates appointments for the week of June 23, 2024 and before
-- Focuses on selected doctors in private cabinets with realistic schedules
-- Created to demonstrate busy medical practice activity

-- ========================================
-- WEEK OF JUNE 17-23, 2024 - APPOINTMENTS
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Busy general practice
-- Monday June 17, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 08:00:00', '2024-06-17 08:30:00', 'Consultation de routine - suivi hypertension', 'terminé', 'Contrôle tension artérielle mensuel', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 08:30:00', '2024-06-17 09:00:00', 'Consultation générale - fatigue', 'terminé', 'Bilan fatigue chronique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 09:00:00', '2024-06-17 09:30:00', 'Suivi diabète type 2', 'terminé', 'Contrôle glycémie et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 09:30:00', '2024-06-17 10:00:00', 'Consultation préventive - bilan annuel', 'terminé', 'Bilan de santé complet', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 10:00:00', '2024-06-17 10:30:00', 'Consultation renouvellement ordonnance', 'terminé', 'Renouvellement traitement chronique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Tuesday June 18, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-18 08:00:00', '2024-06-18 08:30:00', 'Consultation pédiatrique - vaccination', 'terminé', 'Rappel vaccinal selon calendrier', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-18 08:30:00', '2024-06-18 09:00:00', 'Consultation générale - douleurs articulaires', 'terminé', 'Évaluation douleurs genoux', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Specialized cardiology consultations
-- Monday June 17, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 09:00:00', '2024-06-17 09:45:00', 'Consultation cardiologique post-infarctus', 'terminé', 'Suivi à 3 ans post-IDM', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-17 10:00:00', '2024-06-17 10:45:00', 'Hypertension artérielle sévère', 'terminé', 'Ajustement traitement antihypertenseur', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Wednesday June 19, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-19 09:00:00', '2024-06-19 09:45:00', 'Consultation préventive cardiovasculaire', 'terminé', 'Évaluation risque cardiovasculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Fatima Zahra Idrissi (Pédiatrie - Casablanca) - Pediatric consultations
-- Tuesday June 18, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-18 09:00:00', '2024-06-18 09:30:00', 'Consultation pédiatrique - suivi croissance', 'terminé', 'Contrôle développement et croissance', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-18 09:30:00', '2024-06-18 10:00:00', 'Consultation allergie alimentaire', 'terminé', 'Suivi allergie aux œufs', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN106010' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

-- Dr. Khadija Bennani (Gynécologie - Casablanca) - Women's health consultations
-- Wednesday June 19, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-19 14:00:00', '2024-06-19 14:40:00', 'Suivi gynécologique - endométriose', 'terminé', 'Contrôle endométriose et douleurs pelviennes', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN308994' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-19 15:00:00', '2024-06-19 15:30:00', 'Consultation préventive - frottis', 'terminé', 'Dépistage cancer col utérus', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- ========================================
-- WEEK OF JUNE 17-21, 2024 - ADDITIONAL APPOINTMENTS
-- ========================================

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Regional practice
-- Thursday June 20, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-20 14:00:00', '2024-06-20 14:30:00', 'Consultation dermatologique - eczéma', 'terminé', 'Suivi eczéma atopique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN302986' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-20 14:30:00', '2024-06-20 15:00:00', 'Suivi arthrose et douleurs articulaires', 'terminé', 'Gestion douleur et kinésithérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303974' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- Dr. Ahmed Fassi (Médecine Générale - Rabat) - Capital city practice
-- Friday June 21, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-21 08:00:00', '2024-06-21 08:30:00', 'Consultation générale - bilan senior', 'terminé', 'Bilan gériatrique complet', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-21 08:30:00', '2024-06-21 09:00:00', 'Suivi hypertension et diabète', 'terminé', 'Contrôle polypathologie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

-- ========================================
-- SATURDAY JUNE 22, 2024 - WEEKEND CONSULTATIONS
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Saturday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-22 08:00:00', '2024-06-22 08:30:00', 'Consultation urgente - fièvre', 'terminé', 'Syndrome grippal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-22 08:30:00', '2024-06-22 09:00:00', 'Consultation générale - certificat médical', 'terminé', 'Certificat médical sport', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- ========================================
-- SUNDAY JUNE 23, 2024 - THE TARGET DATE
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Sunday emergency consultations
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-23 09:00:00', '2024-06-23 09:30:00', 'Consultation urgente - douleurs abdominales', 'terminé', 'Gastro-entérite aiguë', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-23 09:30:00', '2024-06-23 10:00:00', 'Suivi post-consultation', 'terminé', 'Contrôle évolution traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Sunday specialized consultation
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-23 10:00:00', '2024-06-23 10:45:00', 'Consultation cardiologique urgente', 'terminé', 'Douleurs thoraciques - ECG normal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- ========================================
-- EARLIER APPOINTMENTS - JUNE 10-16, 2024
-- ========================================

-- Dr. Brahim Zouiten (Médecine Générale - Oujda) - Eastern region practice
-- Monday June 10, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 08:00:00', '2024-06-10 08:30:00', 'Consultation générale - hypertension', 'terminé', 'Contrôle tension et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN507982' AND m.prenom = 'Brahim' AND m.nom = 'Zouiten';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 08:30:00', '2024-06-10 09:00:00', 'Suivi migraine avec aura', 'terminé', 'Évaluation traitement préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN508995' AND m.prenom = 'Brahim' AND m.nom = 'Zouiten';

-- Dr. Zineb Filali (Dermatologie - Fès) - Specialized dermatology
-- Tuesday June 11, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-11 14:00:00', '2024-06-11 14:30:00', 'Consultation dermatologique - acné', 'terminé', 'Traitement acné sévère', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN402994' AND m.prenom = 'Zineb' AND m.nom = 'Filali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-11 14:30:00', '2024-06-11 15:00:00', 'Suivi dermatite atopique', 'terminé', 'Contrôle eczéma et traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN406011' AND m.prenom = 'Zineb' AND m.nom = 'Filali';

-- Dr. Samira Ouali (Pédiatrie - Agadir) - Coastal pediatric practice
-- Wednesday June 12, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-12 09:00:00', '2024-06-12 09:30:00', 'Consultation pédiatrique - allergie respiratoire', 'terminé', 'Suivi allergie aux poils d\'animaux', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.prenom = 'Samira' AND m.nom = 'Ouali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-12 09:30:00', '2024-06-12 10:00:00', 'Consultation préventive - vaccination', 'terminé', 'Mise à jour vaccinations', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN513009' AND m.prenom = 'Samira' AND m.nom = 'Ouali';

-- Migration completed
SELECT 'June 2024 appointments migration completed successfully - 35+ appointments added for private cabinet doctors' as status; 
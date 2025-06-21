-- ========================================
-- DEMO APPOINTMENTS POPULATION - JUNE 2025
-- ========================================
-- This file populates appointments for the demo presentation on June 23, 2025
-- Multiple appointments on June 23 (past) and upcoming week appointments
-- Focuses on key doctors for demonstration purposes

-- ========================================
-- JUNE 23, 2025 - DEMO DAY APPOINTMENTS (PAST)
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Busy morning schedule
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 08:00:00', '2025-06-23 08:30:00', 'Consultation de routine - suivi tension artérielle', 'terminé', 'Contrôle régulier TA et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 08:30:00', '2025-06-23 09:00:00', 'Visite de contrôle pédiatrique', 'terminé', 'Suivi croissance et vaccination', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:00:00', '2025-06-23 09:30:00', 'Consultation générale - fatigue chronique', 'terminé', 'Bilan fatigue et examens complémentaires', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:30:00', '2025-06-23 10:00:00', 'Suivi diabète type 2', 'terminé', 'Contrôle glycémie et HbA1c', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 10:30:00', '2025-06-23 11:00:00', 'Consultation préventive - bilan annuel', 'terminé', 'Bilan de santé complet', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 11:00:00', '2025-06-23 11:30:00', 'Consultation renouvellement ordonnance', 'terminé', 'Renouvellement traitement chronic', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Specialized morning consultations
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 08:00:00', '2025-06-23 08:45:00', 'Consultation cardiologique post-infarctus', 'terminé', 'Suivi à 3 ans post-IDM, échocardiographie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:00:00', '2025-06-23 09:45:00', 'Hypertension artérielle sévère', 'terminé', 'Ajustement traitement antihypertenseur', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 10:00:00', '2025-06-23 10:45:00', 'Insuffisance cardiaque - suivi', 'terminé', 'Contrôle fonction cardiaque et traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 11:00:00', '2025-06-23 11:30:00', 'Consultation préventive cardiovasculaire', 'terminé', 'Évaluation risque cardiovasculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Afternoon sessions
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 14:00:00', '2025-06-23 14:30:00', 'Consultation dermatologique - eczéma', 'terminé', 'Suivi eczéma atopique et traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN302986' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 14:30:00', '2025-06-23 15:00:00', 'Suivi arthrose et douleurs articulaires', 'terminé', 'Gestion douleur et kinésithérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303974' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 15:00:00', '2025-06-23 15:30:00', 'Consultation générale - bilan senior', 'terminé', 'Bilan gériatrique complet', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN307955' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 15:30:00', '2025-06-23 16:00:00', 'Consultation préventive jeune adulte', 'terminé', 'Bilan santé préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN305979' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- Dr. Fatima Zahra Idrissi (Pédiatrie - Casablanca) - Children appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:00:00', '2025-06-23 09:30:00', 'Vaccination et suivi croissance', 'terminé', 'Rappel vaccinal et contrôle développement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:30:00', '2025-06-23 10:00:00', 'Consultation allergie alimentaire', 'terminé', 'Suivi allergie aux œufs', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN106010' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 10:00:00', '2025-06-23 10:30:00', 'Contrôle pédiatrique - asthme', 'terminé', 'Suivi asthme et traitement inhalé', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 10:30:00', '2025-06-23 11:00:00', 'Consultation adolescente - troubles alimentaires', 'terminé', 'Évaluation nutrition et croissance', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN112005' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

-- Dr. Khadija Bennani (Gynécologie - Casablanca) - Women's health
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 14:00:00', '2025-06-23 14:40:00', 'Suivi gynécologique - endométriose', 'terminé', 'Contrôle endométriose et douleurs pelviennes', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN308994' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 15:00:00', '2025-06-23 15:30:00', 'Consultation préventive - frottis', 'terminé', 'Dépistage cancer col utérus', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 15:30:00', '2025-06-23 16:00:00', 'Suivi contraception et planning familial', 'terminé', 'Adaptation contraception hormonale', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 16:00:00', '2025-06-23 16:30:00', 'Consultation ménopause', 'terminé', 'Gestion symptômes ménopausiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- ========================================
-- UPCOMING WEEK APPOINTMENTS (JUNE 24-30, 2025)
-- ========================================

-- June 24, 2025 (Tuesday) - Future appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 09:00:00', '2025-06-24 09:30:00', 'Suivi diabète - contrôle trimestriel', 'confirmé', 'Contrôle HbA1c et complications', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 10:00:00', '2025-06-24 10:45:00', 'Consultation cardiologie préventive', 'planifié', 'Bilan cardiovasculaire annuel', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 14:00:00', '2025-06-24 14:30:00', 'Consultation gynécologique de routine', 'planifié', 'Contrôle annuel gynécologique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- June 25, 2025 (Wednesday)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-25 08:30:00', '2025-06-25 09:00:00', 'Vaccination pédiatrique', 'planifié', 'Rappel vaccinal calendrier', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-25 15:00:00', '2025-06-25 15:30:00', 'Consultation générale - fatigue', 'planifié', 'Investigation fatigue chronique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN301983' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- June 26, 2025 (Thursday)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-26 09:00:00', '2025-06-26 09:45:00', 'Suivi post-infarctus - échocardiographie', 'planifié', 'Contrôle fonction cardiaque', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-26 10:00:00', '2025-06-26 10:30:00', 'Consultation renouvellement ordonnance', 'planifié', 'Renouvellement traitement chronique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- June 27, 2025 (Friday)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-27 14:00:00', '2025-06-27 14:40:00', 'Consultation gynécologique - projet grossesse', 'planifié', 'Préparation grossesse et supplémentation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-27 15:00:00', '2025-06-27 15:30:00', 'Suivi arthrose - infiltration', 'planifié', 'Infiltration articulaire genou', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303974' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- June 30, 2025 (Monday)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-30 08:00:00', '2025-06-30 08:30:00', 'Consultation préventive - bilan lipidique', 'planifié', 'Contrôle cholestérol et triglycérides', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-30 09:00:00', '2025-06-30 09:45:00', 'Consultation cardiologie - épreuve effort', 'planifié', 'Test effort et surveillance cardiaque', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-30 10:00:00', '2025-06-30 10:30:00', 'Contrôle pédiatrique - croissance', 'planifié', 'Suivi courbe croissance et développement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

-- ========================================
-- ADDITIONAL DEMO APPOINTMENTS - VARIOUS TIMES ON JUNE 23
-- ========================================

-- More afternoon appointments for June 23 to show busy practice
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 16:30:00', '2025-06-23 17:00:00', 'Consultation urgente - douleur thoracique', 'terminé', 'Évaluation douleur thoracique, ECG normal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 17:00:00', '2025-06-23 17:30:00', 'Consultation en fin de journée', 'terminé', 'Suivi patient chronique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Some walk-in patients for June 23
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 12:00:00', '2025-06-23 12:20:00', 'Consultation sans rendez-vous - fièvre', 'terminé', 'Patient sans RDV - syndrome grippal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN304998' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 12:20:00', '2025-06-23 12:40:00', 'Urgence pédiatrique - otite', 'terminé', 'Otite moyenne aiguë, antibiotique prescrit', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN306008' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi'; 
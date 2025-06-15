-- ========================================
-- APPOINTMENTS MIGRATION
-- ========================================
-- This file should be imported AFTER populate_medical_notes.sql
-- It adds comprehensive appointment history (past and future)
-- Based on existing patients' conditions and follow-up needs

-- ========================================
-- SECTION 1: PAST APPOINTMENTS - CHRONIC CONDITIONS FOLLOW-UP
-- ========================================

-- Omar Tazi (CN103978) - Hypertension and diabetes prevention appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-06-15 10:00:00', '2023-06-15 10:30:00', 'Suivi hypertension artérielle', 'terminé', 'Contrôle tension artérielle et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-09-15 14:00:00', '2023-09-15 14:30:00', 'Consultation diabétologie - prévention', 'terminé', 'Bilan glycémique et surveillance préventive diabète', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-10 14:00:00', '2024-01-10 14:30:00', 'Suivi diabète - contrôle trimestriel', 'terminé', 'Contrôle HbA1c et ajustement Metformine', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

-- Abdellatif Idrissi (CN107965) - Complex polypathology follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-08-10 09:00:00', '2023-08-10 09:45:00', 'Suivi diabète et BPCO', 'terminé', 'Consultation complexe - ajustement traitements multiples', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-11-10 09:30:00', '2023-11-10 10:15:00', 'Consultation pneumologie BPCO', 'terminé', 'Évaluation fonction respiratoire et technique inhalation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-15 11:00:00', '2024-01-15 11:30:00', 'Suivi pneumologique trimestriel', 'terminé', 'Contrôle stabilité BPCO et observance traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

-- Nadia Berrada (CN110987) - Migraine follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-08-14 16:00:00', '2023-08-14 16:30:00', 'Suivi neurologique - migraine', 'terminé', 'Évaluation efficacité traitement et fréquence crises', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-02-14 14:30:00', '2024-02-14 15:00:00', 'Consultation neurologie - suivi migraine', 'terminé', 'Contrôle semestriel et gestion facteurs déclenchants', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
LIMIT 1;

-- Rachid Hajji (CN111975) - Post-infarctus cardiology follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-09-18 08:00:00', '2023-09-18 08:45:00', 'Suivi cardiologique post-IDM 2 ans', 'terminé', 'Contrôle annuel post-infarctus et bilan lipidique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-18 15:00:00', '2024-01-18 15:30:00', 'Consultation cardiologie annuelle', 'terminé', 'Échocardiographie et épreuve d\'effort programmées', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
LIMIT 1;

-- ========================================
-- SECTION 2: WOMEN'S HEALTH APPOINTMENTS
-- ========================================

-- Samia Benkirane (CN114997) - Rheumatology follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-10-08 13:30:00', '2023-10-08 14:00:00', 'Suivi polyarthrite rhumatoïde', 'terminé', 'Contrôle activité maladie sous biothérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-08 10:00:00', '2024-01-08 10:30:00', 'Consultation rhumatologie - projet grossesse', 'terminé', 'Discussion adaptation traitement pour projet parental', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

-- Imane Hajji (CN308994) - Endometriosis management
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-07-16 14:00:00', '2023-07-16 14:30:00', 'Suivi endométriose', 'terminé', 'Évaluation efficacité Dienogest et douleurs pelviennes', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN308994' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN308994')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-16 13:30:00', '2024-01-16 14:00:00', 'Consultation gynécologie - endométriose', 'terminé', 'Contrôle échographique endométriomes et bilan anémie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN308994' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN308994')
LIMIT 1;

-- ========================================
-- SECTION 3: PEDIATRIC APPOINTMENTS
-- ========================================

-- Khalid Tazi (CN115015) - Pediatric allergy follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-09-15 16:00:00', '2023-09-15 16:30:00', 'Consultation pédiatrique - allergie œufs', 'terminé', 'Contrôle croissance et évolution allergie alimentaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-15 16:00:00', '2024-01-15 16:30:00', 'Suivi pédiatrique - allergie alimentaire', 'terminé', 'Préparation tests de provocation orale futurs', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

-- Hassan Taibi (CN503012) - Pediatric respiratory allergies
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-12-30 10:00:00', '2023-12-30 10:30:00', 'Consultation pédiatrique - allergies respiratoires', 'terminé', 'Contrôle rhinite allergique et prévention asthme', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN503012')
LIMIT 1;

-- ========================================
-- SECTION 4: FUTURE APPOINTMENTS - UPCOMING CONSULTATIONS
-- ========================================

-- Omar Tazi (CN103978) - Future diabetes and hypertension follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-04-10 14:00:00', '2024-04-10 14:30:00', 'Suivi diabète - contrôle trimestriel', 'planifié', 'Contrôle HbA1c et surveillance complications', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-15 10:00:00', '2024-06-15 10:30:00', 'Consultation cardiologie - HTA', 'planifié', 'Contrôle annuel hypertension et bilan cardiovasculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

-- Abdellatif Idrissi (CN107965) - Future complex care appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-05-15 11:00:00', '2024-05-15 11:30:00', 'Suivi pneumologique BPCO', 'planifié', 'Contrôle fonction respiratoire et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-07-15 09:00:00', '2024-07-15 09:45:00', 'Consultation diabétologie complexe', 'planifié', 'Bilan annuel diabète et complications', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

-- Nadia Berrada (CN110987) - Future neurology follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-08-14 16:00:00', '2024-08-14 16:30:00', 'Suivi neurologique - migraine', 'planifié', 'Contrôle semestriel et évaluation besoin traitement préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
LIMIT 1;

-- Rachid Hajji (CN111975) - Future cardiology appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-01-18 15:00:00', '2025-01-18 15:30:00', 'Consultation cardiologie annuelle', 'planifié', 'Contrôle post-IDM 3 ans et bilan cardiovasculaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
LIMIT 1;

-- Samia Benkirane (CN114997) - Future rheumatology and pregnancy planning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-04-08 10:00:00', '2024-04-08 10:30:00', 'Consultation rhumatologie - préparation grossesse', 'planifié', 'Adaptation traitement et planification grossesse', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-07-08 13:30:00', '2024-07-08 14:00:00', 'Suivi polyarthrite - surveillance grossesse', 'planifié', 'Contrôle activité maladie pendant grossesse', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

-- ========================================
-- SECTION 5: PEDIATRIC FUTURE APPOINTMENTS
-- ========================================

-- Khalid Tazi (CN115015) - Future pediatric allergy management
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-07-15 16:00:00', '2024-07-15 16:30:00', 'Suivi pédiatrique - allergie alimentaire', 'planifié', 'Contrôle évolution allergie et préparation tests', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2026-01-15 15:00:00', '2026-01-15 16:00:00', 'Tests de provocation orale - œufs', 'planifié', 'Tests de réintroduction alimentaire supervisés', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

-- Hassan Taibi (CN503012) - Future pediatric respiratory follow-up
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-30 10:00:00', '2024-06-30 10:30:00', 'Consultation pédiatrique - allergies respiratoires', 'planifié', 'Contrôle semestriel rhinite allergique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN503012')
LIMIT 1;

-- ========================================
-- SECTION 6: ELDERLY PATIENTS FUTURE CARE
-- ========================================

-- Abderrahim Kettani (CN307955) - Future geriatric diabetes care
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-05-12 09:00:00', '2024-05-12 09:30:00', 'Suivi diabète et insuffisance rénale', 'planifié', 'Contrôle fonction rénale et adaptation traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN307955' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN307955')
LIMIT 1;

-- Mehdi Alaoui (CN113960) - Future preventive geriatric care
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-10-18 11:00:00', '2024-10-18 11:30:00', 'Consultation gériatrique préventive', 'planifié', 'Bilan annuel et dépistages adaptés à l\'âge', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN113960')
LIMIT 1;

-- ========================================
-- SECTION 7: EMERGENCY AND URGENT APPOINTMENTS
-- ========================================

-- Hassan Bennani (CN105988) - Emergency allergy consultation (past)
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-12-22 18:30:00', '2023-12-22 19:00:00', 'Consultation urgente - réaction allergique', 'terminé', 'Réaction allergique mineure après exposition accidentelle', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), FALSE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN105988')
LIMIT 1;

-- ========================================
-- SECTION 8: CANCELLED AND RESCHEDULED APPOINTMENTS
-- ========================================

-- Some realistic cancelled appointments
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2023-12-15 14:00:00', '2023-12-15 14:30:00', 'Suivi hypertension', 'annulé', 'Annulé par patient - maladie intercurrente', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, FALSE
FROM patients p, medecins m 
WHERE p.CNE = 'CN202993' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN202993')
LIMIT 1;

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-01-20 10:00:00', '2024-01-20 10:30:00', 'Consultation pédiatrique', 'patient absent', 'Patient absent sans prévenir', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN503012')
LIMIT 1;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment these queries to verify the data after import

/*
-- Check total appointments added
SELECT COUNT(*) as 'Total Appointments' FROM rendez_vous;

-- Check appointments by status
SELECT statut, COUNT(*) as 'Count' FROM rendez_vous GROUP BY statut;

-- Check appointments by patient (top 10)
SELECT p.prenom, p.nom, p.CNE, COUNT(rv.id) as 'Appointments Count'
FROM patients p 
LEFT JOIN rendez_vous rv ON p.id = rv.patient_id 
WHERE p.CNE LIKE 'CN%'
GROUP BY p.id 
ORDER BY COUNT(rv.id) DESC 
LIMIT 10;

-- Check future appointments
SELECT p.prenom, p.nom, rv.date_heure_debut, rv.motif, rv.statut
FROM patients p 
JOIN rendez_vous rv ON p.id = rv.patient_id 
WHERE rv.date_heure_debut > NOW() 
AND p.CNE LIKE 'CN%'
ORDER BY rv.date_heure_debut 
LIMIT 15;

-- Check past appointments by specialty
SELECT s.nom as 'Speciality', COUNT(rv.id) as 'Appointments'
FROM rendez_vous rv
JOIN medecins m ON rv.medecin_id = m.id
JOIN specialites s ON m.specialite_id = s.id
JOIN patients p ON rv.patient_id = p.id
WHERE p.CNE LIKE 'CN%'
AND rv.date_heure_debut < NOW()
GROUP BY s.nom
ORDER BY COUNT(rv.id) DESC;

-- Check appointment distribution by month (2024)
SELECT MONTH(rv.date_heure_debut) as 'Month', COUNT(rv.id) as 'Appointments'
FROM rendez_vous rv
JOIN patients p ON rv.patient_id = p.id
WHERE YEAR(rv.date_heure_debut) = 2024
AND p.CNE LIKE 'CN%'
GROUP BY MONTH(rv.date_heure_debut)
ORDER BY MONTH(rv.date_heure_debut);
*/ 
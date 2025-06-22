-- ========================================
-- APPOINTMENTS FOR END OF JUNE 2024 - PRIVATE CABINETS
-- ========================================
-- This file populates appointments for June 24-30, 2024
-- Completes the month of June for private cabinet doctors
-- Focus on realistic end-of-month medical practice patterns

-- ========================================
-- MONDAY JUNE 24, 2024 - START OF FINAL WEEK
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Monday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 08:00:00', '2024-06-24 08:30:00', 'Consultation post-urgence - suivi', 'terminé', 'Contrôle après consultation urgente dimanche', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 08:30:00', '2024-06-24 09:00:00', 'Consultation diabète - bilan mensuel', 'terminé', 'Contrôle HbA1c et ajustement traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 09:00:00', '2024-06-24 09:30:00', 'Consultation générale - bilan lipidique', 'terminé', 'Résultats analyses et conseils diététiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 14:00:00', '2024-06-24 14:30:00', 'Consultation générale - certificat médical', 'terminé', 'Certificat aptitude professionnelle', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Monday specialized
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 10:00:00', '2024-06-24 10:45:00', 'Consultation cardiologie préventive', 'terminé', 'Bilan cardiovasculaire annuel', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Monday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-24 15:00:00', '2024-06-24 15:30:00', 'Consultation générale - allergies saisonnières', 'terminé', 'Traitement rhinite allergique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN304998' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- ========================================
-- TUESDAY JUNE 25, 2024
-- ========================================

-- Dr. Fatima Zahra Idrissi (Pédiatrie - Casablanca) - Tuesday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-25 08:30:00', '2024-06-25 09:00:00', 'Vaccination pédiatrique - rappels', 'terminé', 'Mise à jour calendrier vaccinal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-25 09:00:00', '2024-06-25 09:30:00', 'Consultation pédiatrique - troubles alimentaires', 'terminé', 'Évaluation comportement alimentaire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN112005' AND m.prenom = 'Fatima Zahra' AND m.nom = 'Idrissi';

-- Dr. Khadija Bennani (Gynécologie - Casablanca) - Tuesday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-25 14:00:00', '2024-06-25 14:40:00', 'Consultation gynécologique - bilan annuel', 'terminé', 'Examen gynécologique complet et frottis', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- Dr. Ahmed Fassi (Médecine Générale - Rabat) - Tuesday evening
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-25 17:00:00', '2024-06-25 17:30:00', 'Consultation générale - fatigue chronique', 'terminé', 'Investigation fatigue et bilan thyroïdien', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN202993' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

-- ========================================
-- WEDNESDAY JUNE 26, 2024
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Wednesday busy schedule
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-26 08:00:00', '2024-06-26 08:30:00', 'Consultation renouvellement ordonnance', 'terminé', 'Renouvellement traitement chronique HTA', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-26 08:30:00', '2024-06-26 09:00:00', 'Consultation générale - bilan préopératoire', 'terminé', 'Bilan avant chirurgie ambulatoire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Wednesday specialized
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-26 09:00:00', '2024-06-26 09:45:00', 'Suivi post-infarctus - échocardiographie', 'terminé', 'Contrôle fonction cardiaque 3 ans post-IDM', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Zineb Filali (Dermatologie - Fès) - Wednesday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-26 14:30:00', '2024-06-26 15:00:00', 'Consultation dermatologique - acné sévère', 'terminé', 'Réévaluation traitement isotrétinoïne', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN402994' AND m.prenom = 'Zineb' AND m.nom = 'Filali';

-- ========================================
-- THURSDAY JUNE 27, 2024
-- ========================================

-- Dr. Khadija Bennani (Gynécologie - Casablanca) - Thursday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-27 09:00:00', '2024-06-27 09:40:00', 'Consultation gynécologique - projet grossesse', 'terminé', 'Préparation grossesse et supplémentation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Khadija' AND m.nom = 'Bennani';

-- Dr. Brahim Zouiten (Médecine Générale - Oujda) - Thursday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-27 08:00:00', '2024-06-27 08:30:00', 'Consultation générale - suivi hypothyroïdie', 'terminé', 'Contrôle TSH et ajustement Levothyrox', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN512986' AND m.prenom = 'Brahim' AND m.nom = 'Zouiten';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-27 08:30:00', '2024-06-27 09:00:00', 'Consultation générale - bilan annuel enseignant', 'terminé', 'Bilan de santé professionnel', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN507982' AND m.prenom = 'Brahim' AND m.nom = 'Zouiten';

-- Dr. Leila Bensouda (Ophtalmologie - Fès) - Thursday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-27 15:00:00', '2024-06-27 15:35:00', 'Consultation post-opératoire cataracte', 'terminé', 'Contrôle J+15 chirurgie cataracte', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN403976' AND m.prenom = 'Leila' AND m.nom = 'Bensouda';

-- ========================================
-- FRIDAY JUNE 28, 2024
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Friday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-28 08:00:00', '2024-06-28 08:30:00', 'Consultation générale - sevrage tabagique', 'terminé', 'Suivi arrêt tabac et substituts nicotiniques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-28 08:30:00', '2024-06-28 09:00:00', 'Consultation générale - douleurs lombaires', 'terminé', 'Lombalgie chronique et kinésithérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Friday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-28 14:00:00', '2024-06-28 14:30:00', 'Consultation générale - bilan préventif', 'terminé', 'Bilan de santé jeune adulte', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN305979' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- Dr. Samira Ouali (Pédiatrie - Agadir) - Friday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-28 09:00:00', '2024-06-28 09:30:00', 'Consultation pédiatrique - asthme d\'effort', 'terminé', 'Ajustement traitement inhalé avant été', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN513009' AND m.prenom = 'Samira' AND m.nom = 'Ouali';

-- ========================================
-- SATURDAY JUNE 29, 2024 - WEEKEND COVERAGE
-- ========================================

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Saturday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-29 08:00:00', '2024-06-29 08:30:00', 'Consultation urgente - otite aiguë', 'terminé', 'Otite moyenne aiguë - antibiothérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-29 08:30:00', '2024-06-29 09:00:00', 'Consultation générale - certificat voyage', 'terminé', 'Certificat médical aptitude voyage', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Hassan Berrada (Médecine Générale - Marrakech) - Saturday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-29 14:00:00', '2024-06-29 14:30:00', 'Consultation urgente - crise d\'asthme', 'terminé', 'Exacerbation asthme - nébulisation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN306008' AND m.prenom = 'Hassan' AND m.nom = 'Berrada';

-- ========================================
-- SUNDAY JUNE 30, 2024 - END OF MONTH
-- ========================================

-- Dr. Omar Tazi (Cardiologie - Casablanca) - Sunday emergency
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-30 10:00:00', '2024-06-30 10:45:00', 'Consultation cardiologique urgente', 'terminé', 'Palpitations et douleurs thoraciques - ECG normal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Omar' AND m.nom = 'Tazi';

-- Dr. Amina Benali (Médecine Générale - Casablanca) - Sunday morning
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-30 09:00:00', '2024-06-30 09:30:00', 'Consultation urgente - gastro-entérite', 'terminé', 'Gastro-entérite aiguë - réhydratation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Dr. Ahmed Fassi (Médecine Générale - Rabat) - Sunday afternoon
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-30 15:00:00', '2024-06-30 15:30:00', 'Consultation urgente - hypertension sévère', 'terminé', 'Poussée hypertensive - ajustement urgent', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Ahmed' AND m.nom = 'Fassi';

-- ========================================
-- ADDITIONAL APPOINTMENTS - CATCHING UP
-- ========================================

-- Dr. Malika Benomar (Neurologie - Oujda) - End of month follow-ups
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-28 14:00:00', '2024-06-28 14:45:00', 'Consultation neurologique - suivi épilepsie', 'terminé', 'Contrôle EEG et ajustement antiépileptiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN509988' AND m.prenom = 'Malika' AND m.nom = 'Benomar';

-- Dr. Houda Taibi (Dermatologie - Tanger) - End of month consultations
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-27 14:00:00', '2024-06-27 14:25:00', 'Consultation dermatologique - mélanome screening', 'terminé', 'Dépistage systématique cancer peau', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN504987' AND m.prenom = 'Houda' AND m.nom = 'Taibi';

-- Dr. Najat Berrada (Médecine Générale - Safi) - End of month
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-29 08:00:00', '2024-06-29 08:30:00', 'Consultation générale - bilan grossesse', 'terminé', 'Suivi grossesse 1er trimestre', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN510991' AND m.prenom = 'Najat' AND m.nom = 'Berrada';

-- Migration completed
SELECT 'End of June 2024 appointments migration completed successfully - 30+ appointments added for June 24-30' as status; 
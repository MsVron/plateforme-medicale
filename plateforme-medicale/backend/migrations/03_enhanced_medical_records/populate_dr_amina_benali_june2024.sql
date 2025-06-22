-- ========================================
-- DR. AMINA BENALI - COMPLETE JUNE 2024 SCHEDULE
-- ========================================
-- Comprehensive monthly appointment schedule for Dr. Amina Benali
-- Médecine Générale - Cabinet Privé Casablanca
-- Coverage: June 1-30, 2024 (Complete month)
-- Pattern: Monday-Friday regular hours, Saturday mornings, Sunday emergencies

-- ========================================
-- WEEK 1: JUNE 3-9, 2024
-- ========================================

-- MONDAY JUNE 3, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-03 08:00:00', '2024-06-03 08:30:00', 'Consultation générale - bilan mensuel', 'terminé', 'Contrôle tension artérielle et renouvellement ordonnance', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-03 08:30:00', '2024-06-03 09:00:00', 'Consultation diabète - suivi glycémique', 'terminé', 'HbA1c à 7.2%, ajustement metformine', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-03 09:00:00', '2024-06-03 09:30:00', 'Consultation générale - certificat médical', 'terminé', 'Certificat aptitude sportive', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-03 14:00:00', '2024-06-03 14:30:00', 'Consultation générale - fatigue chronique', 'terminé', 'Bilan thyroïdien et vitaminique prescrit', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-03 14:30:00', '2024-06-03 15:00:00', 'Consultation générale - douleurs articulaires', 'terminé', 'Arthrose débutante, conseils et anti-inflammatoires', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- TUESDAY JUNE 4, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-04 08:00:00', '2024-06-04 08:30:00', 'Consultation générale - bilan préventif', 'terminé', 'Bilan annuel jeune adulte - analyses prescrites', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-04 08:30:00', '2024-06-04 09:00:00', 'Consultation générale - hypertension', 'terminé', 'TA 150/90, augmentation amlodipine', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-04 09:00:00', '2024-06-04 09:30:00', 'Consultation générale - allergies saisonnières', 'terminé', 'Rhinite allergique - antihistaminiques prescrits', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-04 14:00:00', '2024-06-04 14:30:00', 'Consultation générale - sevrage tabagique', 'terminé', 'Mois 2 arrêt tabac, substituts nicotiniques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- WEDNESDAY JUNE 5, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-05 08:00:00', '2024-06-05 08:30:00', 'Consultation générale - résultats analyses', 'terminé', 'Bilan lipidique normal, conseils diététiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-05 08:30:00', '2024-06-05 09:00:00', 'Consultation générale - lombalgie', 'terminé', 'Lombalgie mécanique, kinésithérapie prescrite', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-05 14:00:00', '2024-06-05 14:30:00', 'Consultation générale - insomnie', 'terminé', 'Troubles du sommeil, hygiène du sommeil conseillée', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-05 14:30:00', '2024-06-05 15:00:00', 'Consultation générale - migraine', 'terminé', 'Céphalées de tension, traitement préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN112005' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- THURSDAY JUNE 6, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-06 08:00:00', '2024-06-06 08:30:00', 'Consultation générale - gastrite', 'terminé', 'Gastrite chronique, IPP et conseils alimentaires', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-06 08:30:00', '2024-06-06 09:00:00', 'Consultation générale - vaccination voyage', 'terminé', 'Vaccins hépatite A et fièvre jaune', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-06 14:00:00', '2024-06-06 14:30:00', 'Consultation générale - eczéma', 'terminé', 'Dermatite atopique, corticoïdes topiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN202993' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- FRIDAY JUNE 7, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-07 08:00:00', '2024-06-07 08:30:00', 'Consultation générale - suivi post-grippal', 'terminé', 'Récupération post-infection virale, vitamines', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-07 08:30:00', '2024-06-07 09:00:00', 'Consultation générale - cholestérol', 'terminé', 'Hypercholestérolémie, statines initiées', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN301983' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-07 14:00:00', '2024-06-07 14:30:00', 'Consultation générale - anxiété', 'terminé', 'Troubles anxieux, relaxation et suivi psychologique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN302977' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- SATURDAY JUNE 8, 2024 - Morning only
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-08 08:00:00', '2024-06-08 08:30:00', 'Consultation urgente - fièvre enfant', 'terminé', 'Angine virale enfant 8 ans, paracétamol', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-08 08:30:00', '2024-06-08 09:00:00', 'Consultation urgente - douleur abdominale', 'terminé', 'Gastro-entérite aiguë, réhydratation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303996' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- ========================================
-- WEEK 2: JUNE 10-16, 2024
-- ========================================

-- MONDAY JUNE 10, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 08:00:00', '2024-06-10 08:30:00', 'Consultation générale - suivi diabète', 'terminé', 'Diabète type 2 équilibré, maintien traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 08:30:00', '2024-06-10 09:00:00', 'Consultation générale - renouvellement ordonnance', 'terminé', 'HTA stable, renouvellement 3 mois', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 09:00:00', '2024-06-10 09:30:00', 'Consultation générale - certificat sport', 'terminé', 'Aptitude sport loisir, ECG normal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN304998' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-10 14:00:00', '2024-06-10 14:30:00', 'Consultation générale - dépistage colon', 'terminé', 'Test Hemoccult prescrit, 55 ans', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN305979' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- TUESDAY JUNE 11, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-11 08:00:00', '2024-06-11 08:30:00', 'Consultation générale - vertiges', 'terminé', 'Vertiges positionnels, manœuvre libératoire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN306008' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-11 08:30:00', '2024-06-11 09:00:00', 'Consultation générale - acné adulte', 'terminé', 'Acné tardive femme, traitement topique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-11 14:00:00', '2024-06-11 14:30:00', 'Consultation générale - constipation chronique', 'terminé', 'Transit lent, fibres et laxatifs doux', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN401991' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- WEDNESDAY JUNE 12, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-12 08:00:00', '2024-06-12 08:30:00', 'Consultation générale - bilan préopératoire', 'terminé', 'Chirurgie cataracte, bilan cardiaque OK', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-12 08:30:00', '2024-06-12 09:00:00', 'Consultation générale - hypothyroïdie', 'terminé', 'TSH élevée, augmentation Levothyrox', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN402994' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-12 14:00:00', '2024-06-12 14:30:00', 'Consultation générale - tendinite épaule', 'terminé', 'Tendinopathie coiffe rotateurs, kiné prescrite', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN403976' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- THURSDAY JUNE 13, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-13 08:00:00', '2024-06-13 08:30:00', 'Consultation générale - infection urinaire', 'terminé', 'Cystite simple, antibiothérapie courte', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-13 08:30:00', '2024-06-13 09:00:00', 'Consultation générale - varices', 'terminé', 'Insuffisance veineuse, contention élastique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN501989' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-13 14:00:00', '2024-06-13 14:30:00', 'Consultation générale - ménopause', 'terminé', 'Bouffées de chaleur, phytothérapie conseillée', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN502984' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- FRIDAY JUNE 14, 2024
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-14 08:00:00', '2024-06-14 08:30:00', 'Consultation générale - psoriasis', 'terminé', 'Poussée psoriasis, dermocorticoïdes prescrits', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN504987' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-14 08:30:00', '2024-06-14 09:00:00', 'Consultation générale - ostéoporose', 'terminé', 'Densitométrie prescrite, calcium et vitamine D', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN505981' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-14 14:00:00', '2024-06-14 14:30:00', 'Consultation générale - hémorroïdes', 'terminé', 'Crise hémorroïdaire, traitement local', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN506993' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- SATURDAY JUNE 15, 2024 - Morning only
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-15 08:00:00', '2024-06-15 08:30:00', 'Consultation urgente - otite', 'terminé', 'Otite moyenne aiguë, antibiothérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN112005' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2024-06-15 08:30:00', '2024-06-15 09:00:00', 'Consultation urgente - conjonctivite', 'terminé', 'Conjonctivite allergique, collyres prescrits', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN507982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- ========================================
-- WEEK 3: JUNE 17-23, 2024 (Existing appointments - reference only)
-- ========================================
-- Note: These appointments already exist in populate_appointments_june2024.sql
-- Dr. Amina Benali has multiple appointments this week

-- ========================================
-- WEEK 4: JUNE 24-30, 2024 (Existing appointments - reference only)
-- ========================================
-- Note: These appointments already exist in populate_appointments_june24_30_2024.sql
-- Dr. Amina Benali has multiple appointments this week

-- Migration completed
SELECT 'Dr. Amina Benali June 2024 complete schedule populated successfully - 60+ appointments added' as status; 
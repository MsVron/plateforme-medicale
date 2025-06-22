-- ========================================
-- DR. AMINA BENALI - JUNE 2025 FOCUSED SCHEDULE
-- ========================================
-- Focused appointment schedule for Dr. Amina Benali
-- Médecine Générale - Cabinet Privé Casablanca (MG-CAS-001)
-- Email: dr.benali@cabinet-benali.ma
-- Focus: Weeks before and after June 23, 2025
-- Coverage: June 16-29, 2025 (2 weeks around June 23)

-- ========================================
-- WEEK BEFORE JUNE 23: JUNE 16-22, 2025
-- ========================================

-- MONDAY JUNE 16, 2025 - Week before target date
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-16 08:00:00', '2025-06-16 08:30:00', 'Consultation générale - bilan préventif', 'terminé', 'Bilan annuel 45 ans, analyses sanguines prescrites', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-16 08:30:00', '2025-06-16 09:00:00', 'Consultation diabète - suivi mensuel', 'terminé', 'Diabète type 2, HbA1c à 7.1%, bon équilibre', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-16 09:00:00', '2025-06-16 09:30:00', 'Consultation générale - hypertension', 'terminé', 'TA 140/85, ajustement posologie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-16 14:00:00', '2025-06-16 14:30:00', 'Consultation générale - certificat médical', 'terminé', 'Certificat aptitude professionnelle', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN102992' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-16 14:30:00', '2025-06-16 15:00:00', 'Consultation générale - fatigue chronique', 'terminé', 'Asthénie, bilan thyroïdien et ferritine', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN108990' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- TUESDAY JUNE 17, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-17 08:00:00', '2025-06-17 08:30:00', 'Consultation générale - allergies saisonnières', 'terminé', 'Rhinite allergique, antihistaminiques prescrits', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN109982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-17 08:30:00', '2025-06-17 09:00:00', 'Consultation générale - lombalgie', 'terminé', 'Douleurs lombaires, kinésithérapie prescrite', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-17 09:00:00', '2025-06-17 09:30:00', 'Consultation générale - migraine', 'terminé', 'Céphalées de tension, traitement préventif', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-17 14:00:00', '2025-06-17 14:30:00', 'Consultation générale - sevrage tabagique', 'terminé', 'Arrêt tabac mois 3, substituts nicotiniques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- WEDNESDAY JUNE 18, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-18 08:00:00', '2025-06-18 08:30:00', 'Consultation générale - gastrite', 'terminé', 'Gastrite chronique, IPP et conseils diététiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-18 08:30:00', '2025-06-18 09:00:00', 'Consultation générale - cholestérol', 'terminé', 'Hypercholestérolémie, statines efficaces', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-18 14:00:00', '2025-06-18 14:30:00', 'Consultation générale - anxiété', 'terminé', 'Troubles anxieux, relaxation et suivi', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN112005' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- THURSDAY JUNE 19, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-19 08:00:00', '2025-06-19 08:30:00', 'Consultation générale - vaccination voyage', 'terminé', 'Vaccins hépatite A et typhoïde pour voyage', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN201980' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-19 08:30:00', '2025-06-19 09:00:00', 'Consultation générale - hypothyroïdie', 'terminé', 'TSH normale, maintien Levothyrox', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-19 14:00:00', '2025-06-19 14:30:00', 'Consultation générale - eczéma', 'terminé', 'Dermatite atopique, corticoïdes topiques', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN202993' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- FRIDAY JUNE 20, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-20 08:00:00', '2025-06-20 08:30:00', 'Consultation générale - bilan préopératoire', 'terminé', 'Chirurgie programmée, bilan complet OK', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-20 08:30:00', '2025-06-20 09:00:00', 'Consultation générale - ostéoporose', 'terminé', 'Densitométrie, calcium et vitamine D', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN301983' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-20 14:00:00', '2025-06-20 14:30:00', 'Consultation générale - infection urinaire', 'terminé', 'Cystite récidivante, ECBU et traitement', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN302977' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- SATURDAY JUNE 21, 2025 - Weekend coverage
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-21 08:00:00', '2025-06-21 08:30:00', 'Consultation urgente - fièvre', 'terminé', 'Syndrome grippal, repos et paracétamol', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN303996' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-21 08:30:00', '2025-06-21 09:00:00', 'Consultation urgente - douleur abdominale', 'terminé', 'Gastro-entérite, réhydratation orale', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN304998' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- ========================================
-- MONDAY JUNE 23, 2025 - TARGET DATE
-- ========================================

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 08:00:00', '2025-06-23 08:30:00', 'Consultation générale - suivi diabète', 'terminé', 'Contrôle glycémique mensuel, équilibre satisfaisant', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 08:30:00', '2025-06-23 09:00:00', 'Consultation générale - renouvellement ordonnance', 'terminé', 'HTA stable, renouvellement traitement 3 mois', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 09:00:00', '2025-06-23 09:30:00', 'Consultation générale - certificat sport', 'terminé', 'Aptitude sport loisir, ECG normal', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN305979' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 14:00:00', '2025-06-23 14:30:00', 'Consultation générale - bilan annuel', 'terminé', 'Bilan de santé complet 50 ans', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN306008' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-23 14:30:00', '2025-06-23 15:00:00', 'Consultation générale - résultats analyses', 'terminé', 'Bilan lipidique et rénal, résultats normaux', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN401991' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- ========================================
-- WEEK AFTER JUNE 23: JUNE 24-29, 2025
-- ========================================

-- TUESDAY JUNE 24, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 08:00:00', '2025-06-24 08:30:00', 'Consultation générale - vertiges', 'terminé', 'Vertiges positionnels, manœuvre libératoire', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN402994' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 08:30:00', '2025-06-24 09:00:00', 'Consultation générale - constipation', 'terminé', 'Transit lent, fibres et laxatifs doux', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN403976' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-24 14:00:00', '2025-06-24 14:30:00', 'Consultation générale - tendinite', 'terminé', 'Tendinopathie épaule, kinésithérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN501989' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- WEDNESDAY JUNE 25, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-25 08:00:00', '2025-06-25 08:30:00', 'Consultation générale - varices', 'terminé', 'Insuffisance veineuse, contention élastique', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN502984' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-25 08:30:00', '2025-06-25 09:00:00', 'Consultation générale - ménopause', 'terminé', 'Bouffées de chaleur, phytothérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN504987' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-25 14:00:00', '2025-06-25 14:30:00', 'Consultation générale - psoriasis', 'terminé', 'Poussée psoriasis, dermocorticoïdes', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN505981' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- THURSDAY JUNE 26, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-26 08:00:00', '2025-06-26 08:30:00', 'Consultation générale - hémorroïdes', 'terminé', 'Crise hémorroïdaire, traitement local', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN506993' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-26 08:30:00', '2025-06-26 09:00:00', 'Consultation générale - insomnie', 'terminé', 'Troubles du sommeil, hygiène du sommeil', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN507982' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-26 14:00:00', '2025-06-26 14:30:00', 'Consultation générale - acné adulte', 'terminé', 'Acné tardive, traitement topique adapté', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN509988' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- FRIDAY JUNE 27, 2025
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-27 08:00:00', '2025-06-27 08:30:00', 'Consultation générale - suivi post-opératoire', 'terminé', 'Contrôle post-chirurgie J+7, cicatrisation OK', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN203970' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-27 08:30:00', '2025-06-27 09:00:00', 'Consultation générale - dépistage cancer', 'terminé', 'Mammographie et frottis prescrits', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN510991' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-27 14:00:00', '2025-06-27 14:30:00', 'Consultation générale - certificat voyage', 'terminé', 'Certificat médical aptitude voyage', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN512986' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- SATURDAY JUNE 28, 2025 - Weekend coverage
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-28 08:00:00', '2025-06-28 08:30:00', 'Consultation urgente - otite', 'terminé', 'Otite moyenne aiguë, antibiothérapie', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.prenom = 'Amina' AND m.nom = 'Benali';

INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-28 08:30:00', '2025-06-28 09:00:00', 'Consultation urgente - conjonctivite', 'terminé', 'Conjonctivite allergique, collyres', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN513009' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- SUNDAY JUNE 29, 2025 - Emergency coverage
INSERT INTO rendez_vous (patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, notes_patient, mode, createur_id, rappel_24h_envoye, rappel_1h_envoye) 
SELECT p.id, m.id, m.institution_id, '2025-06-29 09:00:00', '2025-06-29 09:30:00', 'Consultation urgente - crise d\'asthme', 'terminé', 'Exacerbation asthme, nébulisation', 'présentiel', 
       (SELECT id FROM utilisateurs WHERE role = 'medecin' AND id_specifique_role = m.id LIMIT 1), TRUE, TRUE
FROM patients p, medecins m 
WHERE p.CNE = 'CN104995' AND m.prenom = 'Amina' AND m.nom = 'Benali';

-- Migration completed
SELECT 'Dr. Amina Benali June 2025 focused schedule (weeks around 23/06/2025) populated successfully - 40+ appointments added' as status; 
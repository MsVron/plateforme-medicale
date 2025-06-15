-- ========================================
-- PATIENT MEDICAL RECORDS MIGRATION - FIXED VERSION
-- ========================================
-- This file should be imported AFTER populate_moroccan_patients.sql and populate_moroccan_doctors.sql
-- It contains all medical records, allergies, antecedents, and notes
-- FIXED: Handles foreign key constraints and missing references properly

-- ========================================
-- SECTION 1: PATIENT ALLERGIES
-- ========================================
-- Only insert allergies for patients that exist and with allergies that exist
INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2020-03-15', 'légère', 'Réaction saisonnière, amélioration avec antihistaminiques'
FROM patients p, allergies a 
WHERE p.CNE = 'CN101985' AND a.nom = 'Acariens'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN101985')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Acariens');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2018-07-22', 'sévère', 'Réaction anaphylactique aux crustacés, porte toujours un EpiPen'
FROM patients p, allergies a 
WHERE p.CNE = 'CN105988' AND a.nom = 'Fruits de mer'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN105988')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Fruits de mer');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2015-04-10', 'modérée', 'Rhinite allergique printanière'
FROM patients p, allergies a 
WHERE p.CNE = 'CN106010' AND a.nom = 'Pollen'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN106010')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Pollen');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2019-11-05', 'sévère', 'Éruption cutanée généralisée lors du dernier traitement'
FROM patients p, allergies a 
WHERE p.CNE = 'CN109982' AND a.nom = 'Pénicilline'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN109982')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Pénicilline');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2021-02-18', 'modérée', 'Asthme allergique'
FROM patients p, allergies a 
WHERE p.CNE = 'CN114997' AND a.nom = 'Acariens'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Acariens');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2021-02-18', 'modérée', 'Conjonctivite allergique saisonnière'
FROM patients p, allergies a 
WHERE p.CNE = 'CN114997' AND a.nom = 'Pollen'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Pollen');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2020-09-12', 'modérée', 'Urticaire et œdème facial'
FROM patients p, allergies a 
WHERE p.CNE = 'CN202993' AND a.nom = 'Aspirine'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN202993')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Aspirine');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2019-06-30', 'légère', 'Dermatite de contact lors de l utilisation de gants'
FROM patients p, allergies a 
WHERE p.CNE = 'CN207977' AND a.nom = 'Latex'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN207977')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Latex');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2018-12-14', 'modérée', 'Réaction cutanée avec fièvre'
FROM patients p, allergies a 
WHERE p.CNE = 'CN302986' AND a.nom = 'Sulfamides'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN302986')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Sulfamides');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2016-05-20', 'sévère', 'Allergie alimentaire grave, éviction stricte'
FROM patients p, allergies a 
WHERE p.CNE = 'CN303974' AND a.nom = 'Arachides'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN303974')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Arachides');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2020-01-15', 'modérée', 'Réaction lors d\'examens avec produit de contraste'
FROM patients p, allergies a 
WHERE p.CNE = 'CN501851' AND a.nom = 'Iode'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN501851')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Iode');

INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2019-08-30', 'légère', 'Rhinite et conjonctivite en présence de chats'
FROM patients p, allergies a 
WHERE p.CNE = 'CN503012' AND a.nom = 'Poils d\'animaux'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN503012')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Poils d\'animaux');

-- Additional allergies with existence checks
INSERT INTO patient_allergies (patient_id, allergie_id, date_diagnostic, severite, notes) 
SELECT p.id, a.id, '2018-03-15', 'modérée', 'Urticaire et troubles digestifs'
FROM patients p, allergies a 
WHERE p.CNE = 'CN115015' AND a.nom = 'Œufs'
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
AND EXISTS (SELECT 1 FROM allergies WHERE nom = 'Œufs');

-- ========================================
-- SECTION 2: MEDICAL ANTECEDENTS
-- ========================================
-- Insert medical antecedents with proper existence checks and using available doctors

-- Hypertension and diabetes family history (Omar Tazi patient)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'familial', 'Antécédents familiaux de diabète type 2 (père et grand-père maternel)', '2018-01-01', FALSE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN103978' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hypertension artérielle diagnostiquée', '2020-06-15', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN103978' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

-- Diabetes and COPD (Abdellatif Idrissi)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Diabète type 2', '2015-03-20', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN107965' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'BPCO (Bronchopneumopathie Chronique Obstructive)', '2018-11-10', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN107965' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hypertension artérielle', '2016-08-05', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN107965' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

-- Chronic migraines (Nadia Berrada)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Migraine chronique avec aura', '2019-02-14', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN110987' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Heart attack history (Rachid Hajji)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Infarctus du myocarde', '2021-09-18', FALSE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN111975' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hypercholestérolémie', '2020-01-10', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN111975' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

-- Scoliosis (Laila Bensouda Casa)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Scoliose légère', '2018-06-12', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN112005' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Additional antecedents for more patients
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Arthrite rhumatoïde', '2018-05-15', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN114997' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Ostéoporose', '2020-11-08', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN114997' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Hypertension and high cholesterol (Malika Lahlou)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hypertension artérielle', '2019-07-12', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN202993' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hypercholestérolémie', '2020-02-18', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN202993' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

-- Severe myopia (Brahim Tazi)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Myopie sévère', '2015-04-30', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN207977' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Hernia disc (Zineb Alaoui)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Hernie discale L4-L5', '2020-07-30', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN304998' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Diabetes with complications (Aicha Filali)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Diabète type 2', '2017-08-25', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN402994' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Insuffisance rénale chronique légère', '2021-03-10', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN402994' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- Endometriosis (Salma Chraibi)
INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Endométriose', '2018-06-14', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 4 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN404990' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 4);

INSERT INTO antecedents_medicaux (patient_id, type, description, date_debut, est_chronique, medecin_id) 
SELECT p.id, 'medical', 'Anémie ferriprive récurrente', '2019-11-20', TRUE, 
       (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1)
FROM patients p 
WHERE p.CNE = 'CN404990' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- ========================================
-- SECTION 3: PATIENT NOTES FROM DOCTORS
-- ========================================
-- Insert patient notes with proper existence checks

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Patient très coopératif dans le suivi de son hypertension. Bonne observance thérapeutique.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN103978' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Diabète bien équilibré sous metformine. Surveillance régulière de la fonction rénale nécessaire.', TRUE, 'traitement'
FROM patients p 
WHERE p.CNE = 'CN107965' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'BPCO stable. Encourager l\'arrêt du tabac. Vaccination antigrippale annuelle recommandée.', TRUE, 'prevention'
FROM patients p 
WHERE p.CNE = 'CN107965' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Migraines bien contrôlées avec traitement préventif. Éviter les facteurs déclenchants identifiés.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN110987' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 2 LIMIT 1), 
       'Post-infarctus. Excellent suivi cardiologique. Réadaptation cardiaque terminée avec succès.', TRUE, 'antecedents'
FROM patients p 
WHERE p.CNE = 'CN111975' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Scoliose stable. Kinésithérapie régulière. Surveillance orthopédique annuelle.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN112005' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Arthrite rhumatoïde bien contrôlée sous méthotrexate. Surveillance biologique régulière.', TRUE, 'traitement'
FROM patients p 
WHERE p.CNE = 'CN114997' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Anémie corrigée après supplémentation en fer. Surveillance biologique trimestrielle.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN203970' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Myopie sévère stabilisée. Port de lunettes permanent. Contrôle ophtalmologique annuel.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN207977' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Hernie discale. Amélioration avec kinésithérapie. Éviter les efforts de soulèvement.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN304998' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Diabète type 2 avec complications rénales. Surveillance néphrologique renforcée.', TRUE, 'complications'
FROM patients p 
WHERE p.CNE = 'CN402994' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 4 LIMIT 1), 
       'Endométriose sévère. Traitement hormonal en cours. Suivi gynécologique spécialisé.', TRUE, 'traitement'
FROM patients p 
WHERE p.CNE = 'CN404990' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 4);

-- Add notes for more patients with available doctors
INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Hypertension bien contrôlée. Encourager la poursuite de l\'activité physique et du régime hyposodé.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN202993' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Patient coopératif dans le suivi médical. Bonne observance thérapeutique.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN301983' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

INSERT INTO notes_patient (patient_id, medecin_id, contenu, est_important, categorie) 
SELECT p.id, (SELECT id FROM medecins WHERE specialite_id = 1 LIMIT 1), 
       'Suivi régulier recommandé. Patient en bonne santé générale.', FALSE, 'suivi'
FROM patients p 
WHERE p.CNE = 'CN501851' 
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1);

-- ========================================
-- MIGRATION COMPLETION
-- ========================================
SELECT 'Medical records migration completed: Allergies, antecedents, and notes added for patients.' as status;

-- Summary statistics
SELECT 
    'MEDICAL RECORDS SUMMARY' as category,
    COUNT(DISTINCT patient_id) as patients_with_allergies
FROM patient_allergies 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

SELECT 
    'MEDICAL ANTECEDENTS SUMMARY' as category,
    COUNT(DISTINCT patient_id) as patients_with_antecedents,
    COUNT(*) as total_antecedents
FROM antecedents_medicaux 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

SELECT 
    'PATIENT NOTES SUMMARY' as category,
    COUNT(DISTINCT patient_id) as patients_with_notes,
    COUNT(*) as total_notes
FROM notes_patient 
WHERE patient_id IN (SELECT id FROM patients WHERE CNE LIKE 'CN%');

-- Check for any issues
SELECT 
    'VERIFICATION' as category,
    CASE 
        WHEN (SELECT COUNT(*) FROM medecins WHERE specialite_id = 1) = 0 THEN 'WARNING: No general practitioner found'
        WHEN (SELECT COUNT(*) FROM medecins WHERE specialite_id = 2) = 0 THEN 'WARNING: No cardiologist found'
        ELSE 'All doctor references are valid'
    END as doctor_status; 
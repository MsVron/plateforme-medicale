-- ========================================
-- PAST TREATMENTS AND MEDICATIONS MIGRATION
-- ========================================
-- This file should be imported AFTER populate_patient_medical_records_fixed.sql
-- It adds comprehensive past treatments, medications, and prescriptions
-- Based on existing patients' conditions and medical antecedents

-- ========================================
-- SECTION 1: MEDICATIONS SETUP
-- ========================================
-- First, ensure we have the medications in the database
INSERT IGNORE INTO medicaments (nom_commercial, nom_molecule, dosage, forme, description) VALUES
-- Cardiovascular medications
('Amlor', 'Amlodipine', '5mg', 'comprimé', 'Inhibiteur calcique pour hypertension'),
('Coversyl', 'Périndopril', '5mg', 'comprimé', 'IEC pour hypertension et insuffisance cardiaque'),
('Bi-Preterax', 'Périndopril/Amlodipine', '5mg/5mg', 'comprimé', 'Association fixe antihypertensive'),
('Plavix', 'Clopidogrel', '75mg', 'comprimé', 'Antiagrégant plaquettaire'),
('Tahor', 'Atorvastatine', '80mg', 'comprimé', 'Statine pour hypercholestérolémie'),

-- Diabetes medications
('Glucophage', 'Metformine', '500mg', 'comprimé', 'Antidiabétique oral'),
('Diamicron', 'Gliclazide', '30mg', 'comprimé', 'Sulfamide hypoglycémiant'),

-- Respiratory medications
('Spiriva', 'Tiotropium', '18mcg', 'autre', 'Bronchodilatateur longue durée'),
('Symbicort', 'Formotérol/Budésonide', '12/400mcg', 'autre', 'Bronchodilatateur + corticoïde'),
('Ventoline', 'Salbutamol', '100mcg', 'autre', 'Bronchodilatateur courte durée'),

-- Neurological medications
('Avlocardyl', 'Propranolol', '40mg', 'comprimé', 'Bêta-bloquant pour migraine'),
('Imigrane', 'Sumatriptan', '50mg', 'comprimé', 'Triptan pour crise migraineuse'),
('Lyrica', 'Prégabaline', '75mg', 'gélule', 'Antiépileptique pour douleurs neuropathiques'),
('Epitomax', 'Topiramate', '50mg', 'comprimé', 'Antiépileptique préventif migraine'),

-- Rheumatology medications
('Novatrex', 'Méthotrexate', '15mg', 'comprimé', 'Immunosuppresseur pour polyarthrite'),
('Fosamax', 'Alendronate', '70mg', 'comprimé', 'Bisphosphonate pour ostéoporose'),
('Visanne', 'Dienogest', '2mg', 'comprimé', 'Progestatif pour endométriose'),

-- Allergy medications
('Zyrtec', 'Cétirizine', '10mg', 'comprimé', 'Antihistaminique'),
('Clarityne', 'Loratadine', '10mg', 'comprimé', 'Antihistaminique non sédatif'),
('Flixonase', 'Fluticasone', '50mcg', 'autre', 'Corticoïde nasal'),
('Singulair', 'Montelukast', '4mg', 'comprimé', 'Antileucotriène'),
('EpiPen', 'Adrénaline', '0.3mg', 'injectable', 'Auto-injecteur d\'urgence'),

-- Dermatology medications
('Locoid', 'Hydrocortisone', '1%', 'pommade', 'Corticoïde topique'),
('Protopic', 'Tacrolimus', '0.03%', 'pommade', 'Immunosuppresseur topique'),

-- Thyroid medications
('Levothyrox', 'Lévothyroxine', '75mcg', 'comprimé', 'Hormone thyroïdienne'),

-- Iron supplements
('Tardyferon', 'Fumarate de fer', '200mg', 'comprimé', 'Supplémentation en fer'),

-- Smoking cessation
('Nicorette', 'Nicotine', '21mg', 'patch', 'Substitut nicotinique patch'),
('Nicorette Gommes', 'Nicotine', '2mg', 'autre', 'Substitut nicotinique gommes');

-- ========================================
-- SECTION 2: CHRONIC CONDITIONS TREATMENTS
-- ========================================

-- Omar Tazi (CN103978) - Hypertension and diabetes prevention
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le matin', '2020-06-15', '2023-06-15', FALSE, m.id, 'Bon contrôle tensionnel, remplacé par association fixe', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN103978' AND med.nom_commercial = 'Amlor' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé matin et soir', '2021-01-10', TRUE, m.id, 'Prévention diabète, surveillance glycémique trimestrielle', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN103978' AND med.nom_commercial = 'Glucophage' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Abdellatif Idrissi (CN107965) - Diabète type 2, BPCO, Hypertension
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé matin et soir', '2015-03-20', '2020-03-20', FALSE, m.id, 'Remplacé par association metformine + gliclazide', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN107965' AND med.nom_commercial = 'Glucophage' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 inhalation par jour le matin', '2018-11-10', TRUE, m.id, 'BPCO - Amélioration de la dyspnée, observance correcte', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN107965' AND med.nom_commercial = 'Spiriva' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le matin', '2016-08-05', TRUE, m.id, 'HTA - Bon contrôle tensionnel, compatible BPCO', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN107965' AND med.nom_commercial = 'Coversyl' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

-- Nadia Berrada (CN110987) - Migraine chronique
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé matin et soir', '2019-02-14', '2022-02-14', FALSE, m.id, 'Prévention migraine - Réduction de 60% des crises', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN110987' AND med.nom_commercial = 'Avlocardyl' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé au début de la crise', '2019-02-14', FALSE, m.id, 'Traitement de crise - Efficace en 30min, max 2/jour', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN110987' AND med.nom_commercial = 'Imigrane' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Rachid Hajji (CN111975) - Post-infarctus, Hypercholestérolémie
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par jour', '2021-09-18', '2022-09-18', FALSE, m.id, 'Double antiagrégation post-infarctus pendant 1 an', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN111975' AND med.nom_commercial = 'Plavix' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le soir', '2021-09-18', TRUE, m.id, 'Statine haute intensité - LDL cible atteint', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN111975' AND med.nom_commercial = 'Tahor' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

-- Samia Benkirane (CN114997) - Arthrite rhumatoïde, Ostéoporose
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par semaine', '2018-05-15', '2021-05-15', FALSE, m.id, 'Méthotrexate - Bonne réponse initiale, remplacé par biothérapie', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN114997' AND med.nom_commercial = 'Novatrex' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par semaine', '2020-11-08', TRUE, m.id, 'Ostéoporose - Amélioration densité osseuse', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN114997' AND med.nom_commercial = 'Fosamax' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Malika Lahlou (CN202993) - Hypertension artérielle
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le matin', '2019-07-12', '2021-07-12', FALSE, m.id, 'Monothérapie initiale - Contrôle insuffisant', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN202993' AND med.nom_commercial = 'Coversyl' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN202993')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le matin', '2021-07-12', TRUE, m.id, 'Bithérapie - Excellent contrôle tensionnel', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN202993' AND med.nom_commercial = 'Bi-Preterax' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN202993')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 2)
LIMIT 1;

-- ========================================
-- SECTION 3: ALLERGY TREATMENTS
-- ========================================

-- Youssef Alami (CN101985) - Allergie aux acariens
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le soir', '2020-03-15', '2023-03-15', FALSE, m.id, 'Allergie acariens - Bon contrôle, passage à traitement à la demande', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN101985' AND med.nom_commercial = 'Zyrtec' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN101985')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Hassan Bennani (CN105988) - Allergie sévère aux fruits de mer
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, 'En cas de réaction anaphylactique', '2018-07-22', TRUE, m.id, 'Port permanent - Formation patient et famille réalisée', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN105988' AND med.nom_commercial = 'EpiPen' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN105988')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Zineb Fassi (CN106010) - Allergie au pollen
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '2 pulvérisations par narine matin et soir', '2015-04-10', FALSE, m.id, 'Rhinite allergique - Traitement saisonnier mars-juin', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN106010' AND med.nom_commercial = 'Flixonase' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN106010')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par jour', '2015-04-10', FALSE, m.id, 'Complément antihistaminique pour rhinite allergique', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN106010' AND med.nom_commercial = 'Clarityne' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN106010')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- ========================================
-- SECTION 4: WOMEN'S HEALTH TREATMENTS
-- ========================================

-- Imane Hajji (CN308994) - Endométriose, anémie
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par jour en continu', '2021-07-16', TRUE, m.id, 'Endométriose - Réduction significative des douleurs pelviennes', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN308994' AND med.nom_commercial = 'Visanne' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN308994')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, date_fin, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé par jour à jeun', '2020-07-16', '2021-01-16', FALSE, m.id, 'Anémie ferriprive - Normalisation hémoglobine', 'expired'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN308994' AND med.nom_commercial = 'Tardyferon' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN308994')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- Amina Zouiten (CN512986) - Hypothyroïdie
INSERT INTO traitements (patient_id, medicament_id, posologie, date_debut, est_permanent, medecin_prescripteur_id, instructions, status) 
SELECT p.id, med.id, '1 comprimé le matin à jeun', '2020-02-11', TRUE, m.id, 'Hypothyroïdie - TSH normalisée, surveillance semestrielle', 'prescribed'
FROM patients p, medicaments med, medecins m 
WHERE p.CNE = 'CN512986' AND med.nom_commercial = 'Levothyrox' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN512986')
AND EXISTS (SELECT 1 FROM medecins WHERE specialite_id = 1)
LIMIT 1;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment these queries to verify the data after import

/*
-- Check total treatments added
SELECT COUNT(*) as 'Total Treatments' FROM traitements;

-- Check treatments by status
SELECT status, COUNT(*) as 'Count' FROM traitements GROUP BY status;

-- Check treatments by patient (top 10)
SELECT p.prenom, p.nom, p.CNE, COUNT(t.id) as 'Treatments Count'
FROM patients p 
LEFT JOIN traitements t ON p.id = t.patient_id 
WHERE p.CNE LIKE 'CN%'
GROUP BY p.id 
ORDER BY COUNT(t.id) DESC 
LIMIT 10;

-- Check chronic conditions treatments
SELECT p.prenom, p.nom, med.nom_commercial, t.status, t.date_debut
FROM patients p 
JOIN traitements t ON p.id = t.patient_id 
JOIN medicaments med ON t.medicament_id = med.id
WHERE t.status = 'prescribed' 
ORDER BY p.nom;
*/ 
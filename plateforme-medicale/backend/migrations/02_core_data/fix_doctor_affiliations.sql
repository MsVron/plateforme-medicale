-- FIX DOCTOR-INSTITUTION AFFILIATIONS
-- This migration fixes the foreign key constraint issues by using proper ID lookups

-- Clear any existing affiliations that might have been partially inserted
DELETE FROM medecin_institution WHERE medecin_id IN (
    SELECT id FROM medecins WHERE numero_ordre LIKE '%-HUM6-%' 
    OR numero_ordre LIKE '%-HISN-%' 
    OR numero_ordre LIKE '%-HMM5-%'
    OR numero_ordre LIKE '%-CAM-%'
    OR numero_ordre LIKE '%-CAT-%'
    OR numero_ordre LIKE '%-COC-%'
    OR numero_ordre LIKE '%-CMA-%'
    OR numero_ordre LIKE '%-CMM-%'
);

-- Create doctor-institution affiliations using proper subqueries
-- Hôpital Universitaire Mohammed VI (10 doctors)
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-01-15', '2018-01-15'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'CAR-HUM6-001' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-03-20', '2019-03-20'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'NEU-HUM6-002' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-06-10', '2017-06-10'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'CHG-HUM6-003' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-02-28', '2020-02-28'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'ANE-HUM6-004' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2016-09-12', '2016-09-12'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'URO-HUM6-005' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-11-05', '2019-11-05'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'HEM-HUM6-006' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-04-18', '2018-04-18'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'GAS-HUM6-007' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-07-22', '2020-07-22'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'PNE-HUM6-008' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-01-30', '2017-01-30'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'NEP-HUM6-009' AND i.nom = 'Hôpital Universitaire Mohammed VI';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-08-14', '2019-08-14'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'ORL-HUM6-010' AND i.nom = 'Hôpital Universitaire Mohammed VI';

-- Hôpital Ibn Sina (5 doctors)
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2015-12-03', '2015-12-03'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'CHC-HISN-011' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-10-25', '2018-10-25'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'ONC-HISN-012' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-05-17', '2019-05-17'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'END-HISN-013' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-03-08', '2020-03-08'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'MIN-HISN-014' AND i.nom = 'Hôpital Ibn Sina';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-11-12', '2017-11-12'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'GER-HISN-015' AND i.nom = 'Hôpital Ibn Sina';

-- Continue with other institutions...
-- Hôpital Militaire Mohammed V (5 doctors)
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2016-04-26', '2016-04-26'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'ORT-HMM5-016' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2019-09-30', '2019-09-30'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'URG-HMM5-017' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2018-06-14', '2018-06-14'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'CHP-HMM5-018' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2020-02-07', '2020-02-07'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'RAD-HMM5-019' AND i.nom = 'Hôpital Militaire Mohammed V';

INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, '2017-12-19', '2017-12-19'
FROM medecins m CROSS JOIN institutions i 
WHERE m.numero_ordre = 'MPR-HMM5-020' AND i.nom = 'Hôpital Militaire Mohammed V';

-- Cliniques and Centres (remaining affiliations)
INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut, date_affectation)
SELECT m.id, i.id, TRUE, 
  CASE m.numero_ordre
    WHEN 'CHP-CAM-021' THEN '2019-08-03'
    WHEN 'CAR-CAM-022' THEN '2020-05-21'
    WHEN 'GYN-CAM-023' THEN '2018-01-15'
    WHEN 'OPH-CAM-024' THEN '2019-03-20'
    WHEN 'NEU-CAT-025' THEN '2017-06-10'
    WHEN 'ORT-CAT-026' THEN '2020-02-28'
    WHEN 'OPH-CAT-027' THEN '2018-09-12'
    WHEN 'CHG-COC-028' THEN '2019-11-05'
    WHEN 'GYN-COC-029' THEN '2018-04-18'
    WHEN 'PED-COC-030' THEN '2020-07-22'
    WHEN 'MG-CMA-031' THEN '2019-01-15'
    WHEN 'DER-CMA-032' THEN '2020-03-20'
    WHEN 'MTR-CMA-033' THEN '2018-06-10'
    WHEN 'MG-CMA-034' THEN '2019-02-28'
    WHEN 'MG-CMM-035' THEN '2020-09-12'
    WHEN 'MG-CMM-036' THEN '2018-11-05'
  END,
  CASE m.numero_ordre
    WHEN 'CHP-CAM-021' THEN '2019-08-03'
    WHEN 'CAR-CAM-022' THEN '2020-05-21'
    WHEN 'GYN-CAM-023' THEN '2018-01-15'
    WHEN 'OPH-CAM-024' THEN '2019-03-20'
    WHEN 'NEU-CAT-025' THEN '2017-06-10'
    WHEN 'ORT-CAT-026' THEN '2020-02-28'
    WHEN 'OPH-CAT-027' THEN '2018-09-12'
    WHEN 'CHG-COC-028' THEN '2019-11-05'
    WHEN 'GYN-COC-029' THEN '2018-04-18'
    WHEN 'PED-COC-030' THEN '2020-07-22'
    WHEN 'MG-CMA-031' THEN '2019-01-15'
    WHEN 'DER-CMA-032' THEN '2020-03-20'
    WHEN 'MTR-CMA-033' THEN '2018-06-10'
    WHEN 'MG-CMA-034' THEN '2019-02-28'
    WHEN 'MG-CMM-035' THEN '2020-09-12'
    WHEN 'MG-CMM-036' THEN '2018-11-05'
  END
FROM medecins m CROSS JOIN institutions i 
WHERE (
  (m.numero_ordre IN ('CHP-CAM-021', 'CAR-CAM-022', 'GYN-CAM-023', 'OPH-CAM-024') AND i.nom = 'Clinique Al Madina') OR
  (m.numero_ordre IN ('NEU-CAT-025', 'ORT-CAT-026', 'OPH-CAT-027') AND i.nom = 'Clinique Atlas') OR
  (m.numero_ordre IN ('CHG-COC-028', 'GYN-COC-029', 'PED-COC-030') AND i.nom = 'Clinique Océan') OR
  (m.numero_ordre IN ('MG-CMA-031', 'DER-CMA-032') AND i.nom = 'Centre Médical Avicenne') OR
  (m.numero_ordre IN ('MTR-CMA-033', 'MG-CMA-034') AND i.nom = 'Centre Médical Andalous') OR
  (m.numero_ordre IN ('MG-CMM-035', 'MG-CMM-036') AND i.nom = 'Centre Médical Maghreb')
); 
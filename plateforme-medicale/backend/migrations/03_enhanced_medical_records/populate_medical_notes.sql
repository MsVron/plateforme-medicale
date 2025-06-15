-- ========================================
-- MEDICAL NOTES MIGRATION
-- ========================================
-- This file should be imported AFTER populate_weight_height_history.sql
-- It adds comprehensive medical notes, observations, and follow-up notes
-- Based on existing patients' conditions and treatment history

-- ========================================
-- SECTION 1: CHRONIC CONDITIONS FOLLOW-UP NOTES
-- ========================================

-- Omar Tazi (CN103978) - Hypertension and diabetes prevention follow-up
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patient de 45 ans, ingénieur informatique. Antécédents familiaux de diabète type 2 (père et grand-père maternel). Hypertension artérielle diagnostiquée en juin 2020. Excellent compliance au traitement antihypertenseur. Tension artérielle bien contrôlée sous Amlodipine puis association fixe. Perte de poids significative (88.5kg → 85.2kg) grâce aux modifications du mode de vie. Prévention diabète initiée avec Metformine 500mg x2/j. Surveillance glycémique trimestrielle : glycémie à jeun stable autour de 1.05g/L, HbA1c à 5.8%. Recommandations : poursuite du régime méditerranéen, activité physique régulière (marche 30min/j), surveillance pondérale.', '2023-06-15 10:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation de suivi diabète. Patient asymptomatique. Bonne observance thérapeutique. Glycémie capillaire matinale entre 0.95-1.10g/L. Pas de signes de complications micro ou macrovasculaires. Examen des pieds normal. Fond d\'œil programmé dans 6 mois. Conseils diététiques renforcés : réduction des glucides simples, augmentation des fibres. Objectif HbA1c <6.5%. Prochain RDV dans 3 mois.', '2024-01-10 14:15:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

-- Abdellatif Idrissi (CN107965) - Diabète type 2, BPCO, Hypertension - Complex case
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patient de 58 ans, retraité, polypathologique. Diabète type 2 depuis 2015, initialement sous Metformine puis association avec Gliclazide. HbA1c actuelle 7.8% (objectif <8% chez sujet âgé). BPCO diagnostiquée en 2018, tabagisme 40 paquets-années, sevrage difficile. Dyspnée stade II GOLD. Spirométrie : VEMS 65% théorique. Traitement par Tiotropium avec bonne tolérance. Hypertension artérielle sous Périndopril, TA bien contrôlée. Surveillance cardiologique annuelle. Éducation thérapeutique renforcée : technique d\'inhalation, reconnaissance des signes d\'exacerbation.', '2023-11-10 09:45:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation pneumologique. Patient stable sur le plan respiratoire. Pas d\'exacerbation depuis 8 mois. Bonne technique d\'inhalation du Tiotropium. Dyspnée d\'effort stable. Oxymétrie de pouls : 94% en air ambiant. Radiographie thoracique : emphysème modéré, pas de foyer infectieux. Vaccination antigrippale à jour. Conseils : éviter les irritants respiratoires, maintenir activité physique adaptée (marche lente), surveillance des signes d\'infection. Prochain RDV dans 4 mois.', '2024-01-15 11:20:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

-- Nadia Berrada (CN110987) - Migraine chronique management
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patiente de 36 ans, pharmacienne. Migraine avec aura depuis 2019. Fréquence initiale : 8-10 crises/mois. Traitement préventif par Propranolol 40mg x2/j pendant 3 ans avec excellents résultats (réduction 60% des crises). Arrêt progressif réussi en 2022. Actuellement : 2-3 crises/mois, bien contrôlées par Sumatriptan 50mg. Facteurs déclenchants identifiés : stress professionnel, manque de sommeil, règles. Agenda des céphalées tenu régulièrement. Qualité de vie nettement améliorée. Conseils : gestion du stress, hygiène de sommeil, éviction des facteurs déclenchants alimentaires.', '2022-02-14 16:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation neurologique de suivi. Patiente en rémission partielle. Fréquence des crises stable à 2-3/mois. Intensité modérée (6-7/10). Sumatriptan efficace en 30-45 minutes. Pas d\'abus médicamenteux. Examen neurologique normal. Pas de signes d\'alarme. Conseils : techniques de relaxation, yoga, maintien du traitement de crise. Réévaluation dans 6 mois. Si aggravation, envisager nouveau traitement préventif.', '2024-02-14 14:45:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN110987' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN110987')
LIMIT 1;

-- Rachid Hajji (CN111975) - Post-infarctus cardiac rehabilitation
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patient de 48 ans, chef d\'entreprise. Infarctus du myocarde antérieur le 18/09/2021, pris en charge par angioplastie primaire avec pose de stent actif sur IVA proximale. Évolution favorable. Double antiagrégation plaquettaire pendant 12 mois. FEVG post-IDM : 50%. Hypercholestérolémie traitée par Atorvastatine 80mg, LDL cible <0.7g/L atteint. Réadaptation cardiaque complétée. Sevrage tabagique réussi. Perte de poids significative (82.5kg → 76.9kg). Reprise progressive de l\'activité professionnelle. Épreuve d\'effort à 6 mois : capacité fonctionnelle normale, pas d\'ischémie résiduelle.', '2022-09-18 08:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation cardiologique annuelle. Patient asymptomatique. Pas de douleur thoracique, dyspnée ou palpitations. Bonne tolérance à l\'effort. ECG : rythme sinusal, séquelles d\'IDM antérieur. Échocardiographie : FEVG 55%, cinétique segmentaire normale, pas de complication mécanique. Biologie : LDL 0.6g/L, créatinine normale. Observance thérapeutique excellente. Conseils : maintien du mode de vie, activité physique régulière, surveillance lipidique. Prochain RDV dans 12 mois.', '2024-01-18 15:20:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN111975' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN111975')
LIMIT 1;

-- ========================================
-- SECTION 2: RHEUMATOLOGY AND WOMEN'S HEALTH
-- ========================================

-- Samia Benkirane (CN114997) - Arthrite rhumatoïde, Ostéoporose - Young adult
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Étudiante en pharmacie de 26 ans. Polyarthrite rhumatoïde diagnostiquée à 21 ans. Forme érosive avec atteinte des mains et pieds. Traitement initial par Méthotrexate 15mg/semaine pendant 3 ans avec bonne réponse clinique et biologique. Passage en biothérapie en 2021 devant échappement thérapeutique. Ostéoporose précoce découverte à 23 ans (T-score -2.8 au rachis lombaire), probablement liée à la corticothérapie initiale. Traitement par Alendronate + supplémentation calcique. Dernière ostéodensitométrie : amélioration significative. Contraception adaptée, désir de grossesse dans 2-3 ans.', '2021-05-15 13:45:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation rhumatologique. Patiente en rémission clinique sous biothérapie. DAS28 <2.6. Pas de douleur articulaire, raideur matinale <15 minutes. Examen articulaire : synovites résiduelles minimes aux IPP. Biologie : CRP <3mg/L, VS normale. Radiographies : pas de progression érosive. Tolérance biothérapie excellente. Surveillance infectieuse : pas d\'épisode intercurrent. Projet de grossesse discuté : arrêt biothérapie 3 mois avant conception, relais par sulfasalazine. Prochain RDV dans 3 mois.', '2024-01-08 10:15:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN114997' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN114997')
LIMIT 1;

-- Malika Lahlou (CN202993) - Hypertension management in middle-aged woman
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Journaliste de 30 ans. Hypertension artérielle essentielle diagnostiquée en 2019. Initialement sous monothérapie par Périndopril 5mg avec contrôle insuffisant. Passage en bithérapie (Périndopril/Amlodipine) en 2021 avec excellent résultat. TA actuelle : 125/78 mmHg. Facteurs de risque cardiovasculaire : stress professionnel important, sédentarité. Bilan d\'extension normal : fond d\'œil, ECG, échocardiographie, fonction rénale. Perte de poids encourageante (62.5kg → 57.8kg). Conseils hygiéno-diététiques : régime hyposodé, activité physique régulière, gestion du stress.', '2021-07-12 11:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN202993' AND m.specialite_id = 2 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN202993')
LIMIT 1;

-- Imane Hajji (CN308994) - Endométriose and anemia management
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Infirmière de 29 ans. Endométriose diagnostiquée en 2021 devant dysménorrhées sévères et dyspareunie. IRM pelvienne : endométriomes ovariens bilatéraux 3-4cm, nodules du cul-de-sac de Douglas. Traitement médical par Dienogest 2mg/j avec amélioration significative des douleurs (EVA 8/10 → 3/10). Anémie ferriprive récurrente liée aux ménorragies, corrigée par supplémentation martiale. Hémoglobine actuelle : 12.8g/dL. Désir de grossesse exprimé. Discussion thérapeutique : arrêt temporaire Dienogest, stimulation ovarienne si nécessaire. Surveillance échographique régulière des endométriomes.', '2021-07-16 14:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN308994' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN308994')
LIMIT 1;

-- ========================================
-- SECTION 3: PEDIATRIC FOLLOW-UP NOTES
-- ========================================

-- Khalid Tazi (CN115015) - Pediatric allergy management
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Enfant de 8 ans. Allergie alimentaire aux œufs diagnostiquée à 2 ans suite à réaction urticarienne. Tests cutanés positifs aux protéines d\'œuf (blanc et jaune). Éviction alimentaire stricte depuis le diagnostic. Amélioration progressive avec l\'âge : derniers tests montrent diminution de la sensibilisation. Croissance normale (P50 pour taille et poids). Pas de réaction accidentelle depuis 18 mois. Éducation familiale renforcée : lecture des étiquettes, trousse d\'urgence, plan d\'action allergique. Tests de provocation orale envisagés à 10 ans si évolution favorable. Surveillance allergologique annuelle.', '2020-03-15 10:45:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Consultation pédiatrique de suivi. Enfant en bonne santé générale. Développement psychomoteur normal. Scolarité sans problème. Allergie aux œufs bien gérée par la famille et l\'école. Pas d\'exposition accidentelle récente. Croissance harmonieuse : taille 120cm (P50), poids 28.5kg (P50). Examen clinique normal. Vaccinations à jour. Conseils : poursuite éviction alimentaire, éducation continue, préparation tests de provocation dans 2 ans. Prochain RDV dans 6 mois.', '2024-01-15 16:20:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN115015' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN115015')
LIMIT 1;

-- Hassan Taibi (CN503012) - Pediatric respiratory allergies
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Enfant de 11 ans. Rhinite allergique aux poils d\'animaux diagnostiquée à 7 ans. Symptômes déclenchés par exposition aux chats et chiens : éternuements, rhinorrhée, conjonctivite. Tests cutanés fortement positifs aux phanères de chat et chien. Traitement par Montelukast avec bonne efficacité. Éviction des allergènes à domicile. Pas de développement d\'asthme associé. Fonction respiratoire normale. Croissance normale. Conseils : maintien éviction allergènes, traitement préventif avant expositions inévitables, surveillance développement asthme.', '2019-08-30 12:15:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN503012' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN503012')
LIMIT 1;

-- ========================================
-- SECTION 4: ELDERLY PATIENTS COMPREHENSIVE CARE
-- ========================================

-- Abderrahim Kettani (CN307955) - Elderly diabetes with complications
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patient de 68 ans, retraité. Diabète type 2 depuis 2010, compliqué d\'insuffisance rénale chronique stade 3A (DFG 55 mL/min). Traitement adapté à la fonction rénale : Gliclazide LP 30mg. HbA1c stable à 7.2% (objectif <8% chez sujet âgé). Surveillance néphrologique trimestrielle. Pas de rétinopathie diabétique. Neuropathie sensitive distale modérée. Pied diabétique : soins podologiques réguliers, chaussage adapté. Autonomie préservée. Entourage familial présent. Éducation thérapeutique adaptée à l\'âge : simplification du traitement, surveillance glycémique, prévention des hypoglycémies.', '2022-11-12 09:30:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN307955' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN307955')
LIMIT 1;

-- Mehdi Alaoui (CN113960) - Elderly general health monitoring
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Patient de 63 ans, retraité. Suivi gériatrique préventif. Antécédents : tabagisme sevré depuis 5 ans. État général conservé. Autonomie complète pour les activités de la vie quotidienne. Pas de troubles cognitifs. Perte de poids physiologique avec l\'âge (75.8kg → 72.4kg). Bilan biologique annuel normal. Dépistages à jour : coloscopie, PSA, mammographie (épouse). Activité physique régulière : marche quotidienne. Vie sociale active. Conseils : maintien activité physique, alimentation équilibrée, prévention des chutes, vaccinations (grippe, COVID, zona).', '2022-04-18 11:45:00', FALSE, 'consultation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN113960' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN113960')
LIMIT 1;

-- ========================================
-- SECTION 5: ALLERGY MANAGEMENT NOTES
-- ========================================

-- Youssef Alami (CN101985) - Adult environmental allergies
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Ingénieur informatique de 38 ans. Rhinite allergique perannuelle aux acariens depuis 2020. Symptômes : obstruction nasale matinale, éternuements, prurit nasal. Tests cutanés positifs aux acariens (Dermatophagoides pteronyssinus et farinae). Traitement initial par Cétirizine 10mg/j pendant 3 ans avec bonne efficacité. Passage à traitement à la demande depuis 2023. Mesures d\'éviction allergénique mises en place : housses anti-acariens, aspirateur HEPA, réduction humidité. Amélioration significative des symptômes. Pas de développement d\'asthme associé.', '2023-03-15 14:20:00', FALSE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN101985' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN101985')
LIMIT 1;

-- Hassan Bennani (CN105988) - Severe food allergy management
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Architecte de 35 ans. Allergie alimentaire sévère aux fruits de mer (crustacés) depuis 2018. Réaction anaphylactique initiale : urticaire généralisée, œdème facial, dyspnée. Prise en charge urgente avec adrénaline IM. Tests allergologiques : IgE spécifiques très élevées (>100 kU/L). Port permanent d\'auto-injecteur d\'adrénaline. Éviction alimentaire stricte. Formation patient et famille aux gestes d\'urgence. Pas de réaction depuis le diagnostic grâce à la vigilance. Carte d\'allergie alimentaire. Conseils restaurants et voyages. Surveillance allergologique annuelle.', '2018-07-22 16:45:00', TRUE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN105988' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN105988')
LIMIT 1;

-- Zineb Fassi (CN106010) - Seasonal allergic rhinitis
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Étudiante de 23 ans. Rhinite allergique saisonnière au pollen depuis l\'adolescence. Symptômes de mars à juin : rhinorrhée claire, éternuements en salves, conjonctivite. Tests cutanés positifs aux pollens de graminées et d\'arbres (bouleau, olivier). Traitement saisonnier par Fluticasone nasal + Loratadine avec excellente efficacité. Amélioration qualité de vie pendant la saison pollinique. Conseils : surveillance calendrier pollinique, fermeture fenêtres, douche après exposition extérieure. Immunothérapie spécifique discutée mais refusée par la patiente.', '2020-04-10 13:30:00', FALSE, 'suivi_chronique'
FROM patients p, medecins m 
WHERE p.CNE = 'CN106010' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN106010')
LIMIT 1;

-- ========================================
-- SECTION 6: TREATMENT RESPONSE AND ADJUSTMENT NOTES
-- ========================================

-- Treatment efficacy assessment notes
INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Évaluation de l\'efficacité thérapeutique après 6 mois de traitement. Excellente réponse clinique et biologique. Observance thérapeutique optimale. Pas d\'effets indésirables rapportés. Qualité de vie nettement améliorée. Poursuite du traitement à la même posologie. Surveillance renforcée des paramètres biologiques. Éducation thérapeutique continue.', '2024-01-15 11:00:00', FALSE, 'evaluation'
FROM patients p, medecins m 
WHERE p.CNE = 'CN103978' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN103978')
LIMIT 1;

INSERT INTO notes_patient (patient_id, medecin_id, contenu, date_creation, est_important, categorie) 
SELECT p.id, m.id, 'Ajustement thérapeutique nécessaire. Réponse partielle au traitement actuel. Augmentation progressive de la posologie envisagée. Surveillance rapprochée des effets indésirables. Réévaluation dans 4 semaines. Si échec, changement de classe thérapeutique à discuter.', '2024-01-20 15:30:00', TRUE, 'ajustement'
FROM patients p, medecins m 
WHERE p.CNE = 'CN107965' AND m.specialite_id = 1 
AND EXISTS (SELECT 1 FROM patients WHERE CNE = 'CN107965')
LIMIT 1;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment these queries to verify the data after import

/*
-- Check total notes added
SELECT COUNT(*) as 'Total Notes' FROM notes_patient;

-- Check notes by category
SELECT categorie, COUNT(*) as 'Count' FROM notes_patient GROUP BY categorie;

-- Check notes by importance
SELECT est_important, COUNT(*) as 'Count' FROM notes_patient GROUP BY est_important;

-- Check notes by patient (top 10)
SELECT p.prenom, p.nom, p.CNE, COUNT(np.id) as 'Notes Count'
FROM patients p 
LEFT JOIN notes_patient np ON p.id = np.patient_id 
WHERE p.CNE LIKE 'CN%'
GROUP BY p.id 
ORDER BY COUNT(np.id) DESC 
LIMIT 10;

-- Check recent important notes
SELECT p.prenom, p.nom, np.categorie, np.date_creation, 
       LEFT(np.contenu, 100) as 'Note Preview'
FROM patients p 
JOIN notes_patient np ON p.id = np.patient_id 
WHERE np.est_important = TRUE 
AND p.CNE LIKE 'CN%'
ORDER BY np.date_creation DESC 
LIMIT 10;
*/ 
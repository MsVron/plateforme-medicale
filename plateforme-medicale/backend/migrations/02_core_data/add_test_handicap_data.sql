-- Add test handicap data to some existing patients
-- This will allow testing of the handicap display functionality

-- Update patient with motor handicap (Omar Tazi)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'moteur',
    niveau_handicap = 'modéré',
    description_handicap = 'Mobilité réduite suite à un accident, utilise des béquilles pour se déplacer',
    besoins_accessibilite = 'Rampe d\'accès, ascenseur obligatoire, toilettes adaptées',
    equipements_medicaux = 'Béquilles, orthèse de genou',
    autonomie_niveau = 'assistance_partielle'
WHERE CNE = 'CN103978';

-- Update patient with sensory handicap (Fatima Chraibi)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'sensoriel',
    niveau_handicap = 'sévère',
    description_handicap = 'Déficience auditive bilatérale profonde depuis la naissance',
    besoins_accessibilite = 'Interprète en langue des signes, boucle magnétique, éclairage suffisant pour lecture labiale',
    equipements_medicaux = 'Appareil auditif numérique bilateral',
    autonomie_niveau = 'autonome'
WHERE CNE = 'CN104995';

-- Update patient with intellectual handicap (Zineb Fassi - young patient)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'intellectuel',
    niveau_handicap = 'léger',
    description_handicap = 'Troubles d\'apprentissage et retard de développement cognitif léger',
    besoins_accessibilite = 'Explications simples et répétées, accompagnement d\'un parent/tuteur',
    equipements_medicaux = 'Aucun équipement spécifique',
    autonomie_niveau = 'assistance_partielle'
WHERE CNE = 'CN106010';

-- Update patient with multiple handicaps (Abdellatif Idrissi - elderly)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'multiple',
    niveau_handicap = 'sévère',
    description_handicap = 'Combinaison de déficience motrice (arthrose sévère) et de troubles cognitifs légers',
    besoins_accessibilite = 'Fauteuil roulant accessible, aide pour les transferts, environnement calme',
    equipements_medicaux = 'Fauteuil roulant, déambulateur, matelas anti-escarres',
    autonomie_niveau = 'assistance_totale'
WHERE CNE = 'CN107965';

-- Update patient with psychic handicap (Nadia Berrada)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'psychique',
    niveau_handicap = 'modéré',
    description_handicap = 'Troubles anxieux généralisés avec épisodes dépressifs récurrents',
    besoins_accessibilite = 'Environnement calme, consultation sans stress, temps supplémentaire',
    equipements_medicaux = 'Aucun équipement médical spécifique',
    autonomie_niveau = 'autonome'
WHERE CNE = 'CN110987';

-- Update patient with custom "autre" handicap (Hassan Berrada)
UPDATE patients 
SET a_handicap = TRUE,
    type_handicap = 'autre',
    type_handicap_autre = 'Syndrome rare de Marfan',
    niveau_handicap = 'modéré',
    description_handicap = 'Syndrome de Marfan affectant le système cardiovasculaire et squelettique',
    besoins_accessibilite = 'Éviter les efforts physiques intenses, surveillance cardiaque régulière',
    equipements_medicaux = 'Holter cardiaque, orthèses plantaires',
    autonomie_niveau = 'autonome'
WHERE CNE = 'CN301983';

-- Verify the updates
SELECT prenom, nom, CNE, a_handicap, type_handicap, type_handicap_autre, niveau_handicap, autonomie_niveau 
FROM patients 
WHERE a_handicap = TRUE; 
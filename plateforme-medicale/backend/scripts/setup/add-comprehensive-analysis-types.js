const db = require('./config/db');

async function addComprehensiveAnalysisTypes() {
  try {
    console.log('=== ADDING COMPREHENSIVE ANALYSIS TYPES ===');
    
    // Check current count
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM types_analyses');
    console.log('Current analysis types in database:', existing[0].count);
    
    const analysisTypes = [
      // HÉMATOLOGIE (categorie_id: 3) - More comprehensive blood tests
      { nom: 'Vitesse de sédimentation (VS)', description: 'Vitesse de chute des globules rouges', valeurs_normales: 'H: <15 mm/h, F: <20 mm/h', unite: 'mm/h', categorie_id: 3, ordre_affichage: 6 },
      { nom: 'Réticulocytes', description: 'Jeunes globules rouges', valeurs_normales: '0.5-2.5%', unite: '%', categorie_id: 3, ordre_affichage: 7 },
      { nom: 'Volume globulaire moyen (VGM)', description: 'Taille moyenne des globules rouges', valeurs_normales: '80-100 fL', unite: 'fL', categorie_id: 3, ordre_affichage: 8 },
      { nom: 'Teneur corpusculaire moyenne en hémoglobine (TCMH)', description: 'Quantité d\'hémoglobine par globule rouge', valeurs_normales: '27-32 pg', unite: 'pg', categorie_id: 3, ordre_affichage: 9 },
      { nom: 'Concentration corpusculaire moyenne en hémoglobine (CCMH)', description: 'Concentration d\'hémoglobine dans les globules rouges', valeurs_normales: '32-36 g/dL', unite: 'g/dL', categorie_id: 3, ordre_affichage: 10 },
      { nom: 'Polynucléaires neutrophiles', description: 'Type de globules blancs', valeurs_normales: '1.8-7.7 10³/μL', unite: '10³/μL', categorie_id: 3, ordre_affichage: 11 },
      { nom: 'Polynucléaires éosinophiles', description: 'Type de globules blancs', valeurs_normales: '0.05-0.5 10³/μL', unite: '10³/μL', categorie_id: 3, ordre_affichage: 12 },
      { nom: 'Polynucléaires basophiles', description: 'Type de globules blancs', valeurs_normales: '0.01-0.1 10³/μL', unite: '10³/μL', categorie_id: 3, ordre_affichage: 13 },
      { nom: 'Lymphocytes', description: 'Type de globules blancs', valeurs_normales: '1.0-4.0 10³/μL', unite: '10³/μL', categorie_id: 3, ordre_affichage: 14 },
      { nom: 'Monocytes', description: 'Type de globules blancs', valeurs_normales: '0.2-1.0 10³/μL', unite: '10³/μL', categorie_id: 3, ordre_affichage: 15 },
      
      // BIOCHIMIE (categorie_id: 4) - More comprehensive biochemistry
      { nom: 'Urée', description: 'Déchet azoté filtré par les reins', valeurs_normales: '0.15-0.45 g/L', unite: 'g/L', categorie_id: 4, ordre_affichage: 6 },
      { nom: 'Acide urique', description: 'Produit de dégradation des purines', valeurs_normales: 'H: 3.4-7.0 mg/dL, F: 2.4-6.0 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 7 },
      { nom: 'Bilirubine totale', description: 'Pigment biliaire total', valeurs_normales: '<1.2 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 8 },
      { nom: 'Bilirubine directe', description: 'Bilirubine conjuguée', valeurs_normales: '<0.3 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 9 },
      { nom: 'ASAT (SGOT)', description: 'Aspartate aminotransférase', valeurs_normales: 'H: <40 UI/L, F: <32 UI/L', unite: 'UI/L', categorie_id: 4, ordre_affichage: 10 },
      { nom: 'ALAT (SGPT)', description: 'Alanine aminotransférase', valeurs_normales: 'H: <41 UI/L, F: <33 UI/L', unite: 'UI/L', categorie_id: 4, ordre_affichage: 11 },
      { nom: 'Gamma GT', description: 'Gamma-glutamyltransférase', valeurs_normales: 'H: <55 UI/L, F: <38 UI/L', unite: 'UI/L', categorie_id: 4, ordre_affichage: 12 },
      { nom: 'Phosphatases alcalines', description: 'Enzymes hépatiques et osseuses', valeurs_normales: '44-147 UI/L', unite: 'UI/L', categorie_id: 4, ordre_affichage: 13 },
      { nom: 'LDH', description: 'Lactate déshydrogénase', valeurs_normales: '135-225 UI/L', unite: 'UI/L', categorie_id: 4, ordre_affichage: 14 },
      { nom: 'Triglycérides', description: 'Lipides sanguins', valeurs_normales: '<150 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 15 },
      { nom: 'LDL Cholestérol', description: 'Mauvais cholestérol', valeurs_normales: '<100 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 16 },
      { nom: 'Protéines totales', description: 'Protéines sériques totales', valeurs_normales: '6.6-8.3 g/dL', unite: 'g/dL', categorie_id: 4, ordre_affichage: 17 },
      { nom: 'Albumine', description: 'Protéine de transport', valeurs_normales: '3.5-5.0 g/dL', unite: 'g/dL', categorie_id: 4, ordre_affichage: 18 },
      { nom: 'Sodium', description: 'Électrolyte principal', valeurs_normales: '136-145 mmol/L', unite: 'mmol/L', categorie_id: 4, ordre_affichage: 19 },
      { nom: 'Potassium', description: 'Électrolyte intracellulaire', valeurs_normales: '3.5-5.1 mmol/L', unite: 'mmol/L', categorie_id: 4, ordre_affichage: 20 },
      { nom: 'Chlore', description: 'Électrolyte', valeurs_normales: '98-107 mmol/L', unite: 'mmol/L', categorie_id: 4, ordre_affichage: 21 },
      { nom: 'Calcium', description: 'Minéral osseux', valeurs_normales: '8.5-10.5 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 22 },
      { nom: 'Phosphore', description: 'Minéral osseux', valeurs_normales: '2.5-4.5 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 23 },
      { nom: 'Magnésium', description: 'Minéral essentiel', valeurs_normales: '1.7-2.2 mg/dL', unite: 'mg/dL', categorie_id: 4, ordre_affichage: 24 },
      
      // ENDOCRINOLOGIE (categorie_id: 5) - More hormones
      { nom: 'Cortisol', description: 'Hormone du stress', valeurs_normales: 'Matin: 6-23 μg/dL', unite: 'μg/dL', categorie_id: 5, ordre_affichage: 4 },
      { nom: 'Insuline', description: 'Hormone de régulation glycémique', valeurs_normales: '2.6-24.9 μUI/mL', unite: 'μUI/mL', categorie_id: 5, ordre_affichage: 5 },
      { nom: 'Testostérone', description: 'Hormone sexuelle masculine', valeurs_normales: 'H: 300-1000 ng/dL, F: 15-70 ng/dL', unite: 'ng/dL', categorie_id: 5, ordre_affichage: 6 },
      { nom: 'Œstradiol', description: 'Hormone sexuelle féminine', valeurs_normales: 'Variable selon cycle', unite: 'pg/mL', categorie_id: 5, ordre_affichage: 7 },
      { nom: 'Progestérone', description: 'Hormone de grossesse', valeurs_normales: 'Variable selon cycle', unite: 'ng/mL', categorie_id: 5, ordre_affichage: 8 },
      { nom: 'LH', description: 'Hormone lutéinisante', valeurs_normales: 'Variable selon sexe et âge', unite: 'mUI/mL', categorie_id: 5, ordre_affichage: 9 },
      { nom: 'FSH', description: 'Hormone folliculo-stimulante', valeurs_normales: 'Variable selon sexe et âge', unite: 'mUI/mL', categorie_id: 5, ordre_affichage: 10 },
      { nom: 'Prolactine', description: 'Hormone de lactation', valeurs_normales: 'H: 4-15 ng/mL, F: 4-23 ng/mL', unite: 'ng/mL', categorie_id: 5, ordre_affichage: 11 },
      { nom: 'Hormone de croissance (GH)', description: 'Hormone de croissance', valeurs_normales: '<10 ng/mL', unite: 'ng/mL', categorie_id: 5, ordre_affichage: 12 },
      { nom: 'IGF-1', description: 'Facteur de croissance insulino-like', valeurs_normales: 'Variable selon âge', unite: 'ng/mL', categorie_id: 5, ordre_affichage: 13 },
      { nom: 'ACTH', description: 'Hormone adrénocorticotrope', valeurs_normales: '7-63 pg/mL', unite: 'pg/mL', categorie_id: 5, ordre_affichage: 14 },
      { nom: 'Parathormone (PTH)', description: 'Hormone parathyroïdienne', valeurs_normales: '15-65 pg/mL', unite: 'pg/mL', categorie_id: 5, ordre_affichage: 15 },
      
      // IMMUNOLOGIE (categorie_id: 6) - More immunological tests
      { nom: 'Anticorps anti-nucléaires (AAN)', description: 'Auto-anticorps', valeurs_normales: '<1/80', unite: 'titre', categorie_id: 6, ordre_affichage: 3 },
      { nom: 'Anticorps anti-DNA natif', description: 'Auto-anticorps spécifiques', valeurs_normales: '<7 UI/mL', unite: 'UI/mL', categorie_id: 6, ordre_affichage: 4 },
      { nom: 'Anticorps anti-CCP', description: 'Anticorps anti-peptides citrullinés', valeurs_normales: '<17 UI/mL', unite: 'UI/mL', categorie_id: 6, ordre_affichage: 5 },
      { nom: 'Complément C3', description: 'Protéine du complément', valeurs_normales: '90-180 mg/dL', unite: 'mg/dL', categorie_id: 6, ordre_affichage: 6 },
      { nom: 'Complément C4', description: 'Protéine du complément', valeurs_normales: '10-40 mg/dL', unite: 'mg/dL', categorie_id: 6, ordre_affichage: 7 },
      { nom: 'Immunoglobulines IgG', description: 'Anticorps de défense', valeurs_normales: '700-1600 mg/dL', unite: 'mg/dL', categorie_id: 6, ordre_affichage: 8 },
      { nom: 'Immunoglobulines IgA', description: 'Anticorps de défense', valeurs_normales: '70-400 mg/dL', unite: 'mg/dL', categorie_id: 6, ordre_affichage: 9 },
      { nom: 'Immunoglobulines IgM', description: 'Anticorps de défense', valeurs_normales: '40-230 mg/dL', unite: 'mg/dL', categorie_id: 6, ordre_affichage: 10 },
      { nom: 'Immunoglobulines IgE', description: 'Anticorps d\'allergie', valeurs_normales: '<100 UI/mL', unite: 'UI/mL', categorie_id: 6, ordre_affichage: 11 },
      
      // MICROBIOLOGIE (categorie_id: 7) - Infectious disease tests
      { nom: 'Hémoculture', description: 'Culture sanguine pour bactéries', valeurs_normales: 'Stérile', unite: '', categorie_id: 7, ordre_affichage: 1 },
      { nom: 'ECBU', description: 'Examen cytobactériologique des urines', valeurs_normales: '<10⁴ germes/mL', unite: 'germes/mL', categorie_id: 7, ordre_affichage: 2 },
      { nom: 'Coproculture', description: 'Culture des selles', valeurs_normales: 'Flore normale', unite: '', categorie_id: 7, ordre_affichage: 3 },
      { nom: 'Procalcitonine', description: 'Marqueur d\'infection bactérienne', valeurs_normales: '<0.25 ng/mL', unite: 'ng/mL', categorie_id: 7, ordre_affichage: 4 },
      { nom: 'Sérologie VIH', description: 'Anticorps anti-VIH', valeurs_normales: 'Négatif', unite: '', categorie_id: 7, ordre_affichage: 5 },
      { nom: 'Sérologie Hépatite B (HBs Ag)', description: 'Antigène de surface hépatite B', valeurs_normales: 'Négatif', unite: '', categorie_id: 7, ordre_affichage: 6 },
      { nom: 'Sérologie Hépatite C', description: 'Anticorps anti-VHC', valeurs_normales: 'Négatif', unite: '', categorie_id: 7, ordre_affichage: 7 },
      { nom: 'Sérologie Toxoplasmose IgG', description: 'Immunité toxoplasmose', valeurs_normales: 'Variable', unite: 'UI/mL', categorie_id: 7, ordre_affichage: 8 },
      { nom: 'Sérologie Toxoplasmose IgM', description: 'Infection récente toxoplasmose', valeurs_normales: 'Négatif', unite: '', categorie_id: 7, ordre_affichage: 9 },
      { nom: 'Sérologie Rubéole IgG', description: 'Immunité rubéole', valeurs_normales: '>10 UI/mL', unite: 'UI/mL', categorie_id: 7, ordre_affichage: 10 },
      { nom: 'Sérologie CMV IgG', description: 'Immunité cytomégalovirus', valeurs_normales: 'Variable', unite: 'UA/mL', categorie_id: 7, ordre_affichage: 11 },
      { nom: 'Sérologie CMV IgM', description: 'Infection récente CMV', valeurs_normales: 'Négatif', unite: '', categorie_id: 7, ordre_affichage: 12 },
      
      // VITAMINES ET MINÉRAUX (categorie_id: 8) - More vitamins and minerals
      { nom: 'Folates (Vitamine B9)', description: 'Acide folique', valeurs_normales: '3-17 ng/mL', unite: 'ng/mL', categorie_id: 8, ordre_affichage: 4 },
      { nom: 'Vitamine B1 (Thiamine)', description: 'Vitamine B1', valeurs_normales: '70-180 nmol/L', unite: 'nmol/L', categorie_id: 8, ordre_affichage: 5 },
      { nom: 'Vitamine B6', description: 'Pyridoxine', valeurs_normales: '5-50 ng/mL', unite: 'ng/mL', categorie_id: 8, ordre_affichage: 6 },
      { nom: 'Vitamine C', description: 'Acide ascorbique', valeurs_normales: '0.4-2.0 mg/dL', unite: 'mg/dL', categorie_id: 8, ordre_affichage: 7 },
      { nom: 'Vitamine E', description: 'Tocophérol', valeurs_normales: '5-18 mg/L', unite: 'mg/L', categorie_id: 8, ordre_affichage: 8 },
      { nom: 'Vitamine A', description: 'Rétinol', valeurs_normales: '30-65 μg/dL', unite: 'μg/dL', categorie_id: 8, ordre_affichage: 9 },
      { nom: 'Zinc', description: 'Oligo-élément essentiel', valeurs_normales: '70-120 μg/dL', unite: 'μg/dL', categorie_id: 8, ordre_affichage: 10 },
      { nom: 'Cuivre', description: 'Oligo-élément', valeurs_normales: '70-140 μg/dL', unite: 'μg/dL', categorie_id: 8, ordre_affichage: 11 },
      { nom: 'Sélénium', description: 'Oligo-élément antioxydant', valeurs_normales: '70-150 μg/L', unite: 'μg/L', categorie_id: 8, ordre_affichage: 12 },
      { nom: 'Ferritine', description: 'Réserves en fer', valeurs_normales: 'H: 30-400 ng/mL, F: 15-150 ng/mL', unite: 'ng/mL', categorie_id: 8, ordre_affichage: 13 },
      { nom: 'Transferrine', description: 'Protéine de transport du fer', valeurs_normales: '200-360 mg/dL', unite: 'mg/dL', categorie_id: 8, ordre_affichage: 14 },
      { nom: 'Coefficient de saturation de la transferrine', description: 'Saturation en fer', valeurs_normales: '20-50%', unite: '%', categorie_id: 8, ordre_affichage: 15 },
      
      // MARQUEURS TUMORAUX (categorie_id: 9) - Cancer markers
      { nom: 'PSA total', description: 'Antigène prostatique spécifique', valeurs_normales: '<4 ng/mL', unite: 'ng/mL', categorie_id: 9, ordre_affichage: 1 },
      { nom: 'PSA libre', description: 'PSA libre', valeurs_normales: 'Ratio libre/total >15%', unite: 'ng/mL', categorie_id: 9, ordre_affichage: 2 },
      { nom: 'CEA', description: 'Antigène carcinoembryonnaire', valeurs_normales: '<5 ng/mL', unite: 'ng/mL', categorie_id: 9, ordre_affichage: 3 },
      { nom: 'CA 19-9', description: 'Marqueur pancréatique', valeurs_normales: '<37 U/mL', unite: 'U/mL', categorie_id: 9, ordre_affichage: 4 },
      { nom: 'CA 15-3', description: 'Marqueur mammaire', valeurs_normales: '<30 U/mL', unite: 'U/mL', categorie_id: 9, ordre_affichage: 5 },
      { nom: 'CA 125', description: 'Marqueur ovarien', valeurs_normales: '<35 U/mL', unite: 'U/mL', categorie_id: 9, ordre_affichage: 6 },
      { nom: 'Alpha-fœtoprotéine (AFP)', description: 'Marqueur hépatique et testiculaire', valeurs_normales: '<10 ng/mL', unite: 'ng/mL', categorie_id: 9, ordre_affichage: 7 },
      { nom: 'HCG beta', description: 'Hormone chorionique gonadotrope', valeurs_normales: 'H: <2 mUI/mL, F non enceinte: <5 mUI/mL', unite: 'mUI/mL', categorie_id: 9, ordre_affichage: 8 },
      { nom: 'Calcitonine', description: 'Marqueur thyroïdien', valeurs_normales: 'H: <11.5 pg/mL, F: <4.6 pg/mL', unite: 'pg/mL', categorie_id: 9, ordre_affichage: 9 },
      { nom: 'Thyroglobuline', description: 'Marqueur thyroïdien', valeurs_normales: '<55 ng/mL', unite: 'ng/mL', categorie_id: 9, ordre_affichage: 10 },
      
      // CARDIOLOGIE (categorie_id: 10) - More cardiac markers
      { nom: 'Troponine T', description: 'Marqueur d\'infarctus', valeurs_normales: '<0.014 ng/mL', unite: 'ng/mL', categorie_id: 10, ordre_affichage: 3 },
      { nom: 'Myoglobine', description: 'Marqueur précoce d\'infarctus', valeurs_normales: 'H: 28-72 ng/mL, F: 25-58 ng/mL', unite: 'ng/mL', categorie_id: 10, ordre_affichage: 4 },
      { nom: 'LDH1', description: 'Isoforme cardiaque de LDH', valeurs_normales: '45-90 UI/L', unite: 'UI/L', categorie_id: 10, ordre_affichage: 5 },
      { nom: 'BNP', description: 'Peptide natriurétique de type B', valeurs_normales: '<100 pg/mL', unite: 'pg/mL', categorie_id: 10, ordre_affichage: 6 },
      { nom: 'NT-proBNP', description: 'Fragment N-terminal du proBNP', valeurs_normales: '<125 pg/mL', unite: 'pg/mL', categorie_id: 10, ordre_affichage: 7 },
      { nom: 'Homocystéine', description: 'Facteur de risque cardiovasculaire', valeurs_normales: '<15 μmol/L', unite: 'μmol/L', categorie_id: 10, ordre_affichage: 8 },
      
      // COAGULATION (categorie_id: 11) - Coagulation tests
      { nom: 'Temps de Quick (TP)', description: 'Temps de prothrombine', valeurs_normales: '70-100%', unite: '%', categorie_id: 11, ordre_affichage: 1 },
      { nom: 'INR', description: 'International Normalized Ratio', valeurs_normales: '0.8-1.2', unite: '', categorie_id: 11, ordre_affichage: 2 },
      { nom: 'Temps de céphaline activée (TCA)', description: 'Temps de thromboplastine partielle', valeurs_normales: '25-35 sec', unite: 'sec', categorie_id: 11, ordre_affichage: 3 },
      { nom: 'Fibrinogène', description: 'Protéine de coagulation', valeurs_normales: '2-4 g/L', unite: 'g/L', categorie_id: 11, ordre_affichage: 4 },
      { nom: 'D-Dimères', description: 'Produits de dégradation de la fibrine', valeurs_normales: '<500 ng/mL', unite: 'ng/mL', categorie_id: 11, ordre_affichage: 5 },
      { nom: 'Antithrombine III', description: 'Inhibiteur de coagulation', valeurs_normales: '80-120%', unite: '%', categorie_id: 11, ordre_affichage: 6 },
      { nom: 'Protéine C', description: 'Anticoagulant naturel', valeurs_normales: '70-140%', unite: '%', categorie_id: 11, ordre_affichage: 7 },
      { nom: 'Protéine S', description: 'Anticoagulant naturel', valeurs_normales: '60-140%', unite: '%', categorie_id: 11, ordre_affichage: 8 },
      { nom: 'Facteur V Leiden', description: 'Mutation thrombophilique', valeurs_normales: 'Absent', unite: '', categorie_id: 11, ordre_affichage: 9 },
      
      // UROLOGIE (categorie_id: 12) - Urine tests
      { nom: 'Protéinurie', description: 'Protéines dans les urines', valeurs_normales: '<150 mg/24h', unite: 'mg/24h', categorie_id: 12, ordre_affichage: 1 },
      { nom: 'Microalbuminurie', description: 'Albumine urinaire', valeurs_normales: '<30 mg/g créatinine', unite: 'mg/g', categorie_id: 12, ordre_affichage: 2 },
      { nom: 'Créatinine urinaire', description: 'Créatinine dans les urines', valeurs_normales: '0.8-1.8 g/24h', unite: 'g/24h', categorie_id: 12, ordre_affichage: 3 },
      { nom: 'Clairance de la créatinine', description: 'Fonction rénale', valeurs_normales: '>90 mL/min/1.73m²', unite: 'mL/min/1.73m²', categorie_id: 12, ordre_affichage: 4 },
      { nom: 'Débit de filtration glomérulaire (DFG)', description: 'Fonction rénale estimée', valeurs_normales: '>90 mL/min/1.73m²', unite: 'mL/min/1.73m²', categorie_id: 12, ordre_affichage: 5 },
      { nom: 'Sédiment urinaire', description: 'Examen microscopique des urines', valeurs_normales: 'Normal', unite: '', categorie_id: 12, ordre_affichage: 6 },
      { nom: 'Nitrites urinaires', description: 'Marqueur d\'infection urinaire', valeurs_normales: 'Négatif', unite: '', categorie_id: 12, ordre_affichage: 7 },
      { nom: 'Leucocytes urinaires', description: 'Globules blancs dans les urines', valeurs_normales: '<10/μL', unite: '/μL', categorie_id: 12, ordre_affichage: 8 },
      { nom: 'Hématies urinaires', description: 'Globules rouges dans les urines', valeurs_normales: '<5/μL', unite: '/μL', categorie_id: 12, ordre_affichage: 9 },
      { nom: 'Glucose urinaire', description: 'Sucre dans les urines', valeurs_normales: 'Négatif', unite: '', categorie_id: 12, ordre_affichage: 10 },
      { nom: 'Cétones urinaires', description: 'Corps cétoniques', valeurs_normales: 'Négatif', unite: '', categorie_id: 12, ordre_affichage: 11 }
    ];
    
    console.log('Inserting comprehensive analysis types...');
    let insertedCount = 0;
    
    for (const analysis of analysisTypes) {
      try {
        // Check if this analysis type already exists
        const [existingAnalysis] = await db.execute(
          'SELECT id FROM types_analyses WHERE nom = ? AND categorie_id = ?',
          [analysis.nom, analysis.categorie_id]
        );
        
        if (existingAnalysis.length === 0) {
          await db.execute(`
            INSERT INTO types_analyses (nom, description, valeurs_normales, unite, categorie_id, ordre_affichage)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            analysis.nom,
            analysis.description,
            analysis.valeurs_normales,
            analysis.unite,
            analysis.categorie_id,
            analysis.ordre_affichage
          ]);
          insertedCount++;
        } else {
          console.log(`Analysis type "${analysis.nom}" already exists, skipping...`);
        }
      } catch (error) {
        console.error(`Error inserting analysis type "${analysis.nom}":`, error.message);
      }
    }
    
    console.log(`Successfully added ${insertedCount} new analysis types to the database`);
    
    // Verify final count
    const [finalResult] = await db.execute('SELECT COUNT(*) as count FROM types_analyses');
    console.log('Total analysis types in database:', finalResult[0].count);
    
    // Show count by category
    const [categoryCount] = await db.execute(`
      SELECT ca.nom as categorie, COUNT(ta.id) as count
      FROM categories_analyses ca
      LEFT JOIN types_analyses ta ON ca.id = ta.categorie_id
      GROUP BY ca.id, ca.nom
      ORDER BY ca.ordre_affichage
    `);
    
    console.log('\nAnalysis types by category:');
    categoryCount.forEach(cat => {
      console.log(`- ${cat.categorie}: ${cat.count} types`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding comprehensive analysis types:', error);
    process.exit(1);
  }
}

addComprehensiveAnalysisTypes();

// To run: cd plateforme-medicale/backend && node add-comprehensive-analysis-types.js 
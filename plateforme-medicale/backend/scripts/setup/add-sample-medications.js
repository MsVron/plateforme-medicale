const db = require('./config/db');

async function addSampleMedications() {
  try {
    console.log('=== ADDING SAMPLE MEDICATIONS ===');
    
    // Check if medications already exist
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM medicaments');
    if (existing[0].count > 0) {
      console.log('Medications already exist in database:', existing[0].count);
      process.exit(0);
    }
    
    const medications = [
      // Common medications
      { nom_commercial: 'Doliprane', nom_molecule: 'Paracétamol', dosage: '500mg', forme: 'comprimé' },
      { nom_commercial: 'Efferalgan', nom_molecule: 'Paracétamol', dosage: '1g', forme: 'comprimé' },
      { nom_commercial: 'Advil', nom_molecule: 'Ibuprofène', dosage: '400mg', forme: 'comprimé' },
      { nom_commercial: 'Nurofen', nom_molecule: 'Ibuprofène', dosage: '200mg', forme: 'comprimé' },
      { nom_commercial: 'Aspégic', nom_molecule: 'Aspirine', dosage: '100mg', forme: 'poudre' },
      { nom_commercial: 'Kardégic', nom_molecule: 'Aspirine', dosage: '75mg', forme: 'comprimé' },
      
      // Antibiotics
      { nom_commercial: 'Amoxicilline', nom_molecule: 'Amoxicilline', dosage: '500mg', forme: 'gélule' },
      { nom_commercial: 'Augmentin', nom_molecule: 'Amoxicilline + Acide clavulanique', dosage: '1g', forme: 'comprimé' },
      { nom_commercial: 'Zithromax', nom_molecule: 'Azithromycine', dosage: '250mg', forme: 'comprimé' },
      { nom_commercial: 'Ciflox', nom_molecule: 'Ciprofloxacine', dosage: '500mg', forme: 'comprimé' },
      
      // Cardiovascular
      { nom_commercial: 'Amlor', nom_molecule: 'Amlodipine', dosage: '5mg', forme: 'comprimé' },
      { nom_commercial: 'Coversyl', nom_molecule: 'Périndopril', dosage: '4mg', forme: 'comprimé' },
      { nom_commercial: 'Kardégic', nom_molecule: 'Aspirine', dosage: '75mg', forme: 'comprimé' },
      { nom_commercial: 'Plavix', nom_molecule: 'Clopidogrel', dosage: '75mg', forme: 'comprimé' },
      
      // Diabetes
      { nom_commercial: 'Glucophage', nom_molecule: 'Metformine', dosage: '850mg', forme: 'comprimé' },
      { nom_commercial: 'Diamicron', nom_molecule: 'Gliclazide', dosage: '30mg', forme: 'comprimé' },
      
      // Respiratory
      { nom_commercial: 'Ventoline', nom_molecule: 'Salbutamol', dosage: '100µg', forme: 'inhalateur' },
      { nom_commercial: 'Seretide', nom_molecule: 'Salmétérol + Fluticasone', dosage: '25/125µg', forme: 'inhalateur' },
      
      // Gastrointestinal
      { nom_commercial: 'Mopral', nom_molecule: 'Oméprazole', dosage: '20mg', forme: 'gélule' },
      { nom_commercial: 'Inexium', nom_molecule: 'Esoméprazole', dosage: '40mg', forme: 'comprimé' },
      { nom_commercial: 'Smecta', nom_molecule: 'Diosmectite', dosage: '3g', forme: 'poudre' },
      
      // Psychiatric
      { nom_commercial: 'Lexomil', nom_molecule: 'Bromazépam', dosage: '6mg', forme: 'comprimé' },
      { nom_commercial: 'Xanax', nom_molecule: 'Alprazolam', dosage: '0.25mg', forme: 'comprimé' },
      { nom_commercial: 'Prozac', nom_molecule: 'Fluoxétine', dosage: '20mg', forme: 'gélule' },
      
      // Vitamins and supplements
      { nom_commercial: 'Tardyferon', nom_molecule: 'Sulfate ferreux', dosage: '80mg', forme: 'comprimé' },
      { nom_commercial: 'Zyma D', nom_molecule: 'Vitamine D3', dosage: '10000 UI', forme: 'solution' },
      { nom_commercial: 'Bépanthène', nom_molecule: 'Dexpanthénol', dosage: '5%', forme: 'pommade' }
    ];
    
    console.log('Inserting medications...');
    for (const med of medications) {
      await db.execute(`
        INSERT INTO medicaments (nom_commercial, nom_molecule, dosage, forme, description)
        VALUES (?, ?, ?, ?, ?)
      `, [
        med.nom_commercial,
        med.nom_molecule,
        med.dosage,
        med.forme,
        `${med.nom_commercial} - ${med.nom_molecule} ${med.dosage}`
      ]);
    }
    
    console.log(`Successfully added ${medications.length} medications to the database`);
    
    // Verify insertion
    const [result] = await db.execute('SELECT COUNT(*) as count FROM medicaments');
    console.log('Total medications in database:', result[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding medications:', error);
    process.exit(1);
  }
}

addSampleMedications();

// cd plateforme-medicale/backend && node add-sample-medications.js
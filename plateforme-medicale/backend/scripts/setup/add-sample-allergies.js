const db = require('./config/db');

async function addSampleAllergies() {
  try {
    console.log('=== ADDING SAMPLE ALLERGIES ===');
    
    // Check if allergies already exist
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM allergies');
    if (existing[0].count > 0) {
      console.log('Allergies already exist in database:', existing[0].count);
      process.exit(0);
    }
    
    const allergies = [
      // Common drug allergies
      { nom: 'Pénicilline', description: 'Allergie aux antibiotiques de la famille des pénicillines' },
      { nom: 'Aspirine', description: 'Allergie à l\'acide acétylsalicylique' },
      { nom: 'Ibuprofène', description: 'Allergie aux anti-inflammatoires non stéroïdiens' },
      { nom: 'Codéine', description: 'Allergie aux opiacés' },
      { nom: 'Sulfamides', description: 'Allergie aux antibiotiques sulfamidés' },
      
      // Food allergies
      { nom: 'Arachides', description: 'Allergie aux cacahuètes et dérivés' },
      { nom: 'Fruits à coque', description: 'Allergie aux noix, amandes, noisettes' },
      { nom: 'Lait', description: 'Allergie aux protéines de lait de vache' },
      { nom: 'Œufs', description: 'Allergie aux protéines d\'œuf' },
      { nom: 'Gluten', description: 'Allergie au gluten (maladie cœliaque)' },
      { nom: 'Poisson', description: 'Allergie aux protéines de poisson' },
      { nom: 'Crustacés', description: 'Allergie aux fruits de mer' },
      { nom: 'Soja', description: 'Allergie aux protéines de soja' },
      
      // Environmental allergies
      { nom: 'Pollen', description: 'Allergie aux pollens (rhume des foins)' },
      { nom: 'Acariens', description: 'Allergie aux acariens de la poussière' },
      { nom: 'Poils d\'animaux', description: 'Allergie aux allergènes d\'animaux domestiques' },
      { nom: 'Latex', description: 'Allergie au latex naturel' },
      { nom: 'Nickel', description: 'Allergie de contact au nickel' },
      
      // Other common allergies
      { nom: 'Iode', description: 'Allergie à l\'iode (produits de contraste)' },
      { nom: 'Anesthésiques locaux', description: 'Allergie aux anesthésiques locaux' },
      { nom: 'Parfums', description: 'Allergie aux parfums et fragrances' }
    ];
    
    console.log('Inserting allergies...');
    for (const allergy of allergies) {
      await db.execute(`
        INSERT INTO allergies (nom, description)
        VALUES (?, ?)
      `, [allergy.nom, allergy.description]);
    }
    
    console.log(`Successfully added ${allergies.length} allergies to the database`);
    
    // Verify insertion
    const [result] = await db.execute('SELECT COUNT(*) as count FROM allergies');
    console.log('Total allergies in database:', result[0].count);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding allergies:', error);
    process.exit(1);
  }
}

addSampleAllergies(); 

// cd plateforme-medicale/backend && node add-sample-allergies.js
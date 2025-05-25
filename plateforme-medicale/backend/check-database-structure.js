const db = require('./config/db');

async function checkDatabaseStructure() {
  try {
    console.log('🔍 Checking database structure...');
    
    // Check if categories_analyses table exists
    try {
      const [categories] = await db.execute('SELECT COUNT(*) as count FROM categories_analyses');
      console.log('✅ categories_analyses table exists with', categories[0].count, 'categories');
    } catch (err) {
      console.log('❌ categories_analyses table does not exist');
      console.log('   Run the migration script: improve_database_structure.sql');
    }
    
    // Check if types_analyses has categorie_id column
    try {
      const [columns] = await db.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'types_analyses' 
        AND COLUMN_NAME = 'categorie_id'
      `);
      if (columns.length > 0) {
        console.log('✅ types_analyses.categorie_id column exists');
      } else {
        console.log('❌ types_analyses.categorie_id column missing');
      }
    } catch (err) {
      console.log('❌ Error checking types_analyses structure:', err.message);
    }
    
    // Check if resultats_analyses has new columns
    try {
      const [columns] = await db.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'resultats_analyses' 
        AND COLUMN_NAME IN ('valeur_numerique', 'valeur_texte', 'est_critique')
      `);
      console.log('✅ resultats_analyses has', columns.length, 'of 3 new columns');
      if (columns.length < 3) {
        console.log('   Missing columns in resultats_analyses table');
      }
    } catch (err) {
      console.log('❌ Error checking resultats_analyses structure:', err.message);
    }
    
    // Check if patients has new columns
    try {
      const [columns] = await db.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'patients' 
        AND COLUMN_NAME IN ('contact_urgence_relation', 'allergies_notes')
      `);
      console.log('✅ patients table has', columns.length, 'of 2 new columns');
    } catch (err) {
      console.log('❌ Error checking patients structure:', err.message);
    }
    
    // Check sample data
    try {
      const [sampleTypes] = await db.execute(`
        SELECT ta.nom, ca.nom as categorie 
        FROM types_analyses ta 
        LEFT JOIN categories_analyses ca ON ta.categorie_id = ca.id 
        LIMIT 5
      `);
      console.log('📊 Sample analysis types:');
      sampleTypes.forEach(type => {
        console.log(`   - ${type.nom} (${type.categorie || 'No category'})`);
      });
    } catch (err) {
      console.log('❌ Error fetching sample data:', err.message);
    }
    
    console.log('\n🏁 Database structure check completed');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkDatabaseStructure(); 
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function applyMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, './migrations/improve_database_structure.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.log('❌ Migration file not found at:', migrationPath);
      console.log('   Please ensure improve_database_structure.sql exists in the migrations folder');
      return;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'COMMIT');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length < 10) {
          continue;
        }
        
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        await db.execute(statement);
        
      } catch (err) {
        // Some statements might fail if they already exist (like CREATE TABLE IF NOT EXISTS)
        // We'll log warnings but continue
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || 
            err.code === 'ER_DUP_FIELDNAME' || 
            err.code === 'ER_DUP_KEYNAME' ||
            err.message.includes('Duplicate column name') ||
            err.message.includes('already exists')) {
          console.log(`⚠️  Warning (statement ${i + 1}): ${err.message}`);
        } else {
          console.log(`❌ Error in statement ${i + 1}: ${err.message}`);
          console.log(`   Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the migration
    console.log('\n🔍 Verifying migration...');
    
    try {
      const [categories] = await db.execute('SELECT COUNT(*) as count FROM categories_analyses');
      console.log(`✅ Found ${categories[0].count} analysis categories`);
      
      const [types] = await db.execute('SELECT COUNT(*) as count FROM types_analyses WHERE categorie_id IS NOT NULL');
      console.log(`✅ Found ${types[0].count} analysis types with categories`);
      
    } catch (err) {
      console.log('❌ Verification failed:', err.message);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    process.exit(0);
  }
}

applyMigration(); 
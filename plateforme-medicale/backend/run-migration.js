const mysql = require('mysql2/promise');
const fs = require('fs');

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'plateforme_medicale'
    });
    
    console.log('🔄 Running walk-in patient migration...');
    
    const migrationSQL = fs.readFileSync('./migrations/add_walkin_patient_enhancements.sql', 'utf8');
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✓ Executed:', statement.trim().substring(0, 50) + '...');
        } catch (err) {
          if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_INDEX') {
            console.log('⚠ Index already exists, skipping:', statement.trim().substring(0, 50) + '...');
          } else if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠ Column already exists, skipping:', statement.trim().substring(0, 50) + '...');
          } else {
            throw err;
          }
        }
      }
    }
    
    await connection.end();
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration(); 
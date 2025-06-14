const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function importDatabase() {
  try {
    // Railway MySQL connection
    const connection = await mysql.createConnection({
      host: 'mysql.railway.internal',
      user: 'root',
      password: 'kFdKYAdkQCXNXJhBVLXEHROcyFJkuFfy',
      database: 'railway',
      multipleStatements: true
    });

    console.log('Connected to Railway MySQL database');

    // Read and execute master install script
    const masterInstallPath = path.join(__dirname, '../../sql_structure/master_install.sql');
    if (fs.existsSync(masterInstallPath)) {
      const masterInstallSQL = fs.readFileSync(masterInstallPath, 'utf8');
      console.log('Executing master install script...');
      await connection.execute(masterInstallSQL);
      console.log('Master install completed');
    }

    // Read and execute migrations
    const migrationsPath = path.join(__dirname, 'migrations/run_all_migrations.sql');
    if (fs.existsSync(migrationsPath)) {
      const migrationsSQL = fs.readFileSync(migrationsPath, 'utf8');
      console.log('Executing migrations...');
      await connection.execute(migrationsSQL);
      console.log('Migrations completed');
    }

    await connection.end();
    console.log('Database import completed successfully!');
  } catch (error) {
    console.error('Database import failed:', error);
    process.exit(1);
  }
}

importDatabase(); 
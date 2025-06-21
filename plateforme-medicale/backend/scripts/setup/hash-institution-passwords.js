const bcrypt = require('bcrypt');
const db = require('../../config/db');

/**
 * Script to hash temporary passwords for institution user accounts
 * This should be run after the SQL migration that creates institution accounts
 */

async function hashInstitutionPasswords() {
    try {
        console.log('🔐 Starting password hashing for institution accounts...');

        // Get all users with temporary passwords that need to be hashed
        const [tempUsers] = await db.execute(`
            SELECT 
                u.id,
                u.nom_utilisateur,
                u.mot_de_passe,
                u.role,
                i.nom as institution_nom,
                log.temp_password
            FROM utilisateurs u
            JOIN institutions i ON u.id_specifique_role = i.id
            LEFT JOIN institution_user_creation_log log ON i.id = log.institution_id
            WHERE u.mot_de_passe LIKE 'TEMP_%_NEEDS_BCRYPT_HASH'
            AND u.role IN ('hospital', 'pharmacy', 'laboratory', 'institution')
        `);

        if (tempUsers.length === 0) {
            console.log('✅ No temporary passwords found that need hashing.');
            return;
        }

        console.log(`📊 Found ${tempUsers.length} accounts with temporary passwords to hash.`);

        let successCount = 0;
        let errorCount = 0;

        for (const user of tempUsers) {
            try {
                // Extract the temporary password from the placeholder
                const tempPasswordMatch = user.mot_de_passe.match(/TEMP_(.+)_NEEDS_BCRYPT_HASH/);
                let tempPassword;

                if (tempPasswordMatch) {
                    tempPassword = tempPasswordMatch[1];
                } else if (user.temp_password) {
                    // Fallback to log table if available
                    tempPassword = user.temp_password;
                } else {
                    console.error(`❌ Could not extract password for user: ${user.nom_utilisateur}`);
                    errorCount++;
                    continue;
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(tempPassword, 10);

                // Update the user record
                await db.execute(
                    'UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?',
                    [hashedPassword, user.id]
                );

                console.log(`✅ Hashed password for: ${user.nom_utilisateur} (${user.institution_nom})`);
                successCount++;

            } catch (error) {
                console.error(`❌ Error hashing password for ${user.nom_utilisateur}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n📋 Summary:');
        console.log(`✅ Successfully hashed: ${successCount} passwords`);
        console.log(`❌ Errors: ${errorCount} passwords`);

        if (successCount > 0) {
            console.log('\n🔑 Institution Login Credentials:');
            console.log('=====================================');

            // Display the credentials for manual distribution
            const [credentials] = await db.execute(`
                SELECT 
                    i.nom as institution_name,
                    i.type,
                    u.nom_utilisateur as username,
                    log.temp_password as password,
                    u.email as email
                FROM institution_user_creation_log log
                JOIN institutions i ON log.institution_id = i.id
                JOIN utilisateurs u ON u.id_specifique_role = i.id AND u.role = i.type_institution
                WHERE log.password_changed = FALSE
                ORDER BY i.type, i.nom
            `);

            credentials.forEach(cred => {
                console.log(`
Institution: ${cred.institution_name} (${cred.type})
Username: ${cred.username}
Password: ${cred.password}
Email: ${cred.email}
---`);
            });

            // Mark passwords as changed in the log
            await db.execute(`
                UPDATE institution_user_creation_log 
                SET password_changed = TRUE, notes = 'Passwords hashed successfully'
                WHERE password_changed = FALSE
            `);

            console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
            console.log('1. These are temporary passwords - institutions should change them on first login');
            console.log('2. Distribute these credentials securely to the respective institutions');
            console.log('3. Consider implementing a password reset mechanism');
            console.log('4. The temporary passwords have been marked as processed in the log table');
        }

    } catch (error) {
        console.error('💥 Fatal error during password hashing:', error);
        process.exit(1);
    }
}

// Function to clean up the log table (optional)
async function cleanupLogTable() {
    try {
        const [result] = await db.execute(`
            DELETE FROM institution_user_creation_log 
            WHERE password_changed = TRUE 
            AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        if (result.affectedRows > 0) {
            console.log(`🧹 Cleaned up ${result.affectedRows} old log entries`);
        }
    } catch (error) {
        console.error('Error cleaning up log table:', error);
    }
}

// Main execution
async function main() {
    try {
        await hashInstitutionPasswords();
        
        // Optional cleanup of old log entries
        if (process.argv.includes('--cleanup')) {
            await cleanupLogTable();
        }

        console.log('\n🎉 Institution password hashing completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Script failed:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    hashInstitutionPasswords,
    cleanupLogTable
}; 
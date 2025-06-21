-- Migration to add user accounts for existing institutions
-- This script creates user accounts for institutions that don't have them yet
-- Excludes "cabinet privé" as they don't need login credentials

-- First, let's see which institutions need user accounts
SELECT 
    i.id,
    i.nom,
    i.type,
    i.type_institution,
    i.email_contact,
    CASE 
        WHEN u.id IS NULL THEN 'Needs Account'
        ELSE 'Has Account'
    END as account_status
FROM institutions i
LEFT JOIN utilisateurs u ON u.role = i.type_institution AND u.id_specifique_role = i.id
WHERE i.est_actif = TRUE
AND i.type != 'cabinet privé'
ORDER BY i.type, i.nom;

-- Create user accounts for institutions that don't have them
-- This will be done through a stored procedure to handle username generation and duplicates

DELIMITER //

CREATE PROCEDURE CreateInstitutionUserAccounts()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE inst_id INT;
    DECLARE inst_nom VARCHAR(100);
    DECLARE inst_type VARCHAR(50);
    DECLARE inst_type_institution VARCHAR(50);
    DECLARE inst_email VARCHAR(100);
    DECLARE username VARCHAR(100);
    DECLARE temp_password VARCHAR(50);
    DECLARE hashed_password VARCHAR(255);
    DECLARE counter INT DEFAULT 1;
    DECLARE username_exists INT DEFAULT 0;
    
    -- Cursor to get institutions without user accounts
    DECLARE inst_cursor CURSOR FOR 
        SELECT 
            i.id, i.nom, i.type, i.type_institution, i.email_contact
        FROM institutions i
        LEFT JOIN utilisateurs u ON u.role = i.type_institution AND u.id_specifique_role = i.id
        WHERE i.est_actif = TRUE
        AND i.type != 'cabinet privé'
        AND u.id IS NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN inst_cursor;
    
    read_loop: LOOP
        FETCH inst_cursor INTO inst_id, inst_nom, inst_type, inst_type_institution, inst_email;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Generate base username with comprehensive character cleaning
        -- Special handling for institution type
        SET @clean_type = CASE 
            WHEN LOWER(inst_type) = 'centre médical' OR LOWER(inst_type) = 'centre medical' THEN 'centre'
            ELSE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                    inst_type,
                    'à', 'a'), 'á', 'a'), 'â', 'a'), 'ã', 'a'), 'ä', 'a'), 'å', 'a'), 'æ', 'a'),
                    'è', 'e'), 'é', 'e'), 'ê', 'e'), 'ë', 'e'),
                    'ì', 'i'), 'í', 'i'), 'î', 'i'), 'ï', 'i'),
                    'ò', 'o'), 'ó', 'o'), 'ô', 'o'), 'õ', 'o'), 'ö', 'o'), 'ø', 'o'),
                    'ù', 'u'), 'ú', 'u'), 'û', 'u'), 'ü', 'u'),
                    'ý', 'y'), 'ÿ', 'y'), 'ç', 'c'), 'ñ', 'n'), 'œ', 'oe'), 'ß', 'ss'),
                    ' ', ''), '-', ''), '.', ''), '\'', ''), '"', ''), '(', ''), ')', ''), '[', ''), ']', ''), '{', ''), '}', ''),
                    '&', ''), '+', ''), '*', ''), '/', ''), '\\', ''), '|', ''), '!', ''), '?', ''), '@', ''), '#', ''), '$', ''), '%', ''), '^', ''), '=', ''), '<', ''), '>', ''), '~', ''), '`', ''))
        END;
        
        -- Clean institution name  
        SET @clean_name = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                inst_nom,
                'à', 'a'), 'á', 'a'), 'â', 'a'), 'ã', 'a'), 'ä', 'a'), 'å', 'a'), 'æ', 'a'),
                'è', 'e'), 'é', 'e'), 'ê', 'e'), 'ë', 'e'),
                'ì', 'i'), 'í', 'i'), 'î', 'i'), 'ï', 'i'),
                'ò', 'o'), 'ó', 'o'), 'ô', 'o'), 'õ', 'o'), 'ö', 'o'), 'ø', 'o'),
                'ù', 'u'), 'ú', 'u'), 'û', 'u'), 'ü', 'u'),
                'ý', 'y'), 'ÿ', 'y'), 'ç', 'c'), 'ñ', 'n'), 'œ', 'oe'), 'ß', 'ss'),
                ' ', ''), '-', ''), '.', ''), '\'', ''), '"', ''), '(', ''), ')', ''), '[', ''), ']', ''), '{', ''), '}', ''),
                '&', ''), '+', ''), '*', ''), '/', ''), '\\', ''), '|', ''), '!', ''), '?', ''), '@', ''), '#', ''), '$', ''), '%', ''), '^', ''), '=', ''), '<', ''), '>', ''), '~', ''), '`', ''));
        
        -- Generate username
        SET username = CONCAT(@clean_type, '.', @clean_name);
        
        -- Check for username uniqueness and increment if needed
        SET counter = 0;
        username_check: LOOP
            IF counter = 0 THEN
                SET @check_username = username;
            ELSE
                SET @check_username = CONCAT(username, counter);
            END IF;
            
            SELECT COUNT(*) INTO username_exists 
            FROM utilisateurs 
            WHERE nom_utilisateur = @check_username;
            
            IF username_exists = 0 THEN
                SET username = @check_username;
                LEAVE username_check;
            END IF;
            
            SET counter = counter + 1;
        END LOOP username_check;
        
        -- Generate temporary password (16 characters)
        SET temp_password = CONCAT(
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + RAND() * 36), 1)
        );
        
        -- Note: In a real application, you would hash the password with bcrypt
        -- For this migration, we'll create a placeholder that needs to be updated
        SET hashed_password = CONCAT('TEMP_', temp_password, '_NEEDS_BCRYPT_HASH');
        
        -- Insert user account
        INSERT INTO utilisateurs (
            nom_utilisateur, 
            mot_de_passe, 
            email, 
            role, 
            id_specifique_role, 
            est_actif, 
            est_verifie
        ) VALUES (
            username,
            hashed_password,
            inst_email,
            inst_type_institution,
            inst_id,
            TRUE,
            TRUE
        );
        
        -- Log the created account (you can query this table to see generated credentials)
        INSERT INTO institution_user_creation_log (
            institution_id,
            institution_nom,
            username,
            temp_password,
            created_at
        ) VALUES (
            inst_id,
            inst_nom,
            username,
            temp_password,
            NOW()
        );
        
    END LOOP;
    
    CLOSE inst_cursor;
END//

DELIMITER ;

-- Create a log table to track created accounts and their temporary passwords
CREATE TABLE IF NOT EXISTS institution_user_creation_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution_id INT NOT NULL,
    institution_nom VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    temp_password VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_changed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

-- Execute the procedure
CALL CreateInstitutionUserAccounts();

-- Show the results
SELECT 
    'Created user accounts for the following institutions:' as message;

SELECT 
    institution_nom as 'Institution Name',
    username as 'Username',
    temp_password as 'Temporary Password',
    'IMPORTANT: Passwords need to be properly hashed with bcrypt!' as 'Warning'
FROM institution_user_creation_log
ORDER BY institution_nom;

-- Clean up the procedure
DROP PROCEDURE CreateInstitutionUserAccounts;

-- Note: After running this migration, you need to run a Node.js script to properly hash the passwords 
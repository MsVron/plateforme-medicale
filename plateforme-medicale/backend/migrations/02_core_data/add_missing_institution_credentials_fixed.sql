-- ADD MISSING INSTITUTION CREDENTIALS (EXCLUDING PRIVATE CABINETS)
-- Migration to add login credentials for institutions that don't have them yet
-- EXCLUDES private cabinets which already have doctor credentials
-- Covers only hospitals, clinics, and medical centers from populate_hospitals_clinics_doctors.sql

-- ========================================
-- DIAGNOSTIC INFORMATION
-- ========================================

-- Check current state before adding credentials
SELECT 'DIAGNOSTIC: Current institutions without credentials (excluding private cabinets)' as info;

SELECT 
    i.id,
    i.nom,
    i.type,
    i.type_institution,
    i.ville,
    CASE 
        WHEN u.id IS NOT NULL THEN 'HAS_CREDENTIALS'
        ELSE 'MISSING_CREDENTIALS'
    END as credential_status
FROM institutions i
LEFT JOIN utilisateurs u ON (
    (i.type_institution = 'hospital' AND u.role = 'hospital' AND u.id_specifique_role = i.id) OR
    (i.type_institution = 'institution' AND u.role = 'institution' AND u.id_specifique_role = i.id)
)
WHERE i.type_institution IN ('hospital', 'institution')  -- Only hospitals, clinics, and centers
AND i.type != 'cabinet privé'  -- Exclude private cabinets
ORDER BY i.type_institution, i.nom;

-- ========================================
-- ADD MISSING INSTITUTION CREDENTIALS
-- ========================================

-- Add credentials for institutions that don't have them yet
-- EXCLUDING private cabinets (type_institution = 'clinic' with type = 'cabinet privé')
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie)
SELECT 
    -- Generate username from institution name (clean format)
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(i.nom, 'Hôpital ', ''),
                                'Clinique ', ''
                            ),
                            'Centre Médical ', ''
                        ),
                        ' ', '.'
                    ),
                    'é', 'e'
                ),
                'è', 'e'
            ),
            'ç', 'c'
        )
    ) as nom_utilisateur,
    
    -- Default password hash for 'admin123'
    '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K' as mot_de_passe,
    
    -- Generate system email to avoid conflicts
    CONCAT('admin.', LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(i.nom, 'Hôpital ', ''),
                                'Clinique ', ''
                            ),
                            'Centre Médical ', ''
                        ),
                        ' ', '.'
                    ),
                    'é', 'e'
                ),
                'è', 'e'
            ),
            'ç', 'c'
        )
    ), '@system.ma') as email,
    
    -- Role mapping based on type_institution
    CASE 
        WHEN i.type_institution = 'hospital' THEN 'hospital'
        WHEN i.type_institution = 'institution' THEN 'institution'
    END as role,
    
    i.id as id_specifique_role,
    TRUE as est_verifie

FROM institutions i
LEFT JOIN utilisateurs u ON (
    (i.type_institution = 'hospital' AND u.role = 'hospital' AND u.id_specifique_role = i.id) OR
    (i.type_institution = 'institution' AND u.role = 'institution' AND u.id_specifique_role = i.id)
)
WHERE i.type_institution IN ('hospital', 'institution')  -- Only hospitals, clinics, and centers
AND i.type != 'cabinet privé'  -- Exclude private cabinets
AND u.id IS NULL  -- Only institutions without credentials
AND i.est_actif = TRUE;

-- ========================================
-- VERIFICATION AND SUMMARY
-- ========================================

-- Show what was created
SELECT 'VERIFICATION: Newly created institution credentials' as info;

SELECT 
    u.nom_utilisateur,
    u.email,
    u.role,
    i.nom as institution_name,
    i.type,
    i.type_institution,
    i.ville
FROM utilisateurs u
JOIN institutions i ON u.id_specifique_role = i.id
WHERE u.role IN ('hospital', 'institution')
AND i.type != 'cabinet privé'
ORDER BY u.role, i.nom;

-- Summary count
SELECT 'SUMMARY: Institution credentials by type' as info;

SELECT 
    i.type_institution,
    i.type,
    COUNT(*) as total_institutions,
    COUNT(u.id) as institutions_with_credentials,
    COUNT(*) - COUNT(u.id) as institutions_missing_credentials
FROM institutions i
LEFT JOIN utilisateurs u ON (
    (i.type_institution = 'hospital' AND u.role = 'hospital' AND u.id_specifique_role = i.id) OR
    (i.type_institution = 'institution' AND u.role = 'institution' AND u.id_specifique_role = i.id)
)
WHERE i.type_institution IN ('hospital', 'institution')
AND i.type != 'cabinet privé'
GROUP BY i.type_institution, i.type
ORDER BY i.type_institution;

-- Expected login credentials for institutions (excluding private cabinets):
SELECT 'EXPECTED LOGIN CREDENTIALS (for new institutions only):' as info;
SELECT 
    i.nom as institution_name,
    i.type,
    i.type_institution,
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(i.nom, 'Hôpital ', ''),
                                'Clinique ', ''
                            ),
                            'Centre Médical ', ''
                        ),
                        ' ', '.'
                    ),
                    'é', 'e'
                ),
                'è', 'e'
            ),
            'ç', 'c'
        )
    ) as username,
    'admin123' as password,
    CASE 
        WHEN i.type_institution = 'hospital' THEN 'hospital'
        WHEN i.type_institution = 'institution' THEN 'institution'
    END as role
FROM institutions i
WHERE i.type_institution IN ('hospital', 'institution')
AND i.type != 'cabinet privé'  -- Exclude private cabinets
AND i.est_actif = TRUE
ORDER BY i.type_institution, i.nom;

-- Note about private cabinets
SELECT 'NOTE: Private cabinets are EXCLUDED from this migration' as info;
SELECT 'They already have doctor credentials from populate_moroccan_doctors.sql' as explanation; 
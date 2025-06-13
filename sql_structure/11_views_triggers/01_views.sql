-- DATABASE VIEWS
-- Useful views for the medical platform

-- Create a view to easily check institution login status
CREATE OR REPLACE VIEW v_institution_login_status AS
SELECT 
    i.id as institution_id,
    i.nom as institution_name,
    i.type_institution,
    i.status as institution_status,
    i.est_actif as institution_active,
    u.id as user_id,
    u.nom_utilisateur,
    u.email,
    u.est_actif as user_active,
    u.est_verifie as user_verified,
    u.derniere_connexion,
    CASE 
        WHEN u.id IS NOT NULL AND u.est_actif = TRUE AND i.est_actif = TRUE AND i.status = 'approved' 
        THEN TRUE 
        ELSE FALSE 
    END as can_login
FROM institutions i
LEFT JOIN utilisateurs u ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE i.est_actif = TRUE;

-- Create a view for institutional users with their details
CREATE OR REPLACE VIEW v_institutional_users AS
SELECT 
    u.id as user_id,
    u.nom_utilisateur,
    u.email,
    u.role,
    u.est_actif as user_active,
    u.est_verifie,
    u.derniere_connexion,
    i.id as institution_id,
    i.nom as institution_name,
    i.type_institution,
    i.status as institution_status,
    i.ville,
    i.telephone,
    i.email_contact
FROM utilisateurs u
INNER JOIN institutions i ON u.role = 'institution' AND u.id_specifique_role = i.id
WHERE u.est_actif = TRUE AND i.est_actif = TRUE; 
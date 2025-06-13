-- DATABASE TRIGGERS
-- Triggers for maintaining data consistency

-- Add triggers to maintain data consistency for institutional users
DELIMITER $$

CREATE TRIGGER tr_institution_user_create
AFTER INSERT ON utilisateurs
FOR EACH ROW
BEGIN
    -- When a new institutional user is created, log it
    IF NEW.role = 'institution' THEN
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, created_at)
        VALUES (NEW.id, 'INSTITUTION_USER_CREATED', 'utilisateurs', NEW.id, 
                JSON_OBJECT('institution_id', NEW.id_specifique_role, 'email', NEW.email), NOW());
    END IF;
END$$

CREATE TRIGGER tr_institution_status_change
AFTER UPDATE ON institutions
FOR EACH ROW
BEGIN
    -- When institution status changes, update corresponding user status
    IF OLD.status != NEW.status OR OLD.est_actif != NEW.est_actif THEN
        -- Deactivate user if institution is not approved or not active
        IF NEW.status != 'approved' OR NEW.est_actif = FALSE THEN
            UPDATE utilisateurs 
            SET est_actif = FALSE 
            WHERE role = 'institution' AND id_specifique_role = NEW.id;
        ELSE
            -- Reactivate user if institution becomes approved and active
            UPDATE utilisateurs 
            SET est_actif = TRUE 
            WHERE role = 'institution' AND id_specifique_role = NEW.id;
        END IF;
        
        -- Log the change
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, created_at)
        VALUES (1, 'INSTITUTION_STATUS_CHANGED', 'institutions', NEW.id, 
                JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status, 
                           'old_active', OLD.est_actif, 'new_active', NEW.est_actif), NOW());
    END IF;
END$$

DELIMITER ; 
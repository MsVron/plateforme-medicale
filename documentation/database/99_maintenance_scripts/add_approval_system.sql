-- APPROVAL SYSTEM MIGRATION SCRIPT
-- Run this script to add the approval system for admin actions

-- Update notifications table to support approval system
ALTER TABLE notifications 
ADD COLUMN related_request_id INT DEFAULT NULL,
ADD COLUMN related_request_type ENUM('institution', 'doctor') DEFAULT NULL,
MODIFY COLUMN type ENUM('rdv', 'annulation', 'rappel', 'résultat', 'système', 'approval_request', 'approval_response') NOT NULL,
ADD INDEX idx_notifications_user (utilisateur_id),
ADD INDEX idx_notifications_type (type),
ADD INDEX idx_notifications_unread (est_lue);

-- Create doctor change requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS doctor_change_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  medecin_id INT DEFAULT NULL,
  request_type ENUM('create', 'modify', 'delete') NOT NULL,
  requested_by_user_id INT NOT NULL,
  request_data JSON NOT NULL,
  current_data JSON DEFAULT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by_user_id INT DEFAULT NULL,
  review_comment TEXT DEFAULT NULL,
  date_requested TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_reviewed DATETIME DEFAULT NULL,
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (requested_by_user_id) REFERENCES utilisateurs(id),
  FOREIGN KEY (reviewed_by_user_id) REFERENCES utilisateurs(id),
  INDEX idx_doctor_change_requests_status (status),
  INDEX idx_doctor_change_requests_type (request_type),
  INDEX idx_doctor_change_requests_requested_by (requested_by_user_id)
);

-- Add sample notification for testing (optional)
INSERT INTO notifications (utilisateur_id, titre, message, type) 
SELECT 
    u.id,
    'Système d\'approbation activé',
    'Le système d\'approbation pour les modifications d\'institutions et de médecins est maintenant actif.',
    'système'
FROM utilisateurs u 
WHERE u.role = 'super_admin' 
AND u.est_actif = TRUE
LIMIT 1; 
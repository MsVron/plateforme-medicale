-- AUDIT AND ACTIVITY TRACKING
-- System audit logs and activity history

-- Table de l'historique des actions
CREATE TABLE historique_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  table_concernee VARCHAR(50) NOT NULL,
  enregistrement_id INT NOT NULL,
  description TEXT,
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  adresse_ip VARCHAR(45),
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT DEFAULT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id),
  INDEX idx_audit_logs_user (user_id),
  INDEX idx_audit_logs_entity (entity_type, entity_id),
  INDEX idx_audit_logs_action (action),
  INDEX idx_audit_logs_created (created_at)
); 
-- NOTIFICATIONS AND DOCUMENTS
-- System notifications and medical documents management

-- Table des notifications
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('rdv', 'annulation', 'rappel', 'résultat', 'système', 'approval_request', 'approval_response') NOT NULL,
  est_lue BOOLEAN DEFAULT FALSE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_lecture DATETIME,
  related_request_id INT DEFAULT NULL,
  related_request_type ENUM('institution', 'doctor') DEFAULT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id),
  INDEX idx_notifications_user (utilisateur_id),
  INDEX idx_notifications_type (type),
  INDEX idx_notifications_unread (est_lue)
);

-- Table des documents médicaux
CREATE TABLE documents_medicaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type ENUM('ordonnance', 'certificat', 'compte-rendu', 'lettre', 'autre') NOT NULL,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  document_url VARCHAR(255) NOT NULL,
  medecin_id INT NOT NULL,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  est_partage BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id)
); 
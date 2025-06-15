-- APPOINTMENTS MANAGEMENT
-- Appointment scheduling and management

-- Table des rendez-vous
CREATE TABLE rendez_vous (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  medecin_id INT NOT NULL,
  institution_id INT NOT NULL,
  date_heure_debut DATETIME NOT NULL,
  date_heure_fin DATETIME NOT NULL,
  motif VARCHAR(255) NOT NULL,
  statut ENUM('planifié', 'confirmé', 'en cours', 'terminé', 'annulé', 'patient absent') DEFAULT 'planifié',
  notes_patient TEXT,
  mode ENUM('présentiel') DEFAULT 'présentiel',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createur_id INT NOT NULL,
  rappel_24h_envoye BOOLEAN DEFAULT FALSE,
  rappel_1h_envoye BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (medecin_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
  FOREIGN KEY (createur_id) REFERENCES utilisateurs(id)
); 
-- Test appointments data for debugging
-- This script adds sample appointments to test the doctor appointments functionality

-- First, let's add some sample doctors and patients if they don't exist
INSERT IGNORE INTO specialites (nom, description) VALUES 
('Médecine générale', 'Médecine de premier recours et suivi global du patient'),
('Cardiologie', 'Spécialité médicale traitant des troubles du cœur et du système cardiovasculaire');

-- Add a sample institution
INSERT IGNORE INTO institutions (id, nom, adresse, ville, code_postal, pays, telephone, email_contact, type) VALUES 
(1, 'Clinique Test', '123 Rue de Test', 'Test City', '12345', 'France', '+33123456789', 'test@clinic.fr', 'clinique');

-- Add a sample doctor
INSERT IGNORE INTO medecins (id, prenom, nom, specialite_id, numero_ordre, telephone, email_professionnel, institution_id, est_actif) VALUES 
(1, 'Dr. Test', 'Medecin', 1, 'TEST123', '+33123456789', 'test.medecin@clinic.fr', 1, 1);

-- Add a corresponding user for the doctor
INSERT IGNORE INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES 
('testmedecin', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'test.medecin@clinic.fr', 'medecin', 1, TRUE);

-- Add a sample patient
INSERT IGNORE INTO patients (id, prenom, nom, date_naissance, sexe, telephone, email) VALUES 
(1, 'Test', 'Patient', '1990-01-01', 'M', '+33987654321', 'test.patient@email.fr');

-- Add a corresponding user for the patient
INSERT IGNORE INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES 
('testpatient', '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', 'test.patient@email.fr', 'patient', 1, TRUE);

-- Add some test appointments
INSERT IGNORE INTO rendez_vous (id, patient_id, medecin_id, institution_id, date_heure_debut, date_heure_fin, motif, statut, createur_id) VALUES 
(1, 1, 1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 30 MINUTE), 'Consultation de routine', 'planifié', 1),
(2, 1, 1, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 30 MINUTE), 'Suivi médical', 'confirmé', 1),
(3, 1, 1, 1, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 30 MINUTE), 'Contrôle', 'planifié', 1);

-- Verify the data was inserted
SELECT 'Appointments created:' as message;
SELECT 
  rv.id, 
  rv.date_heure_debut, 
  rv.motif, 
  rv.statut,
  p.prenom as patient_prenom, 
  p.nom as patient_nom,
  m.prenom as medecin_prenom, 
  m.nom as medecin_nom
FROM rendez_vous rv
JOIN patients p ON rv.patient_id = p.id
JOIN medecins m ON rv.medecin_id = m.id
WHERE rv.medecin_id = 1; 
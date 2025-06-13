-- SAMPLE INITIAL DATA
-- Sample data for specialties and institutions

-- Sample specialties data
INSERT INTO specialites (nom, description) VALUES
('Médecine générale', 'Médecine de premier recours et suivi global du patient'),
('Cardiologie', 'Spécialité médicale traitant des troubles du cœur et du système cardiovasculaire'),
('Pédiatrie', 'Spécialité médicale consacrée aux enfants et à leurs maladies'),
('Gynécologie-Obstétrique', 'Spécialité médicale qui s\'occupe de la santé du système reproducteur féminin et du suivi de grossesse'),
('Dermatologie', 'Spécialité médicale qui s\'occupe de la peau, des muqueuses et des phanères'),
('Ophtalmologie', 'Spécialité médicale concernant les yeux et la vision'),
('Orthopédie', 'Spécialité chirurgicale qui traite les troubles du système musculo-squelettique'),
('Neurologie', 'Spécialité médicale traitant des troubles du système nerveux'),
('Psychiatrie', 'Spécialité médicale traitant des troubles mentaux'),
('Radiologie', 'Spécialité médicale utilisant l\'imagerie pour diagnostiquer les maladies');

-- Sample institutions data
INSERT INTO institutions (nom, adresse, ville, code_postal, pays, telephone, email_contact, coordonnees_gps, latitude, longitude, type) VALUES 
('Hôpital Central', '15 Avenue de la République', 'Paris', '75011', 'France', '+33 1 45 67 89 10', 'contact@hopital-central.fr', '48.8566,2.3522', 48.8566, 2.3522, 'hôpital'),
('Clinique Nord', '8 Rue du Nord', 'Lyon', '69001', 'France', '+33 4 72 10 20 30', 'contact@clinique-nord.fr', '45.7640,4.8357', 45.7640, 4.8357, 'clinique');

-- Sample super admin data
INSERT INTO super_admins (prenom, nom, telephone, adresse)
VALUES ('Aya', 'Beroukech', '+212 614-026389', 'SupMTI Oujda');

-- Insert corresponding user for authentication
INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie)
VALUES (
  'ayaberroukech',
  '$2b$10$8Rg2IbdfEkvQ3AgfsVpZkOQbK16TDoWdmJ78baLcmHVvGIK2XMD6K', -- Password: admin
  'aya.beroukech@medical.com',
  'super_admin',
  1,
  TRUE
); 
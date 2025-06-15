-- MEDICAL IMAGING
-- Medical imaging types and results management

-- Table des types d'imagerie
CREATE TABLE types_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Table des résultats d'imagerie
CREATE TABLE resultats_imagerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  type_imagerie_id INT NOT NULL,
  medecin_prescripteur_id INT NOT NULL,
  date_prescription DATE NOT NULL,
  date_realisation DATE,
  institution_realisation_id INT,
  interpretation TEXT,
  conclusion TEXT,
  image_urls TEXT,
  medecin_radiologue_id INT,
  date_interpretation DATETIME,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (type_imagerie_id) REFERENCES types_imagerie(id),
  FOREIGN KEY (medecin_prescripteur_id) REFERENCES medecins(id),
  FOREIGN KEY (institution_realisation_id) REFERENCES institutions(id),
  FOREIGN KEY (medecin_radiologue_id) REFERENCES medecins(id)
); 
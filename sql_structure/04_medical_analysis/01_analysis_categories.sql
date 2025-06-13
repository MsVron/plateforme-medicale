-- MEDICAL ANALYSIS CATEGORIES AND TYPES
-- Structure for organizing medical analysis types by categories

-- Table des catégories d'analyses médicales
CREATE TABLE categories_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  ordre_affichage INT DEFAULT 0
);

-- Table des types d'analyses avec catégories
CREATE TABLE types_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  valeurs_normales TEXT,
  unite VARCHAR(20),
  categorie_id INT NOT NULL,
  ordre_affichage INT DEFAULT 0,
  FOREIGN KEY (categorie_id) REFERENCES categories_analyses(id)
);

-- Analysis structure indexes
CREATE INDEX idx_types_analyses_categorie ON types_analyses(categorie_id, ordre_affichage); 
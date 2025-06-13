-- FOREIGN KEY CONSTRAINTS
-- Foreign key constraints that need to be added after all tables are created

-- Add foreign key constraint after medecins table is created
ALTER TABLE institutions ADD CONSTRAINT institutions_ibfk_1 FOREIGN KEY (medecin_proprietaire_id) REFERENCES medecins (id); 
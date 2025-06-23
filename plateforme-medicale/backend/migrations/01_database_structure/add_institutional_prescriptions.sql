-- INSTITUTIONAL PRESCRIPTIONS SUPPORT
-- Allow hospitals, clinics, and centers to prescribe treatments and request analyses/imaging
-- Migration to support institutional prescriptions alongside doctor prescriptions

-- ========================================
-- SECTION 1: MODIFY TREATMENTS TABLE
-- ========================================

-- Make medecin_prescripteur_id nullable and add institutional prescriber fields
ALTER TABLE traitements 
MODIFY COLUMN medecin_prescripteur_id INT NULL,
ADD COLUMN prescripteur_type ENUM('medecin', 'institution') NOT NULL DEFAULT 'medecin',
ADD COLUMN institution_prescripteur_id INT NULL,
ADD COLUMN prescripteur_user_id INT NULL COMMENT 'User who created the prescription (hospital staff, etc.)',
ADD CONSTRAINT fk_traitements_institution_prescripteur 
  FOREIGN KEY (institution_prescripteur_id) REFERENCES institutions(id),
ADD CONSTRAINT fk_traitements_prescripteur_user 
  FOREIGN KEY (prescripteur_user_id) REFERENCES utilisateurs(id);

-- Add constraint to ensure either doctor or institution is specified
ALTER TABLE traitements 
ADD CONSTRAINT chk_traitements_prescripteur 
CHECK (
  (prescripteur_type = 'medecin' AND medecin_prescripteur_id IS NOT NULL AND institution_prescripteur_id IS NULL) OR
  (prescripteur_type = 'institution' AND institution_prescripteur_id IS NOT NULL AND medecin_prescripteur_id IS NULL)
);

-- Add indexes for better performance
CREATE INDEX idx_traitements_institution_prescripteur ON traitements(institution_prescripteur_id);
CREATE INDEX idx_traitements_prescripteur_type ON traitements(prescripteur_type);
CREATE INDEX idx_traitements_prescripteur_user ON traitements(prescripteur_user_id);

-- ========================================
-- SECTION 2: MODIFY ANALYSIS RESULTS TABLE
-- ========================================

-- Make medecin_prescripteur_id nullable and add institutional prescriber fields
ALTER TABLE resultats_analyses 
MODIFY COLUMN medecin_prescripteur_id INT NULL,
ADD COLUMN prescripteur_type ENUM('medecin', 'institution') NOT NULL DEFAULT 'medecin',
ADD COLUMN institution_prescripteur_id INT NULL,
ADD COLUMN prescripteur_user_id INT NULL COMMENT 'User who requested the analysis',
ADD CONSTRAINT fk_analyses_institution_prescripteur 
  FOREIGN KEY (institution_prescripteur_id) REFERENCES institutions(id),
ADD CONSTRAINT fk_analyses_prescripteur_user 
  FOREIGN KEY (prescripteur_user_id) REFERENCES utilisateurs(id);

-- Add constraint to ensure either doctor or institution is specified
ALTER TABLE resultats_analyses 
ADD CONSTRAINT chk_analyses_prescripteur 
CHECK (
  (prescripteur_type = 'medecin' AND medecin_prescripteur_id IS NOT NULL AND institution_prescripteur_id IS NULL) OR
  (prescripteur_type = 'institution' AND institution_prescripteur_id IS NOT NULL AND medecin_prescripteur_id IS NULL)
);

-- Add indexes for better performance
CREATE INDEX idx_analyses_institution_prescripteur ON resultats_analyses(institution_prescripteur_id);
CREATE INDEX idx_analyses_prescripteur_type ON resultats_analyses(prescripteur_type);
CREATE INDEX idx_analyses_prescripteur_user ON resultats_analyses(prescripteur_user_id);

-- ========================================
-- SECTION 3: MODIFY IMAGING RESULTS TABLE
-- ========================================

-- Make medecin_prescripteur_id nullable and add institutional prescriber fields
ALTER TABLE resultats_imagerie 
MODIFY COLUMN medecin_prescripteur_id INT NULL,
ADD COLUMN prescripteur_type ENUM('medecin', 'institution') NOT NULL DEFAULT 'medecin',
ADD COLUMN institution_prescripteur_id INT NULL,
ADD COLUMN prescripteur_user_id INT NULL COMMENT 'User who requested the imaging',
ADD CONSTRAINT fk_imagerie_institution_prescripteur 
  FOREIGN KEY (institution_prescripteur_id) REFERENCES institutions(id),
ADD CONSTRAINT fk_imagerie_prescripteur_user 
  FOREIGN KEY (prescripteur_user_id) REFERENCES utilisateurs(id);

-- Add constraint to ensure either doctor or institution is specified
ALTER TABLE resultats_imagerie 
ADD CONSTRAINT chk_imagerie_prescripteur 
CHECK (
  (prescripteur_type = 'medecin' AND medecin_prescripteur_id IS NOT NULL AND institution_prescripteur_id IS NULL) OR
  (prescripteur_type = 'institution' AND institution_prescripteur_id IS NOT NULL AND medecin_prescripteur_id IS NULL)
);

-- Add indexes for better performance
CREATE INDEX idx_imagerie_institution_prescripteur ON resultats_imagerie(institution_prescripteur_id);
CREATE INDEX idx_imagerie_prescripteur_type ON resultats_imagerie(prescripteur_type);
CREATE INDEX idx_imagerie_prescripteur_user ON resultats_imagerie(prescripteur_user_id);

-- ========================================
-- SECTION 4: MODIFY PATIENT NOTES TABLE
-- ========================================

-- Add institutional prescriber support to patient notes as well
ALTER TABLE notes_patient 
ADD COLUMN note_type ENUM('medecin', 'institution') NOT NULL DEFAULT 'medecin',
ADD COLUMN institution_id INT NULL,
ADD COLUMN author_user_id INT NULL COMMENT 'User who created the note (hospital staff, etc.)',
ADD CONSTRAINT fk_notes_institution 
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
ADD CONSTRAINT fk_notes_author_user 
  FOREIGN KEY (author_user_id) REFERENCES utilisateurs(id);

-- Add constraint to ensure either doctor or institution is specified
ALTER TABLE notes_patient 
ADD CONSTRAINT chk_notes_author 
CHECK (
  (note_type = 'medecin' AND medecin_id IS NOT NULL AND institution_id IS NULL) OR
  (note_type = 'institution' AND institution_id IS NOT NULL AND medecin_id IS NULL)
);

-- Add indexes for better performance
CREATE INDEX idx_notes_institution ON notes_patient(institution_id);
CREATE INDEX idx_notes_type ON notes_patient(note_type);
CREATE INDEX idx_notes_author_user ON notes_patient(author_user_id);

-- ========================================
-- SECTION 5: MODIFY MEDICAL HISTORY TABLE
-- ========================================

-- Add institutional support to medical history
ALTER TABLE antecedents_medicaux 
ADD COLUMN entry_type ENUM('medecin', 'institution') NOT NULL DEFAULT 'medecin',
ADD COLUMN institution_id INT NULL,
ADD COLUMN author_user_id INT NULL COMMENT 'User who added the history entry',
ADD CONSTRAINT fk_antecedents_institution 
  FOREIGN KEY (institution_id) REFERENCES institutions(id),
ADD CONSTRAINT fk_antecedents_author_user 
  FOREIGN KEY (author_user_id) REFERENCES utilisateurs(id);

-- Add constraint to ensure either doctor or institution is specified
ALTER TABLE antecedents_medicaux 
ADD CONSTRAINT chk_antecedents_author 
CHECK (
  (entry_type = 'medecin' AND medecin_id IS NOT NULL AND institution_id IS NULL) OR
  (entry_type = 'institution' AND institution_id IS NOT NULL AND medecin_id IS NULL)
);

-- Add indexes for better performance
CREATE INDEX idx_antecedents_institution ON antecedents_medicaux(institution_id);
CREATE INDEX idx_antecedents_type ON antecedents_medicaux(entry_type);
CREATE INDEX idx_antecedents_author_user ON antecedents_medicaux(author_user_id);

-- ========================================
-- SECTION 6: CREATE VIEWS FOR UNIFIED ACCESS
-- ========================================

-- Create a view to get prescriber information regardless of type
CREATE OR REPLACE VIEW v_prescripteur_info AS
SELECT 
  'traitements' as table_name,
  t.id as record_id,
  t.patient_id,
  t.prescripteur_type,
  CASE 
    WHEN t.prescripteur_type = 'medecin' THEN CONCAT('Dr. ', m.prenom, ' ', m.nom)
    WHEN t.prescripteur_type = 'institution' THEN i.nom
  END as prescripteur_nom,
  CASE 
    WHEN t.prescripteur_type = 'medecin' THEN t.medecin_prescripteur_id
    WHEN t.prescripteur_type = 'institution' THEN t.institution_prescripteur_id
  END as prescripteur_id,
  t.prescripteur_user_id,
  u.nom_utilisateur as prescripteur_utilisateur,
  t.date_prescription as date_creation
FROM traitements t
LEFT JOIN medecins m ON t.medecin_prescripteur_id = m.id
LEFT JOIN institutions i ON t.institution_prescripteur_id = i.id
LEFT JOIN utilisateurs u ON t.prescripteur_user_id = u.id

UNION ALL

SELECT 
  'resultats_analyses' as table_name,
  ra.id as record_id,
  ra.patient_id,
  ra.prescripteur_type,
  CASE 
    WHEN ra.prescripteur_type = 'medecin' THEN CONCAT('Dr. ', m.prenom, ' ', m.nom)
    WHEN ra.prescripteur_type = 'institution' THEN i.nom
  END as prescripteur_nom,
  CASE 
    WHEN ra.prescripteur_type = 'medecin' THEN ra.medecin_prescripteur_id
    WHEN ra.prescripteur_type = 'institution' THEN ra.institution_prescripteur_id
  END as prescripteur_id,
  ra.prescripteur_user_id,
  u.nom_utilisateur as prescripteur_utilisateur,
  ra.date_prescription as date_creation
FROM resultats_analyses ra
LEFT JOIN medecins m ON ra.medecin_prescripteur_id = m.id
LEFT JOIN institutions i ON ra.institution_prescripteur_id = i.id
LEFT JOIN utilisateurs u ON ra.prescripteur_user_id = u.id

UNION ALL

SELECT 
  'resultats_imagerie' as table_name,
  ri.id as record_id,
  ri.patient_id,
  ri.prescripteur_type,
  CASE 
    WHEN ri.prescripteur_type = 'medecin' THEN CONCAT('Dr. ', m.prenom, ' ', m.nom)
    WHEN ri.prescripteur_type = 'institution' THEN i.nom
  END as prescripteur_nom,
  CASE 
    WHEN ri.prescripteur_type = 'medecin' THEN ri.medecin_prescripteur_id
    WHEN ri.prescripteur_type = 'institution' THEN ri.institution_prescripteur_id
  END as prescripteur_id,
  ri.prescripteur_user_id,
  u.nom_utilisateur as prescripteur_utilisateur,
  ri.date_prescription as date_creation
FROM resultats_imagerie ri
LEFT JOIN medecins m ON ri.medecin_prescripteur_id = m.id
LEFT JOIN institutions i ON ri.institution_prescripteur_id = i.id
LEFT JOIN utilisateurs u ON ri.prescripteur_user_id = u.id;

-- ========================================
-- SECTION 7: UPDATE EXISTING DATA
-- ========================================

-- Update existing treatments to have correct prescripteur_type
UPDATE traitements 
SET prescripteur_type = 'medecin' 
WHERE medecin_prescripteur_id IS NOT NULL;

-- Update existing analysis results to have correct prescripteur_type
UPDATE resultats_analyses 
SET prescripteur_type = 'medecin' 
WHERE medecin_prescripteur_id IS NOT NULL;

-- Update existing imaging results to have correct prescripteur_type
UPDATE resultats_imagerie 
SET prescripteur_type = 'medecin' 
WHERE medecin_prescripteur_id IS NOT NULL;

-- Update existing notes to have correct note_type
UPDATE notes_patient 
SET note_type = 'medecin' 
WHERE medecin_id IS NOT NULL;

-- Update existing medical history to have correct entry_type
UPDATE antecedents_medicaux 
SET entry_type = 'medecin' 
WHERE medecin_id IS NOT NULL; 
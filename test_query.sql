-- Test query to check patients for Dr. Amina Benali
-- Run this in phpMyAdmin to see what patients should appear

SELECT DISTINCT
    p.id, 
    p.prenom, 
    p.nom, 
    p.CNE,
    p.date_naissance, 
    p.sexe, 
    p.email, 
    p.telephone,
    MAX(rv.date_heure_debut) as derniere_consultation,
    MIN(rv.date_heure_debut) as premiere_consultation,
    COUNT(rv.id) as total_rdv
FROM patients p
INNER JOIN rendez_vous rv ON p.id = rv.patient_id
INNER JOIN medecins m ON rv.medecin_id = m.id
WHERE m.prenom = 'Amina' AND m.nom = 'Benali'
GROUP BY p.id, p.prenom, p.nom, p.CNE, p.date_naissance, p.sexe, p.email, p.telephone
ORDER BY derniere_consultation DESC;

-- Check if Dr. Amina Benali exists (fixed - removed email column)
SELECT id, prenom, nom FROM medecins WHERE prenom = 'Amina' AND nom = 'Benali';

-- Check the structure of medecins table
DESCRIBE medecins;

-- Check a specific patient like Omar Tazi
SELECT * FROM patients WHERE prenom = 'Omar' AND nom = 'Tazi';

-- Check appointments for Omar Tazi with any doctor
SELECT 
    p.prenom as patient_prenom,
    p.nom as patient_nom,
    m.prenom as medecin_prenom,
    m.nom as medecin_nom,
    rv.date_heure_debut,
    rv.motif,
    rv.statut
FROM rendez_vous rv
INNER JOIN patients p ON rv.patient_id = p.id
INNER JOIN medecins m ON rv.medecin_id = m.id
WHERE p.prenom = 'Omar' AND p.nom = 'Tazi'
ORDER BY rv.date_heure_debut DESC;

-- Alternative: Check all medecins to see what's available
SELECT id, prenom, nom, specialite_id FROM medecins ORDER BY prenom, nom; 
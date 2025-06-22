-- ========================================
-- CONVERT 2024 TO 2025 APPOINTMENTS
-- ========================================
-- This script converts all appointment dates from 2024 to 2025
-- Run this after populating the 2024 appointment data

-- Start transaction for safety
START TRANSACTION;

-- Show current count of 2024 appointments before conversion
SELECT 'BEFORE CONVERSION - 2024 Appointments Count:' as info;
SELECT COUNT(*) as total_2024_appointments 
FROM rendez_vous 
WHERE YEAR(date_heure_debut) = 2024;

-- Show breakdown by month
SELECT 'BEFORE CONVERSION - 2024 Appointments by Month:' as info;
SELECT 
    MONTH(date_heure_debut) as month_number,
    MONTHNAME(date_heure_debut) as month_name,
    COUNT(*) as appointments_count
FROM rendez_vous 
WHERE YEAR(date_heure_debut) = 2024
GROUP BY MONTH(date_heure_debut), MONTHNAME(date_heure_debut)
ORDER BY month_number;

-- Update all 2024 appointments to 2025
-- This adds exactly 1 year to each appointment
UPDATE rendez_vous 
SET 
    date_heure_debut = DATE_ADD(date_heure_debut, INTERVAL 1 YEAR),
    date_heure_fin = DATE_ADD(date_heure_fin, INTERVAL 1 YEAR)
WHERE YEAR(date_heure_debut) = 2024;

-- Show results after conversion
SELECT 'AFTER CONVERSION - Updated Appointments:' as info;
SELECT ROW_COUNT() as updated_appointments;

-- Verify 2025 appointments now exist
SELECT 'AFTER CONVERSION - 2025 Appointments Count:' as info;
SELECT COUNT(*) as total_2025_appointments 
FROM rendez_vous 
WHERE YEAR(date_heure_debut) = 2025;

-- Show breakdown by month for 2025
SELECT 'AFTER CONVERSION - 2025 Appointments by Month:' as info;
SELECT 
    MONTH(date_heure_debut) as month_number,
    MONTHNAME(date_heure_debut) as month_name,
    COUNT(*) as appointments_count
FROM rendez_vous 
WHERE YEAR(date_heure_debut) = 2025
GROUP BY MONTH(date_heure_debut), MONTHNAME(date_heure_debut)
ORDER BY month_number;

-- Show sample of converted appointments
SELECT 'SAMPLE OF CONVERTED 2025 APPOINTMENTS:' as info;
SELECT 
    rv.id,
    DATE(rv.date_heure_debut) as appointment_date,
    TIME(rv.date_heure_debut) as appointment_time,
    rv.motif,
    CONCAT(m.prenom, ' ', m.nom) as doctor_name,
    CONCAT(p.prenom, ' ', p.nom) as patient_name
FROM rendez_vous rv
JOIN medecins m ON rv.medecin_id = m.id
JOIN patients p ON rv.patient_id = p.id
WHERE YEAR(rv.date_heure_debut) = 2025
ORDER BY rv.date_heure_debut
LIMIT 10;

-- Verify no 2024 appointments remain
SELECT 'VERIFICATION - Remaining 2024 Appointments:' as info;
SELECT COUNT(*) as remaining_2024_appointments 
FROM rendez_vous 
WHERE YEAR(date_heure_debut) = 2024;

-- Commit the transaction
COMMIT;

SELECT '✅ CONVERSION COMPLETED SUCCESSFULLY!' as status;
SELECT 'All 2024 appointments have been converted to 2025' as message; 
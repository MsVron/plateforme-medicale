const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isSuperAdmin, isAdmin } = require('../middlewares/auth');

router.post('/admins', verifyToken, isSuperAdmin, adminController.addAdmin);
router.put('/admins/:id', verifyToken, isSuperAdmin, adminController.editAdmin);
router.delete('/admins/:id', verifyToken, isSuperAdmin, adminController.deleteAdmin);
router.get('/admins', verifyToken, isSuperAdmin, adminController.getAdmins);

// Get all doctors for admin use
router.get('/doctors', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        const [doctors] = await db.execute(
            `SELECT 
                m.id, m.prenom, m.nom, m.numero_ordre, m.telephone,
                m.email_professionnel, m.est_actif,
                s.nom as specialite
            FROM medecins m
            LEFT JOIN specialites s ON m.specialite_id = s.id
            WHERE m.est_actif = TRUE
            ORDER BY m.nom, m.prenom`
        );
        
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des médecins' });
    }
});

// Get all allergies for admin use
router.get('/allergies', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        const [allergies] = await db.execute(
            'SELECT id, nom, description FROM allergies ORDER BY nom'
        );
        
        res.json(allergies);
    } catch (error) {
        console.error('Error fetching allergies:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des allergies' });
    }
});

// Get all medications for admin use
router.get('/medications', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        const [medications] = await db.execute(
            'SELECT id, nom_commercial, nom_molecule, dosage, forme FROM medicaments ORDER BY nom_commercial'
        );
        
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des médicaments' });
    }
});

// Institution Management Routes
router.get('/institutions', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        const [institutions] = await db.execute(
            `SELECT 
                i.*,
                m.prenom as medecin_proprietaire_prenom,
                m.nom as medecin_proprietaire_nom
            FROM institutions i
            LEFT JOIN medecins m ON i.medecin_proprietaire_id = m.id
            WHERE i.est_actif = TRUE
            ORDER BY i.nom`
        );
        
        // Get doctors for each institution
        for (let institution of institutions) {
            const [doctors] = await db.execute(
                `SELECT 
                    m.id, m.prenom, m.nom, m.numero_ordre,
                    s.nom as specialite,
                    mi.est_principal, mi.date_debut, mi.date_fin
                FROM medecin_institution mi
                JOIN medecins m ON mi.medecin_id = m.id
                LEFT JOIN specialites s ON m.specialite_id = s.id
                WHERE mi.institution_id = ? AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())
                ORDER BY mi.est_principal DESC, m.nom, m.prenom`,
                [institution.id]
            );
            institution.doctors = doctors;
        }
        
        res.json(institutions);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des institutions' });
    }
});

router.post('/institutions', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const {
            nom, adresse, ville, code_postal, pays, telephone, email_contact,
            site_web, description, type
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO institutions (
                nom, adresse, ville, code_postal, pays, telephone, email_contact,
                site_web, description, type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, adresse, ville, code_postal, pays, telephone, email_contact,
             site_web, description, type]
        );

        res.json({ 
            message: 'Institution ajoutée avec succès',
            institutionId: result.insertId 
        });
    } catch (error) {
        console.error('Error adding institution:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'institution' });
    }
});

router.put('/institutions/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const institutionId = req.params.id;
        const {
            nom, adresse, ville, code_postal, pays, telephone, email_contact,
            site_web, description, type
        } = req.body;

        await db.execute(
            `UPDATE institutions SET 
                nom = ?, adresse = ?, ville = ?, code_postal = ?, pays = ?,
                telephone = ?, email_contact = ?, site_web = ?, description = ?,
                type = ?
            WHERE id = ?`,
            [nom, adresse, ville, code_postal, pays, telephone, email_contact,
             site_web, description, type, institutionId]
        );

        res.json({ message: 'Institution mise à jour avec succès' });
    } catch (error) {
        console.error('Error updating institution:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'institution' });
    }
});

router.delete('/institutions/:id', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const institutionId = req.params.id;

        // Soft delete - mark as inactive
        await db.execute(
            'UPDATE institutions SET est_actif = FALSE WHERE id = ?',
            [institutionId]
        );

        res.json({ message: 'Institution désactivée avec succès' });
    } catch (error) {
        console.error('Error deactivating institution:', error);
        res.status(500).json({ message: 'Erreur lors de la désactivation de l\'institution' });
    }
});

// Doctor Management for Institutions
router.get('/institutions/:id/doctors', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const institutionId = req.params.id;

        const [doctors] = await db.execute(
            `SELECT 
                m.id, m.prenom, m.nom, m.numero_ordre, m.telephone,
                m.email_professionnel, m.est_actif,
                s.nom as specialite,
                mi.est_principal, mi.date_debut, mi.date_fin
            FROM medecin_institution mi
            JOIN medecins m ON mi.medecin_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            WHERE mi.institution_id = ?
            ORDER BY mi.est_principal DESC, m.nom, m.prenom`,
            [institutionId]
        );

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching institution doctors:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des médecins' });
    }
});

router.post('/institutions/:id/doctors', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const institutionId = req.params.id;
        const { doctorId } = req.body;

        // Check if association already exists
        const [existing] = await db.execute(
            'SELECT id FROM medecin_institution WHERE medecin_id = ? AND institution_id = ? AND (date_fin IS NULL OR date_fin > CURDATE())',
            [doctorId, institutionId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ce médecin est déjà associé à cette institution' });
        }

        await db.execute(
            'INSERT INTO medecin_institution (medecin_id, institution_id, est_principal, date_debut) VALUES (?, ?, ?, ?)',
            [doctorId, institutionId, false, new Date().toISOString().split('T')[0]]
        );

        res.json({ message: 'Médecin ajouté à l\'institution avec succès' });
    } catch (error) {
        console.error('Error adding doctor to institution:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du médecin' });
    }
});

router.delete('/institutions/:institutionId/doctors/:doctorId', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const { institutionId, doctorId } = req.params;

        // Set end date instead of deleting
        await db.execute(
            'UPDATE medecin_institution SET date_fin = CURDATE() WHERE medecin_id = ? AND institution_id = ? AND (date_fin IS NULL OR date_fin > CURDATE())',
            [doctorId, institutionId]
        );

        res.json({ message: 'Médecin retiré de l\'institution avec succès' });
    } catch (error) {
        console.error('Error removing doctor from institution:', error);
        res.status(500).json({ message: 'Erreur lors du retrait du médecin' });
    }
});

// Patient Registration on Site
router.post('/patients/register-onsite', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const bcrypt = require('bcrypt');
        const adminId = req.user.id_specifique_role;
        
        const {
            prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal,
            pays, telephone, email, contact_urgence_nom, contact_urgence_telephone,
            contact_urgence_relation, groupe_sanguin, taille_cm, poids_kg,
            est_fumeur, consommation_alcool, activite_physique, profession,
            selectedAllergies, selectedMedications, allergies_notes, antecedents_medicaux
        } = req.body;

        // Check if patient already exists
        if (CNE) {
            const [existingPatient] = await db.execute(
                'SELECT id FROM patients WHERE CNE = ?',
                [CNE]
            );

            if (existingPatient.length > 0) {
                return res.status(400).json({ message: 'Un patient avec ce CNE existe déjà' });
            }
        }

        if (email) {
            const [existingEmail] = await db.execute(
                'SELECT id FROM patients WHERE email = ?',
                [email]
            );

            if (existingEmail.length > 0) {
                return res.status(400).json({ message: 'Un patient avec cet email existe déjà' });
            }
        }

        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Insert patient
        const [patientResult] = await db.execute(
            `INSERT INTO patients (
                prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal,
                pays, telephone, email, contact_urgence_nom, contact_urgence_telephone,
                contact_urgence_relation, groupe_sanguin, taille_cm, poids_kg,
                est_fumeur, consommation_alcool, activite_physique, profession,
                est_inscrit_par_medecin, est_profil_complete, allergies_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE, ?)`,
            [prenom, nom, date_naissance, sexe, CNE, adresse, ville, code_postal,
             pays, telephone, email, contact_urgence_nom, contact_urgence_telephone,
             contact_urgence_relation, groupe_sanguin, taille_cm, poids_kg,
             est_fumeur, consommation_alcool, activite_physique, profession, allergies_notes]
        );

        const patientId = patientResult.insertId;

        // Create user account if email is provided
        if (email) {
            await db.execute(
                'INSERT INTO utilisateurs (nom_utilisateur, mot_de_passe, email, role, id_specifique_role, est_verifie) VALUES (?, ?, ?, ?, ?, ?)',
                [`${prenom.toLowerCase()}.${nom.toLowerCase()}`, hashedPassword, email, 'patient', patientId, true]
            );
        }

        // Add allergies
        if (selectedAllergies && selectedAllergies.length > 0) {
            for (const allergyId of selectedAllergies) {
                await db.execute(
                    'INSERT INTO patient_allergies (patient_id, allergie_id, severite) VALUES (?, ?, ?)',
                    [patientId, allergyId, 'modérée']
                );
            }
        }

        // Add medical history
        if (antecedents_medicaux) {
            await db.execute(
                'INSERT INTO antecedents_medicaux (patient_id, type, description) VALUES (?, ?, ?)',
                [patientId, 'medical', antecedents_medicaux]
            );
        }

        res.json({ 
            message: 'Patient inscrit avec succès',
            patientId: patientId,
            credentials: email ? {
                username: `${prenom.toLowerCase()}.${nom.toLowerCase()}`,
                password: tempPassword
            } : null
        });
    } catch (error) {
        console.error('Error registering patient onsite:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription du patient' });
    }
});

// Pharmacy Search Routes
router.get('/pharmacy/search-patient', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const { prenom, nom, cne } = req.query;

        if (!prenom || !nom || !cne) {
            return res.status(400).json({ message: 'Prénom, nom et CNE sont requis' });
        }

        const [patients] = await db.execute(
            `SELECT 
                p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE,
                p.telephone, p.email, p.adresse, p.ville, p.groupe_sanguin,
                CONCAT(mt.prenom, ' ', mt.nom) as medecin_traitant_nom,
                s.nom as medecin_traitant_specialite
            FROM patients p
            LEFT JOIN medecins mt ON p.medecin_traitant_id = mt.id
            LEFT JOIN specialites s ON mt.specialite_id = s.id
            WHERE LOWER(p.prenom) = LOWER(?) AND LOWER(p.nom) = LOWER(?) AND p.CNE = ?`,
            [prenom, nom, cne]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé' });
        }

        // Get patient allergies
        const [allergies] = await db.execute(
            `SELECT a.nom, pa.severite
             FROM patient_allergies pa
             JOIN allergies a ON pa.allergie_id = a.id
             WHERE pa.patient_id = ?`,
            [patients[0].id]
        );

        patients[0].allergies = allergies;

        res.json(patients[0]);
    } catch (error) {
        console.error('Error searching patient:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche du patient' });
    }
});

router.get('/pharmacy/patient/:id/treatments', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const patientId = req.params.id;

        const [treatments] = await db.execute(
            `SELECT 
                med.nom_commercial,
                med.nom_molecule,
                med.dosage,
                med.forme,
                t.posologie,
                t.date_debut,
                t.date_fin,
                t.est_permanent,
                t.instructions,
                t.date_prescription,
                CONCAT(m.prenom, ' ', m.nom) as medecin_nom,
                s.nom as medecin_specialite,
                i.nom as institution_nom
            FROM traitements t
            JOIN medicaments med ON t.medicament_id = med.id
            JOIN medecins m ON t.medecin_prescripteur_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            LEFT JOIN medecin_institution mi ON m.id = mi.medecin_id AND mi.est_principal = TRUE
            LEFT JOIN institutions i ON mi.institution_id = i.id
            WHERE t.patient_id = ?
            ORDER BY t.date_prescription DESC`,
            [patientId]
        );

        res.json(treatments);
    } catch (error) {
        console.error('Error fetching patient treatments:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des traitements' });
    }
});

// Statistics for SuperAdmin and Admin
router.get('/statistics', verifyToken, isAdmin, async (req, res) => {
    try {
        const db = require('../config/db');

        // Get basic counts
        const [patientCount] = await db.execute('SELECT COUNT(*) as count FROM patients');
        const [doctorCount] = await db.execute('SELECT COUNT(*) as count FROM medecins WHERE est_actif = TRUE');
        const [institutionCount] = await db.execute('SELECT COUNT(*) as count FROM institutions WHERE est_actif = TRUE');
        const [appointmentCount] = await db.execute('SELECT COUNT(*) as count FROM rendez_vous');

        // Get appointments by status
        const [appointmentsByStatus] = await db.execute(
            `SELECT statut as name, COUNT(*) as count 
             FROM rendez_vous 
             GROUP BY statut`
        );

        // Get monthly trends (last 12 months)
        const [monthlyTrends] = await db.execute(
            `SELECT 
                DATE_FORMAT(p.date_inscription, '%Y-%m') as month,
                COUNT(DISTINCT p.id) as patients,
                COUNT(DISTINCT rv.id) as appointments
             FROM patients p
             LEFT JOIN rendez_vous rv ON DATE_FORMAT(rv.date_creation, '%Y-%m') = DATE_FORMAT(p.date_inscription, '%Y-%m')
             WHERE p.date_inscription >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY DATE_FORMAT(p.date_inscription, '%Y-%m')
             ORDER BY month`
        );

        // Get specialty stats
        const [specialtyStats] = await db.execute(
            `SELECT 
                s.nom as name,
                COUNT(m.id) as count
             FROM specialites s
             LEFT JOIN medecins m ON s.id = m.specialite_id AND m.est_actif = TRUE
             GROUP BY s.id, s.nom
             HAVING count > 0
             ORDER BY count DESC
             LIMIT 10`
        );

        // Get institution stats
        const [institutionStats] = await db.execute(
            `SELECT 
                i.nom as name,
                COUNT(DISTINCT mi.medecin_id) as patients,
                COUNT(DISTINCT rv.id) as appointments
             FROM institutions i
             LEFT JOIN medecin_institution mi ON i.id = mi.institution_id AND (mi.date_fin IS NULL OR mi.date_fin > CURDATE())
             LEFT JOIN rendez_vous rv ON mi.medecin_id = rv.medecin_id
             WHERE i.est_actif = TRUE
             GROUP BY i.id, i.nom
             ORDER BY patients DESC, appointments DESC
             LIMIT 10`
        );

        // Get recent activity
        const [recentAppointments] = await db.execute(
            `SELECT COUNT(*) as count 
             FROM rendez_vous 
             WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );

        const [recentPatients] = await db.execute(
            `SELECT COUNT(*) as count 
             FROM patients 
             WHERE date_inscription >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
        );

        res.json({
            overview: {
                patients: patientCount[0].count,
                doctors: doctorCount[0].count,
                institutions: institutionCount[0].count,
                appointments: appointmentCount[0].count
            },
            appointmentsByStatus,
            monthlyTrends,
            specialtyStats,
            institutionStats,
            recentActivity: {
                appointments: recentAppointments[0].count,
                patients: recentPatients[0].count
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
});

// SuperAdmin Statistics Routes
router.get('/superadmin/stats/overview', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Get comprehensive overview statistics
        const [patientStats] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active
            FROM patients
        `);
        
        const [doctorStats] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active
            FROM medecins
        `);
        
        const [institutionStats] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active
            FROM institutions
        `);
        
        const [appointmentStats] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as this_month,
                COUNT(CASE WHEN statut = 'confirme' THEN 1 END) as confirmed,
                COUNT(CASE WHEN statut = 'annule' THEN 1 END) as cancelled
            FROM rendez_vous
        `);
        
        const [systemHealth] = await db.execute(`
            SELECT 
                COUNT(DISTINCT p.id) as active_patients,
                COUNT(DISTINCT m.id) as active_doctors,
                COUNT(DISTINCT rv.id) as today_appointments
            FROM patients p
            CROSS JOIN medecins m
            LEFT JOIN rendez_vous rv ON DATE(rv.date_rdv) = CURDATE()
            WHERE p.est_actif = TRUE AND m.est_actif = TRUE
        `);
        
        res.json({
            patients: patientStats[0],
            doctors: doctorStats[0],
            institutions: institutionStats[0],
            appointments: appointmentStats[0],
            systemHealth: systemHealth[0]
        });
    } catch (error) {
        console.error('Error fetching overview stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques générales' });
    }
});

router.get('/superadmin/stats/patients', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Patient engagement metrics
        const [patientMetrics] = await db.execute(`
            SELECT 
                COUNT(*) as total_patients,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_patients,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_patients,
                COUNT(CASE WHEN email IS NOT NULL AND mot_de_passe IS NOT NULL THEN 1 END) as verified_patients
            FROM patients
        `);
        
        // Demographics breakdown
        const [ageGroups] = await db.execute(`
            SELECT 
                CASE 
                    WHEN YEAR(CURDATE()) - YEAR(date_naissance) < 18 THEN 'Moins de 18'
                    WHEN YEAR(CURDATE()) - YEAR(date_naissance) BETWEEN 18 AND 30 THEN '18-30'
                    WHEN YEAR(CURDATE()) - YEAR(date_naissance) BETWEEN 31 AND 50 THEN '31-50'
                    WHEN YEAR(CURDATE()) - YEAR(date_naissance) BETWEEN 51 AND 70 THEN '51-70'
                    ELSE 'Plus de 70'
                END as age_group,
                COUNT(*) as count
            FROM patients
            WHERE date_naissance IS NOT NULL
            GROUP BY age_group
        `);
        
        const [genderDistribution] = await db.execute(`
            SELECT sexe as gender, COUNT(*) as count
            FROM patients
            WHERE sexe IS NOT NULL
            GROUP BY sexe
        `);
        
        // Activity trends
        const [monthlyActivity] = await db.execute(`
            SELECT 
                DATE_FORMAT(date_inscription, '%Y-%m') as month,
                COUNT(*) as registrations
            FROM patients
            WHERE date_inscription >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_inscription, '%Y-%m')
            ORDER BY month
        `);
        
        res.json({
            metrics: patientMetrics[0],
            demographics: {
                ageGroups,
                genderDistribution
            },
            activity: monthlyActivity
        });
    } catch (error) {
        console.error('Error fetching patient stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques patients' });
    }
});

router.get('/superadmin/stats/institutions', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Institution metrics
        const [institutionMetrics] = await db.execute(`
            SELECT 
                COUNT(*) as total_institutions,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_institutions,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_institutions,
                (SELECT COUNT(*) FROM medecins WHERE est_actif = TRUE) as total_doctors
            FROM institutions
        `);
        
        // Institution types
        const [institutionTypes] = await db.execute(`
            SELECT type, COUNT(*) as count
            FROM institutions
            WHERE est_actif = TRUE
            GROUP BY type
        `);
        
        // Performance metrics
        const [institutionPerformance] = await db.execute(`
            SELECT 
                i.nom as name,
                COUNT(DISTINCT mi.medecin_id) as doctor_count,
                COUNT(DISTINCT rv.id) as appointment_count,
                AVG(CASE WHEN rv.statut = 'confirme' THEN 1 ELSE 0 END) * 100 as success_rate
            FROM institutions i
            LEFT JOIN medecin_institution mi ON i.id = mi.institution_id
            LEFT JOIN rendez_vous rv ON mi.medecin_id = rv.medecin_id
            WHERE i.est_actif = TRUE
            GROUP BY i.id, i.nom
            ORDER BY doctor_count DESC
            LIMIT 10
        `);
        
        res.json({
            metrics: institutionMetrics[0],
            types: institutionTypes,
            performance: institutionPerformance
        });
    } catch (error) {
        console.error('Error fetching institution stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques institutions' });
    }
});

router.get('/superadmin/stats/audit', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Audit metrics (simulated for demo - you'd implement actual audit logging)
        const auditMetrics = {
            totalLogs: 156789,
            securityEvents: 342,
            accessViolations: 23,
            dataChanges: 5432,
            complianceScore: 94.5,
            criticalAlerts: 8
        };
        
        // Security events simulation
        const securityEvents = [
            { month: 'Jan', incidents: 45, resolved: 42, pending: 3 },
            { month: 'Fév', incidents: 38, resolved: 36, pending: 2 },
            { month: 'Mar', incidents: 52, resolved: 48, pending: 4 },
            { month: 'Avr', incidents: 41, resolved: 39, pending: 2 },
            { month: 'Mai', incidents: 47, resolved: 44, pending: 3 },
            { month: 'Juin', incidents: 39, resolved: 37, pending: 2 }
        ];
        
        // Compliance data
        const complianceData = [
            { category: 'RGPD', score: 96, issues: 2, status: 'Conforme' },
            { category: 'ISO 27001', score: 93, issues: 5, status: 'Conforme' },
            { category: 'HDS', score: 98, issues: 1, status: 'Conforme' },
            { category: 'Sécurité Données', score: 91, issues: 7, status: 'Attention' },
            { category: 'Traçabilité', score: 97, issues: 2, status: 'Conforme' }
        ];
        
        res.json({
            metrics: auditMetrics,
            securityEvents,
            compliance: complianceData
        });
    } catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques d\'audit' });
    }
});

router.get('/superadmin/stats/dashboards', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Real-time metrics
        const [realtimeMetrics] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM patients WHERE est_actif = TRUE) as active_users,
                (SELECT COUNT(*) FROM rendez_vous WHERE DATE(date_rdv) = CURDATE()) as today_consultations,
                ROUND(RAND() * 100, 1) as system_load
        `);
        
        // Performance metrics
        const [performanceMetrics] = await db.execute(`
            SELECT 
                COUNT(DISTINCT p.id) as total_patients,
                COUNT(DISTINCT m.id) as total_doctors,
                COUNT(DISTINCT i.id) as total_institutions,
                COUNT(DISTINCT rv.id) as total_appointments
            FROM patients p
            CROSS JOIN medecins m
            CROSS JOIN institutions i
            CROSS JOIN rendez_vous rv
            WHERE p.est_actif = TRUE AND m.est_actif = TRUE AND i.est_actif = TRUE
        `);
        
        // Monthly trends
        const [monthlyTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(date_creation, '%Y-%m') as month,
                COUNT(*) as appointments
            FROM rendez_vous
            WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(date_creation, '%Y-%m')
            ORDER BY month
        `);
        
        res.json({
            realtime: realtimeMetrics[0],
            performance: performanceMetrics[0],
            trends: monthlyTrends
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques dashboard' });
    }
});

// Additional SuperAdmin Statistics Routes
router.get('/superadmin/stats/users', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const { period = 'month' } = req.query;
        
        // User metrics by role
        const [userMetrics] = await db.execute(`
            SELECT 
                'patients' as role,
                COUNT(*) as total,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
            FROM patients
            UNION ALL
            SELECT 
                'medecins' as role,
                COUNT(*) as total,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
            FROM medecins
            UNION ALL
            SELECT 
                'admins' as role,
                COUNT(*) as total,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
            FROM administrateurs
        `);
        
        // User growth trends
        const [growthTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(date_inscription, '%Y-%m') as month,
                'patients' as type,
                COUNT(*) as registrations
            FROM patients
            WHERE date_inscription >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_inscription, '%Y-%m')
            UNION ALL
            SELECT 
                DATE_FORMAT(date_inscription, '%Y-%m') as month,
                'medecins' as type,
                COUNT(*) as registrations
            FROM medecins
            WHERE date_inscription >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_inscription, '%Y-%m')
            ORDER BY month
        `);
        
        // Login activity (simulated data)
        const loginActivity = [
            { period: 'Matin (6h-12h)', patients: 2450, doctors: 850, admins: 45 },
            { period: 'Après-midi (12h-18h)', patients: 3200, doctors: 1200, admins: 78 },
            { period: 'Soirée (18h-24h)', patients: 1800, doctors: 650, admins: 23 },
            { period: 'Nuit (0h-6h)', patients: 150, doctors: 45, admins: 8 }
        ];
        
        // Geographic distribution
        const [geographicData] = await db.execute(`
            SELECT 
                ville as city,
                COUNT(*) as users
            FROM patients
            WHERE ville IS NOT NULL
            GROUP BY ville
            ORDER BY users DESC
            LIMIT 10
        `);
        
        res.json({
            userMetrics,
            growthTrends,
            loginActivity,
            geographicData
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques utilisateurs' });
    }
});

router.get('/superadmin/stats/appointments', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const { period = 'month', specialty = 'all' } = req.query;
        
        // Appointment metrics
        const [appointmentMetrics] = await db.execute(`
            SELECT 
                COUNT(*) as total_appointments,
                COUNT(CASE WHEN statut = 'confirme' THEN 1 END) as confirmed,
                COUNT(CASE WHEN statut = 'annule' THEN 1 END) as cancelled,
                COUNT(CASE WHEN statut = 'en_attente' THEN 1 END) as pending,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as this_month
            FROM rendez_vous
        `);
        
        // Appointment trends by month
        const [appointmentTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(date_rdv, '%Y-%m') as month,
                COUNT(*) as appointments,
                COUNT(CASE WHEN statut = 'confirme' THEN 1 END) as confirmed,
                COUNT(CASE WHEN statut = 'annule' THEN 1 END) as cancelled
            FROM rendez_vous
            WHERE date_rdv >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_rdv, '%Y-%m')
            ORDER BY month
        `);
        
        // Appointments by specialty
        const [appointmentsBySpecialty] = await db.execute(`
            SELECT 
                s.nom as specialty,
                COUNT(rv.id) as count,
                AVG(CASE WHEN rv.statut = 'confirme' THEN 1 ELSE 0 END) * 100 as success_rate
            FROM rendez_vous rv
            LEFT JOIN medecins m ON rv.medecin_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            WHERE s.nom IS NOT NULL
            GROUP BY s.nom
            ORDER BY count DESC
        `);
        
        // Daily appointment distribution
        const [dailyDistribution] = await db.execute(`
            SELECT 
                DAYNAME(date_rdv) as day_name,
                COUNT(*) as appointments
            FROM rendez_vous
            WHERE date_rdv >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DAYNAME(date_rdv), DAYOFWEEK(date_rdv)
            ORDER BY DAYOFWEEK(date_rdv)
        `);
        
        // Time slot analysis
        const [timeSlotAnalysis] = await db.execute(`
            SELECT 
                CASE 
                    WHEN HOUR(heure_rdv) BETWEEN 8 AND 11 THEN 'Matin (8h-12h)'
                    WHEN HOUR(heure_rdv) BETWEEN 12 AND 17 THEN 'Après-midi (12h-18h)'
                    WHEN HOUR(heure_rdv) BETWEEN 18 AND 20 THEN 'Soirée (18h-21h)'
                    ELSE 'Autres'
                END as time_slot,
                COUNT(*) as appointments,
                AVG(CASE WHEN statut = 'confirme' THEN 1 ELSE 0 END) * 100 as success_rate
            FROM rendez_vous
            WHERE heure_rdv IS NOT NULL
            GROUP BY time_slot
        `);
        
        res.json({
            metrics: appointmentMetrics[0],
            trends: appointmentTrends,
            bySpecialty: appointmentsBySpecialty,
            dailyDistribution,
            timeSlotAnalysis
        });
    } catch (error) {
        console.error('Error fetching appointment stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques rendez-vous' });
    }
});

router.get('/superadmin/stats/medical-activity', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Consultation statistics
        const [consultationStats] = await db.execute(`
            SELECT 
                COUNT(*) as total_consultations,
                AVG(TIMESTAMPDIFF(MINUTE, heure_debut, heure_fin)) as avg_duration,
                COUNT(CASE WHEN date_consultation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as this_month
            FROM consultations
        `);
        
        // Medical records activity
        const [medicalRecordActivity] = await db.execute(`
            SELECT 
                COUNT(*) as total_records,
                COUNT(CASE WHEN date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month,
                COUNT(CASE WHEN date_modification >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as updated_this_month
            FROM dossiers_medicaux
        `);
        
        // Prescription metrics
        const [prescriptionMetrics] = await db.execute(`
            SELECT 
                COUNT(DISTINCT o.id) as total_prescriptions,
                COUNT(DISTINCT om.medicament_id) as unique_medications,
                COUNT(om.id) as total_medication_entries
            FROM ordonnances o
            LEFT JOIN ordonnance_medicaments om ON o.id = om.ordonnance_id
        `);
        
        // Laboratory results by category
        const [labResults] = await db.execute(`
            SELECT 
                type_analyse as category,
                COUNT(*) as count,
                COUNT(CASE WHEN date_analyse >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as this_month
            FROM resultats_analyses
            WHERE type_analyse IS NOT NULL
            GROUP BY type_analyse
            ORDER BY count DESC
        `);
        
        // Treatment analysis
        const [treatmentAnalysis] = await db.execute(`
            SELECT 
                COUNT(*) as total_treatments,
                COUNT(CASE WHEN statut = 'actif' THEN 1 END) as active_treatments,
                COUNT(CASE WHEN statut = 'termine' THEN 1 END) as completed_treatments,
                COUNT(CASE WHEN date_debut >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_this_month
            FROM traitements
        `);
        
        // Monthly medical activity trends
        const [monthlyTrends] = await db.execute(`
            SELECT 
                DATE_FORMAT(date_consultation, '%Y-%m') as month,
                COUNT(*) as consultations
            FROM consultations
            WHERE date_consultation >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_consultation, '%Y-%m')
            ORDER BY month
        `);
        
        res.json({
            consultations: consultationStats[0],
            medicalRecords: medicalRecordActivity[0],
            prescriptions: prescriptionMetrics[0],
            labResults,
            treatments: treatmentAnalysis[0],
            monthlyTrends
        });
    } catch (error) {
        console.error('Error fetching medical activity stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques activité médicale' });
    }
});

router.get('/superadmin/stats/doctors', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        
        // Doctor performance metrics
        const [doctorMetrics] = await db.execute(`
            SELECT 
                COUNT(*) as total_doctors,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_doctors,
                COUNT(CASE WHEN date_inscription >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_doctors,
                AVG(YEAR(CURDATE()) - YEAR(date_naissance)) as avg_age
            FROM medecins
        `);
        
        // Doctors by specialty
        const [doctorsBySpecialty] = await db.execute(`
            SELECT 
                s.nom as specialty,
                COUNT(m.id) as count,
                COUNT(CASE WHEN m.est_actif = TRUE THEN 1 END) as active_count
            FROM specialites s
            LEFT JOIN medecins m ON s.id = m.specialite_id
            GROUP BY s.id, s.nom
            HAVING count > 0
            ORDER BY count DESC
        `);
        
        // Doctor activity analysis
        const [doctorActivity] = await db.execute(`
            SELECT 
                m.id,
                CONCAT(m.prenom, ' ', m.nom) as doctor_name,
                s.nom as specialty,
                COUNT(DISTINCT rv.id) as total_appointments,
                COUNT(DISTINCT c.id) as total_consultations,
                AVG(CASE WHEN rv.statut = 'confirme' THEN 1 ELSE 0 END) * 100 as success_rate
            FROM medecins m
            LEFT JOIN specialites s ON m.specialite_id = s.id
            LEFT JOIN rendez_vous rv ON m.id = rv.medecin_id
            LEFT JOIN consultations c ON m.id = c.medecin_id
            WHERE m.est_actif = TRUE
            GROUP BY m.id, m.prenom, m.nom, s.nom
            ORDER BY total_appointments DESC
            LIMIT 20
        `);
        
        // Availability metrics
        const [availabilityMetrics] = await db.execute(`
            SELECT 
                COUNT(DISTINCT dm.id) as total_slots,
                COUNT(DISTINCT CASE WHEN rv.id IS NOT NULL THEN dm.id END) as booked_slots,
                (COUNT(DISTINCT CASE WHEN rv.id IS NOT NULL THEN dm.id END) / COUNT(DISTINCT dm.id)) * 100 as utilization_rate
            FROM disponibilites_medecin dm
            LEFT JOIN rendez_vous rv ON dm.medecin_id = rv.medecin_id 
                AND DATE(dm.date_disponibilite) = DATE(rv.date_rdv)
                AND TIME(dm.heure_debut) <= TIME(rv.heure_rdv)
                AND TIME(dm.heure_fin) > TIME(rv.heure_rdv)
            WHERE dm.date_disponibilite >= CURDATE()
        `);
        
        // Patient load distribution
        const [patientLoadDistribution] = await db.execute(`
            SELECT 
                CASE 
                    WHEN patient_count < 10 THEN 'Faible (< 10)'
                    WHEN patient_count BETWEEN 10 AND 30 THEN 'Moyenne (10-30)'
                    WHEN patient_count BETWEEN 31 AND 50 THEN 'Élevée (31-50)'
                    ELSE 'Très élevée (> 50)'
                END as load_category,
                COUNT(*) as doctor_count
            FROM (
                SELECT 
                    m.id,
                    COUNT(DISTINCT rv.patient_id) as patient_count
                FROM medecins m
                LEFT JOIN rendez_vous rv ON m.id = rv.medecin_id
                WHERE m.est_actif = TRUE
                GROUP BY m.id
            ) as doctor_patients
            GROUP BY load_category
        `);
        
        res.json({
            metrics: doctorMetrics[0],
            bySpecialty: doctorsBySpecialty,
            activity: doctorActivity,
            availability: availabilityMetrics[0],
            patientLoad: patientLoadDistribution
        });
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques médecins' });
    }
});

router.get('/superadmin/stats/geographic', verifyToken, isSuperAdmin, async (req, res) => {
    try {
        const db = require('../config/db');
        const { period = 'month' } = req.query;
        
        // Geographic distribution of users
        const [usersByRegion] = await db.execute(`
            SELECT 
                ville as city,
                COUNT(*) as user_count,
                'patients' as user_type
            FROM patients
            WHERE ville IS NOT NULL
            GROUP BY ville
            UNION ALL
            SELECT 
                ville as city,
                COUNT(*) as user_count,
                'medecins' as user_type
            FROM medecins
            WHERE ville IS NOT NULL
            GROUP BY ville
            ORDER BY user_count DESC
        `);
        
        // Institution distribution
        const [institutionsByRegion] = await db.execute(`
            SELECT 
                ville as city,
                COUNT(*) as institution_count,
                COUNT(CASE WHEN est_actif = TRUE THEN 1 END) as active_institutions
            FROM institutions
            WHERE ville IS NOT NULL
            GROUP BY ville
            ORDER BY institution_count DESC
        `);
        
        // Appointment activity by region
        const [appointmentsByRegion] = await db.execute(`
            SELECT 
                p.ville as city,
                COUNT(rv.id) as appointment_count,
                COUNT(CASE WHEN rv.statut = 'confirme' THEN 1 END) as confirmed_appointments
            FROM rendez_vous rv
            LEFT JOIN patients p ON rv.patient_id = p.id
            WHERE p.ville IS NOT NULL
            GROUP BY p.ville
            ORDER BY appointment_count DESC
            LIMIT 15
        `);
        
        // Regional coverage analysis
        const [regionalCoverage] = await db.execute(`
            SELECT 
                region,
                COUNT(DISTINCT city) as cities_covered,
                SUM(user_count) as total_users
            FROM (
                SELECT 
                    CASE 
                        WHEN ville IN ('Casablanca', 'Mohammedia', 'Settat', 'Berrechid') THEN 'Casablanca-Settat'
                        WHEN ville IN ('Rabat', 'Salé', 'Kénitra', 'Témara') THEN 'Rabat-Salé-Kénitra'
                        WHEN ville IN ('Marrakech', 'Safi', 'Essaouira') THEN 'Marrakech-Safi'
                        WHEN ville IN ('Fès', 'Meknès', 'Ifrane') THEN 'Fès-Meknès'
                        WHEN ville IN ('Tanger', 'Tétouan', 'Al Hoceïma') THEN 'Tanger-Tétouan-Al Hoceïma'
                        WHEN ville IN ('Agadir', 'Tiznit', 'Taroudant') THEN 'Souss-Massa'
                        ELSE 'Autres régions'
                    END as region,
                    ville as city,
                    COUNT(*) as user_count
                FROM patients
                WHERE ville IS NOT NULL
                GROUP BY ville
            ) as regional_data
            GROUP BY region
            ORDER BY total_users DESC
        `);
        
        res.json({
            usersByRegion,
            institutionsByRegion,
            appointmentsByRegion,
            regionalCoverage
        });
    } catch (error) {
        console.error('Error fetching geographic stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques géographiques' });
    }
});

module.exports = router;
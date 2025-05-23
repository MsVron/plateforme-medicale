const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
    verifyToken,
    isSuperAdmin,
    isMedecin,
    isPatient,
} = require("../middlewares/auth");

router.get(
    "/patients",
    verifyToken,
    isSuperAdmin,
    patientController.getPatients
);
router.post(
    "/patients",
    verifyToken,
    isSuperAdmin,
    patientController.addPatient
);
router.put(
    "/patients/:id",
    verifyToken,
    isSuperAdmin,
    patientController.editPatient
);
router.delete(
    "/patients/:id",
    verifyToken,
    isSuperAdmin,
    patientController.deletePatient
);

// Route pour récupérer les patients (protégée)
router.get("/", verifyToken, patientController.getPatients);

// Route pour ajouter un patient direct (réservée aux médecins)
router.post(
    "/direct",
    verifyToken,
    isMedecin,
    patientController.addWalkInPatient
);

// Patient-specific routes
router.get(
    "/patient/appointments",
    verifyToken,
    isPatient,
    async (req, res) => {
        try {
            const patientId = req.user.id_specifique_role;
            const db = require("../config/db");

            const [appointments] = await db.execute(
                `SELECT 
                    rv.id,
                    rv.date_heure_debut,
                    rv.date_heure_fin,
                    rv.motif,
                    rv.statut,
                    rv.notes_patient,
                    m.prenom as medecin_prenom,
                    m.nom as medecin_nom,
                    s.nom as specialite,
                    i.nom as institution_nom
                FROM rendez_vous rv
                JOIN medecins m ON rv.medecin_id = m.id
                LEFT JOIN specialites s ON m.specialite_id = s.id
                LEFT JOIN institutions i ON rv.institution_id = i.id
                WHERE rv.patient_id = ?
                ORDER BY rv.date_heure_debut DESC`,
                [patientId]
            );

            res.json(appointments);
        } catch (error) {
            console.error("Error fetching patient appointments:", error);
            res.status(500).json({
                message: "Erreur lors de la récupération des rendez-vous",
            });
        }
    }
);

// Dashboard appointments - only upcoming ones
router.get(
    "/patient/dashboard-appointments",
    verifyToken,
    isPatient,
    async (req, res) => {
        try {
            const patientId = req.user.id_specifique_role;
            const db = require("../config/db");

            const [appointments] = await db.execute(
                `SELECT 
                    rv.id,
                    rv.date_heure_debut,
                    rv.date_heure_fin,
                    rv.motif,
                    rv.statut,
                    rv.notes_patient,
                    m.prenom as medecin_prenom,
                    m.nom as medecin_nom,
                    s.nom as specialite,
                    i.nom as institution_nom
                FROM rendez_vous rv
                JOIN medecins m ON rv.medecin_id = m.id
                LEFT JOIN specialites s ON m.specialite_id = s.id
                LEFT JOIN institutions i ON rv.institution_id = i.id
                WHERE rv.patient_id = ? 
                AND rv.date_heure_debut >= NOW()
                AND rv.statut NOT IN ('annulé', 'terminé')
                ORDER BY rv.date_heure_debut ASC
                LIMIT 5`,
                [patientId]
            );

            res.json(appointments);
        } catch (error) {
            console.error("Error fetching patient dashboard appointments:", error);
            res.status(500).json({
                message: "Erreur lors de la récupération des rendez-vous",
            });
        }
    }
);

router.put(
    "/patient/appointments/:id/cancel",
    verifyToken,
    isPatient,
    async (req, res) => {
        try {
            const appointmentId = req.params.id;
            const patientId = req.user.id_specifique_role;
            const db = require("../config/db");

            // Verify the appointment belongs to the patient
            const [appointment] = await db.execute(
                "SELECT id FROM rendez_vous WHERE id = ? AND patient_id = ?",
                [appointmentId, patientId]
            );

            if (appointment.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Rendez-vous non trouvé" });
            }

            await db.execute("UPDATE rendez_vous SET statut = ? WHERE id = ?", [
                "annulé",
                appointmentId,
            ]);

            res.json({ message: "Rendez-vous annulé avec succès" });
        } catch (error) {
            console.error("Error canceling appointment:", error);
            res.status(500).json({
                message: "Erreur lors de l'annulation du rendez-vous",
            });
        }
    }
);

router.get("/patient/favorites", verifyToken, isPatient, async (req, res) => {
    try {
        const patientId = req.user.id_specifique_role;
        const db = require("../config/db");
        
        const [favorites] = await db.execute(
            `SELECT 
                m.id,
                m.prenom,
                m.nom,
                s.nom as specialite,
                m.telephone,
                m.email_professionnel as email,
                m.tarif_consultation,
                m.ville,
                m.accepte_patients_walk_in,
                i.nom as institution_nom
            FROM favoris_medecins fm
            JOIN medecins m ON fm.medecin_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            LEFT JOIN institutions i ON m.institution_id = i.id
            WHERE fm.patient_id = ?
            ORDER BY fm.date_ajout DESC`,
            [patientId]
        );
        
        res.json(favorites);
    } catch (error) {
        console.error("Error fetching patient favorites:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des médecins favoris",
        });
    }
});

router.get("/patient/favorites/check/:doctorId", verifyToken, isPatient, async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const patientId = req.user.id_specifique_role;
        const db = require("../config/db");
        
        const [result] = await db.execute(
            "SELECT id FROM favoris_medecins WHERE patient_id = ? AND medecin_id = ?",
            [patientId, doctorId]
        );
        
        res.json({ isFavorite: result.length > 0 });
    } catch (error) {
        console.error("Error checking favorite status:", error);
        res.status(500).json({
            message: "Erreur lors de la vérification du statut favori",
        });
    }
});

router.post(
    "/patient/favorites/:doctorId",
    verifyToken,
    isPatient,
    async (req, res) => {
        try {
            const doctorId = req.params.doctorId;
            const patientId = req.user.id_specifique_role;
            const db = require("../config/db");
            
            // Check if already in favorites
            const [existing] = await db.execute(
                "SELECT id FROM favoris_medecins WHERE patient_id = ? AND medecin_id = ?",
                [patientId, doctorId]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({
                    message: "Ce médecin est déjà dans vos favoris",
                });
            }
            
            await db.execute(
                "INSERT INTO favoris_medecins (patient_id, medecin_id) VALUES (?, ?)",
                [patientId, doctorId]
            );
            
            res.json({ message: "Médecin ajouté aux favoris avec succès" });
        } catch (error) {
            console.error("Error adding favorite doctor:", error);
            res.status(500).json({
                message: "Erreur lors de l'ajout du favori",
            });
        }
    }
);

router.delete(
    "/patient/favorites/:doctorId",
    verifyToken,
    isPatient,
    async (req, res) => {
        try {
            const doctorId = req.params.doctorId;
            const patientId = req.user.id_specifique_role;
            const db = require("../config/db");
            
            await db.execute(
                "DELETE FROM favoris_medecins WHERE patient_id = ? AND medecin_id = ?",
                [patientId, doctorId]
            );
            
            res.json({ message: "Médecin retiré des favoris avec succès" });
        } catch (error) {
            console.error("Error removing favorite doctor:", error);
            res.status(500).json({
                message: "Erreur lors de la suppression du favori",
            });
        }
    }
);

module.exports = router;

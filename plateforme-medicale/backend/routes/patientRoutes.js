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

// Medical Records Routes
router.get("/patient/medical-record", verifyToken, isPatient, async (req, res) => {
    try {
        const patientId = req.user.id_specifique_role;
        const db = require("../config/db");

        // Get patient basic info
        const [patientInfo] = await db.execute(
            `SELECT 
                p.id, p.prenom, p.nom, p.date_naissance, p.sexe, p.CNE,
                p.adresse, p.ville, p.code_postal, p.pays, p.telephone, p.email,
                p.contact_urgence_nom, p.contact_urgence_telephone, p.contact_urgence_relation,
                p.groupe_sanguin, p.taille_cm, p.poids_kg, p.est_fumeur, 
                p.consommation_alcool, p.activite_physique, p.profession,
                p.allergies_notes,
                mt.prenom as medecin_traitant_prenom,
                mt.nom as medecin_traitant_nom,
                s.nom as medecin_traitant_specialite
            FROM patients p
            LEFT JOIN medecins mt ON p.medecin_traitant_id = mt.id
            LEFT JOIN specialites s ON mt.specialite_id = s.id
            WHERE p.id = ?`,
            [patientId]
        );

        if (patientInfo.length === 0) {
            return res.status(404).json({ message: "Patient non trouvé" });
        }

        // Get allergies
        const [allergies] = await db.execute(
            `SELECT 
                a.nom as allergie_nom,
                pa.date_diagnostic,
                pa.severite,
                pa.notes
            FROM patient_allergies pa
            JOIN allergies a ON pa.allergie_id = a.id
            WHERE pa.patient_id = ?`,
            [patientId]
        );

        // Get medical history
        const [antecedents] = await db.execute(
            `SELECT 
                am.type,
                am.description,
                am.date_debut,
                am.date_fin,
                am.est_chronique,
                am.date_enregistrement,
                m.prenom as medecin_prenom,
                m.nom as medecin_nom
            FROM antecedents_medicaux am
            LEFT JOIN medecins m ON am.medecin_id = m.id
            WHERE am.patient_id = ?
            ORDER BY am.date_enregistrement DESC`,
            [patientId]
        );

        // Get current treatments
        const [traitements] = await db.execute(
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
                m.prenom as medecin_prenom,
                m.nom as medecin_nom,
                s.nom as medecin_specialite
            FROM traitements t
            JOIN medicaments med ON t.medicament_id = med.id
            JOIN medecins m ON t.medecin_prescripteur_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            WHERE t.patient_id = ? AND (t.date_fin IS NULL OR t.date_fin >= CURDATE())
            ORDER BY t.date_prescription DESC`,
            [patientId]
        );

        // Get analysis results
        const [analyses] = await db.execute(
            `SELECT 
                ta.nom as type_analyse,
                ca.nom as categorie,
                ra.date_prescription,
                ra.date_realisation,
                ra.laboratoire,
                ra.valeur_numerique,
                ra.valeur_texte,
                ra.unite,
                ra.valeur_normale_min,
                ra.valeur_normale_max,
                ra.interpretation,
                ra.est_normal,
                ra.est_critique,
                mp.prenom as medecin_prescripteur_prenom,
                mp.nom as medecin_prescripteur_nom,
                mi.prenom as medecin_interpreteur_prenom,
                mi.nom as medecin_interpreteur_nom
            FROM resultats_analyses ra
            JOIN types_analyses ta ON ra.type_analyse_id = ta.id
            JOIN categories_analyses ca ON ta.categorie_id = ca.id
            JOIN medecins mp ON ra.medecin_prescripteur_id = mp.id
            LEFT JOIN medecins mi ON ra.medecin_interpreteur_id = mi.id
            WHERE ra.patient_id = ?
            ORDER BY ra.date_realisation DESC, ra.date_prescription DESC`,
            [patientId]
        );

        // Get imaging results
        const [imagerie] = await db.execute(
            `SELECT 
                ti.nom as type_imagerie,
                ri.date_prescription,
                ri.date_realisation,
                ri.interpretation,
                ri.conclusion,
                ri.image_urls,
                ri.date_interpretation,
                mp.prenom as medecin_prescripteur_prenom,
                mp.nom as medecin_prescripteur_nom,
                mr.prenom as medecin_radiologue_prenom,
                mr.nom as medecin_radiologue_nom,
                i.nom as institution_nom
            FROM resultats_imagerie ri
            JOIN types_imagerie ti ON ri.type_imagerie_id = ti.id
            JOIN medecins mp ON ri.medecin_prescripteur_id = mp.id
            LEFT JOIN medecins mr ON ri.medecin_radiologue_id = mr.id
            LEFT JOIN institutions i ON ri.institution_realisation_id = i.id
            WHERE ri.patient_id = ?
            ORDER BY ri.date_realisation DESC, ri.date_prescription DESC`,
            [patientId]
        );

        // Get consultations
        const [consultations] = await db.execute(
            `SELECT 
                c.date_consultation,
                c.motif,
                c.anamnese,
                c.examen_clinique,
                c.diagnostic,
                c.conclusion,
                c.follow_up_date,
                m.prenom as medecin_prenom,
                m.nom as medecin_nom,
                s.nom as medecin_specialite,
                i.nom as institution_nom
            FROM consultations c
            JOIN medecins m ON c.medecin_id = m.id
            LEFT JOIN specialites s ON m.specialite_id = s.id
            LEFT JOIN rendez_vous rv ON c.rendez_vous_id = rv.id
            LEFT JOIN institutions i ON rv.institution_id = i.id
            WHERE c.patient_id = ?
            ORDER BY c.date_consultation DESC`,
            [patientId]
        );

        // Get vital signs
        const [constantes] = await db.execute(
            `SELECT 
                cv.date_mesure,
                cv.temperature,
                cv.tension_arterielle_systolique,
                cv.tension_arterielle_diastolique,
                cv.frequence_cardiaque,
                cv.saturation_oxygene,
                cv.frequence_respiratoire,
                cv.glycemie,
                cv.poids,
                cv.taille,
                cv.imc,
                cv.notes,
                c.date_consultation,
                m.prenom as medecin_prenom,
                m.nom as medecin_nom
            FROM constantes_vitales cv
            LEFT JOIN consultations c ON cv.consultation_id = c.id
            LEFT JOIN medecins m ON c.medecin_id = m.id
            WHERE cv.patient_id = ?
            ORDER BY cv.date_mesure DESC`,
            [patientId]
        );

        res.json({
            patient: patientInfo[0],
            allergies,
            antecedents,
            traitements,
            analyses,
            imagerie,
            consultations,
            constantes
        });

    } catch (error) {
        console.error("Error fetching patient medical record:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération du dossier médical",
        });
    }
});

// Update patient personal information (only modifiable fields)
router.put("/patient/personal-info", verifyToken, isPatient, async (req, res) => {
    try {
        const patientId = req.user.id_specifique_role;
        const db = require("../config/db");
        
        const {
            adresse,
            ville,
            code_postal,
            pays,
            telephone,
            email,
            contact_urgence_nom,
            contact_urgence_telephone,
            contact_urgence_relation,
            profession
        } = req.body;

        // Update only personal information fields
        await db.execute(
            `UPDATE patients SET 
                adresse = ?,
                ville = ?,
                code_postal = ?,
                pays = ?,
                telephone = ?,
                email = ?,
                contact_urgence_nom = ?,
                contact_urgence_telephone = ?,
                contact_urgence_relation = ?,
                profession = ?
            WHERE id = ?`,
            [
                adresse,
                ville,
                code_postal,
                pays,
                telephone,
                email,
                contact_urgence_nom,
                contact_urgence_telephone,
                contact_urgence_relation,
                profession,
                patientId
            ]
        );

        // Also update email in users table if changed
        if (email) {
            await db.execute(
                "UPDATE utilisateurs SET email = ? WHERE role = 'patient' AND id_specifique_role = ?",
                [email, patientId]
            );
        }

        res.json({ message: "Informations personnelles mises à jour avec succès" });

    } catch (error) {
        console.error("Error updating patient personal info:", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour des informations personnelles",
        });
    }
});

module.exports = router;

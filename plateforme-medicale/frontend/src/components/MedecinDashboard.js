import React, { useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Tabs,
    Tab,
    Grid,
    TextField,
} from "@mui/material";
import axios from "axios";
import useMedecinData from "../hooks/useMedecinData";
import ProfileTab from "./medecin/ProfileTab";
import AvailabilitiesTab from "./medecin/AvailabilitiesTab";
import AvailabilityDialog from "./medecin/AvailabilityDialog";
import AbsencesTab from "./medecin/AbsencesTab";
import AbsenceDialog from "./medecin/AbsenceDialog";
import PatientsTab from "./medecin/PatientsTab";
import PatientDialog from "./medecin/PatientDialog";
import PreferencePatientsDirectsToggle from "./medecin/WalkInPreferenceToggle";

const MedecinDashboard = () => {
    const {
        data,
        error,
        loading,
        success,
        updateMedecin,
        submitAvailability,
        deleteAvailability,
        submitAbsence,
        deleteAbsence,
        submitPatient,
        clearMessages,
    } = useMedecinData();

    const [tabValue, setTabValue] = useState(0);
    const [openAvailability, setOpenAvailability] = useState(false);
    const [openAbsence, setOpenAbsence] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    

    // Form states
    const [availabilityForm, setAvailabilityForm] = useState({
        id: null,
        institution_id: "",
        jours_semaine: [],
        heure_debut: "",
        heure_fin: "",
        intervalle_minutes: 30,
        est_actif: true,
        a_pause_dejeuner: false,
        heure_debut_pause: "",
        heure_fin_pause: "",
    });

    const [absenceForm, setAbsenceForm] = useState({
        date_debut: null,
        date_fin: null,
        motif: "",
    });

    const [patientForm, setPatientForm] = useState({
        prenom: "",
        nom: "",
        date_naissance: null,
        sexe: "",
        CNE: "",
        CNE_confirm: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        code_postal: "",
        pays: "Maroc",
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        clearMessages();
    };

    const handleOpenAvailability = (availability = null) => {
        if (availability) {
            setAvailabilityForm({
                id: availability.id,
                institution_id: availability.institution_id,
                jours_semaine: [availability.jour_semaine],
                heure_debut: availability.heure_debut,
                heure_fin: availability.heure_fin,
                intervalle_minutes: availability.intervalle_minutes,
                est_actif: availability.est_actif,
                a_pause_dejeuner: availability.a_pause_dejeuner || false,
                heure_debut_pause: availability.heure_debut_pause || "",
                heure_fin_pause: availability.heure_fin_pause || "",
            });
        } else {
            setAvailabilityForm({
                id: null,
                institution_id: "",
                jours_semaine: [],
                heure_debut: "",
                heure_fin: "",
                intervalle_minutes: 30,
                est_actif: true,
                a_pause_dejeuner: false,
                heure_debut_pause: "",
                heure_fin_pause: "",
            });
        }
        clearMessages();
        setOpenAvailability(true);
    };

    const handleCloseAvailability = () => {
        setOpenAvailability(false);
        setAvailabilityForm({
            id: null,
            institution_id: "",
            jours_semaine: [],
            heure_debut: "",
            heure_fin: "",
            intervalle_minutes: 30,
            est_actif: true,
            a_pause_dejeuner: false,
            heure_debut_pause: "",
            heure_fin_pause: "",
        });
    };

    const handleSubmitAvailability = async () => {
        const success = await submitAvailability(availabilityForm);
        if (success) {
            handleCloseAvailability();
        }
    };

    const handleOpenAbsence = () => {
        setAbsenceForm({ date_debut: null, date_fin: null, motif: "" });
        clearMessages();
        setOpenAbsence(true);
    };

    const handleCloseAbsence = () => {
        setOpenAbsence(false);
    };

    const handleSubmitAbsence = async () => {
        const success = await submitAbsence(absenceForm);
        if (success) {
            handleCloseAbsence();
        }
    };

    const handleOpenPatient = () => {
        setPatientForm({
            prenom: "",
            nom: "",
            date_naissance: null,
            sexe: "",
            CNE: "",
            CNE_confirm: "",
            email: "",
            telephone: "",
            adresse: "",
            ville: "",
            code_postal: "",
            pays: "Maroc",
        });
        clearMessages();
        setOpenPatient(true);
    };

    const handleClosePatient = () => {
        setOpenPatient(false);
    };

    const handleSubmitPatient = async () => {
        const success = await submitPatient(patientForm);
        if (success) {
            handleClosePatient();
        }
    };

    

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Chargement...</Typography>
            </Box>
        );
    }

    if (error && !success) {
        return (
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: 1,
                }}>
                <Typography variant="h4" gutterBottom>
                    Espace Médecin
                </Typography>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                mt: 4,
                p: 3,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                minHeight: "100vh",
            }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976d2" }}>
                Espace Médecin
            </Typography>

            {/* Header Section */}
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 1,
                    boxShadow: 1,
                }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Bienvenue, {data.medecin.prenom} {data.medecin.nom}
                </Typography>
                <Typography sx={{ mb: 2 }}>
                    Spécialité: {data.medecin.specialite_nom || "Non spécifiée"}{" "}
                    | Institution: {data.medecin.institution_nom || "Aucune"}
                </Typography>

                
            </Box>

            {/* Préférence Patients Directs Section */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <PreferencePatientsDirectsToggle />
                </Grid>
            </Grid>

            {/* Success Message */}
            {success && (
                <Typography
                    color="success.main"
                    sx={{ mb: 2, bgcolor: "#e8f5e9", p: 1, borderRadius: 1 }}>
                    {success}
                </Typography>
            )}

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ mb: 3, bgcolor: "#fff", borderRadius: 1 }}>
                <Tab label="Profil" />
                <Tab label="Disponibilités" />
                <Tab label="Absences" />
                <Tab label="Patients" />
            </Tabs>

            {/* Tab Content */}
            {tabValue === 0 && (
                <ProfileTab
                    medecin={data.medecin}
                    onUpdateMedecin={updateMedecin}
                    onSuccess={clearMessages}
                    onError={clearMessages}
                />
            )}

            {tabValue === 1 && (
                <AvailabilitiesTab
                    availabilities={data.availabilities}
                    onOpenAvailability={handleOpenAvailability}
                    onDeleteAvailability={deleteAvailability}
                />
            )}

            {tabValue === 2 && (
                <AbsencesTab
                    absences={data.absences}
                    onOpenAbsence={handleOpenAbsence}
                    onDeleteAbsence={deleteAbsence}
                />
            )}

            {tabValue === 3 && <PatientsTab patients={data.patients} />}

            {/* Dialogs */}
            <AvailabilityDialog
                open={openAvailability}
                onClose={handleCloseAvailability}
                availabilityForm={availabilityForm}
                setAvailabilityForm={setAvailabilityForm}
                institutions={data.institutions}
                onSubmit={handleSubmitAvailability}
                error={error}
            />

            <AbsenceDialog
                open={openAbsence}
                onClose={handleCloseAbsence}
                absenceForm={absenceForm}
                setAbsenceForm={setAbsenceForm}
                onSubmit={handleSubmitAbsence}
                error={error}
            />

            <PatientDialog
                open={openPatient}
                onClose={handleClosePatient}
                patientForm={patientForm}
                setPatientForm={setPatientForm}
                onSubmit={handleSubmitPatient}
                error={error}
            />
        </Box>
    );
};

export default MedecinDashboard;

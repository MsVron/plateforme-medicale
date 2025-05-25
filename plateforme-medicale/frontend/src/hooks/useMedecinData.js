import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const useMedecinData = () => {
    const [data, setData] = useState({
        medecin: null,
        institutions: [],
        availabilities: [],
        absences: [],
        patients: [],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        try {
            const [
                medecinResponse,
                institutionsResponse,
                availabilitiesResponse,
                absencesResponse,
                patientsResponse,
            ] = await Promise.all([
                axios.get("/medecin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }),
                axios.get("/medecin/institutions", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }),
                axios.get("/medecin/disponibilites", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }),
                axios.get("/medecin/absences", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }),
                axios.get("/medecin/patients", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }),
            ]);
            setData({
                medecin: medecinResponse.data.medecin,
                institutions: institutionsResponse.data.institutions,
                availabilities: availabilitiesResponse.data.availabilities,
                absences: absencesResponse.data.absences,
                patients: patientsResponse.data.patients,
            });
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de la récupération des données"
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateMedecin = (updatedMedecin) => {
        setData({ ...data, medecin: updatedMedecin });
    };

    const submitAvailability = async (availabilityForm) => {
        try {
            if (
                !availabilityForm.institution_id ||
                !availabilityForm.jours_semaine.length ||
                !availabilityForm.heure_debut ||
                !availabilityForm.heure_fin
            ) {
                setError("Tous les champs obligatoires doivent être remplis");
                return false;
            }

            const token = localStorage.getItem("token");
            if (availabilityForm.id) {
                await axios.put(
                    `/medecin/disponibilites/${availabilityForm.id}`,
                    {
                        ...availabilityForm,
                        jour_semaine: availabilityForm.jours_semaine[0],
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess("Disponibilité mise à jour avec succès");
            } else {
                await axios.post(
                    "/medecin/disponibilites",
                    availabilityForm,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSuccess("Disponibilités ajoutées avec succès");
            }

            const response = await axios.get(
                "/medecin/disponibilites",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setData({ ...data, availabilities: response.data.availabilities });
            return true;
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de l'ajout/modification de la disponibilité"
            );
            return false;
        }
    };

    const deleteAvailability = async (id) => {
        try {
            await axios.delete(
                `/medecin/disponibilites/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccess("Disponibilité supprimée avec succès");
            const response = await axios.get(
                "/medecin/disponibilites",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setData({ ...data, availabilities: response.data.availabilities });
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de la suppression de la disponibilité"
            );
        }
    };

    const submitAbsence = async (absenceForm) => {
        try {
            if (!absenceForm.date_debut || !absenceForm.date_fin) {
                setError("Les dates de début et de fin sont obligatoires");
                return false;
            }

            const token = localStorage.getItem("token");
            await axios.post(
                "/medecin/absences",
                absenceForm,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccess("Absence ajoutée avec succès");

            const response = await axios.get(
                "/medecin/absences",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setData({ ...data, absences: response.data.absences });
            return true;
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de l'ajout de l'absence"
            );
            return false;
        }
    };

    const deleteAbsence = async (id) => {
        try {
            await axios.delete(
                `/medecin/absences/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSuccess("Absence supprimée avec succès");
            const response = await axios.get(
                "/medecin/absences",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setData({ ...data, absences: response.data.absences });
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de la suppression de l'absence"
            );
        }
    };

    const submitPatient = async (patientForm) => {
        try {
            if (
                !patientForm.prenom ||
                !patientForm.nom ||
                !patientForm.date_naissance ||
                !patientForm.sexe
            ) {
                setError(
                    "Prénom, nom, date de naissance et sexe sont obligatoires"
                );
                return false;
            }

            const formattedPatient = {
                ...patientForm,
                date_naissance: patientForm.date_naissance
                    ? format(patientForm.date_naissance, "yyyy-MM-dd")
                    : null,
            };

            const token = localStorage.getItem("token");
            await axios.post(
                "/medecin/patients",
                formattedPatient,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuccess("Patient ajouté avec succès");

            const response = await axios.get(
                "/medecin/patients",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setData({ ...data, patients: response.data.patients });
            return true;
        } catch (error) {
            console.error("Erreur lors de l'ajout du patient:", error);
            setError(
                error.response?.data?.message ||
                    "Erreur lors de l'ajout du patient"
            );
            return false;
        }
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return {
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
    };
};

export default useMedecinData; 
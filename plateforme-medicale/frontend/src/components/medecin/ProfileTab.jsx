import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const ProfileTab = ({ medecin, onUpdateMedecin, onSuccess, onError }) => {
    const [isEditingFee, setIsEditingFee] = useState(false);
    const [consultationFee, setConsultationFee] = useState("");

    const handleUpdateConsultationFee = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                "/medecin/profile/fee",
                { tarif_consultation: parseFloat(consultationFee) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUpdateMedecin({
                ...medecin,
                tarif_consultation: parseFloat(consultationFee),
            });

            setIsEditingFee(false);
            onSuccess("Tarif de consultation mis à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du tarif:", error);
            onError(
                error.response?.data?.message ||
                    "Erreur lors de la mise à jour du tarif de consultation"
            );
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: "medium", mb: 3 }}>
                Mon Profil
            </Typography>
            <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", mb: 2 }}>
                                Informations Personnelles
                            </Typography>
                            <Typography>
                                <strong>Nom:</strong> {medecin.nom}
                            </Typography>
                            <Typography>
                                <strong>Prénom:</strong> {medecin.prenom}
                            </Typography>
                            <Typography>
                                <strong>Spécialité:</strong>{" "}
                                {medecin.specialite_nom || "Non spécifiée"}
                            </Typography>
                            <Typography>
                                <strong>Institution:</strong>{" "}
                                {medecin.institution_nom || "Aucune"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold", mb: 2 }}>
                                Tarification
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                }}>
                                {isEditingFee ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                            width: "100%",
                                        }}>
                                        <TextField
                                            label="Tarif de consultation"
                                            type="number"
                                            value={consultationFee}
                                            onChange={(e) =>
                                                setConsultationFee(e.target.value)
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <Typography component="span">
                                                        DH
                                                    </Typography>
                                                ),
                                                inputProps: {
                                                    min: 0,
                                                    step: "0.01",
                                                },
                                            }}
                                            fullWidth
                                            helperText="Définissez votre tarif de consultation standard"
                                        />
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                onClick={handleUpdateConsultationFee}
                                                color="primary">
                                                Enregistrer
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setIsEditingFee(false);
                                                    setConsultationFee(
                                                        medecin.tarif_consultation?.toString() ||
                                                            ""
                                                    );
                                                }}>
                                                Annuler
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ width: "100%" }}>
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                            sx={{ mb: 1 }}>
                                            {medecin.tarif_consultation
                                                ? `${medecin.tarif_consultation} DH`
                                                : "Non défini"}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setConsultationFee(
                                                    medecin.tarif_consultation?.toString() ||
                                                        ""
                                                );
                                                setIsEditingFee(true);
                                            }}
                                            startIcon={<EditIcon />}>
                                            Modifier le tarif
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ProfileTab; 
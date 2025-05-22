import React from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
import { formatTime } from "../../utils/dateUtils";

const AvailabilitiesTab = ({
    availabilities,
    onOpenAvailability,
    onDeleteAvailability,
}) => {
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}>
                <Typography variant="h5" sx={{ fontWeight: "medium" }}>
                    Disponibilités Hebdomadaires
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onOpenAvailability()}>
                    Ajouter une disponibilité
                </Button>
            </Box>
            <Grid container spacing={2}>
                {availabilities.length === 0 ? (
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                        Aucune disponibilité enregistrée.
                    </Typography>
                ) : (
                    availabilities.map((availability) => (
                        <Grid item xs={12} sm={6} md={4} key={availability.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {availability.institution_nom}
                                    </Typography>
                                    <Typography>
                                        <strong>Jour:</strong>{" "}
                                        {availability.jour_semaine}
                                    </Typography>
                                    <Typography>
                                        <strong>Horaire:</strong>{" "}
                                        {formatTime(availability.heure_debut)} -{" "}
                                        {formatTime(availability.heure_fin)}
                                    </Typography>
                                    {availability.a_pause_dejeuner && (
                                        <Typography>
                                            <strong>Pause déjeuner:</strong>{" "}
                                            {formatTime(
                                                availability.heure_debut_pause
                                            )}{" "}
                                            -{" "}
                                            {formatTime(
                                                availability.heure_fin_pause
                                            )}
                                        </Typography>
                                    )}
                                    <Typography>
                                        <strong>Intervalle:</strong>{" "}
                                        {availability.intervalle_minutes} min
                                    </Typography>
                                    <Typography>
                                        <strong>Statut:</strong>{" "}
                                        {availability.est_actif
                                            ? "Actif"
                                            : "Inactif"}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            onOpenAvailability(availability)
                                        }>
                                        Modifier
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            onDeleteAvailability(availability.id)
                                        }>
                                        Supprimer
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default AvailabilitiesTab; 
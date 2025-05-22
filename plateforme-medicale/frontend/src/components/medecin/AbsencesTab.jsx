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
import { formatDateTime } from "../../utils/dateUtils";

const AbsencesTab = ({ absences, onOpenAbsence, onDeleteAbsence }) => {
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
                    Absences Exceptionnelles
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenAbsence}>
                    Ajouter une absence
                </Button>
            </Box>
            <Grid container spacing={2}>
                {absences.length === 0 ? (
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                        Aucune absence enregistrée.
                    </Typography>
                ) : (
                    absences.map((absence) => (
                        <Grid item xs={12} sm={6} md={4} key={absence.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Absence
                                    </Typography>
                                    <Typography>
                                        <strong>Début:</strong>{" "}
                                        {formatDateTime(absence.date_debut)}
                                    </Typography>
                                    <Typography>
                                        <strong>Fin:</strong>{" "}
                                        {formatDateTime(absence.date_fin)}
                                    </Typography>
                                    <Typography>
                                        <strong>Motif:</strong>{" "}
                                        {absence.motif || "Non spécifié"}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            onDeleteAbsence(absence.id)
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

export default AbsencesTab; 
import React from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import { formatDate } from "../../utils/dateUtils";

const PatientsTab = ({ patients }) => {
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
                    Mes Patients
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {patients.length === 0 ? (
                    <Typography sx={{ mt: 2, color: "text.secondary" }}>
                        Aucun patient enregistré.
                    </Typography>
                ) : (
                    patients.map((patient) => (
                        <Grid item xs={12} sm={6} md={4} key={patient.id}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {patient.prenom} {patient.nom}
                                    </Typography>
                                    <Typography>
                                        <strong>Date de naissance:</strong>{" "}
                                        {formatDate(patient.date_naissance)}
                                    </Typography>
                                    <Typography>
                                        <strong>Sexe:</strong> {patient.sexe}
                                    </Typography>
                                    {patient.CNE && (
                                        <Typography>
                                            <strong>CNE:</strong> {patient.CNE}
                                        </Typography>
                                    )}
                                    {patient.email && (
                                        <Typography>
                                            <strong>Email:</strong>{" "}
                                            {patient.email}
                                        </Typography>
                                    )}
                                    {patient.telephone && (
                                        <Typography>
                                            <strong>Téléphone:</strong>{" "}
                                            {patient.telephone}
                                        </Typography>
                                    )}
                                    {patient.adresse && (
                                        <Typography>
                                            <strong>Adresse:</strong>{" "}
                                            {patient.adresse}, {patient.ville}{" "}
                                            {patient.code_postal}, {patient.pays}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default PatientsTab; 
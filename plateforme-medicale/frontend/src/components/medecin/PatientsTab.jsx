import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    IconButton,
    Tooltip,
} from "@mui/material";
import { 
    MedicalServices as MedicalIcon,
    Person as PersonIcon 
} from "@mui/icons-material";
import { formatDate } from "../../utils/dateUtils";

const PatientsTab = ({ patients }) => {
    const navigate = useNavigate();

    const handlePatientClick = (patientId) => {
        navigate(`/medecin/patients/${patientId}/dossier`);
    };

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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Cliquez sur un patient pour voir son dossier médical
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {patients.length === 0 ? (
                    <Grid item xs={12}>
                        <Box 
                            sx={{ 
                                textAlign: "center", 
                                py: 4,
                                bgcolor: "grey.50",
                                borderRadius: 2,
                                border: "1px dashed",
                                borderColor: "grey.300"
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                            <Typography sx={{ color: "text.secondary" }}>
                                Aucun patient enregistré.
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    patients.map((patient) => (
                        <Grid item xs={12} sm={6} md={4} key={patient.id}>
                            <Card 
                                sx={{ 
                                    boxShadow: 3, 
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: 6,
                                        transform: "translateY(-2px)",
                                        cursor: "pointer"
                                    }
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => handlePatientClick(patient.id)}
                                    sx={{ height: "100%" }}
                                >
                                    <CardContent sx={{ position: "relative", pb: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                                {patient.prenom} {patient.nom}
                                            </Typography>
                                            <Tooltip title="Voir le dossier médical">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ 
                                                        color: "primary.main",
                                                        "&:hover": { bgcolor: "primary.light", color: "white" }
                                                    }}
                                                >
                                                    <MedicalIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        
                                        <Box sx={{ space: 1 }}>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                <strong>Date de naissance:</strong>{" "}
                                                {formatDate(patient.date_naissance)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                <strong>Sexe:</strong> {patient.sexe}
                                            </Typography>
                                            {patient.CNE && (
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                    <strong>CNE:</strong> {patient.CNE}
                                                </Typography>
                                            )}
                                            {patient.email && (
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                    <strong>Email:</strong>{" "}
                                                    {patient.email}
                                                </Typography>
                                            )}
                                            {patient.telephone && (
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                    <strong>Téléphone:</strong>{" "}
                                                    {patient.telephone}
                                                </Typography>
                                            )}
                                            {patient.adresse && (
                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                    <strong>Adresse:</strong>{" "}
                                                    {patient.adresse}, {patient.ville}{" "}
                                                    {patient.code_postal}, {patient.pays}
                                                </Typography>
                                            )}
                                        </Box>
                                        
                                        <Box 
                                            sx={{ 
                                                position: "absolute",
                                                bottom: 8,
                                                right: 8,
                                                opacity: 0.6,
                                                fontSize: "0.75rem",
                                                color: "primary.main",
                                                fontWeight: "medium"
                                            }}
                                        >
                                            Cliquer pour voir le dossier
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default PatientsTab; 
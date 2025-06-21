import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Grid,
    Divider,
} from "@mui/material";
import {
    LocalizationProvider,
    DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { datePickerProps } from "../../utils/dateUtils";

const PatientDialog = ({
    open,
    onClose,
    patientForm,
    setPatientForm,
    onSubmit,
    error,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Ajouter un Patient</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography
                            color="error"
                            sx={{
                                mb: 2,
                                bgcolor: "#ffebee",
                                p: 1,
                                borderRadius: 1,
                            }}>
                            {error}
                        </Typography>
                    )}
                    <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, fontWeight: "medium" }}>
                        Informations Personnelles
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Prénom *"
                                fullWidth
                                value={patientForm.prenom}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        prenom: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Nom *"
                                fullWidth
                                value={patientForm.nom}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        nom: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Date de naissance *"
                                value={patientForm.date_naissance}
                                onChange={(newValue) =>
                                    setPatientForm({
                                        ...patientForm,
                                        date_naissance: newValue,
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        margin="dense"
                                        fullWidth
                                    />
                                )}
                                maxDate={new Date()}
                                {...datePickerProps}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Sexe *</InputLabel>
                                <Select
                                    value={patientForm.sexe}
                                    onChange={(e) =>
                                        setPatientForm({
                                            ...patientForm,
                                            sexe: e.target.value,
                                        })
                                    }
                                    label="Sexe">
                                    <MenuItem value="M">Homme</MenuItem>
                                    <MenuItem value="F">Femme</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="CIN"
                                fullWidth
                                value={patientForm.CNE}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        CNE: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Confirmer le CIN"
                                fullWidth
                                value={patientForm.CNE_confirm}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        CNE_confirm: e.target.value,
                                    })
                                }
                                onPaste={(e) => e.preventDefault()}
                                helperText="Saisissez à nouveau le CIN (copier-coller désactivé)"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Email"
                                type="email"
                                fullWidth
                                value={patientForm.email}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                label="Téléphone"
                                fullWidth
                                value={patientForm.telephone}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        telephone: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, fontWeight: "medium" }}>
                        Adresse
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                label="Adresse"
                                fullWidth
                                value={patientForm.adresse}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        adresse: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Ville"
                                fullWidth
                                value={patientForm.ville}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        ville: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Code postal"
                                fullWidth
                                value={patientForm.code_postal}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        code_postal: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                margin="dense"
                                label="Pays"
                                fullWidth
                                value={patientForm.pays}
                                onChange={(e) =>
                                    setPatientForm({
                                        ...patientForm,
                                        pays: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button onClick={onSubmit} variant="contained">
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default PatientDialog; 
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
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Chip,
    Button,
    Typography,
    Box,
    Grid,
} from "@mui/material";
import { timeInputProps } from "../../utils/dateUtils";

const AvailabilityDialog = ({
    open,
    onClose,
    availabilityForm,
    setAvailabilityForm,
    institutions,
    onSubmit,
    error,
}) => {
    const joursSemaine = [
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi",
        "dimanche",
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {availabilityForm.id
                    ? "Modifier Disponibilité"
                    : "Ajouter Disponibilité"}
            </DialogTitle>
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
                <Autocomplete
                    options={institutions}
                    getOptionLabel={(option) =>
                        `${option.nom} (${option.type})`
                    }
                    value={
                        institutions.find(
                            (i) => i.id === availabilityForm.institution_id
                        ) || null
                    }
                    onChange={(event, newValue) => {
                        setAvailabilityForm({
                            ...availabilityForm,
                            institution_id: newValue ? newValue.id : "",
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            margin="dense"
                            label="Institution"
                            fullWidth
                        />
                    )}
                    disabled={availabilityForm.id !== null}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Jours de la semaine</InputLabel>
                    <Select
                        multiple
                        value={availabilityForm.jours_semaine}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.includes("all")) {
                                setAvailabilityForm({
                                    ...availabilityForm,
                                    jours_semaine: joursSemaine,
                                });
                            } else {
                                setAvailabilityForm({
                                    ...availabilityForm,
                                    jours_semaine: value,
                                });
                            }
                        }}
                        label="Jours de la semaine"
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        disabled={availabilityForm.id !== null}>
                        {!availabilityForm.id && (
                            <MenuItem value="all">
                                <em>Toute la semaine</em>
                            </MenuItem>
                        )}
                        {joursSemaine.map((jour) => (
                            <MenuItem key={jour} value={jour}>
                                {jour}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Heure de début"
                    type="time"
                    fullWidth
                    value={availabilityForm.heure_debut}
                    onChange={(e) =>
                        setAvailabilityForm({
                            ...availabilityForm,
                            heure_debut: e.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                    {...timeInputProps}
                />
                <TextField
                    margin="dense"
                    label="Heure de fin"
                    type="time"
                    fullWidth
                    value={availabilityForm.heure_fin}
                    onChange={(e) =>
                        setAvailabilityForm({
                            ...availabilityForm,
                            heure_fin: e.target.value,
                        })
                    }
                    InputLabelProps={{ shrink: true }}
                    {...timeInputProps}
                />
                <TextField
                    margin="dense"
                    label="Intervalle (minutes)"
                    type="number"
                    fullWidth
                    value={availabilityForm.intervalle_minutes}
                    onChange={(e) =>
                        setAvailabilityForm({
                            ...availabilityForm,
                            intervalle_minutes: Number(e.target.value),
                        })
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={availabilityForm.a_pause_dejeuner}
                            onChange={(e) =>
                                setAvailabilityForm({
                                    ...availabilityForm,
                                    a_pause_dejeuner: e.target.checked,
                                })
                            }
                        />
                    }
                    label="Pause déjeuner"
                />
                {availabilityForm.a_pause_dejeuner && (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Début pause déjeuner"
                                type="time"
                                fullWidth
                                value={availabilityForm.heure_debut_pause}
                                onChange={(e) =>
                                    setAvailabilityForm({
                                        ...availabilityForm,
                                        heure_debut_pause: e.target.value,
                                    })
                                }
                                InputLabelProps={{ shrink: true }}
                                {...timeInputProps}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Fin pause déjeuner"
                                type="time"
                                fullWidth
                                value={availabilityForm.heure_fin_pause}
                                onChange={(e) =>
                                    setAvailabilityForm({
                                        ...availabilityForm,
                                        heure_fin_pause: e.target.value,
                                    })
                                }
                                InputLabelProps={{ shrink: true }}
                                {...timeInputProps}
                            />
                        </Grid>
                    </Grid>
                )}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={availabilityForm.est_actif}
                            onChange={(e) =>
                                setAvailabilityForm({
                                    ...availabilityForm,
                                    est_actif: e.target.checked,
                                })
                            }
                        />
                    }
                    label="Actif"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={onSubmit} variant="contained">
                    {availabilityForm.id ? "Modifier" : "Ajouter"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvailabilityDialog; 
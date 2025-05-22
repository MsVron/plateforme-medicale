import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import {
    LocalizationProvider,
    DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { dateTimePickerProps } from "../../utils/dateUtils";

const AbsenceDialog = ({
    open,
    onClose,
    absenceForm,
    setAbsenceForm,
    onSubmit,
    error,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Ajouter une Absence</DialogTitle>
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
                    <DateTimePicker
                        label="Date et heure de début"
                        value={absenceForm.date_debut}
                        onChange={(newValue) =>
                            setAbsenceForm({
                                ...absenceForm,
                                date_debut: newValue,
                            })
                        }
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" fullWidth />
                        )}
                        {...dateTimePickerProps}
                    />
                    <DateTimePicker
                        label="Date et heure de fin"
                        value={absenceForm.date_fin}
                        onChange={(newValue) =>
                            setAbsenceForm({
                                ...absenceForm,
                                date_fin: newValue,
                            })
                        }
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" fullWidth />
                        )}
                        {...dateTimePickerProps}
                    />
                    <TextField
                        margin="dense"
                        label="Motif (optionnel)"
                        fullWidth
                        value={absenceForm.motif}
                        onChange={(e) =>
                            setAbsenceForm({
                                ...absenceForm,
                                motif: e.target.value,
                            })
                        }
                    />
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

export default AbsenceDialog; 
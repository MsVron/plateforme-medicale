import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  PersonAdd,
  Save
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import hospitalService from '../../services/hospitalService';

const WalkInPatientTab = ({ onStatsUpdate }) => {
  const [patientForm, setPatientForm] = useState({
    prenom: '',
    nom: '',
    date_naissance: null,
    sexe: '',
    CNE: '',
    CNE_confirm: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Maroc'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleFieldChange = (field, value) => {
    setPatientForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!patientForm.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!patientForm.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!patientForm.date_naissance) newErrors.date_naissance = 'La date de naissance est requise';
    if (!patientForm.sexe) newErrors.sexe = 'Le sexe est requis';
    if (!patientForm.CNE.trim()) newErrors.CNE = 'Le CIN est requis';
    if (!patientForm.CNE_confirm.trim()) newErrors.CNE_confirm = 'La confirmation du CIN est requise';

    // CIN validation
    if (patientForm.CNE && patientForm.CNE_confirm && patientForm.CNE !== patientForm.CNE_confirm) {
      newErrors.CNE_confirm = 'Les CIN ne correspondent pas';
    }

    // Email validation
    if (patientForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientForm.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Veuillez corriger les erreurs dans le formulaire', severity: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      await hospitalService.addWalkInPatient({
        ...patientForm,
        date_naissance: patientForm.date_naissance ? patientForm.date_naissance.toISOString().split('T')[0] : null
      });
      
      setSnackbar({ open: true, message: 'Patient ajouté avec succès', severity: 'success' });
      
      // Reset form
      setPatientForm({
        prenom: '',
        nom: '',
        date_naissance: null,
        sexe: '',
        CNE: '',
        CNE_confirm: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        code_postal: '',
        pays: 'Maroc'
      });
      
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error adding patient:', error);
      setSnackbar({ 
        open: true, 
        message: error.message || 'Erreur lors de l\'ajout du patient', 
        severity: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
          Ajouter un Patient Sans Rendez-vous
        </Typography>

        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Informations Personnelles
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  value={patientForm.prenom}
                  onChange={(e) => handleFieldChange('prenom', e.target.value)}
                  error={!!errors.prenom}
                  helperText={errors.prenom}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  value={patientForm.nom}
                  onChange={(e) => handleFieldChange('nom', e.target.value)}
                  error={!!errors.nom}
                  helperText={errors.nom}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date de naissance *"
                  value={patientForm.date_naissance}
                  onChange={(date) => handleFieldChange('date_naissance', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date_naissance}
                      helperText={errors.date_naissance}
                    />
                  )}
                  maxDate={new Date()}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.sexe}>
                  <InputLabel>Sexe *</InputLabel>
                  <Select
                    value={patientForm.sexe}
                    onChange={(e) => handleFieldChange('sexe', e.target.value)}
                    label="Sexe *"
                  >
                    <MenuItem value="M">Masculin</MenuItem>
                    <MenuItem value="F">Féminin</MenuItem>
                  </Select>
                  {errors.sexe && (
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                      {errors.sexe}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Identity Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Informations d'Identité
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="CIN *"
                  value={patientForm.CNE}
                  onChange={(e) => handleFieldChange('CNE', e.target.value.toUpperCase())}
                  error={!!errors.CNE}
                  helperText={errors.CNE}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Confirmer CIN *"
                  value={patientForm.CNE_confirm}
                  onChange={(e) => handleFieldChange('CNE_confirm', e.target.value.toUpperCase())}
                  error={!!errors.CNE_confirm}
                  helperText={errors.CNE_confirm}
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Informations de Contact
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={patientForm.telephone}
                  onChange={(e) => handleFieldChange('telephone', e.target.value)}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                  variant="outlined"
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  Adresse
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={patientForm.adresse}
                  onChange={(e) => handleFieldChange('adresse', e.target.value)}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={patientForm.ville}
                  onChange={(e) => handleFieldChange('ville', e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  value={patientForm.code_postal}
                  onChange={(e) => handleFieldChange('code_postal', e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pays"
                  value={patientForm.pays}
                  onChange={(e) => handleFieldChange('pays', e.target.value)}
                  variant="outlined"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={20} /> : <PersonAdd />}
                    onClick={handleSubmit}
                    disabled={submitting}
                    size="large"
                    sx={{
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5
                    }}
                  >
                    {submitting ? 'Ajout en cours...' : 'Ajouter le Patient'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default WalkInPatientTab; 
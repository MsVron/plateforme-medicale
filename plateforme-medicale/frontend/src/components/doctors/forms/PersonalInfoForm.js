import React, { useEffect } from 'react';
import {
  Grid,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  InputAdornment,
  Typography
} from '@mui/material';
import { validateUsername } from '../../../utils/doctorValidation';

/**
 * Form component for doctor personal information
 */
const PersonalInfoForm = ({ 
  formData, 
  handleFieldChange, 
  specialties, 
  isEditMode, 
  error, 
  setError 
}) => {
  // Auto-generate username when first name or last name changes
  useEffect(() => {
    if (!isEditMode && formData.prenom && formData.nom) {
      const generatedUsername = `${formData.prenom.toLowerCase()}_${formData.nom.toLowerCase()}`
        .replace(/\s+/g, '') // Remove spaces
        .replace(/[^a-zA-Z0-9_]/g, ''); // Remove special characters except underscore
        
      // Check if username is valid before setting it
      const usernameError = validateUsername(generatedUsername);
      
      if (!usernameError) {
        handleFieldChange('nom_utilisateur', generatedUsername);
      }
    }
  }, [formData.prenom, formData.nom, isEditMode, handleFieldChange]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="#4ca1af" sx={{ mb: 1 }}>
          Commencez par entrer le prénom et le nom du médecin pour générer automatiquement son nom d'utilisateur
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          margin="dense"
          label="Prénom"
          fullWidth
          value={formData.prenom}
          onChange={(e) => handleFieldChange('prenom', e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          margin="dense"
          label="Nom"
          fullWidth
          value={formData.nom}
          onChange={(e) => handleFieldChange('nom', e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          margin="dense"
          label="Nom d'utilisateur"
          fullWidth
          value={formData.nom_utilisateur}
          onChange={(e) => {
            const value = e.target.value;
            const usernameError = validateUsername(value);
            handleFieldChange('nom_utilisateur', value);
            if (usernameError) {
              setError(usernameError);
            } else {
              setError("");
            }
          }}
          helperText={error && error.includes("utilisateur") ? error : "Généré automatiquement à partir du prénom et nom"}
          error={!!error && error.includes("utilisateur")}
          disabled={isEditMode}
          InputProps={{
            sx: {
              borderRadius: '8px',
            },
            startAdornment: (
              <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                {formData.prenom && formData.nom ? `${formData.prenom.toLowerCase()}_${formData.nom.toLowerCase()}` : ''}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      {!isEditMode && (
        <Grid item xs={12} sm={6}>
          <TextField
            required
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            value={formData.mot_de_passe}
            onChange={(e) => handleFieldChange('mot_de_passe', e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '8px',
              }
            }}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TextField
          required
          margin="dense"
          label="Email"
          fullWidth
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          margin="dense"
          label="Numéro d'ordre"
          fullWidth
          value={formData.numero_ordre}
          onChange={(e) => handleFieldChange('numero_ordre', e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          margin="dense"
          label="Téléphone"
          fullWidth
          value={formData.telephone}
          onChange={(e) => handleFieldChange('telephone', e.target.value)}
          placeholder="+212612345678"
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          options={specialties || []}
          getOptionLabel={(option) => option.nom || ""}
          value={specialties?.find(s => s.id === formData.specialite_id) || null}
          onChange={(event, newValue) => {
            handleFieldChange('specialite_id', newValue ? newValue.id : "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              margin="dense"
              label="Spécialité"
              fullWidth
              placeholder="Tapez pour rechercher une spécialité"
              InputProps={{
                ...params.InputProps,
                sx: {
                  ...params.InputProps.sx,
                  borderRadius: '8px',
                }
              }}
            />
          )}
          noOptionsText="Aucune spécialité trouvée"
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.est_actif !== undefined ? formData.est_actif : true}
                onChange={(e) => handleFieldChange('est_actif', e.target.checked)}
                sx={{
                  color: '#4ca1af',
                  '&.Mui-checked': {
                    color: '#4ca1af',
                  },
                }}
              />
            }
            label="Compte actif"
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default PersonalInfoForm; 
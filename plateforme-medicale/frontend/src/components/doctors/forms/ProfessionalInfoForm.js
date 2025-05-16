import React from 'react';
import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from '@mui/material';

/**
 * Form component for doctor professional information
 */
const ProfessionalInfoForm = ({ formData, handleFieldChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          margin="dense"
          label="URL de la photo"
          fullWidth
          value={formData.photo_url}
          onChange={(e) => handleFieldChange('photo_url', e.target.value)}
          placeholder="https://example.com/photo.jpg"
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="dense"
          label="Biographie"
          fullWidth
          multiline
          rows={4}
          value={formData.biographie}
          onChange={(e) => handleFieldChange('biographie', e.target.value)}
          placeholder="Décrivez votre parcours professionnel, vos spécialités et votre approche..."
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
          label="Tarif de consultation"
          fullWidth
          type="number"
          value={formData.tarif_consultation}
          onChange={(e) => handleFieldChange('tarif_consultation', e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">MAD</InputAdornment>,
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          margin="dense"
          label="Temps de consultation moyen"
          fullWidth
          type="number"
          value={formData.temps_consultation_moyen}
          onChange={(e) => handleFieldChange('temps_consultation_moyen', e.target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          margin="dense"
          label="Langues parlées (séparées par des virgules)"
          fullWidth
          value={formData.langues_parlees}
          placeholder="Français, Arabe, Anglais"
          onChange={(e) => handleFieldChange('langues_parlees', e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '8px',
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.accepte_nouveaux_patients}
              onChange={(e) => handleFieldChange('accepte_nouveaux_patients', e.target.checked)}
              sx={{
                color: '#4ca1af',
                '&.Mui-checked': {
                  color: '#4ca1af',
                },
              }}
            />
          }
          label="Accepte de nouveaux patients"
        />
      </Grid>
    </Grid>
  );
};

export default ProfessionalInfoForm; 
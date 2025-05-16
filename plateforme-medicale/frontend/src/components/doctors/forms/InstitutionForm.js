import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Paper,
  Autocomplete,
  Button,
  Collapse
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import moroccanCities from '../../../utils/moroccanCities';
import CoordinatesMap from './CoordinatesMap';

/**
 * Form component for doctor institution and location information
 */
const InstitutionForm = ({ 
  formData, 
  handleFieldChange, 
  isPrivateCabinet, 
  togglePrivateCabinet,
  institutions 
}) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <Box mb={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPrivateCabinet}
              onChange={(e) => togglePrivateCabinet(e.target.checked)}
              sx={{
                color: '#4ca1af',
                '&.Mui-checked': {
                  color: '#4ca1af',
                },
              }}
            />
          }
          label="Cabinet privé (Créer une nouvelle institution)"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: 0.5 }}>
          {isPrivateCabinet 
            ? "Les informations du cabinet seront liées directement au médecin" 
            : "Le médecin sera rattaché à une institution existante"}
        </Typography>
      </Box>
      
      {isPrivateCabinet ? (
        <Box 
          component={Paper} 
          elevation={1} 
          p={2} 
          mb={3}
          sx={{ 
            backgroundColor: '#f5f9fc',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="#2c3e50">
            Informations du cabinet privé
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                margin="dense"
                label="Nom du cabinet"
                fullWidth
                value={formData.institution_nom}
                onChange={(e) => handleFieldChange('institution_nom', e.target.value)}
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
                label="Email du cabinet"
                fullWidth
                value={formData.institution_email}
                onChange={(e) => handleFieldChange('institution_email', e.target.value)}
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
                label="Téléphone du cabinet"
                fullWidth
                value={formData.institution_telephone}
                onChange={(e) => handleFieldChange('institution_telephone', e.target.value)}
                placeholder="+212612345678"
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
                label="Latitude"
                fullWidth
                type="number"
                value={formData.latitude}
                onChange={(e) => handleFieldChange('latitude', e.target.value)}
                placeholder="ex: 34.0150"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                  }
                }}
                helperText="Coordonnée pour la carte (décimal avec 6 décimales max)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Longitude"
                fullWidth
                type="number"
                value={formData.longitude}
                onChange={(e) => handleFieldChange('longitude', e.target.value)}
                placeholder="ex: -6.8327"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                  }
                }}
                helperText="Coordonnée pour la carte (décimal avec 6 décimales max)"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                startIcon={<LocationOnIcon />}
                onClick={() => setShowMap(!showMap)}
                sx={{
                  mt: 1,
                  borderRadius: '8px',
                  borderColor: '#4ca1af',
                  color: '#4ca1af',
                  '&:hover': {
                    borderColor: '#2c3e50',
                    bgcolor: 'rgba(44, 62, 80, 0.04)',
                  }
                }}
              >
                {showMap ? 'Masquer la carte' : 'Visualiser sur la carte'}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Les coordonnées permettent d'afficher le cabinet sur la carte pour les patients
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Collapse in={showMap} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                  <CoordinatesMap 
                    latitude={formData.latitude} 
                    longitude={formData.longitude} 
                  />
                  <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 1 }}>
                    Vous pouvez trouver les coordonnées exactes sur Google Maps en faisant un clic droit sur un emplacement et en sélectionnant "Plus d'infos sur cet endroit"
                  </Typography>
                </Box>
              </Collapse>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <FormControl fullWidth margin="dense" sx={{ mb: 3 }}>
          <InputLabel>Institution</InputLabel>
          <Select
            value={formData.institution_id}
            onChange={(e) => handleFieldChange('institution_id', e.target.value)}
            label="Institution"
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="">
              <em>Aucune</em>
            </MenuItem>
            {(institutions || []).map((institution) => (
              <MenuItem
                key={institution.id}
                value={institution.id}>
                {institution.nom} ({institution.type || 'Non spécifié'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        fontWeight="bold" 
        color="#2c3e50"
        sx={{ mt: 2 }}
      >
        Adresse professionnelle
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Adresse"
            fullWidth
            value={formData.adresse}
            onChange={(e) => handleFieldChange('adresse', e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '8px',
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={moroccanCities}
            value={formData.ville || null}
            onChange={(event, newValue) => {
              handleFieldChange('ville', newValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Ville"
                fullWidth
                placeholder="Sélectionnez une ville"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    ...params.InputProps.sx,
                    borderRadius: '8px',
                  }
                }}
              />
            )}
            freeSolo
            autoSelect
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            margin="dense"
            label="Code postal"
            fullWidth
            value={formData.code_postal}
            onChange={(e) => handleFieldChange('code_postal', e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '8px',
              }
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Pays</InputLabel>
            <Select
              value={formData.pays}
              onChange={(e) => handleFieldChange('pays', e.target.value)}
              label="Pays"
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="Maroc">Maroc</MenuItem>
              <MenuItem value="France">France</MenuItem>
              <MenuItem value="Algérie">Algérie</MenuItem>
              <MenuItem value="Tunisie">Tunisie</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default InstitutionForm; 
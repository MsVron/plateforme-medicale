import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { datePickerProps } from '../../utils/dateUtils';
import axios from 'axios';

const PatientProfileEditor = ({ open, onClose, patient, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    prenom: patient?.prenom || '',
    nom: patient?.nom || '',
    date_naissance: patient?.date_naissance ? new Date(patient.date_naissance) : null,
    sexe: patient?.sexe || '',
    CNE: patient?.CNE || '',
    adresse: patient?.adresse || '',
    ville: patient?.ville || '',
    code_postal: patient?.code_postal || '',
    pays: patient?.pays || 'Maroc',
    telephone: patient?.telephone || '',
    email: patient?.email || '',
    contact_urgence_nom: patient?.contact_urgence_nom || '',
    contact_urgence_telephone: patient?.contact_urgence_telephone || '',
    contact_urgence_relation: patient?.contact_urgence_relation || '',
    groupe_sanguin: patient?.groupe_sanguin || '',
    taille_cm: patient?.taille_cm || '',
    poids_kg: patient?.poids_kg || '',
    est_fumeur: patient?.est_fumeur || false,
    consommation_alcool: patient?.consommation_alcool || '',
    activite_physique: patient?.activite_physique || '',
    profession: patient?.profession || '',
    allergies_notes: patient?.allergies_notes || '',
    // Handicap fields
    a_handicap: patient?.a_handicap || false,
    type_handicap: patient?.type_handicap || '',
    type_handicap_autre: patient?.type_handicap_autre || '',
    niveau_handicap: patient?.niveau_handicap || '',
    description_handicap: patient?.description_handicap || '',
    besoins_accessibilite: patient?.besoins_accessibilite || '',
    equipements_medicaux: patient?.equipements_medicaux || '',
    autonomie_niveau: patient?.autonomie_niveau || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Format date for backend
      const submitData = {
        ...formData,
        date_naissance: formData.date_naissance ? 
          formData.date_naissance.toISOString().split('T')[0] : null,
        taille_cm: formData.taille_cm ? parseInt(formData.taille_cm) : null,
        poids_kg: formData.poids_kg ? parseFloat(formData.poids_kg) : null
      };

      await axios.put(
        `/medecin/patients/${patient.id}/profile`,
        submitData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess('Profil patient mis à jour avec succès');
      onClose();
    } catch (err) {
      console.error('Error updating patient profile:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Modifier le profil de {patient?.prenom} {patient?.nom}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            {/* Personal Information */}
            <Typography variant="h6" gutterBottom>
              Informations personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={formData.prenom}
                  onChange={(e) => handleChange('prenom', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de naissance"
                  value={formData.date_naissance}
                  onChange={(newValue) => handleChange('date_naissance', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  maxDate={new Date()}
                  {...datePickerProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sexe</InputLabel>
                  <Select
                    value={formData.sexe}
                    label="Sexe"
                    onChange={(e) => handleChange('sexe', e.target.value)}
                  >
                    <MenuItem value="M">Homme</MenuItem>
                    <MenuItem value="F">Femme</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CIN"
                  value={formData.CNE}
                  onChange={(e) => handleChange('CNE', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Groupe sanguin</InputLabel>
                  <Select
                    value={formData.groupe_sanguin}
                    label="Groupe sanguin"
                    onChange={(e) => handleChange('groupe_sanguin', e.target.value)}
                  >
                    <MenuItem value="">Non spécifié</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profession"
                  value={formData.profession}
                  onChange={(e) => handleChange('profession', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Contact Information */}
            <Typography variant="h6" gutterBottom>
              Informations de contact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Code postal"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pays"
                  value={formData.pays}
                  onChange={(e) => handleChange('pays', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Emergency Contact */}
            <Typography variant="h6" gutterBottom>
              Contact d'urgence
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom du contact d'urgence"
                  value={formData.contact_urgence_nom}
                  onChange={(e) => handleChange('contact_urgence_nom', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone du contact d'urgence"
                  value={formData.contact_urgence_telephone}
                  onChange={(e) => handleChange('contact_urgence_telephone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Relation avec le contact d'urgence"
                  value={formData.contact_urgence_relation}
                  onChange={(e) => handleChange('contact_urgence_relation', e.target.value)}
                  placeholder="Ex: Époux/Épouse, Parent, Ami, etc."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Health Information */}
            <Typography variant="h6" gutterBottom>
              Informations de santé
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taille (cm)"
                  type="number"
                  value={formData.taille_cm}
                  onChange={(e) => handleChange('taille_cm', e.target.value)}
                  inputProps={{ min: 0, max: 300 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Poids (kg)"
                  type="number"
                  value={formData.poids_kg}
                  onChange={(e) => handleChange('poids_kg', e.target.value)}
                  inputProps={{ min: 0, max: 500, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Consommation d'alcool</InputLabel>
                  <Select
                    value={formData.consommation_alcool}
                    label="Consommation d'alcool"
                    onChange={(e) => handleChange('consommation_alcool', e.target.value)}
                  >
                    <MenuItem value="">Non spécifié</MenuItem>
                    <MenuItem value="non">Non</MenuItem>
                    <MenuItem value="occasionnel">Occasionnel</MenuItem>
                    <MenuItem value="régulier">Régulier</MenuItem>
                    <MenuItem value="quotidien">Quotidien</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Activité physique</InputLabel>
                  <Select
                    value={formData.activite_physique}
                    label="Activité physique"
                    onChange={(e) => handleChange('activite_physique', e.target.value)}
                  >
                    <MenuItem value="">Non spécifié</MenuItem>
                    <MenuItem value="sédentaire">Sédentaire</MenuItem>
                    <MenuItem value="légère">Légère</MenuItem>
                    <MenuItem value="modérée">Modérée</MenuItem>
                    <MenuItem value="intense">Intense</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Fumeur</InputLabel>
                  <Select
                    value={formData.est_fumeur === null ? '' : formData.est_fumeur.toString()}
                    label="Fumeur"
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : e.target.value === 'true';
                      handleChange('est_fumeur', value);
                    }}
                  >
                    <MenuItem value="">Non spécifié</MenuItem>
                    <MenuItem value="false">Non</MenuItem>
                    <MenuItem value="true">Oui</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes sur les allergies"
                  multiline
                  rows={3}
                  value={formData.allergies_notes}
                  onChange={(e) => handleChange('allergies_notes', e.target.value)}
                  placeholder="Notes générales sur les allergies du patient..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Handicap Information */}
            <Typography variant="h6" gutterBottom>
              Informations sur le handicap
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Situation de handicap</InputLabel>
                  <Select
                    value={formData.a_handicap === null ? '' : formData.a_handicap.toString()}
                    label="Situation de handicap"
                    onChange={(e) => {
                      const value = e.target.value === '' ? false : e.target.value === 'true';
                      handleChange('a_handicap', value);
                    }}
                  >
                    <MenuItem value="false">Non</MenuItem>
                    <MenuItem value="true">Oui</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.a_handicap && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type de handicap</InputLabel>
                      <Select
                        value={formData.type_handicap}
                        label="Type de handicap"
                        onChange={(e) => {
                          handleChange('type_handicap', e.target.value);
                          // Clear custom type when switching away from "autre"
                          if (e.target.value !== 'autre') {
                            handleChange('type_handicap_autre', '');
                          }
                        }}
                      >
                        <MenuItem value="">Non spécifié</MenuItem>
                        <MenuItem value="moteur">Moteur</MenuItem>
                        <MenuItem value="sensoriel">Sensoriel</MenuItem>
                        <MenuItem value="intellectuel">Intellectuel</MenuItem>
                        <MenuItem value="psychique">Psychique</MenuItem>
                        <MenuItem value="multiple">Multiple</MenuItem>
                        <MenuItem value="autre">Autre</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {/* Custom handicap type field - only show when "autre" is selected */}
                  {formData.type_handicap === 'autre' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Préciser le type de handicap"
                        value={formData.type_handicap_autre}
                        onChange={(e) => handleChange('type_handicap_autre', e.target.value)}
                        placeholder="Veuillez préciser le type de handicap..."
                        required
                      />
                    </Grid>
                  )}
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Niveau de handicap</InputLabel>
                      <Select
                        value={formData.niveau_handicap}
                        label="Niveau de handicap"
                        onChange={(e) => handleChange('niveau_handicap', e.target.value)}
                      >
                        <MenuItem value="">Non spécifié</MenuItem>
                        <MenuItem value="léger">Léger</MenuItem>
                        <MenuItem value="modéré">Modéré</MenuItem>
                        <MenuItem value="sévère">Sévère</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Niveau d'autonomie</InputLabel>
                      <Select
                        value={formData.autonomie_niveau}
                        label="Niveau d'autonomie"
                        onChange={(e) => handleChange('autonomie_niveau', e.target.value)}
                      >
                        <MenuItem value="">Non spécifié</MenuItem>
                        <MenuItem value="autonome">Autonome</MenuItem>
                        <MenuItem value="assistance_partielle">Assistance partielle</MenuItem>
                        <MenuItem value="assistance_totale">Assistance totale</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description du handicap"
                      multiline
                      rows={3}
                      value={formData.description_handicap}
                      onChange={(e) => handleChange('description_handicap', e.target.value)}
                      placeholder="Description détaillée du handicap..."
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Besoins d'accessibilité"
                      multiline
                      rows={3}
                      value={formData.besoins_accessibilite}
                      onChange={(e) => handleChange('besoins_accessibilite', e.target.value)}
                      placeholder="Rampe d'accès, ascenseur, toilettes adaptées..."
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Équipements médicaux"
                      multiline
                      rows={3}
                      value={formData.equipements_medicaux}
                      onChange={(e) => handleChange('equipements_medicaux', e.target.value)}
                      placeholder="Fauteuil roulant, prothèses, appareils auditifs..."
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default PatientProfileEditor; 
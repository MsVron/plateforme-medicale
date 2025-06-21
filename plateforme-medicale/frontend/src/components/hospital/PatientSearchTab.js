import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Search,
  Person,
  LocalHospital,
  PersonAdd,
  Bed
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';

const PatientSearchTab = ({ onSuccess, onError, onRefresh }) => {
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [admissionDialog, setAdmissionDialog] = useState({
    open: false,
    patient: null
  });
  const [admissionForm, setAdmissionForm] = useState({
    doctor_id: '',
    bed_number: '',
    admission_reason: '',
    notes: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [admitting, setAdmitting] = useState(false);

  React.useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await hospitalService.getHospitalDoctors();
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchForm.prenom && !searchForm.nom && !searchForm.cne) {
      onError('Veuillez saisir au moins un critère de recherche');
      return;
    }

    try {
      setSearching(true);
      const response = await hospitalService.searchPatients(searchForm);
      setSearchResults(response.patients || []);
      
      if (response.patients?.length === 0) {
        onError('Aucun patient trouvé avec ces critères');
      }
    } catch (error) {
      console.error('Search error:', error);
      onError(error.message || 'Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  };

  const handleAdmitPatient = (patient) => {
    setAdmissionDialog({
      open: true,
      patient: patient
    });
    setAdmissionForm({
      doctor_id: '',
      bed_number: '',
      admission_reason: '',
      notes: ''
    });
  };

  const handleAdmissionSubmit = async () => {
    if (!admissionForm.doctor_id || !admissionForm.admission_reason) {
      onError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setAdmitting(true);
      await hospitalService.admitPatient(admissionDialog.patient.id, admissionForm);
      onSuccess('Patient admis avec succès');
      setAdmissionDialog({ open: false, patient: null });
      onRefresh();
      // Refresh search results
      handleSearch();
    } catch (error) {
      console.error('Admission error:', error);
      onError(error.message || 'Erreur lors de l\'admission');
    } finally {
      setAdmitting(false);
    }
  };

  const getAdmissionStatusChip = (patient) => {
    if (patient.is_admitted) {
      return (
        <Chip 
          label="Admis" 
          color="success" 
          size="small"
          icon={<Bed />}
        />
      );
    }
    return (
      <Chip 
        label="Non admis" 
        color="default" 
        size="small"
      />
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
        Rechercher un Patient
      </Typography>

      {/* Search Form */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prénom"
                value={searchForm.prenom}
                onChange={(e) => handleSearchChange('prenom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nom"
                value={searchForm.nom}
                onChange={(e) => handleSearchChange('nom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CIN"
                value={searchForm.cne}
                onChange={(e) => handleSearchChange('cne', e.target.value)}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={searching ? <CircularProgress size={20} /> : <Search />}
                onClick={handleSearch}
                disabled={searching}
                sx={{
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5
                }}
              >
                {searching ? 'Recherche...' : 'Rechercher'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Résultats de recherche ({searchResults.length})
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((patient) => (
              <Grid item xs={12} md={6} key={patient.id}>
                <Card sx={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {patient.prenom} {patient.nom}
                        </Typography>
                      </Box>
                      {getAdmissionStatusChip(patient)}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>CIN:</strong> {patient.CNE}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Date de naissance:</strong> {new Date(patient.date_naissance).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Téléphone:</strong> {patient.telephone || 'Non renseigné'}
                    </Typography>

                    {patient.admission_date && (
                      <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                        <strong>Date d'admission:</strong> {new Date(patient.admission_date).toLocaleDateString()}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!patient.is_admitted && (
                        <Button
                          variant="contained"
                          startIcon={<PersonAdd />}
                          onClick={() => handleAdmitPatient(patient)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Admettre
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<LocalHospital />}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Voir Dossier
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Admission Dialog */}
      <Dialog 
        open={admissionDialog.open} 
        onClose={() => setAdmissionDialog({ open: false, patient: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Admettre le Patient: {admissionDialog.patient?.prenom} {admissionDialog.patient?.nom}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Médecin Assigné *</InputLabel>
                <Select
                  value={admissionForm.doctor_id}
                  onChange={(e) => setAdmissionForm(prev => ({ ...prev, doctor_id: e.target.value }))}
                  label="Médecin Assigné *"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Numéro de Lit"
                value={admissionForm.bed_number}
                onChange={(e) => setAdmissionForm(prev => ({ ...prev, bed_number: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motif d'admission *"
                value={admissionForm.admission_reason}
                onChange={(e) => setAdmissionForm(prev => ({ ...prev, admission_reason: e.target.value }))}
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={admissionForm.notes}
                onChange={(e) => setAdmissionForm(prev => ({ ...prev, notes: e.target.value }))}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setAdmissionDialog({ open: false, patient: null })}
            disabled={admitting}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdmissionSubmit}
            disabled={admitting}
            startIcon={admitting ? <CircularProgress size={20} /> : <PersonAdd />}
            sx={{ fontWeight: 'bold' }}
          >
            {admitting ? 'Admission...' : 'Admettre'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientSearchTab; 
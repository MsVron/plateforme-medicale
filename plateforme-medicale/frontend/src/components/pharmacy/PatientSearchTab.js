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
  Alert
} from '@mui/material';
import {
  Search,
  Person,
  LocalPharmacy,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import pharmacyService from '../../services/pharmacyService';

const PatientSearchTab = ({ onSuccess, onError, onRefresh }) => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);


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
      const response = await pharmacyService.searchPatients(searchForm);
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

  const handleViewPrescriptions = (patient) => {
    navigate(`/pharmacy/patients/${patient.id}/prescriptions`);
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
                      {patient.has_prescriptions && (
                        <Chip 
                          label="Prescriptions" 
                          color="primary" 
                          size="small"
                          icon={<LocalPharmacy />}
                        />
                      )}
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

                    {patient.last_prescription_date && (
                      <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                        <strong>Dernière prescription:</strong> {new Date(patient.last_prescription_date).toLocaleDateString()}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<LocalPharmacy />}
                        onClick={() => handleViewPrescriptions(patient)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Voir ordonnance
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Results Message */}
      {searchResults.length === 0 && (searchForm.prenom || searchForm.nom || searchForm.cne) && !searching && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Aucun patient trouvé avec ces critères de recherche.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Le patient que vous recherchez n'est peut-être pas encore enregistré dans le système.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigate('/medecin/walk-in-patient')}
            sx={{ fontWeight: 'bold' }}
          >
            Ajouter un patient sur place
          </Button>
        </Alert>
      )}


    </Box>
  );
};

export default PatientSearchTab; 
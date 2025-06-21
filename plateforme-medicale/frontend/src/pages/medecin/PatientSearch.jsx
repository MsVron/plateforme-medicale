import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, CircularProgress, Alert, IconButton, Grid,
  Chip, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Clear as ClearIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const clearSearch = () => {
    setSearchCriteria({
      prenom: '',
      nom: '',
      cne: ''
    });
    setPatients([]);
    setSearched(false);
    setError(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validate that at least one field is filled
    const { prenom, nom, cne } = searchCriteria;
    if (!prenom.trim() && !nom.trim() && !cne.trim()) {
      setError('Veuillez remplir au moins un critère de recherche');
      return;
    }

    // Validate field lengths
    if (prenom.trim() && prenom.trim().length < 2) {
      setError('Le prénom doit contenir au moins 2 caractères');
      return;
    }
    if (nom.trim() && nom.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return;
    }
    if (cne.trim() && cne.trim().length < 3) {
      setError('Le CIN doit contenir au moins 3 caractères');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const params = {};
      
      if (prenom.trim()) params.prenom = prenom.trim();
      if (nom.trim()) params.nom = nom.trim();
      if (cne.trim()) params.cne = cne.trim();
      
            const response = await axios.get(`http://localhost:5000/api/medecin/patients/search`, {        headers: { Authorization: `Bearer ${token}` },        params      });
      
      setPatients(response.data.patients);
      setSearched(true);
    } catch (err) {
      console.error('Error searching patients:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erreur lors de la recherche. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const viewMedicalRecord = (patientId) => {
    navigate(`/medecin/patients/${patientId}/dossier`);
  };

  const getActiveSearchCriteria = () => {
    const criteria = [];
    if (searchCriteria.prenom.trim()) criteria.push(`Prénom: "${searchCriteria.prenom.trim()}"`);
    if (searchCriteria.nom.trim()) criteria.push(`Nom: "${searchCriteria.nom.trim()}"`);
    if (searchCriteria.cne.trim()) criteria.push(`CIN: "${searchCriteria.cne.trim()}"`);
    return criteria;
  };

  return (
    <Container maxWidth="lg">
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'white !important',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          mb: 3
        }}
      >
        <SearchIcon sx={{ mr: 1, color: 'white !important' }} /> Recherche de patients
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recherche exacte par critères
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Recherche par correspondance exacte. Remplissez au moins un critère.
        </Typography>
        
        <Box component="form" onSubmit={handleSearch}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prénom exact"
                variant="outlined"
                value={searchCriteria.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="ex: Mohamed"
                helperText="Correspondance exacte requise"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nom exact"
                variant="outlined"
                value={searchCriteria.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="ex: Alami"
                helperText="Correspondance exacte requise"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CIN exact"
                variant="outlined"
                value={searchCriteria.cne}
                onChange={(e) => handleInputChange('cne', e.target.value)}
                placeholder="ex: AB123456"
                helperText="Correspondance exacte requise"
                InputProps={{
                  startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SearchIcon />}
              disabled={loading}
            >
              Rechercher
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ClearIcon />}
              onClick={clearSearch}
              disabled={loading}
            >
              Effacer
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {searched && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    color: 'white !important',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                  }}
                >
                  {patients.length} résultat{patients.length !== 1 ? 's' : ''} trouvé{patients.length !== 1 ? 's' : ''}
                </Typography>
                
                {getActiveSearchCriteria().length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mr: 1, 
                        alignSelf: 'center', 
                        color: 'white !important',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                      }}
                    >
                      Critères de recherche:
                    </Typography>
                    {getActiveSearchCriteria().map((criterion, index) => (
                      <Chip 
                        key={index}
                        label={criterion} 
                        size="small" 
                        variant="filled" 
                        color="primary"
                        sx={{
                          fontWeight: 'medium',
                          color: 'white !important',
                          '& .MuiChip-label': {
                            color: 'white !important'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
                
                <Divider />
              </Box>
              
              {patients.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="patients table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Âge</TableCell>
                        <TableCell>Sexe</TableCell>
                        <TableCell>CIN</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {patient.prenom} {patient.nom}
                                </Typography>
                                {patient.est_inscrit_par_medecin && (
                                  <Chip 
                                    label="Patient direct" 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined"
                                    sx={{
                                      fontWeight: 'medium'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{calculateAge(patient.date_naissance)} ans</TableCell>
                          <TableCell>
                            {patient.sexe === 'M' ? 'Homme' : 'Femme'}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {patient.CNE || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {patient.email || 'Pas d\'email'}<br />
                              {patient.telephone || 'Pas de téléphone'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {patient.a_rendez_vous_avec_medecin ? (
                              <Chip 
                                label="Patient suivi" 
                                color="success" 
                                size="small" 
                                sx={{ 
                                  color: 'white !important',
                                  fontWeight: 'medium',
                                  '& .MuiChip-label': {
                                    color: 'white !important'
                                  }
                                }}
                              />
                            ) : (
                              <Chip 
                                label="Nouveau patient" 
                                color="info" 
                                size="small" 
                                sx={{ 
                                  color: 'white !important',
                                  fontWeight: 'medium',
                                  '& .MuiChip-label': {
                                    color: 'white !important'
                                  }
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <IconButton 
                                color="primary" 
                                onClick={() => viewMedicalRecord(patient.id)}
                                title="Dossier médical"
                              >
                                <MedicalIcon />
                              </IconButton>
                              <IconButton 
                                color="secondary"
                                onClick={() => navigate(`/medecin/patients/${patient.id}/edit`)}
                                title="Modifier le patient"
                              >
                                <EditIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Aucun patient trouvé avec ces critères de recherche exacts.
                  <br />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    <strong>Rappel:</strong> La recherche nécessite une correspondance exacte pour les noms et le CIN.
                  </Typography>
                </Alert>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default PatientSearch; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Paper, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, CircularProgress, Alert, IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.length < 2) {
      setError('Veuillez entrer au moins 2 caractères pour la recherche');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/medecin/patients/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { query: searchQuery }
      });
      
      setPatients(response.data.patients);
      setSearched(true);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Erreur lors de la recherche. Veuillez réessayer.');
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
    navigate(`/medecin/patients/${patientId}/medical-record`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SearchIcon sx={{ mr: 1 }} /> Recherche de patients
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Rechercher par nom, prénom, CNE ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<SearchIcon />}
            disabled={loading}
          >
            Rechercher
          </Button>
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
              <Typography variant="h6" gutterBottom>
                {patients.length} résultat{patients.length !== 1 ? 's' : ''} trouvé{patients.length !== 1 ? 's' : ''}
              </Typography>
              
              {patients.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="patients table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Âge</TableCell>
                        <TableCell>Sexe</TableCell>
                        <TableCell>CNE</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                              {patient.prenom} {patient.nom}
                            </Box>
                          </TableCell>
                          <TableCell>{calculateAge(patient.date_naissance)} ans</TableCell>
                          <TableCell>
                            {patient.sexe === 'M' ? 'Homme' : patient.sexe === 'F' ? 'Femme' : 'Autre'}
                          </TableCell>
                          <TableCell>{patient.CNE || 'N/A'}</TableCell>
                          <TableCell>
                            {patient.email}<br />
                            {patient.telephone || 'Pas de téléphone'}
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
                  Aucun patient trouvé pour cette recherche.
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
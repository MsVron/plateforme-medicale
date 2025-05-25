import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/medecin/patients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        setRecentPatients(response.data.patients || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent patients:', err);
        setError('Erreur lors de la récupération des patients récents');
        setLoading(false);
      }
    };

    fetchRecentPatients();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/medecin/patients/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setRecentPatients(response.data.patients || []);
      setLoading(false);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Erreur lors de la recherche des patients');
      setLoading(false);
    }
  };

  const viewPatientRecord = (patientId) => {
    navigate(`/medecin/patients/${patientId}/dossier`);
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dossiers Médicaux
      </Typography>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Rechercher un patient"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {searchTerm ? 'Résultats de recherche' : 'Patients récents'}
          </Typography>
          
          {recentPatients.length === 0 ? (
            <Typography>Aucun patient trouvé.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Date de naissance</TableCell>
                    <TableCell>Dernière consultation</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.nom}</TableCell>
                      <TableCell>{patient.prenom}</TableCell>
                      <TableCell>{formatDate(patient.date_naissance)}</TableCell>
                      <TableCell>{patient.derniere_consultation ? formatDate(patient.derniere_consultation) : 'Aucune'}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => viewPatientRecord(patient.id)}
                          title="Voir le dossier médical"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default MedicalRecords; 
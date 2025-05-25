import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
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
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/medecin/patients/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setPatients(response.data.patients || []);
      setLoading(false);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Erreur lors de la recherche des patients');
      setLoading(false);
      setPatients([]);
    }
  };

  const viewPatientRecord = (patientId) => {
    navigate(`/medecin/patients/${patientId}/dossier`);
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Rechercher un Patient
      </Typography>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Rechercher par nom, prénom, email ou téléphone"
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
      ) : searched ? (
        patients.length === 0 ? (
          <Typography>Aucun patient trouvé.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Date de naissance</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.nom}</TableCell>
                    <TableCell>{patient.prenom}</TableCell>
                    <TableCell>{formatDate(patient.date_naissance)}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.telephone}</TableCell>
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
        )
      ) : null}
    </Box>
  );
};

export default PatientSearch; 
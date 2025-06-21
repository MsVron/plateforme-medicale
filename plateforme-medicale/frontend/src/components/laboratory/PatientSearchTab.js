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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Search,
  Person,
  Science,
  Assignment,
  CheckCircle,
  Schedule,
  Visibility,
  Upload,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import laboratoryService from '../../services/laboratoryService';

const PatientSearchTab = ({ onSuccess, onError, onRefresh }) => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [testRequestsDialog, setTestRequestsDialog] = useState({
    open: false,
    patient: null,
    testRequests: []
  });

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
      const response = await laboratoryService.searchPatients(searchForm);
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

  const handleViewTestRequests = async (patient) => {
    try {
      const response = await laboratoryService.getPatientTestRequests(patient.id);
      setTestRequestsDialog({
        open: true,
        patient: patient,
        testRequests: response.testRequests || []
      });
    } catch (error) {
      console.error('Error fetching test requests:', error);
      onError(error.message || 'Erreur lors du chargement des demandes d\'analyses');
    }
  };

  const getTestStatusChip = (testRequest) => {
    const statusConfig = {
      'pending': { label: 'En attente', color: 'warning', icon: <Schedule /> },
      'in_progress': { label: 'En cours', color: 'info', icon: <Science /> },
      'completed': { label: 'Terminé', color: 'success', icon: <CheckCircle /> },
      'cancelled': { label: 'Annulé', color: 'error', icon: <Schedule /> }
    };
    
    const config = statusConfig[testRequest.status] || { label: testRequest.status, color: 'default', icon: <Schedule /> };
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getTestTypeChip = (testType) => {
    const typeColors = {
      'blood_test': 'error',
      'urine_test': 'warning',
      'imaging': 'info',
      'biopsy': 'secondary',
      'other': 'default'
    };
    
    const typeLabels = {
      'blood_test': 'Analyse de sang',
      'urine_test': 'Analyse d\'urine',
      'imaging': 'Imagerie',
      'biopsy': 'Biopsie',
      'other': 'Autre'
    };
    
    return (
      <Chip 
        label={typeLabels[testType] || testType} 
        color={typeColors[testType] || 'default'} 
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
                      {patient.has_test_requests && (
                        <Chip 
                          label="Analyses" 
                          color="primary" 
                          size="small"
                          icon={<Science />}
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

                    {patient.last_test_request_date && (
                      <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                        <strong>Dernière demande:</strong> {new Date(patient.last_test_request_date).toLocaleDateString()}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Science />}
                        onClick={() => handleViewTestRequests(patient)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Voir Analyses
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

      {/* Test Requests Dialog */}
      <Dialog 
        open={testRequestsDialog.open} 
        onClose={() => setTestRequestsDialog({ open: false, patient: null, testRequests: [] })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Demandes d'Analyses de {testRequestsDialog.patient?.prenom} {testRequestsDialog.patient?.nom}
        </DialogTitle>
        <DialogContent>
          {testRequestsDialog.testRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Science sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucune demande d'analyse trouvée
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Demande</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type d'Analyse</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priorité</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testRequestsDialog.testRequests.map((testRequest) => (
                    <TableRow 
                      key={testRequest.id}
                      sx={{ 
                        '&:hover': { backgroundColor: 'rgba(76, 161, 175, 0.04)' },
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                      }}
                    >
                      <TableCell>
                        {new Date(testRequest.request_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {testRequest.test_name}
                          </Typography>
                          {getTestTypeChip(testRequest.test_type)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Dr. {testRequest.doctor_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testRequest.doctor_specialty}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getTestStatusChip(testRequest)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={testRequest.priority || 'Normal'} 
                          color={testRequest.priority === 'urgent' ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Voir détails">
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {testRequest.status === 'pending' && (
                            <Tooltip title="Télécharger résultats">
                              <IconButton size="small" color="success">
                                <Upload />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setTestRequestsDialog({ open: false, patient: null, testRequests: [] })}
            variant="contained"
            sx={{ fontWeight: 'bold' }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientSearchTab; 
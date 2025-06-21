import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  Autocomplete,
  Tabs,
  Tab
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Search,
  Refresh,
  MedicalServices,
  Phone,
  Email,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';

const HospitalDoctorsTab = ({ onSuccess, onError, onRefresh }) => {
  // Provide default functions if not provided
  const handleSuccess = onSuccess || ((message) => console.log('Success:', message));
  const handleError = onError || ((message) => console.error('Error:', message));
  const handleRefresh = onRefresh || (() => {});
  const [tabValue, setTabValue] = useState(0);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addDialog, setAddDialog] = useState({ open: false, doctor: null });
  
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    specialite: ''
  });

  const [addForm, setAddForm] = useState({
    department: '',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const departments = [
    'Urgences', 'Cardiologie', 'Chirurgie', 'Médecine interne',
    'Pédiatrie', 'Gynécologie-Obstétrique', 'Orthopédie', 'Neurologie',
    'Radiologie', 'Laboratoire', 'Anesthésie-Réanimation', 'Psychiatrie'
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch both hospital doctors and specialties in parallel
      const [doctorsResponse, specialtiesResponse] = await Promise.all([
        hospitalService.getHospitalDoctors(),
        hospitalService.getSpecialties()
      ]);
      
      setHospitalDoctors(doctorsResponse.doctors || []);
      setSpecialties(specialtiesResponse.data || []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      handleError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalDoctors = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getHospitalDoctors();
      setHospitalDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error fetching hospital doctors:', error);
      handleError('Erreur lors du chargement des médecins');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const response = await hospitalService.searchDoctors(searchForm);
      setSearchResults(response.doctors || []);
    } catch (error) {
      console.error('Error searching doctors:', error);
      handleError('Erreur lors de la recherche');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddDoctor = (doctor) => {
    setAddForm({
      department: '',
      start_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setAddDialog({ open: true, doctor: doctor });
  };

  const handleSaveAdd = async () => {
    try {
      await hospitalService.addDoctorToHospital(addDialog.doctor.id, addForm);
      handleSuccess('Médecin ajouté à l\'hôpital avec succès');
      setAddDialog({ open: false, doctor: null });
      fetchHospitalDoctors();
      handleSearch(); // Refresh search results
      handleRefresh();
    } catch (error) {
      handleError(error.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleRemoveDoctor = async (doctorId) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer ce médecin de l\'hôpital ?')) {
      try {
        await hospitalService.removeDoctorFromHospital(doctorId);
        handleSuccess('Médecin retiré de l\'hôpital avec succès');
        fetchHospitalDoctors();
        handleRefresh();
      } catch (error) {
        handleError(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const clearSearch = () => {
    setSearchForm({ prenom: '', nom: '', specialite: '' });
    setSearchResults([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des médecins...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Gestion des Médecins de l'Hôpital
        </Typography>
        <Tooltip title="Actualiser">
          <IconButton onClick={fetchInitialData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MedicalServices sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {hospitalDoctors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Médecins de l'Hôpital
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {hospitalDoctors.filter(d => d.est_actif).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Médecins Actifs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MedicalServices sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {new Set(hospitalDoctors.map(d => d.specialite)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spécialités
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none'
            }
          }}
        >
          <Tab label="Médecins de l'Hôpital" />
          <Tab label="Rechercher et Ajouter" />
        </Tabs>
      </Card>

      {/* Hospital Doctors Tab */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Médecins Travaillant dans l'Hôpital ({hospitalDoctors.length})
            </Typography>
            
            {hospitalDoctors.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <MedicalServices sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Aucun médecin assigné à cet hôpital
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Utilisez l'onglet "Rechercher et Ajouter" pour ajouter des médecins
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setTabValue(1)}
                  startIcon={<PersonAdd />}
                >
                  Ajouter des Médecins
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Spécialité</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hospitalDoctors.map((doctor) => (
                      <TableRow key={doctor.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                              {doctor.prenom.charAt(0)}{doctor.nom.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Dr. {doctor.prenom} {doctor.nom}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={doctor.specialite} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            {doctor.telephone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="caption">{doctor.telephone}</Typography>
                              </Box>
                            )}
                            {doctor.email && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="caption">{doctor.email}</Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={doctor.est_actif ? 'Actif' : 'Inactif'} 
                            size="small" 
                            color={doctor.est_actif ? 'success' : 'error'} 
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Retirer de l'hôpital">
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => handleRemoveDoctor(doctor.id)}
                            >
                              <PersonRemove />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Add Tab */}
      {tabValue === 1 && (
        <Box>
          {/* Search Form */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Rechercher des Médecins
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Prénom"
                    value={searchForm.prenom}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, prenom: e.target.value }))}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Nom"
                    value={searchForm.nom}
                    onChange={(e) => setSearchForm(prev => ({ ...prev, nom: e.target.value }))}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    options={specialties}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.nom}
                    value={searchForm.specialite}
                    onChange={(event, newValue) => {
                      const value = typeof newValue === 'string' ? newValue : (newValue ? newValue.nom : '');
                      setSearchForm(prev => ({ ...prev, specialite: value }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Spécialité"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Search />}
                      onClick={handleSearch}
                      disabled={searchLoading}
                      fullWidth
                    >
                      {searchLoading ? 'Recherche...' : 'Rechercher'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={clearSearch}
                      disabled={searchLoading}
                    >
                      Effacer
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Résultats de la Recherche ({searchResults.length})
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'secondary.main' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Spécialité</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.map((doctor) => (
                        <TableRow key={doctor.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'secondary.main' }}>
                                {doctor.prenom.charAt(0)}{doctor.nom.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  Dr. {doctor.prenom} {doctor.nom}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={doctor.specialite} 
                              size="small" 
                              color="secondary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              {doctor.telephone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                  <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="caption">{doctor.telephone}</Typography>
                                </Box>
                              )}
                              {doctor.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="caption">{doctor.email}</Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={doctor.est_actif ? 'Actif' : 'Inactif'} 
                                size="small" 
                                color={doctor.est_actif ? 'success' : 'error'} 
                              />
                              {doctor.is_assigned && (
                                <Chip 
                                  label="Déjà dans l'hôpital" 
                                  size="small" 
                                  color="info" 
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {doctor.is_assigned ? (
                              <Typography variant="caption" color="text.secondary">
                                Déjà assigné
                              </Typography>
                            ) : (
                              <Tooltip title="Ajouter à l'hôpital">
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={() => handleAddDoctor(doctor)}
                                >
                                  <PersonAdd />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Add Doctor Dialog */}
      <Dialog open={addDialog.open} onClose={() => setAddDialog({ open: false, doctor: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ajouter Dr. {addDialog.doctor?.prenom} {addDialog.doctor?.nom} à l'Hôpital
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={departments}
                value={addForm.department}
                onChange={(event, newValue) => {
                  setAddForm(prev => ({ ...prev, department: newValue || '' }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Département"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date de début"
                type="date"
                value={addForm.start_date}
                onChange={(e) => setAddForm(prev => ({ ...prev, start_date: e.target.value }))}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={addForm.notes}
                onChange={(e) => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Notes sur l'affectation du médecin..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog({ open: false, doctor: null })}>
            Annuler
          </Button>
          <Button onClick={handleSaveAdd} variant="contained">
            Ajouter à l'Hôpital
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HospitalDoctorsTab; 
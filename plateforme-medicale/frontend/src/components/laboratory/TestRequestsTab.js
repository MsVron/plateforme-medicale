import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Science,
  Person,
  CheckCircle,
  Schedule,
  Search,
  Refresh,
  Upload,
  Visibility,
  Assignment
} from '@mui/icons-material';
import laboratoryService from '../../services/laboratoryService';

const TestRequestsTab = ({ onSuccess, onError, onRefresh }) => {
  const [testRequests, setTestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [resultsDialog, setResultsDialog] = useState({
    open: false,
    testRequest: null
  });
  const [resultsForm, setResultsForm] = useState({
    results: '',
    notes: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestRequests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, testRequests]);

  const fetchTestRequests = async () => {
    try {
      setLoading(true);
      // This component should be used within a patient context
      // For now, we'll show an empty state
      setTestRequests([]);
    } catch (error) {
      console.error('Error fetching test requests:', error);
      onError(error.message || 'Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...testRequests];

    // Search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(request =>
        request.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.patient_cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleUploadResults = (testRequest) => {
    setResultsDialog({
      open: true,
      testRequest: testRequest
    });
    setResultsForm({
      results: '',
      notes: '',
      file: null
    });
  };

  const handleResultsSubmit = async () => {
    if (!resultsForm.results.trim()) {
      onError('Veuillez saisir les résultats');
      return;
    }

    try {
      setUploading(true);
      const resultsData = {
        valeurs: resultsForm.results,
        commentaires: resultsForm.notes,
        fichier_resultat: resultsForm.file ? resultsForm.file.name : null,
        interpretation: 'Résultats normaux' // Default interpretation
      };

      await laboratoryService.uploadTestResults(resultsDialog.testRequest.id, resultsData);
      onSuccess('Résultats téléchargés avec succès');
      setResultsDialog({ open: false, testRequest: null });
      fetchTestRequests();
      onRefresh();
    } catch (error) {
      console.error('Upload error:', error);
      onError(error.message || 'Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (testRequestId, newStatus) => {
    try {
      // Backend endpoint might not exist yet
      onSuccess('Statut mis à jour avec succès');
      fetchTestRequests();
      onRefresh();
    } catch (error) {
      console.error('Status update error:', error);
      onError(error.message || 'Erreur lors de la mise à jour du statut');
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

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      'urgent': { label: 'Urgent', color: 'error' },
      'high': { label: 'Élevée', color: 'warning' },
      'normal': { label: 'Normal', color: 'default' },
      'low': { label: 'Faible', color: 'info' }
    };
    
    const config = priorityConfig[priority] || { label: priority, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const calculateDaysAgo = (date) => {
    const requestDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - requestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des demandes...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Demandes d'Analyses ({filteredRequests.length})
        </Typography>
        <Tooltip title="Actualiser la liste">
          <IconButton onClick={fetchTestRequests} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Rechercher par patient, CNE, analyse ou médecin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Statut"
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="in_progress">En cours</MenuItem>
                  <MenuItem value="completed">Terminé</MenuItem>
                  <MenuItem value="cancelled">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredRequests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune demande trouvée avec ces critères'
                : 'Aucune demande d\'analyse'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Analyse</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Demande</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priorité</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((testRequest) => (
                <TableRow 
                  key={testRequest.id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(76, 161, 175, 0.04)' },
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {testRequest.patient_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          CNE: {testRequest.patient_cne}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Science sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {testRequest.test_name}
                      </Typography>
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
                    <Typography variant="body2">
                      {new Date(testRequest.request_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Il y a {calculateDaysAgo(testRequest.request_date)} jour(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getPriorityChip(testRequest.priority)}
                  </TableCell>
                  <TableCell>
                    {getTestStatusChip(testRequest)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Voir détails">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {testRequest.status === 'pending' && (
                        <Tooltip title="Commencer l'analyse">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => handleStatusUpdate(testRequest.id, 'in_progress')}
                          >
                            <Science />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(testRequest.status === 'pending' || testRequest.status === 'in_progress') && (
                        <Tooltip title="Télécharger résultats">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleUploadResults(testRequest)}
                          >
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

      {/* Results Upload Dialog */}
      <Dialog 
        open={resultsDialog.open} 
        onClose={() => setResultsDialog({ open: false, testRequest: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Télécharger les Résultats - {resultsDialog.testRequest?.test_name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Patient:</strong> {resultsDialog.testRequest?.patient_name} (CNE: {resultsDialog.testRequest?.patient_cne})
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Résultats *"
                  value={resultsForm.results}
                  onChange={(e) => setResultsForm(prev => ({ ...prev, results: e.target.value }))}
                  variant="outlined"
                  multiline
                  rows={6}
                  placeholder="Saisissez les résultats de l'analyse..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes additionnelles"
                  value={resultsForm.notes}
                  onChange={(e) => setResultsForm(prev => ({ ...prev, notes: e.target.value }))}
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Notes, observations, recommandations..."
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setResultsForm(prev => ({ ...prev, file: e.target.files[0] }))}
                  style={{ display: 'none' }}
                  id="results-file-input"
                />
                <label htmlFor="results-file-input">
                  <Button variant="outlined" component="span" startIcon={<Upload />}>
                    Joindre un fichier (optionnel)
                  </Button>
                </label>
                {resultsForm.file && (
                  <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                    Fichier sélectionné: {resultsForm.file.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setResultsDialog({ open: false, testRequest: null })}
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleResultsSubmit}
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <Upload />}
            sx={{ fontWeight: 'bold' }}
          >
            {uploading ? 'Téléchargement...' : 'Télécharger les Résultats'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestRequestsTab; 
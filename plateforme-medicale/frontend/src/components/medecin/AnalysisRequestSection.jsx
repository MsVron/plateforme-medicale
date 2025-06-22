import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Stack,
  Tabs,
  Tab,
  Autocomplete
} from '@mui/material';
import {
  Science as ScienceIcon,
  MedicalServices as ImagingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from '../../services/axiosConfig';

const AnalysisRequestSection = ({ patientId, analyses = [], imagingResults = [], onRefresh }) => {
  // State management
  const [categories, setCategories] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [imagingTypes, setImagingTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [requestDialog, setRequestDialog] = useState({ 
    open: false, 
    type: 'analysis', // 'analysis' or 'imaging'
    mode: 'add', // 'add' or 'edit'
    data: null 
  });
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Analysis request form state
  const [analysisForm, setAnalysisForm] = useState({
    type_analyse_id: '',
    categorie_id: '',
    priority: 'normal',
    clinical_indication: '',
    sample_type: '',
    special_instructions: '',
    preferred_laboratory_id: ''
  });
  
  // Imaging request form state
  const [imagingForm, setImagingForm] = useState({
    type_imagerie_id: '',
    priority: 'routine',
    clinical_indication: '',
    patient_preparation_instructions: '',
    contrast_required: false,
    contrast_type: '',
    special_instructions: '',
    preferred_laboratory_id: ''
  });
  
  // Feedback state
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Expanded sections state
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchAnalysisCategories();
    fetchImagingTypes();
  }, []);

  useEffect(() => {
    if (analysisForm.categorie_id) {
      fetchAnalysisTypes(analysisForm.categorie_id);
    }
  }, [analysisForm.categorie_id]);

  const fetchAnalysisCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/medecin/analysis-categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching analysis categories:', err);
      setError('Impossible de charger les catégories d\'analyses');
    }
  };

  const fetchAnalysisTypes = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/medecin/analysis-types/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisTypes(response.data);
    } catch (err) {
      console.error('Error fetching analysis types:', err);
      setError('Impossible de charger les types d\'analyses');
    }
  };

  const fetchImagingTypes = async () => {
    try {
      console.log('Fetching imaging types...');
      const token = localStorage.getItem('token');
      const response = await axios.get('/medecin/imaging-types', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Imaging types response:', response.data);
      setImagingTypes(response.data);
    } catch (err) {
      console.error('Error fetching imaging types:', err);
      console.error('Error response:', err.response?.data);
      setError('Impossible de charger les types d\'imagerie');
    }
  };

  const handleRequestAnalysis = () => {
    const newForm = {
      type_analyse_id: '',
      categorie_id: '',
      priority: 'normal',
      clinical_indication: '',
      sample_type: '',
      special_instructions: '',
      preferred_laboratory_id: ''
    };
    setAnalysisForm(newForm);
    setRequestDialog({ open: true, type: 'analysis', mode: 'add', data: null });
  };

  const handleRequestImaging = () => {
    setImagingForm({
      type_imagerie_id: '',
      priority: 'routine',
      clinical_indication: '',
      patient_preparation_instructions: '',
      contrast_required: false,
      contrast_type: '',
      special_instructions: '',
      preferred_laboratory_id: ''
    });
    setRequestDialog({ open: true, type: 'imaging', mode: 'add', data: null });
    // Fetch imaging types when dialog opens
    fetchImagingTypes();
  };

  const handleSaveRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const isAnalysis = requestDialog.type === 'analysis';
      const formData = isAnalysis ? analysisForm : imagingForm;
      
      // Validate required fields
      if (!formData.clinical_indication) {
        throw new Error('L\'indication clinique est obligatoire');
      }
      
      const url = requestDialog.mode === 'add' 
        ? `/medecin/patients/${patientId}/${isAnalysis ? 'analysis' : 'imaging'}-requests`
        : `/medecin/patients/${patientId}/${isAnalysis ? 'analysis' : 'imaging'}-requests/${requestDialog.data.id}`;
      
      const method = requestDialog.mode === 'add' ? 'post' : 'put';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: `Demande ${isAnalysis ? 'd\'analyse' : 'd\'imagerie'} ${requestDialog.mode === 'add' ? 'envoyée' : 'modifiée'} avec succès`,
        severity: 'success'
      });
      
      setRequestDialog({ open: false, type: 'analysis', mode: 'add', data: null });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error saving request:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (request) => {
    switch (request.request_status) {
      case 'requested':
        return <ScheduleIcon color="warning" />;
      case 'in_progress':
        return <ScienceIcon color="info" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      default:
        return <ScheduleIcon color="info" />;
    }
  };

  const getStatusColor = (request) => {
    switch (request.request_status) {
      case 'requested': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (request) => {
    switch (request.request_status) {
      case 'requested': return 'Demandée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      default: return request.request_status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const currentForm = requestDialog.type === 'analysis' ? analysisForm : imagingForm;

  return (
    <Box>
      {/* Header with Request Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
          Demandes d'Analyses et Imagerie
          <Badge badgeContent={analyses.length + imagingResults.length} color="primary" sx={{ ml: 2 }} />
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ScienceIcon />}
            onClick={handleRequestAnalysis}
            size="small"
          >
            Demander une analyse
          </Button>
          <Button
            variant="outlined"
            startIcon={<ImagingIcon />}
            onClick={handleRequestImaging}
            size="small"
          >
            Demander une imagerie
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabs for Analysis and Imaging */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`Analyses (${analyses.length})`} />
          <Tab label={`Imagerie (${imagingResults.length})`} />
        </Tabs>
      </Box>

      {/* Analysis Tab */}
      {tabValue === 0 && (
        <Box>
          {analyses.length === 0 ? (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <ScienceIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Aucune analyse demandée pour ce patient
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleRequestAnalysis}
                sx={{ mt: 2 }}
              >
                Demander la première analyse
              </Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {analyses.map((analysis) => (
                <Grid item xs={12} md={6} lg={4} key={analysis.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {analysis.nom || analysis.type_analyse}
                      </Typography>
                      
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(analysis)}
                          <Chip 
                            label={getStatusLabel(analysis)}
                            size="small"
                            color={getStatusColor(analysis)}
                          />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          Demandée le: {formatDate(analysis.date_prescription)}
                        </Typography>
                        
                        {analysis.clinical_indication && (
                          <Typography variant="body2">
                            <strong>Indication:</strong> {analysis.clinical_indication}
                          </Typography>
                        )}
                        
                        {analysis.date_realisation && (
                          <Typography variant="caption" color="text.secondary">
                            Réalisée le: {formatDate(analysis.date_realisation)}
                          </Typography>
                        )}
                        
                        {(analysis.valeur_numerique || analysis.valeur_texte) && (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              Résultat: {analysis.valeur_numerique || analysis.valeur_texte}
                              {analysis.unite && ` ${analysis.unite}`}
                            </Typography>
                          </Box>
                        )}
                        
                        {analysis.interpretation && (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {analysis.interpretation}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Imaging Tab */}
      {tabValue === 1 && (
        <Box>
          {imagingResults.length === 0 ? (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <ImagingIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Aucune imagerie demandée pour ce patient
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleRequestImaging}
                sx={{ mt: 2 }}
              >
                Demander la première imagerie
              </Button>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {imagingResults.map((imaging) => (
                <Grid item xs={12} md={6} lg={4} key={imaging.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {imaging.type_imagerie || imaging.nom}
                      </Typography>
                      
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(imaging)}
                          <Chip 
                            label={getStatusLabel(imaging)}
                            size="small"
                            color={getStatusColor(imaging)}
                          />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          Demandée le: {formatDate(imaging.date_prescription)}
                        </Typography>
                        
                        {imaging.clinical_indication && (
                          <Typography variant="body2">
                            <strong>Indication:</strong> {imaging.clinical_indication}
                          </Typography>
                        )}
                        
                        {imaging.contrast_required && (
                          <Chip label="Produit de contraste requis" color="warning" size="small" />
                        )}
                        
                        {imaging.interpretation && (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {imaging.interpretation}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Request Dialog */}
      <Dialog 
        open={requestDialog.open} 
        onClose={() => setRequestDialog({ open: false, type: 'analysis', mode: 'add', data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Demander une {requestDialog.type === 'analysis' ? 'analyse' : 'imagerie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {requestDialog.type === 'analysis' ? (
              <>
                {/* Analysis Category Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Catégorie *</InputLabel>
                    <Select
                      value={analysisForm.categorie_id}
                      onChange={(e) => {
                        setAnalysisForm(prev => ({ 
                          ...prev, 
                          categorie_id: e.target.value,
                          type_analyse_id: ''
                        }));
                      }}
                      label="Catégorie *"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Analysis Type Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type d'analyse *</InputLabel>
                    <Select
                      value={analysisForm.type_analyse_id}
                      onChange={(e) => setAnalysisForm(prev => ({ ...prev, type_analyse_id: e.target.value }))}
                      label="Type d'analyse *"
                      disabled={!analysisForm.categorie_id}
                    >
                      {analysisTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Sample Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Type d'échantillon"
                    value={analysisForm.sample_type}
                    onChange={(e) => setAnalysisForm(prev => ({ ...prev, sample_type: e.target.value }))}
                    fullWidth
                    placeholder="Sang, urine, salive..."
                  />
                </Grid>
              </>
            ) : (
              <>
                {/* Imaging Type Selection */}
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={imagingTypes}
                    getOptionLabel={(option) => option.nom}
                    value={imagingTypes.find(type => type.id === imagingForm.type_imagerie_id) || null}
                    onChange={(event, newValue) => {
                      setImagingForm(prev => ({ 
                        ...prev, 
                        type_imagerie_id: newValue ? newValue.id : '' 
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type d'imagerie *"
                        required
                        placeholder="Rechercher un type d'imagerie..."
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {option.nom}
                          </Typography>
                          {option.description && (
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      
                      const filtered = options.filter(option =>
                        option.nom.toLowerCase().includes(inputValue.toLowerCase()) ||
                        (option.description && option.description.toLowerCase().includes(inputValue.toLowerCase()))
                      );
                      
                      return filtered;
                    }}
                    noOptionsText="Aucun type d'imagerie trouvé"
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    sx={{
                      '& .MuiAutocomplete-option': {
                        padding: '12px 16px',
                      }
                    }}
                  />
                </Grid>

                {/* Contrast Required */}
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={imagingForm.contrast_required}
                        onChange={(e) => setImagingForm(prev => ({ ...prev, contrast_required: e.target.checked }))}
                      />
                    }
                    label="Produit de contraste requis"
                  />
                </Grid>
              </>
            )}

            {/* Priority */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Priorité
                </Typography>
                <select 
                  value={requestDialog.type === 'analysis' ? analysisForm.priority : imagingForm.priority}
                  onChange={(e) => {
                    if (requestDialog.type === 'analysis') {
                      setAnalysisForm(prev => ({ ...prev, priority: e.target.value }));
                    } else {
                      setImagingForm(prev => ({ ...prev, priority: e.target.value }));
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '16.5px 14px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                >
                  {requestDialog.type === 'analysis' ? (
                    <>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                    </>
                  ) : (
                    <>
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT</option>
                      <option value="emergency">Urgence</option>
                    </>
                  )}
                </select>
              </Box>
            </Grid>

            {/* Clinical Indication */}
            <Grid item xs={12}>
              <TextField
                label="Indication clinique *"
                value={currentForm.clinical_indication}
                onChange={(e) => {
                  if (requestDialog.type === 'analysis') {
                    setAnalysisForm(prev => ({ ...prev, clinical_indication: e.target.value }));
                  } else {
                    setImagingForm(prev => ({ ...prev, clinical_indication: e.target.value }));
                  }
                }}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Raison médicale de la demande, symptômes, diagnostic suspecté..."
              />
            </Grid>

            {/* Special Instructions */}
            <Grid item xs={12}>
              <TextField
                label="Instructions spéciales"
                value={currentForm.special_instructions}
                onChange={(e) => {
                  if (requestDialog.type === 'analysis') {
                    setAnalysisForm(prev => ({ ...prev, special_instructions: e.target.value }));
                  } else {
                    setImagingForm(prev => ({ ...prev, special_instructions: e.target.value }));
                  }
                }}
                fullWidth
                multiline
                rows={2}
                placeholder="Instructions particulières pour le laboratoire..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialog({ open: false, type: 'analysis', mode: 'add', data: null })}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveRequest}
            variant="contained"
            disabled={loading || !currentForm.clinical_indication}
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnalysisRequestSection; 
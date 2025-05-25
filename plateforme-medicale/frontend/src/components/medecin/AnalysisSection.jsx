import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Grid, Card, CardContent, List, ListItem, ListItemText, Chip, IconButton,
  Accordion, AccordionSummary, AccordionDetails, Divider, Alert, Snackbar,
  FormControlLabel, Checkbox, Tooltip, Stack, Badge
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

const AnalysisSection = ({ patientId, analyses = [], onRefresh }) => {
  // State management
  const [categories, setCategories] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [analysisDialog, setAnalysisDialog] = useState({ 
    open: false, 
    mode: 'add', 
    data: null 
  });
  
  // Form state
  const [analysisForm, setAnalysisForm] = useState({
    type_analyse_id: '',
    categorie_id: '',
    date_prescription: new Date().toISOString().split('T')[0],
    date_realisation: '',
    laboratoire: '',
    valeur_numerique: '',
    valeur_texte: '',
    unite: '',
    valeur_normale_min: '',
    valeur_normale_max: '',
    interpretation: '',
    est_normal: null,
    est_critique: false,
    document_url: '',
    notes_techniques: ''
  });
  
  // Feedback state
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Expanded sections state - Start with all categories collapsed
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchAnalysisCategories();
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

  const handleAddAnalysis = () => {
    setAnalysisForm({
      type_analyse_id: '',
      categorie_id: '',
      date_prescription: new Date().toISOString().split('T')[0],
      date_realisation: '',
      laboratoire: '',
      valeur_numerique: '',
      valeur_texte: '',
      unite: '',
      valeur_normale_min: '',
      valeur_normale_max: '',
      interpretation: '',
      est_normal: null,
      est_critique: false,
      document_url: '',
      notes_techniques: ''
    });
    setAnalysisDialog({ open: true, mode: 'add', data: null });
  };

  const handleEditAnalysis = (analysis) => {
    // First set the form data with the analysis information
    setAnalysisForm({
      type_analyse_id: analysis.type_analyse_id || '',
      categorie_id: analysis.categorie_id || '',
      date_prescription: analysis.date_prescription ? analysis.date_prescription.split('T')[0] : '',
      date_realisation: analysis.date_realisation ? analysis.date_realisation.split('T')[0] : '',
      laboratoire: analysis.laboratoire || '',
      valeur_numerique: analysis.valeur_numerique || '',
      valeur_texte: analysis.valeur_texte || '',
      unite: analysis.unite || '',
      valeur_normale_min: analysis.valeur_normale_min || '',
      valeur_normale_max: analysis.valeur_normale_max || '',
      interpretation: analysis.interpretation || '',
      est_normal: analysis.est_normal,
      est_critique: analysis.est_critique || false,
      document_url: analysis.document_url || '',
      notes_techniques: analysis.notes_techniques || ''
    });
    
    // If we have a category ID, fetch the analysis types for that category
    if (analysis.categorie_id) {
      fetchAnalysisTypes(analysis.categorie_id);
    }
    
    setAnalysisDialog({ open: true, mode: 'edit', data: analysis });
  };

  const handleSaveAnalysis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = analysisDialog.mode === 'add' 
        ? `/medecin/patients/${patientId}/analyses`
        : `/medecin/patients/${patientId}/analyses/${analysisDialog.data.id}`;
      
      const method = analysisDialog.mode === 'add' ? 'post' : 'put';
      
      await axios[method](url, analysisForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: `Analyse ${analysisDialog.mode === 'add' ? 'ajoutée' : 'modifiée'} avec succès`,
        severity: 'success'
      });
      
      setAnalysisDialog({ open: false, mode: 'add', data: null });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error saving analysis:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/medecin/patients/${patientId}/analyses/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSnackbar({
        open: true,
        message: 'Analyse supprimée avec succès',
        severity: 'success'
      });
      
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting analysis:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  const getStatusIcon = (analysis) => {
    if (analysis.est_critique) {
      return <ErrorIcon color="error" />;
    } else if (analysis.est_normal === true) {
      return <CheckCircleIcon color="success" />;
    } else if (analysis.est_normal === false) {
      return <WarningIcon color="warning" />;
    }
    return <InfoIcon color="info" />;
  };

  const getStatusColor = (analysis) => {
    if (analysis.est_critique) return 'error';
    if (analysis.est_normal === true) return 'success';
    if (analysis.est_normal === false) return 'warning';
    return 'default';
  };

  const getStatusLabel = (analysis) => {
    if (analysis.est_critique) return 'Critique';
    if (analysis.est_normal === true) return 'Normal';
    if (analysis.est_normal === false) return 'Anormal';
    return 'En attente';
  };

  // Group analyses by category
  const analysesByCategory = analyses.reduce((acc, analysis) => {
    const categoryName = analysis.categorie_nom || 'Autre';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(analysis);
    return acc;
  }, {});

  // Sort analyses within each category by date (newest first)
  Object.keys(analysesByCategory).forEach(category => {
    analysesByCategory[category].sort((a, b) => {
      const dateA = new Date(a.date_realisation || a.date_prescription);
      const dateB = new Date(b.date_realisation || b.date_prescription);
      return dateB - dateA;
    });
  });

  const handleCategoryToggle = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const selectedAnalysisType = analysisTypes.find(type => type.id === analysisForm.type_analyse_id);

  return (
    <Box>
      {/* Header with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
          Analyses et Examens
          <Badge badgeContent={analyses.length} color="primary" sx={{ ml: 2 }} />
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAnalysis}
          size="small"
        >
          Ajouter une analyse
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Analyses grouped by category */}
      {Object.keys(analysesByCategory).length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <ScienceIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Aucune analyse enregistrée pour ce patient
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddAnalysis}
            sx={{ mt: 2 }}
          >
            Ajouter la première analyse
          </Button>
        </Paper>
      ) : (
        Object.entries(analysesByCategory).map(([categoryName, categoryAnalyses]) => (
          <Accordion
            key={categoryName}
            expanded={expandedCategories[categoryName] === true}
            onChange={() => handleCategoryToggle(categoryName)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {categoryName}
                </Typography>
                <Chip 
                  label={categoryAnalyses.length} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }} 
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {categoryAnalyses.map((analysis) => (
                  <Grid item xs={12} md={6} key={analysis.id}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                            {analysis.type_analyse}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditAnalysis(analysis)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteAnalysis(analysis.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        
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
                            Prescrit le: {formatDate(analysis.date_prescription)}
                          </Typography>
                          
                          {analysis.date_realisation && (
                            <Typography variant="caption" color="text.secondary">
                              Réalisé le: {formatDate(analysis.date_realisation)}
                            </Typography>
                          )}
                          
                          {analysis.laboratoire && (
                            <Typography variant="caption">
                              Laboratoire: {analysis.laboratoire}
                            </Typography>
                          )}
                          
                          {(analysis.valeur_numerique || analysis.valeur_texte) && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                Résultat: {analysis.valeur_numerique || analysis.valeur_texte}
                                {analysis.unite && ` ${analysis.unite}`}
                              </Typography>
                              {analysis.valeurs_normales && (
                                <Typography variant="caption" color="text.secondary">
                                  Valeurs normales: {analysis.valeurs_normales}
                                </Typography>
                              )}
                            </Box>
                          )}
                          
                          {analysis.interpretation && (
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {analysis.interpretation}
                            </Typography>
                          )}
                          
                          <Typography variant="caption" color="text.secondary">
                            Dr. {analysis.prescripteur_prenom} {analysis.prescripteur_nom}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Analysis Dialog */}
      <Dialog 
        open={analysisDialog.open} 
        onClose={() => setAnalysisDialog({ open: false, mode: 'add', data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {analysisDialog.mode === 'add' ? 'Ajouter une analyse' : 'Modifier l\'analyse'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Category Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie *</InputLabel>
                <Select
                  value={analysisForm.categorie_id}
                  onChange={(e) => {
                    setAnalysisForm(prev => ({ 
                      ...prev, 
                      categorie_id: e.target.value,
                      type_analyse_id: '' // Reset analysis type when category changes
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
              <FormControl fullWidth disabled={!analysisForm.categorie_id}>
                <InputLabel>Type d'analyse *</InputLabel>
                <Select
                  value={analysisForm.type_analyse_id}
                  onChange={(e) => {
                    const selectedType = analysisTypes.find(type => type.id === e.target.value);
                    setAnalysisForm(prev => ({ 
                      ...prev, 
                      type_analyse_id: e.target.value,
                      unite: selectedType?.unite || ''
                    }));
                  }}
                  label="Type d'analyse *"
                >
                  {analysisTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Analysis Type Description */}
            {selectedAnalysisType && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>{selectedAnalysisType.nom}</strong>
                    {selectedAnalysisType.description && (
                      <>: {selectedAnalysisType.description}</>
                    )}
                    {selectedAnalysisType.valeurs_normales && (
                      <><br />Valeurs normales: {selectedAnalysisType.valeurs_normales}</>
                    )}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Dates */}
            <Grid item xs={6}>
              <TextField
                label="Date de prescription *"
                type="date"
                value={analysisForm.date_prescription}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, date_prescription: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                label="Date de réalisation"
                type="date"
                value={analysisForm.date_realisation}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, date_realisation: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Laboratory */}
            <Grid item xs={12}>
              <TextField
                label="Laboratoire"
                value={analysisForm.laboratoire}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, laboratoire: e.target.value }))}
                fullWidth
                placeholder="Nom du laboratoire"
              />
            </Grid>

            {/* Results */}
            <Grid item xs={6}>
              <TextField
                label="Valeur numérique"
                type="number"
                value={analysisForm.valeur_numerique}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, valeur_numerique: e.target.value }))}
                fullWidth
                placeholder="Résultat numérique"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Unité"
                value={analysisForm.unite}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, unite: e.target.value }))}
                fullWidth
                placeholder="mg/dL, UI/L, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Valeur textuelle"
                value={analysisForm.valeur_texte}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, valeur_texte: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                placeholder="Résultat qualitatif ou description"
              />
            </Grid>

            {/* Normal Range */}
            <Grid item xs={6}>
              <TextField
                label="Valeur normale min"
                type="number"
                value={analysisForm.valeur_normale_min}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, valeur_normale_min: e.target.value }))}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Valeur normale max"
                type="number"
                value={analysisForm.valeur_normale_max}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, valeur_normale_max: e.target.value }))}
                fullWidth
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={analysisForm.est_normal === null ? '' : analysisForm.est_normal.toString()}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : e.target.value === 'true';
                    setAnalysisForm(prev => ({ ...prev, est_normal: value }));
                  }}
                  label="Statut"
                >
                  <MenuItem value="">En attente</MenuItem>
                  <MenuItem value="true">Normal</MenuItem>
                  <MenuItem value="false">Anormal</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={analysisForm.est_critique}
                    onChange={(e) => setAnalysisForm(prev => ({ ...prev, est_critique: e.target.checked }))}
                  />
                }
                label="Résultat critique"
              />
            </Grid>

            {/* Interpretation */}
            <Grid item xs={12}>
              <TextField
                label="Interprétation"
                value={analysisForm.interpretation}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, interpretation: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Interprétation médicale du résultat..."
              />
            </Grid>

            {/* Technical Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes techniques"
                value={analysisForm.notes_techniques}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, notes_techniques: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                placeholder="Notes techniques ou observations..."
              />
            </Grid>

            {/* Document URL */}
            <Grid item xs={12}>
              <TextField
                label="URL du document"
                value={analysisForm.document_url}
                onChange={(e) => setAnalysisForm(prev => ({ ...prev, document_url: e.target.value }))}
                fullWidth
                placeholder="Lien vers le document PDF ou image"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAnalysisDialog({ open: false, mode: 'add', data: null })}
            startIcon={<CancelIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveAnalysis}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading || !analysisForm.type_analyse_id || !analysisForm.date_prescription}
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnalysisSection; 
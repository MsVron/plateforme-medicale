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
  Autocomplete,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Science as ScienceIcon,
  MedicalServices as ImagingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Save as SaveIcon,
  NoteAdd as NoteAddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import axios from '../../services/axiosConfig';
import doctorService from '../../services/doctorService';
import { formatDateTime } from '../../utils/dateUtils';

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

  // Imaging notes state
  const [selectedImaging, setSelectedImaging] = useState(null);
  const [imagingNotes, setImagingNotes] = useState([]);
  const [noteDialog, setNoteDialog] = useState({ open: false, mode: 'add', note: null });
  const [imageDialog, setImageDialog] = useState({ open: false, imageUrl: '' });
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({
    note_type: 'observation',
    note_content: '',
    is_important: false,
    is_private: false
  });

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
    // Only show status icon if we have results or if it's explicitly requested
    if (!request.request_status && !request.date_realisation) {
      return null;
    }
    
    switch (request.request_status) {
      case 'requested':
        return <ScheduleIcon color="warning" />;
      case 'in_progress':
        return <ScienceIcon color="info" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      default:
        // If we have results but no status, assume completed
        if (request.date_realisation || request.valeur_numerique || request.valeur_texte || request.interpretation) {
          return <CheckCircleIcon color="success" />;
        }
        return null;
    }
  };

  const getStatusColor = (request) => {
    // Only show status if we have results or if it's explicitly requested
    if (!request.request_status && !request.date_realisation) {
      return null;
    }
    
    switch (request.request_status) {
      case 'requested': return 'warning';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      default:
        // If we have results but no status, assume completed
        if (request.date_realisation || request.valeur_numerique || request.valeur_texte || request.interpretation) {
          return 'success';
        }
        return null;
    }
  };

  const getStatusLabel = (request) => {
    // Only show status label if we have results or if it's explicitly requested
    if (!request.request_status && !request.date_realisation) {
      return null;
    }
    
    switch (request.request_status) {
      case 'requested': return 'Demandée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      default:
        // If we have results but no status, assume completed
        if (request.date_realisation || request.valeur_numerique || request.valeur_texte || request.interpretation) {
          return 'Terminée';
        }
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Imaging notes functions
  const fetchImagingNotes = async (imagingId) => {
    try {
      setLoadingNotes(true);
      const response = await doctorService.getImagingNotes(imagingId);
      setImagingNotes(response.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleSelectImaging = (imaging) => {
    setSelectedImaging(imaging);
    if (imaging?.id) {
      fetchImagingNotes(imaging.id);
    }
  };

  const handleOpenNoteDialog = (mode, note = null) => {
    if (mode === 'edit' && note) {
      setNoteForm({
        note_content: note.note_content,
        note_type: note.note_type,
        is_important: note.is_important,
        is_private: note.is_private
      });
    } else {
      setNoteForm({
        note_content: '',
        note_type: 'observation',
        is_important: false,
        is_private: false
      });
    }
    setNoteDialog({ open: true, mode, note });
  };

  const handleSaveNote = async () => {
    try {
      setSavingNote(true);
      
      if (!noteForm.note_content.trim()) {
        alert('Le contenu de la note est obligatoire');
        return;
      }

      if (!selectedImaging?.id) {
        alert('Aucun résultat d\'imagerie sélectionné');
        return;
      }

      if (noteDialog.mode === 'edit' && noteDialog.note) {
        await doctorService.updateImagingNote(selectedImaging.id, noteDialog.note.id, noteForm);
      } else {
        await doctorService.addImagingNote(selectedImaging.id, noteForm);
      }

      setNoteDialog({ open: false, mode: 'add', note: null });
      fetchImagingNotes(selectedImaging.id);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Erreur lors de la sauvegarde de la note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await doctorService.deleteImagingNote(selectedImaging.id, noteId);
        fetchImagingNotes(selectedImaging.id);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Erreur lors de la suppression de la note');
      }
    }
  };

  const getNoteTypeLabel = (type) => {
    const types = {
      observation: 'Observation',
      interpretation: 'Interprétation',
      follow_up: 'Suivi',
      concern: 'Préoccupation',
      recommendation: 'Recommandation'
    };
    return types[type] || type;
  };

  const getNoteTypeColor = (type) => {
    const colors = {
      observation: 'default',
      interpretation: 'primary',
      follow_up: 'info',
      concern: 'warning',
      recommendation: 'success'
    };
    return colors[type] || 'default';
  };

  const getImageUrls = (imaging) => {
    if (!imaging?.image_urls) return [];
    return imaging.image_urls.split(',').filter(url => url.trim());
  };

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleImageClick = (imageUrl) => {
    setImageDialog({ open: true, imageUrl });
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
                        {getStatusIcon(analysis) && getStatusLabel(analysis) && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(analysis)}
                            <Chip 
                              label={getStatusLabel(analysis)}
                              size="small"
                              color={getStatusColor(analysis)}
                            />
                          </Box>
                        )}
                        
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
              {/* Imaging Results List */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Résultats d'Imagerie ({imagingResults.length})
                </Typography>
                <Grid container spacing={2}>
                  {imagingResults.map((imaging) => (
                    <Grid item xs={12} key={imaging.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: selectedImaging?.id === imaging.id ? 2 : 1,
                          borderColor: selectedImaging?.id === imaging.id ? 'primary.main' : 'grey.300',
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                        onClick={() => handleSelectImaging(imaging)}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {imaging.type_imagerie || imaging.nom}
                          </Typography>
                          
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(imaging) && getStatusLabel(imaging) && (
                                <>
                                  {getStatusIcon(imaging)}
                                  <Chip 
                                    label={getStatusLabel(imaging)}
                                    size="small"
                                    color={getStatusColor(imaging)}
                                  />
                                </>
                              )}
                              {imaging.notes && imaging.notes.length > 0 && (
                                <Chip 
                                  label={`${imaging.notes.length} note(s)`}
                                  size="small"
                                  color="info"
                                  icon={<NoteAddIcon />}
                                />
                              )}
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary">
                              Demandée le: {formatDate(imaging.date_prescription)}
                            </Typography>
                            
                            {imaging.date_realisation && (
                              <Typography variant="caption" color="text.secondary">
                                Réalisée le: {formatDate(imaging.date_realisation)}
                              </Typography>
                            )}
                            
                            {imaging.interpretation && (
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                {imaging.interpretation.substring(0, 100)}...
                              </Typography>
                            )}

                            {getImageUrls(imaging).length > 0 && (
                              <Chip 
                                label={`${getImageUrls(imaging).length} image(s)`}
                                size="small"
                                color="secondary"
                                icon={<ViewIcon />}
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Imaging Details and Notes */}
              <Grid item xs={12} md={6}>
                {selectedImaging ? (
                  <Box>
                    {/* Imaging Details */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {selectedImaging.type_imagerie}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Prescrit par:</strong> Dr. {selectedImaging.prescripteur_prenom} {selectedImaging.prescripteur_nom}
                        </Typography>
                        
                        {selectedImaging.institution_nom && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Institution:</strong> {selectedImaging.institution_nom}
                          </Typography>
                        )}

                        {selectedImaging.interpretation && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Interprétation:
                            </Typography>
                            <Typography variant="body2">
                              {selectedImaging.interpretation}
                            </Typography>
                          </Box>
                        )}

                        {selectedImaging.conclusion && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Conclusion:
                            </Typography>
                            <Typography variant="body2">
                              {selectedImaging.conclusion}
                            </Typography>
                          </Box>
                        )}

                        {/* Images Section */}
                        {getImageUrls(selectedImaging).length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Images ({getImageUrls(selectedImaging).length}):
                            </Typography>
                            <ImageList sx={{ width: '100%', height: 150 }} cols={3} rowHeight={100}>
                              {getImageUrls(selectedImaging).map((url, index) => (
                                <ImageListItem key={index} onClick={() => handleImageClick(url)} sx={{ cursor: 'pointer' }}>
                                  {isImageFile(url) ? (
                                    <img
                                      src={url}
                                      alt={`Imagerie ${index + 1}`}
                                      loading="lazy"
                                      style={{ height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <Box 
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        height: '100%',
                                        backgroundColor: 'grey.100'
                                      }}
                                    >
                                      <PdfIcon sx={{ fontSize: 24, color: 'grey.500' }} />
                                    </Box>
                                  )}
                                </ImageListItem>
                              ))}
                            </ImageList>
                          </Box>
                        )}
                      </CardContent>
                    </Card>

                    {/* Notes Section */}
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Notes Médicales ({imagingNotes.length})
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<NoteAddIcon />}
                            onClick={() => handleOpenNoteDialog('add')}
                          >
                            Ajouter
                          </Button>
                        </Box>

                        {loadingNotes ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress size={24} />
                          </Box>
                        ) : imagingNotes.length === 0 ? (
                          <Alert severity="info">
                            Aucune note médicale pour ce résultat d'imagerie
                          </Alert>
                        ) : (
                          <List dense>
                            {imagingNotes.map((note, index) => (
                              <React.Fragment key={note.id}>
                                <ListItem alignItems="flex-start">
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Chip
                                          label={getNoteTypeLabel(note.note_type)}
                                          color={getNoteTypeColor(note.note_type)}
                                          size="small"
                                          sx={{ mr: 1 }}
                                        />
                                        {note.is_important && (
                                          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 16 }} />
                                        )}
                                      </Box>
                                    }
                                    secondary={
                                      <Box>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                          {note.note_content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {formatDateTime(note.created_at)} - Dr. {note.medecin_prenom} {note.medecin_nom}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      onClick={() => handleOpenNoteDialog('edit', note)}
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      onClick={() => handleDeleteNote(note.id)}
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                {index < imagingNotes.length - 1 && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Sélectionnez un résultat d'imagerie pour voir les détails et ajouter des notes
                  </Alert>
                )}
              </Grid>
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

      {/* Note Dialog */}
      <Dialog 
        open={noteDialog.open} 
        onClose={() => setNoteDialog({ open: false, mode: 'add', note: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {noteDialog.mode === 'add' ? 'Ajouter une Note' : 'Modifier la Note'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type de note</InputLabel>
                <Select
                  value={noteForm.note_type}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, note_type: e.target.value }))}
                  label="Type de note"
                >
                  <MenuItem value="observation">Observation</MenuItem>
                  <MenuItem value="interpretation">Interprétation</MenuItem>
                  <MenuItem value="follow_up">Suivi</MenuItem>
                  <MenuItem value="concern">Préoccupation</MenuItem>
                  <MenuItem value="recommendation">Recommandation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noteForm.is_important}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, is_important: e.target.checked }))}
                    />
                  }
                  label="Important"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noteForm.is_private}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, is_private: e.target.checked }))}
                    />
                  }
                  label="Privé"
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contenu de la note *"
                value={noteForm.note_content}
                onChange={(e) => setNoteForm(prev => ({ ...prev, note_content: e.target.value }))}
                fullWidth
                required
                multiline
                rows={4}
                placeholder="Saisissez votre note médicale..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ open: false, mode: 'add', note: null })}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveNote}
            variant="contained"
            disabled={savingNote}
            startIcon={savingNote ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {savingNote ? 'Sauvegarde...' : noteDialog.mode === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog
        open={imageDialog.open}
        onClose={() => setImageDialog({ open: false, imageUrl: '' })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Visualisation de l'image
          <IconButton onClick={() => setImageDialog({ open: false, imageUrl: '' })}>
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 0 }}>
          {imageDialog.imageUrl && (
            isImageFile(imageDialog.imageUrl) ? (
              <img
                src={imageDialog.imageUrl}
                alt="Image d'imagerie"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '80vh', 
                  objectFit: 'contain' 
                }}
              />
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <PdfIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Document PDF
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ViewIcon />}
                  onClick={() => window.open(imageDialog.imageUrl, '_blank')}
                >
                  Ouvrir le PDF
                </Button>
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AnalysisRequestSection; 
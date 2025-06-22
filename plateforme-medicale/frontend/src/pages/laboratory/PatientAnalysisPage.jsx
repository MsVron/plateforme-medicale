import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Science,
  Assignment,
  CheckCircle,
  Schedule,
  Edit,
  Save,
  Cancel,
  Visibility,
  Person,
  LocalHospital,
  CloudUpload,
  MedicalServices
} from '@mui/icons-material';
import laboratoryService from '../../services/laboratoryService';

const PatientAnalysisPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [testRequests, setTestRequests] = useState([]);
  const [imagingRequests, setImagingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState(null);
  const [editingImaging, setEditingImaging] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Utility function to parse normal ranges from text
  const parseNormalRanges = (valeursNormales) => {
    if (!valeursNormales) return { min: '', max: '' };
    
    // Handle different formats:
    // "70-100" -> min: 70, max: 100
    // "<200" -> min: '', max: 200
    // ">40" -> min: 40, max: ''
    // "H: 13-17 g/dL, F: 12-15 g/dL" -> use first range found
    // "4.0-11.0" -> min: 4.0, max: 11.0
    
    const text = valeursNormales.toString().trim();
    
    // Try to find range pattern like "number-number"
    const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
      return {
        min: rangeMatch[1],
        max: rangeMatch[2]
      };
    }
    
    // Try to find "less than" pattern like "<200"
    const lessThanMatch = text.match(/<\s*(\d+(?:\.\d+)?)/);
    if (lessThanMatch) {
      return {
        min: '',
        max: lessThanMatch[1]
      };
    }
    
    // Try to find "greater than" pattern like ">40"
    const greaterThanMatch = text.match(/>\s*(\d+(?:\.\d+)?)/);
    if (greaterThanMatch) {
      return {
        min: greaterThanMatch[1],
        max: ''
      };
    }
    
    // If no pattern matches, return empty
    return { min: '', max: '' };
  };

  // Form states for editing
  const [testForm, setTestForm] = useState({
    valeur_numerique: '',
    valeur_texte: '',
    unite: '',
    valeur_normale_min: '',
    valeur_normale_max: '',
    interpretation: '',
    est_normal: null,
    est_critique: false,
    notes_techniques: ''
  });

  const [imagingForm, setImagingForm] = useState({
    findings: '',
    impression: '',
    conclusion: '',
    technique_used: '',
    contrast_used: false,
    contrast_type: '',
    technician_notes: '',
    imageFiles: []
  });

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await laboratoryService.getPatientTestRequests(patientId);
      setPatient(response.patient);
      setTestRequests(response.testRequests || []);
      setImagingRequests(response.imagingRequests || []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      showSnackbar('Erreur lors du chargement des données patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditTest = (testRequest) => {
    setEditingTest(testRequest.id);
    
    // Parse normal ranges from database if not already set
    const parsedRanges = parseNormalRanges(testRequest.valeurs_normales);
    
    setTestForm({
      valeur_numerique: testRequest.valeur_numerique || '',
      valeur_texte: testRequest.valeurs || '',
      unite: testRequest.unite || testRequest.test_unite || '',
      valeur_normale_min: testRequest.valeur_normale_min || parsedRanges.min,
      valeur_normale_max: testRequest.valeur_normale_max || parsedRanges.max,
      interpretation: testRequest.interpretation || '',
      est_normal: testRequest.est_normal === undefined ? null : testRequest.est_normal,
      est_critique: testRequest.est_critique || false,
      notes_techniques: testRequest.commentaires || ''
    });
  };

  const handleSaveTest = async (testId) => {
    try {
      await laboratoryService.uploadTestResults(testId, testForm);
      showSnackbar('Résultats d\'analyse sauvegardés avec succès');
      setEditingTest(null);
      fetchPatientData(); // Refresh data
    } catch (error) {
      console.error('Error saving test results:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleEditImaging = (imagingRequest) => {
    setEditingImaging(imagingRequest.id);
    setImagingForm({
      findings: imagingRequest.interpretation || '',
      impression: imagingRequest.impression || '',
      conclusion: imagingRequest.conclusion || '',
      technique_used: '',
      contrast_used: false,
      contrast_type: '',
      technician_notes: '',
      imageFiles: []
    });
  };

  const handleSaveImaging = async (imagingId) => {
    try {
      // Validate that either text results or image files are provided
      const hasTextResults = imagingForm.findings || imagingForm.impression || imagingForm.conclusion;
      const hasImageFiles = imagingForm.imageFiles && imagingForm.imageFiles.length > 0;
      
      if (!hasTextResults && !hasImageFiles) {
        showSnackbar('Veuillez saisir au moins les observations/impression ou télécharger des images', 'error');
        return;
      }
      
      // Upload image files first if any
      let uploadedImageUrls = '';
      if (hasImageFiles) {
        try {
          const uploadResponse = await laboratoryService.uploadImagingFiles(imagingId, imagingForm.imageFiles);
          uploadedImageUrls = uploadResponse.uploaded_files ? uploadResponse.uploaded_files.join(',') : '';
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          showSnackbar('Attention: Échec du téléchargement des images, mais les résultats seront sauvegardés', 'warning');
        }
      }
      
      // Prepare imaging results data
      const imagingData = {
        ...imagingForm,
        image_files: uploadedImageUrls ? [uploadedImageUrls] : []
      };
      
      await laboratoryService.uploadImagingResults(imagingId, imagingData);
      showSnackbar('Résultats d\'imagerie sauvegardés avec succès');
      setEditingImaging(null);
      fetchPatientData(); // Refresh data
    } catch (error) {
      console.error('Error saving imaging results:', error);
      showSnackbar('Erreur lors de la sauvegarde', 'error');
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      'requested': { label: 'Demandé', color: 'warning', icon: <Schedule /> },
      'in_progress': { label: 'En cours', color: 'info', icon: <Science /> },
      'completed': { label: 'Terminé', color: 'success', icon: <CheckCircle /> },
      'validated': { label: 'Validé', color: 'success', icon: <CheckCircle /> }
    };
    
    const config = statusConfig[status] || { label: status, color: 'default', icon: <Schedule /> };
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography>Chargement des données patient...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/laboratory/dashboard')} sx={{ mr: 2, color: 'white' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
          Demandes d'Analyses - {patient?.prenom} {patient?.nom}
        </Typography>
      </Box>

      {/* Patient Info */}
      {patient && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {patient.prenom} {patient.nom}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>CIN:</strong> {patient.CNE}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date de naissance:</strong> {new Date(patient.date_naissance).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Téléphone:</strong> {patient.telephone || 'Non renseigné'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {patient.email || 'Non renseigné'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Groupe sanguin:</strong> {patient.groupe_sanguin || 'Non renseigné'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Test Requests Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Science sx={{ mr: 1, color: 'primary.main' }} />
            Analyses Demandées ({testRequests.length})
          </Typography>
          
          {testRequests.length === 0 ? (
            <Alert severity="info">Aucune analyse demandée pour ce patient</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Analyse</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Demande</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Résultats</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testRequests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {test.test_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {test.test_description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(test.date_demande).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {test.medecin_demandeur}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {test.medecin_specialite}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(test.statut)}
                      </TableCell>
                      <TableCell>
                        {editingTest === test.id ? (
                          <Box sx={{ minWidth: 200 }}>
                            <TextField
                              size="small"
                              label="Valeur numérique"
                              type="number"
                              value={testForm.valeur_numerique}
                              onChange={(e) => setTestForm(prev => ({ ...prev, valeur_numerique: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <TextField
                              size="small"
                              label="Valeur textuelle"
                              value={testForm.valeur_texte}
                              onChange={(e) => setTestForm(prev => ({ ...prev, valeur_texte: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <TextField
                              size="small"
                              label="Unité"
                              value={testForm.unite}
                              onChange={(e) => setTestForm(prev => ({ ...prev, unite: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-end' }}>
                              <TextField
                                size="small"
                                label="Valeur normale min"
                                type="number"
                                value={testForm.valeur_normale_min}
                                onChange={(e) => setTestForm(prev => ({ ...prev, valeur_normale_min: e.target.value }))}
                                sx={{ width: '40%' }}
                              />
                              <TextField
                                size="small"
                                label="Valeur normale max"
                                type="number"
                                value={testForm.valeur_normale_max}
                                onChange={(e) => setTestForm(prev => ({ ...prev, valeur_normale_max: e.target.value }))}
                                sx={{ width: '40%' }}
                              />
                              <Tooltip title="Auto-remplir depuis la référence">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    const parsedRanges = parseNormalRanges(test.valeurs_normales);
                                    setTestForm(prev => ({
                                      ...prev,
                                      valeur_normale_min: parsedRanges.min,
                                      valeur_normale_max: parsedRanges.max
                                    }));
                                  }}
                                  sx={{ height: '40px' }}
                                >
                                  <Assignment />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            {test.valeurs_normales && (
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                <strong>Référence:</strong> {test.valeurs_normales}
                              </Typography>
                            )}
                            <TextField
                              size="small"
                              label="Interprétation"
                              multiline
                              rows={2}
                              value={testForm.interpretation}
                              onChange={(e) => setTestForm(prev => ({ ...prev, interpretation: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <FormControl size="small" sx={{ mb: 1, width: '100%' }}>
                              <InputLabel>Statut</InputLabel>
                              <Select
                                value={testForm.est_normal === null || testForm.est_normal === undefined ? '' : testForm.est_normal.toString()}
                                onChange={(e) => {
                                  const value = e.target.value === '' ? null : e.target.value === 'true';
                                  setTestForm(prev => ({ ...prev, est_normal: value }));
                                }}
                                label="Statut"
                              >
                                <MenuItem value="">En attente</MenuItem>
                                <MenuItem value="true">Normal</MenuItem>
                                <MenuItem value="false">Anormal</MenuItem>
                              </Select>
                            </FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={testForm.est_critique}
                                  onChange={(e) => setTestForm(prev => ({ ...prev, est_critique: e.target.checked }))}
                                />
                              }
                              label="Critique"
                            />
                            <TextField
                              size="small"
                              label="Notes techniques"
                              multiline
                              rows={2}
                              value={testForm.notes_techniques}
                              onChange={(e) => setTestForm(prev => ({ ...prev, notes_techniques: e.target.value }))}
                              sx={{ mt: 1, width: '100%' }}
                            />
                          </Box>
                        ) : (
                          <Box>
                            {test.valeur_numerique && (
                              <Typography variant="body2">
                                <strong>Valeur:</strong> {test.valeur_numerique} {test.unite}
                              </Typography>
                            )}
                            {test.valeurs && !test.valeur_numerique && (
                              <Typography variant="body2">
                                <strong>Valeur:</strong> {test.valeurs} {test.unite}
                              </Typography>
                            )}
                            {(test.valeur_normale_min || test.valeur_normale_max) && (
                              <Typography variant="caption" color="text.secondary">
                                <strong>Normal:</strong> {test.valeur_normale_min || '?'} - {test.valeur_normale_max || '?'} {test.unite}
                              </Typography>
                            )}
                            {test.valeurs_normales && !(test.valeur_normale_min || test.valeur_normale_max) && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                <strong>Normal:</strong> {test.valeurs_normales}
                              </Typography>
                            )}
                            {test.interpretation && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Interprétation:</strong> {test.interpretation}
                              </Typography>
                            )}
                            {test.est_normal !== null && test.est_normal !== undefined && (
                              <Chip 
                                label={test.est_normal ? 'Normal' : 'Anormal'} 
                                color={test.est_normal ? 'success' : 'error'} 
                                size="small" 
                                sx={{ mt: 0.5 }}
                              />
                            )}
                            {test.est_critique && (
                              <Chip 
                                label="Critique" 
                                color="error" 
                                size="small" 
                                sx={{ mt: 0.5, ml: 0.5 }}
                              />
                            )}
                            {!test.valeurs && !test.valeur_numerique && !test.interpretation && (
                              <Typography variant="body2" color="text.secondary">
                                Aucun résultat
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingTest === test.id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Sauvegarder">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleSaveTest(test.id)}
                              >
                                <Save />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Annuler">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setEditingTest(null)}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title="Modifier résultats">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditTest(test)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Imaging Requests Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <LocalHospital sx={{ mr: 1, color: 'primary.main' }} />
            Imageries Demandées ({imagingRequests.length})
          </Typography>
          
          {imagingRequests.length === 0 ? (
            <Alert severity="info">Aucune imagerie demandée pour ce patient</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead sx={{ backgroundColor: 'secondary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type d'Imagerie</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Demande</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Résultats</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {imagingRequests.map((imaging) => (
                    <TableRow key={imaging.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {imaging.imaging_type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {imaging.imaging_description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(imaging.date_prescription).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {imaging.medecin_demandeur}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {imaging.medecin_specialite}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {editingImaging === imaging.id ? (
                          <Box sx={{ minWidth: 400 }}>
                            <TextField
                              size="small"
                              label="Observations"
                              multiline
                              rows={2}
                              value={imagingForm.findings}
                              onChange={(e) => setImagingForm(prev => ({ ...prev, findings: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <TextField
                              size="small"
                              label="Impression"
                              multiline
                              rows={2}
                              value={imagingForm.impression}
                              onChange={(e) => setImagingForm(prev => ({ ...prev, impression: e.target.value }))}
                              sx={{ mb: 1, width: '100%' }}
                            />
                            <TextField
                              size="small"
                              label="Conclusion"
                              value={imagingForm.conclusion}
                              onChange={(e) => setImagingForm(prev => ({ ...prev, conclusion: e.target.value }))}
                              sx={{ mb: 2, width: '100%' }}
                            />
                            
                            {/* Image Upload Section */}
                            <Card sx={{ p: 2, backgroundColor: 'rgba(25, 118, 210, 0.04)', border: '1px dashed #1976d2' }}>
                              <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', mb: 1 }}>
                                <MedicalServices sx={{ mr: 1, fontSize: 16 }} />
                                Images d'Imagerie
                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                  (Optionnel si observations remplies)
                                </Typography>
                              </Typography>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                multiple
                                onChange={(e) => setImagingForm(prev => ({ ...prev, imageFiles: Array.from(e.target.files) }))}
                                style={{ display: 'none' }}
                                id={`imaging-files-input-${imaging.id}`}
                              />
                              <label htmlFor={`imaging-files-input-${imaging.id}`}>
                                <Button 
                                  variant="outlined" 
                                  component="span" 
                                  startIcon={<CloudUpload />}
                                  size="small"
                                  sx={{ mb: 1 }}
                                >
                                  Télécharger Images/PDF
                                </Button>
                              </label>
                              {imagingForm.imageFiles && imagingForm.imageFiles.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="primary.main">
                                    {imagingForm.imageFiles.length} fichier(s) sélectionné(s):
                                  </Typography>
                                  {Array.from(imagingForm.imageFiles).map((file, index) => (
                                    <Typography key={index} variant="caption" display="block" color="text.secondary">
                                      • {file.name}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                Formats: JPEG, PNG, GIF, WebP, PDF (max 10MB/fichier)
                              </Typography>
                            </Card>
                          </Box>
                        ) : (
                          <Box>
                            {imaging.interpretation && (
                              <Typography variant="body2">
                                <strong>Interprétation:</strong> {imaging.interpretation}
                              </Typography>
                            )}
                            {imaging.conclusion && (
                              <Typography variant="body2">
                                <strong>Conclusion:</strong> {imaging.conclusion}
                              </Typography>
                            )}
                            {imaging.image_urls && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  Images disponibles:
                                </Typography>
                                {imaging.image_urls.split(',').filter(url => url.trim()).map((imageUrl, index) => (
                                  <Button
                                    key={index}
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Visibility />}
                                    onClick={() => window.open(imageUrl.trim(), '_blank')}
                                    sx={{ mr: 1, mb: 1 }}
                                  >
                                    Image {index + 1}
                                  </Button>
                                ))}
                              </Box>
                            )}
                            {!imaging.interpretation && !imaging.conclusion && !imaging.image_urls && (
                              <Typography variant="body2" color="text.secondary">
                                Aucun résultat
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingImaging === imaging.id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Sauvegarder">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleSaveImaging(imaging.id)}
                              >
                                <Save />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Annuler">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setEditingImaging(null)}
                              >
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip title="Modifier résultats">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditImaging(imaging)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientAnalysisPage; 
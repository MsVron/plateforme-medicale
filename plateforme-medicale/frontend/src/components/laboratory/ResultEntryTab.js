import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import {
  Science,
  Person,
  CheckCircle,
  Schedule,
  Visibility,
  Assignment,
  Save,
  Cancel,
  CloudUpload,
  MedicalServices
} from '@mui/icons-material';
import laboratoryService from '../../services/laboratoryService';
import axios from '../../services/axiosConfig';

const ResultEntryTab = ({ onSuccess, onError, onRefresh }) => {
  const [pendingTests, setPendingTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultDialog, setResultDialog] = useState({ open: false, testRequest: null });
  const [saving, setSaving] = useState(false);
  
  // Result form state
  const [resultForm, setResultForm] = useState({
    // Analysis results
    valeur_numerique: '',
    valeur_texte: '',
    unite: '',
    valeur_normale_min: '',
    valeur_normale_max: '',
    interpretation: '',
    est_normal: null,
    est_critique: false,
    notes_techniques: '',
    
    // Imaging results
    findings: '',
    impression: '',
    conclusion: '',
    technique_used: '',
    contrast_used: false,
    contrast_type: '',
    
    // Common fields
    technician_notes: '',
    quality_control_passed: true,
    validation_required: false,
    imageFiles: []
  });

  useEffect(() => {
    fetchPendingTests();
  }, []);

  const fetchPendingTests = async () => {
    try {
      setLoading(true);
      const response = await laboratoryService.getPendingWork();
      
      // Combine both analysis and imaging requests
      const analysisRequests = (response.pendingTests || []).map(test => ({
        ...test,
        request_type: 'analysis',
        test_name: test.test_name || test.nom,
        doctor_name: test.medecin_demandeur,
        patient_cne: test.CNE
      }));
      
      const imagingRequests = (response.pendingImaging || []).map(imaging => ({
        ...imaging,
        request_type: 'imaging',
        test_name: imaging.imaging_type || imaging.nom,
        doctor_name: imaging.medecin_demandeur,
        patient_cne: imaging.CNE
      }));
      
      // Filter for requests that are ready for results (in_progress or scheduled)
      const allRequests = [...analysisRequests, ...imagingRequests];
      const testsReadyForResults = allRequests.filter(
        test => test.request_status === 'in_progress' || 
                test.request_status === 'scheduled' || 
                test.status === 'in_progress'
      );
      
      setPendingTests(testsReadyForResults);
    } catch (error) {
      console.error('Error fetching pending tests:', error);
      onError(error.message || 'Erreur lors du chargement des tests en cours');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultEntry = (testRequest) => {
    // Reset form
    setResultForm({
      valeur_numerique: '',
      valeur_texte: '',
      unite: '',
      valeur_normale_min: '',
      valeur_normale_max: '',
      interpretation: '',
      est_normal: null,
      est_critique: false,
      notes_techniques: '',
      findings: '',
      impression: '',
      conclusion: '',
      technique_used: '',
      contrast_used: false,
      contrast_type: '',
      technician_notes: '',
      quality_control_passed: true,
      validation_required: false,
      imageFiles: []
    });
    
    setResultDialog({ open: true, testRequest });
  };

  const handleSaveResults = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const testRequest = resultDialog.testRequest;
      
      // Validate required fields
      const isAnalysis = testRequest.request_type === 'analysis';
      if (isAnalysis) {
        if (!resultForm.valeur_numerique && !resultForm.valeur_texte) {
          throw new Error('Veuillez saisir au moins une valeur de résultat');
        }
      } else {
        // For imaging, either findings/impression OR image files are required
        if (!resultForm.findings && !resultForm.impression && (!resultForm.imageFiles || resultForm.imageFiles.length === 0)) {
          throw new Error('Veuillez saisir au moins les observations/impression ou télécharger des images');
        }
      }
      
      // For imaging results, upload files first if any
      let uploadedImageUrls = '';
      if (!isAnalysis && resultForm.imageFiles && resultForm.imageFiles.length > 0) {
        try {
          const uploadResponse = await laboratoryService.uploadImagingFiles(testRequest.id, resultForm.imageFiles);
          uploadedImageUrls = uploadResponse.uploaded_files ? uploadResponse.uploaded_files.join(',') : '';
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          // Continue with results upload even if image upload fails
          onError('Attention: Échec du téléchargement des images, mais les résultats seront sauvegardés');
        }
      }
      
      const endpoint = isAnalysis 
        ? `/laboratory/test-requests/${testRequest.id}/results`
        : `/laboratory/imaging-requests/${testRequest.id}/results`;
      
      const payload = isAnalysis ? {
        valeur_numerique: resultForm.valeur_numerique || null,
        valeur_texte: resultForm.valeur_texte || null,
        unite: resultForm.unite || null,
        valeur_normale_min: resultForm.valeur_normale_min || null,
        valeur_normale_max: resultForm.valeur_normale_max || null,
        interpretation: resultForm.interpretation || null,
        est_normal: resultForm.est_normal,
        est_critique: resultForm.est_critique,
        notes_techniques: resultForm.notes_techniques || null,
        technician_notes: resultForm.technician_notes || null,
        quality_control_passed: resultForm.quality_control_passed,
        validation_required: resultForm.validation_required
      } : {
        interpretation: resultForm.findings || null,
        conclusion: resultForm.conclusion || null,
        image_files: uploadedImageUrls ? [uploadedImageUrls] : [],
        technician_notes: resultForm.technician_notes || null,
        quality_control_passed: resultForm.quality_control_passed,
        validation_required: resultForm.validation_required
      };
      
      await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const successMessage = isAnalysis 
        ? 'Résultats d\'analyse sauvegardés avec succès'
        : `Résultats d'imagerie sauvegardés avec succès${uploadedImageUrls ? ' avec images' : ''}`;
      
      onSuccess(successMessage);
      setResultDialog({ open: false, testRequest: null });
      fetchPendingTests();
      onRefresh();
    } catch (error) {
      console.error('Error saving results:', error);
      onError(error.response?.data?.message || error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getStatusChip = (testRequest) => {
    const status = testRequest.request_status || testRequest.status;
    const statusConfig = {
      'in_progress': { label: 'En cours', color: 'info', icon: <Science /> },
      'completed': { label: 'Terminée', color: 'success', icon: <CheckCircle /> },
      'validated': { label: 'Validée', color: 'success', icon: <CheckCircle /> }
    };
    
    const config = statusConfig[status] || { label: status, color: 'default', icon: <Schedule /> };
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} />;
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = {
      'urgent': { label: 'Urgent', color: 'error' },
      'stat': { label: 'STAT', color: 'error' },
      'emergency': { label: 'Urgence', color: 'error' },
      'normal': { label: 'Normal', color: 'default' },
      'routine': { label: 'Routine', color: 'default' }
    };
    
    const config = priorityConfig[priority] || { label: priority, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const isAnalysis = (testRequest) => {
    if (!testRequest) return true; // Default to analysis if testRequest is null/undefined
    return testRequest.request_type === 'analysis';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des tests en cours...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Saisie des Résultats ({pendingTests.length})
        </Typography>
      </Box>

      {pendingTests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" color="success.main">
              Aucun test en attente de résultats
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Tous les tests assignés ont été traités.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Test/Examen</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médecin</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priorité</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingTests.map((testRequest) => (
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
                          CIN: {testRequest.patient_cne}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {isAnalysis(testRequest) ? (
                        <Science sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      ) : (
                        <MedicalServices sx={{ mr: 1, color: 'secondary.main', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {testRequest.test_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={isAnalysis(testRequest) ? 'Analyse' : 'Imagerie'} 
                      color={isAnalysis(testRequest) ? 'primary' : 'secondary'} 
                      size="small" 
                    />
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
                    {getPriorityChip(testRequest.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(testRequest)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Voir détails">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Saisir les résultats">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleOpenResultEntry(testRequest)}
                        >
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Result Entry Dialog */}
      <Dialog 
        open={resultDialog.open} 
        onClose={() => setResultDialog({ open: false, testRequest: null })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Saisie des Résultats - {resultDialog.testRequest?.test_name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Patient Info */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Patient:</strong> {resultDialog.testRequest?.patient_name} (CIN: {resultDialog.testRequest?.patient_cne})<br/>
                <strong>Médecin prescripteur:</strong> Dr. {resultDialog.testRequest?.doctor_name}<br/>
                <strong>Indication clinique:</strong> {resultDialog.testRequest?.clinical_indication || 'Non spécifiée'}
              </Typography>
            </Alert>
            
            <Grid container spacing={3}>
              {isAnalysis(resultDialog.testRequest) ? (
                // Analysis Results Form
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valeur numérique"
                      type="number"
                      value={resultForm.valeur_numerique}
                      onChange={(e) => setResultForm(prev => ({ ...prev, valeur_numerique: e.target.value }))}
                      placeholder="Résultat numérique"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Unité"
                      value={resultForm.unite}
                      onChange={(e) => setResultForm(prev => ({ ...prev, unite: e.target.value }))}
                      placeholder="mg/dl, g/l, etc."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Valeur textuelle"
                      value={resultForm.valeur_texte}
                      onChange={(e) => setResultForm(prev => ({ ...prev, valeur_texte: e.target.value }))}
                      multiline
                      rows={2}
                      placeholder="Résultat sous forme de texte"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valeur normale min"
                      type="number"
                      value={resultForm.valeur_normale_min}
                      onChange={(e) => setResultForm(prev => ({ ...prev, valeur_normale_min: e.target.value }))}
                      placeholder="Limite inférieure"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valeur normale max"
                      type="number"
                      value={resultForm.valeur_normale_max}
                      onChange={(e) => setResultForm(prev => ({ ...prev, valeur_normale_max: e.target.value }))}
                      placeholder="Limite supérieure"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Statut du résultat</InputLabel>
                      <Select
                        value={resultForm.est_normal === null ? '' : resultForm.est_normal.toString()}
                        onChange={(e) => {
                          const value = e.target.value === '' ? null : e.target.value === 'true';
                          setResultForm(prev => ({ ...prev, est_normal: value }));
                        }}
                        label="Statut du résultat"
                      >
                        <MenuItem value="">En attente d'interprétation</MenuItem>
                        <MenuItem value="true">Normal</MenuItem>
                        <MenuItem value="false">Anormal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={resultForm.est_critique}
                          onChange={(e) => setResultForm(prev => ({ ...prev, est_critique: e.target.checked }))}
                        />
                      }
                      label="Résultat critique (nécessite une attention immédiate)"
                    />
                  </Grid>
                </>
              ) : (
                // Imaging Results Form
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Observations"
                      value={resultForm.findings}
                      onChange={(e) => setResultForm(prev => ({ ...prev, findings: e.target.value }))}
                      multiline
                      rows={4}
                      placeholder="Description détaillée des observations..."
                      helperText="Obligatoire si aucune image n'est téléchargée"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Impression"
                      value={resultForm.impression}
                      onChange={(e) => setResultForm(prev => ({ ...prev, impression: e.target.value }))}
                      multiline
                      rows={3}
                      placeholder="Impression diagnostique..."
                      helperText="Obligatoire si aucune image n'est téléchargée"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Conclusion"
                      value={resultForm.conclusion}
                      onChange={(e) => setResultForm(prev => ({ ...prev, conclusion: e.target.value }))}
                      multiline
                      rows={2}
                      placeholder="Conclusion et recommandations..."
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Technique utilisée"
                      value={resultForm.technique_used}
                      onChange={(e) => setResultForm(prev => ({ ...prev, technique_used: e.target.value }))}
                      placeholder="Technique d'imagerie utilisée"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={resultForm.contrast_used}
                          onChange={(e) => setResultForm(prev => ({ ...prev, contrast_used: e.target.checked }))}
                        />
                      }
                      label="Produit de contraste utilisé"
                    />
                  </Grid>
                  {resultForm.contrast_used && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Type de produit de contraste"
                        value={resultForm.contrast_type}
                        onChange={(e) => setResultForm(prev => ({ ...prev, contrast_type: e.target.value }))}
                        placeholder="Type de contraste utilisé"
                      />
                    </Grid>
                  )}
                  
                  {/* Image Upload Section for Imaging Results */}
                  <Grid item xs={12}>
                    <Card sx={{ p: 2, backgroundColor: 'rgba(25, 118, 210, 0.04)', border: '1px dashed #1976d2' }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <MedicalServices sx={{ mr: 1 }} />
                        Images d'Imagerie
                        <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                          (Optionnel si observations/impression sont remplies)
                        </Typography>
                      </Typography>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        onChange={(e) => setResultForm(prev => ({ ...prev, imageFiles: Array.from(e.target.files) }))}
                        style={{ display: 'none' }}
                        id="imaging-files-input"
                      />
                      <label htmlFor="imaging-files-input">
                        <Button 
                          variant="contained" 
                          component="span" 
                          startIcon={<CloudUpload />}
                          sx={{ mb: 2 }}
                          size="large"
                        >
                          Télécharger des Images/PDF
                        </Button>
                      </label>
                      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                        Formats acceptés: JPEG, PNG, GIF, WebP, PDF (max 10MB par fichier, 10 fichiers max)
                      </Typography>
                      {resultForm.imageFiles && resultForm.imageFiles.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 'medium' }}>
                            {resultForm.imageFiles.length} fichier(s) sélectionné(s):
                          </Typography>
                          {resultForm.imageFiles.map((file, index) => (
                            <Chip
                              key={index}
                              label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                              color="primary"
                              variant="outlined"
                              onDelete={() => {
                                const newFiles = [...resultForm.imageFiles];
                                newFiles.splice(index, 1);
                                setResultForm(prev => ({ ...prev, imageFiles: newFiles }));
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Card>
                  </Grid>
                </>
              )}
              
              {/* Common fields */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interprétation/Notes techniques"
                  value={isAnalysis(resultDialog.testRequest) ? resultForm.interpretation : resultForm.technician_notes}
                  onChange={(e) => setResultForm(prev => ({ 
                    ...prev, 
                    [isAnalysis(resultDialog.testRequest) ? 'interpretation' : 'technician_notes']: e.target.value 
                  }))}
                  multiline
                  rows={3}
                  placeholder="Interprétation des résultats, notes techniques..."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={resultForm.quality_control_passed}
                      onChange={(e) => setResultForm(prev => ({ ...prev, quality_control_passed: e.target.checked }))}
                    />
                  }
                  label="Contrôle qualité validé"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={resultForm.validation_required}
                      onChange={(e) => setResultForm(prev => ({ ...prev, validation_required: e.target.checked }))}
                    />
                  }
                  label="Validation médicale requise"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setResultDialog({ open: false, testRequest: null })}
            disabled={saving}
            startIcon={<Cancel />}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveResults}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            sx={{ fontWeight: 'bold' }}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder les Résultats'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResultEntryTab; 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import doctorService from '../../services/doctorService';
import { formatDateTime } from '../../utils/dateUtils';

const ImagingResultsViewer = ({ imagingResult, onSuccess, onError }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteDialog, setNoteDialog] = useState({ open: false, mode: 'add', note: null });
  const [imageDialog, setImageDialog] = useState({ open: false, imageUrl: '' });
  const [saving, setSaving] = useState(false);
  
  const [noteForm, setNoteForm] = useState({
    note_content: '',
    note_type: 'observation',
    is_important: false,
    is_private: false
  });

  useEffect(() => {
    if (imagingResult?.id) {
      fetchNotes();
    }
  }, [imagingResult]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getImagingNotes(imagingResult.id);
      setNotes(response.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      onError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
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
      setSaving(true);
      
      if (!noteForm.note_content.trim()) {
        onError('Le contenu de la note est obligatoire');
        return;
      }

      if (noteDialog.mode === 'edit' && noteDialog.note) {
        await doctorService.updateImagingNote(imagingResult.id, noteDialog.note.id, noteForm);
        onSuccess('Note modifiée avec succès');
      } else {
        await doctorService.addImagingNote(imagingResult.id, noteForm);
        onSuccess('Note ajoutée avec succès');
      }

      setNoteDialog({ open: false, mode: 'add', note: null });
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      onError(error.message || 'Erreur lors de la sauvegarde de la note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        await doctorService.deleteImagingNote(imagingResult.id, noteId);
        onSuccess('Note supprimée avec succès');
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        onError('Erreur lors de la suppression de la note');
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

  const getImageUrls = () => {
    if (!imagingResult?.image_urls) return [];
    return imagingResult.image_urls.split(',').filter(url => url.trim());
  };

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleImageClick = (imageUrl) => {
    setImageDialog({ open: true, imageUrl });
  };

  if (!imagingResult) {
    return (
      <Alert severity="info">
        Sélectionnez un résultat d'imagerie pour voir les détails et ajouter des notes
      </Alert>
    );
  }

  const imageUrls = getImageUrls();

  return (
    <Box>
      {/* Imaging Result Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {imagingResult.type_imagerie}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Date de prescription:</strong> {formatDateTime(imagingResult.date_prescription)}
              </Typography>
              {imagingResult.date_realisation && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Date de réalisation:</strong> {formatDateTime(imagingResult.date_realisation)}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Prescrit par:</strong> Dr. {imagingResult.prescripteur_prenom} {imagingResult.prescripteur_nom}
              </Typography>
              {imagingResult.institution_nom && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Institution:</strong> {imagingResult.institution_nom}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {imagingResult.interpretation && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Interprétation:
                  </Typography>
                  <Typography variant="body2">
                    {imagingResult.interpretation}
                  </Typography>
                </Box>
              )}
              
              {imagingResult.conclusion && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Conclusion:
                  </Typography>
                  <Typography variant="body2">
                    {imagingResult.conclusion}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Images Section */}
          {imageUrls.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Images ({imageUrls.length}):
              </Typography>
              <ImageList sx={{ width: '100%', height: 200 }} cols={4} rowHeight={150}>
                {imageUrls.map((url, index) => (
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
                        <PdfIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                      </Box>
                    )}
                    <ImageListItemBar
                      title={`Fichier ${index + 1}`}
                      actionIcon={
                        <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                          <ViewIcon />
                        </IconButton>
                      }
                    />
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
              Notes Médicales ({notes.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenNoteDialog('add')}
            >
              Ajouter une Note
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : notes.length === 0 ? (
            <Alert severity="info">
              Aucune note médicale pour ce résultat d'imagerie
            </Alert>
          ) : (
            <List>
              {notes.map((note, index) => (
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
                            <WarningIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(note.created_at)} - Dr. {note.medecin_prenom} {note.medecin_nom}
                            {note.medecin_specialite && ` (${note.medecin_specialite})`}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {note.note_content}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleOpenNoteDialog('edit', note)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteNote(note.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < notes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Note Dialog */}
      <Dialog
        open={noteDialog.open}
        onClose={() => setNoteDialog({ open: false, mode: 'add', note: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {noteDialog.mode === 'edit' ? 'Modifier la Note' : 'Ajouter une Note'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenu de la note *"
                value={noteForm.note_content}
                onChange={(e) => setNoteForm(prev => ({ ...prev, note_content: e.target.value }))}
                multiline
                rows={4}
                placeholder="Rédigez votre note médicale..."
              />
            </Grid>
            
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteForm.is_important}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, is_important: e.target.checked }))}
                  />
                }
                label="Note importante"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={noteForm.is_private}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, is_private: e.target.checked }))}
                  />
                }
                label="Note privée (visible uniquement par moi)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNoteDialog({ open: false, mode: 'add', note: null })}
            startIcon={<CancelIcon />}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSaveNote}
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={saving || !noteForm.note_content.trim()}
          >
            {saving ? 'Sauvegarde...' : (noteDialog.mode === 'edit' ? 'Modifier' : 'Ajouter')}
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
        <DialogTitle>
          Visualisation de l'Image
        </DialogTitle>
        <DialogContent>
          {imageDialog.imageUrl && (
            isImageFile(imageDialog.imageUrl) ? (
              <img
                src={imageDialog.imageUrl}
                alt="Imagerie médicale"
                style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', p: 4 }}>
                <PdfIcon sx={{ fontSize: 64, color: 'grey.500', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Fichier PDF
                </Typography>
                <Button
                  variant="contained"
                  href={imageDialog.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvrir le PDF
                </Button>
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialog({ open: false, imageUrl: '' })}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImagingResultsViewer; 
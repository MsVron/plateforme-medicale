import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Paper, Typography, Tabs, Tab, CircularProgress, Alert,
  Button, Divider, Grid, Card, CardContent, CardHeader, List,
  ListItem, ListItemText, Chip, IconButton, Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  History as HistoryIcon,
  Medication as MedicationIcon,
  NoteAdd as NoteIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Image as ImageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  DateRange as DateIcon,
  Bloodtype as BloodIcon,
  Height as HeightIcon,
  Scale as WeightIcon
} from '@mui/icons-material';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-record-tabpanel-${index}`}
      aria-labelledby={`medical-record-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientMedicalRecord = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchMedicalRecord();
  }, [patientId]);

  const fetchMedicalRecord = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/medecin/patients/${patientId}/medical-record`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicalRecord(response.data);
    } catch (err) {
      console.error('Error fetching medical record:', err);
      setError('Impossible de récupérer le dossier médical. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!medicalRecord) {
    return (
      <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
        Aucune information disponible pour ce patient.
      </Alert>
    );
  }

  const { patient, allergies, antecedents, traitements, consultations, constantes, analyses, imageries, documents, notes, reminders, measurements } = medicalRecord;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Patient Info Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5">
                {patient.prenom} {patient.nom}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {calculateAge(patient.date_naissance)} ans • {patient.sexe === 'M' ? 'Homme' : patient.sexe === 'F' ? 'Femme' : 'Autre'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/medecin/patients/${patientId}/consultation/new`)}
          >
            Nouvelle consultation
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date de naissance
            </Typography>
            <Typography variant="body1">
              {formatDate(patient.date_naissance)}
            </Typography>
          </Grid>
          
          {/* Display latest vital signs if available */}
          {constantes && constantes.length > 0 && (
            <>
              <Grid item xs={6} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HeightIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {constantes[0].taille ? `${constantes[0].taille} cm` : 'Taille: N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WeightIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {constantes[0].poids ? `${constantes[0].poids} kg` : 'Poids: N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BloodIcon sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="body2">
                    {constantes[0].tension_arterielle_systolique && constantes[0].tension_arterielle_diastolique 
                      ? `${constantes[0].tension_arterielle_systolique}/${constantes[0].tension_arterielle_diastolique} mmHg` 
                      : 'TA: N/A'}
                  </Typography>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Medical Record Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="medical record tabs"
        >
          <Tab icon={<MedicalIcon />} label="Consultations" />
          <Tab icon={<HistoryIcon />} label="Antécédents" />
          <Tab icon={<MedicationIcon />} label="Traitements" />
          <Tab icon={<NoteIcon />} label="Notes" />
          <Tab icon={<ScienceIcon />} label="Analyses" />
          <Tab icon={<ImageIcon />} label="Imagerie" />
          <Tab icon={<AssignmentIcon />} label="Documents" />
          <Tab icon={<DateIcon />} label="Suivi" />
        </Tabs>

        {/* Consultations Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Consultations</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/consultation/new`)}
            >
              Ajouter une consultation
            </Button>
          </Box>
          
          {consultations && consultations.length > 0 ? (
            <Grid container spacing={3}>
              {consultations.map((consultation) => (
                <Grid item xs={12} md={6} key={consultation.id}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={formatDate(consultation.date_consultation)}
                      subheader={`Dr. ${consultation.medecin_prenom} ${consultation.medecin_nom}`}
                      action={
                        <IconButton 
                          onClick={() => navigate(`/medecin/consultations/${consultation.id}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                      }
                    />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {consultation.motif}
                      </Typography>
                      {consultation.diagnostic && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Diagnostic:</strong> {consultation.diagnostic}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                        <Chip 
                          size="small" 
                          color={consultation.est_complete ? "success" : "warning"}
                          label={consultation.est_complete ? "Complète" : "En cours"}
                        />
                        {consultation.is_teleconsultation && (
                          <Chip size="small" label="Téléconsultation" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucune consultation enregistrée.</Alert>
          )}
        </TabPanel>

        {/* Medical History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Antécédents médicaux</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/medical-history/new`)}
            >
              Ajouter un antécédent
            </Button>
          </Box>
          
          {/* Allergies Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Allergies
          </Typography>
          
          {allergies && allergies.length > 0 ? (
            <Grid container spacing={2}>
              {allergies.map((allergie) => (
                <Grid item xs={12} sm={6} md={4} key={`${allergie.patient_id}-${allergie.allergie_id}`}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="error">
                        {allergie.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sévérité: {allergie.severite}
                      </Typography>
                      {allergie.notes && (
                        <Typography variant="body2">
                          {allergie.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>Aucune allergie enregistrée.</Alert>
          )}
          
          {/* Medical History Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Antécédents
          </Typography>
          
          {antecedents && antecedents.length > 0 ? (
            <Grid container spacing={2}>
              {antecedents.map((antecedent) => (
                <Grid item xs={12} sm={6} md={4} key={antecedent.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {antecedent.description}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={antecedent.type} 
                          color={
                            antecedent.type === 'medical' ? 'primary' : 
                            antecedent.type === 'chirurgical' ? 'secondary' : 
                            'default'
                          }
                        />
                      </Box>
                      
                      {(antecedent.date_debut || antecedent.date_fin) && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {antecedent.date_debut && `Début: ${formatDate(antecedent.date_debut)}`}
                          {antecedent.date_debut && antecedent.date_fin && ' - '}
                          {antecedent.date_fin && `Fin: ${formatDate(antecedent.date_fin)}`}
                        </Typography>
                      )}
                      
                      {antecedent.est_chronique && (
                        <Chip size="small" label="Chronique" color="warning" sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucun antécédent médical enregistré.</Alert>
          )}
        </TabPanel>

        {/* Treatments Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Traitements en cours</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/treatment/new`)}
            >
              Ajouter un traitement
            </Button>
          </Box>
          
          {traitements && traitements.length > 0 ? (
            <Grid container spacing={2}>
              {traitements.map((traitement) => (
                <Grid item xs={12} sm={6} md={4} key={traitement.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">
                        {traitement.nom_commercial} ({traitement.nom_molecule})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {traitement.posologie} - {traitement.forme}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Début: {formatDate(traitement.date_debut)}
                        {!traitement.est_permanent && traitement.date_fin && (
                          <> - Fin: {formatDate(traitement.date_fin)}</>
                        )}
                      </Typography>
                      {traitement.est_permanent && (
                        <Chip size="small" label="Traitement permanent" color="primary" sx={{ mt: 1 }} />
                      )}
                      {traitement.rappel_prise && (
                        <Chip size="small" label="Rappel activé" color="info" sx={{ mt: 1, ml: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucun traitement en cours.</Alert>
          )}
        </TabPanel>

        {/* Notes Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Notes</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/note/new`)}
            >
              Ajouter une note
            </Button>
          </Box>
          
          {notes && notes.length > 0 ? (
            <Grid container spacing={2}>
              {notes.map((note) => (
                <Grid item xs={12} sm={6} key={note.id}>
                  <Card variant="outlined" sx={{ bgcolor: note.est_important ? '#fff8e1' : 'inherit' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.date_creation).toLocaleDateString('fr-FR')} - Dr. {note.medecin_prenom} {note.medecin_nom}
                        </Typography>
                        {note.est_important && (
                          <Chip size="small" label="Important" color="warning" />
                        )}
                      </Box>
                      <Typography variant="body1">
                        {note.contenu}
                      </Typography>
                      {note.categorie !== 'general' && (
                        <Chip size="small" label={note.categorie} sx={{ mt: 1 }} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucune note enregistrée.</Alert>
          )}
        </TabPanel>

        {/* Analysis Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Analyses médicales</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/analysis/new`)}
            >
              Ajouter une analyse
            </Button>
          </Box>
          
          {analyses && analyses.length > 0 ? (
            <List>
              {analyses.map((analyse) => (
                <ListItem 
                  key={analyse.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => navigate(`/medecin/analyses/${analyse.id}`)}>
                      <ViewIcon />
                    </IconButton>
                  }
                  divider
                >
                  <ListItemText
                    primary={analyse.type_analyse}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Prescrit le {formatDate(analyse.date_prescription)} par Dr. {analyse.prescripteur_prenom} {analyse.prescripteur_nom}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          {analyse.date_realisation ? `Réalisé le ${formatDate(analyse.date_realisation)}` : 'Non réalisé'}
                        </Typography>
                        <br />
                        <Chip 
                          size="small" 
                          label={analyse.est_normal ? "Normal" : "Anormal"} 
                          color={analyse.est_normal ? "success" : "error"}
                          sx={{ mt: 1 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">Aucune analyse médicale enregistrée.</Alert>
          )}
          
          {/* Measurements Section */}
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Mesures
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Dernières mesures enregistrées
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/measurement/new`)}
            >
              Ajouter une mesure
            </Button>
          </Box>
          
          {measurements && measurements.length > 0 ? (
            <Grid container spacing={2}>
              {measurements.map((measurement) => (
                <Grid item xs={12} sm={6} md={4} key={measurement.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2">
                        {measurement.type_mesure}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {measurement.valeur} {measurement.unite}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(measurement.date_mesure)}
                      </Typography>
                      {measurement.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {measurement.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucune mesure enregistrée.</Alert>
          )}
        </TabPanel>

        {/* Imaging Tab */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Imagerie médicale</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/imaging/new`)}
            >
              Ajouter une imagerie
            </Button>
          </Box>
          
          {imageries && imageries.length > 0 ? (
            <List>
              {imageries.map((imagerie) => (
                <ListItem 
                  key={imagerie.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => navigate(`/medecin/imageries/${imagerie.id}`)}>
                      <ViewIcon />
                    </IconButton>
                  }
                  divider
                >
                  <ListItemText
                    primary={imagerie.type_imagerie}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          Prescrit le {formatDate(imagerie.date_prescription)} par Dr. {imagerie.prescripteur_prenom} {imagerie.prescripteur_nom}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span">
                          {imagerie.date_realisation ? `Réalisé le ${formatDate(imagerie.date_realisation)}` : 'Non réalisé'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">Aucune imagerie médicale enregistrée.</Alert>
          )}
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Documents médicaux</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/document/new`)}
            >
              Ajouter un document
            </Button>
          </Box>
          
          {documents && documents.length > 0 ? (
            <Grid container spacing={2}>
              {documents.map((document) => (
                <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">
                        {document.titre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {formatDate(document.date_creation)} - Dr. {document.medecin_prenom} {document.medecin_nom}
                      </Typography>
                      {document.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {document.description}
                        </Typography>
                      )}
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Chip 
                          size="small" 
                          label={document.type} 
                        />
                        <Button 
                          size="small" 
                          variant="outlined"
                          href={document.document_url}
                          target="_blank"
                        >
                          Voir
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucun document médical enregistré.</Alert>
          )}
        </TabPanel>

        {/* Follow-up Tab */}
        <TabPanel value={tabValue} index={7}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Suivi du patient</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/medecin/patients/${patientId}/reminder/new`)}
            >
              Ajouter un rappel
            </Button>
          </Box>
          
          {reminders && reminders.length > 0 ? (
            <Grid container spacing={2}>
              {reminders.map((reminder) => (
                <Grid item xs={12} sm={6} key={reminder.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      bgcolor: new Date(reminder.date_rappel) < new Date() && !reminder.est_complete 
                        ? '#ffebee' 
                        : reminder.est_complete 
                          ? '#e8f5e9' 
                          : 'inherit' 
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {reminder.motif}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={reminder.est_complete ? "Complété" : "À faire"} 
                          color={reminder.est_complete ? "success" : "warning"}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Date prévue: {formatDate(reminder.date_rappel)}
                      </Typography>
                      {reminder.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {reminder.description}
                        </Typography>
                      )}
                      {!reminder.est_complete && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/medecin/reminders/${reminder.id}/complete`)}
                        >
                          Marquer comme complété
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">Aucun rappel de suivi enregistré.</Alert>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PatientMedicalRecord; 
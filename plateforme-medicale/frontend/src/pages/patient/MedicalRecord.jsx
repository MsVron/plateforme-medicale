import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import DiagnosisChatbot from '../../components/patient/DiagnosisChatbot';
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  History as HistoryIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  DateRange as DateIcon,
  Bloodtype as BloodIcon,
  Height as HeightIcon,
  Scale as WeightIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const MedicalRecord = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({});
  const [message, setMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    treatments: false,
    analyses: false,
    consultations: false,
    history: false,
    vitals: false
  });

  useEffect(() => {
    fetchMedicalRecord();
  }, []);

  const fetchMedicalRecord = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patient/medical-record', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMedicalRecord(data);
        setPersonalInfo({
          adresse: data.patient.adresse || '',
          ville: data.patient.ville || '',
          code_postal: data.patient.code_postal || '',
          pays: data.patient.pays || '',
          telephone: data.patient.telephone || '',
          email: data.patient.email || '',
          contact_urgence_nom: data.patient.contact_urgence_nom || '',
          contact_urgence_telephone: data.patient.contact_urgence_telephone || '',
          contact_urgence_relation: data.patient.contact_urgence_relation || '',
          profession: data.patient.profession || ''
        });
      } else {
        throw new Error('Failed to fetch medical record');
      }
    } catch (err) {
      console.error('Error fetching medical record:', err);
      setError('Impossible de charger votre dossier médical. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/patient/personal-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(personalInfo)
      });

      if (response.ok) {
        setMessage('Informations personnelles mises à jour avec succès');
        setEditingPersonalInfo(false);
        fetchMedicalRecord();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      setMessage('Erreur lors de la mise à jour');
    }
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  const getAnalysisStatus = (analysis) => {
    if (analysis.est_critique) {
      return <Chip label="Critique" color="error" size="small" />;
    } else if (analysis.est_normal === false) {
      return <Chip label="Anormal" color="warning" size="small" />;
    } else if (analysis.est_normal === true) {
      return <Chip label="Normal" color="success" size="small" />;
    }
    return <Chip label="En attente" variant="outlined" size="small" />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!medicalRecord) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Aucun dossier médical trouvé.
      </Alert>
    );
  }

  const { patient, allergies, antecedents, traitements, analyses, consultations, constantes } = medicalRecord;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon Dossier Médical
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {/* Personal Information Section */}
      <Accordion 
        expanded={expandedSections.personal} 
        onChange={() => handleSectionToggle('personal')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Informations Personnelles</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditingPersonalInfo(true)}
            >
              Modifier mes informations
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6">{patient.prenom} {patient.nom}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {calculateAge(patient.date_naissance)} ans
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.sexe === 'M' ? 'Masculin' : 'Féminin'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <DateIcon color="primary" />
                    <Typography variant="subtitle2">Informations générales</Typography>
                  </Stack>
                  <Typography variant="body2">CNE: {patient.CNE || 'Non renseigné'}</Typography>
                  <Typography variant="body2">
                    Né(e) le: {formatDate(patient.date_naissance)}
                  </Typography>
                  <Typography variant="body2">
                    Profession: {patient.profession || 'Non renseignée'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <PhoneIcon color="primary" />
                    <Typography variant="subtitle2">Contact</Typography>
                  </Stack>
                  <Typography variant="body2">
                    Tél: {patient.telephone || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2">
                    Email: {patient.email || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2">
                    Adresse: {patient.adresse || 'Non renseignée'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <BloodIcon color="primary" />
                    <Typography variant="subtitle2">Médical</Typography>
                  </Stack>
                  <Typography variant="body2">
                    Groupe sanguin: {patient.groupe_sanguin || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2">
                    Taille: {patient.taille_cm ? `${patient.taille_cm} cm` : 'Non renseignée'}
                  </Typography>
                  <Typography variant="body2">
                    Poids: {patient.poids_kg ? `${patient.poids_kg} kg` : 'Non renseigné'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Allergies */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Allergies
            </Typography>
            {allergies && allergies.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {allergies.map((allergie, index) => (
                  <Chip
                    key={index}
                    label={`${allergie.nom} (${allergie.severite})`}
                    color={allergie.severite === 'sévère' || allergie.severite === 'mortelle' ? 'error' : 'warning'}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">Aucune allergie connue</Typography>
            )}
          </Box>

          {/* Emergency Contact */}
          {patient.contact_urgence_nom && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Contact d'urgence</Typography>
              <Typography variant="body1">
                {patient.contact_urgence_nom} ({patient.contact_urgence_relation})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {patient.contact_urgence_telephone}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Current Treatments Section */}
      <Accordion 
        expanded={expandedSections.treatments} 
        onChange={() => handleSectionToggle('treatments')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicationIcon color="primary" />
            <Typography variant="h6">Traitements en cours</Typography>
            {traitements && (
              <Chip 
                label={traitements.length} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {traitements && traitements.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Médicament</TableCell>
                    <TableCell>Posologie</TableCell>
                    <TableCell>Date début</TableCell>
                    <TableCell>Date fin</TableCell>
                    <TableCell>Médecin prescripteur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {traitements.map((traitement, index) => (
                    <TableRow key={index}>
                      <TableCell>{traitement.nom_commercial}</TableCell>
                      <TableCell>{traitement.posologie}</TableCell>
                      <TableCell>{formatDate(traitement.date_debut)}</TableCell>
                      <TableCell>
                        {traitement.date_fin ? formatDate(traitement.date_fin) : 
                         traitement.est_permanent ? 'Permanent' : 'Non spécifié'}
                      </TableCell>
                      <TableCell>Dr. {traitement.medecin_nom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">Aucun traitement en cours</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Medical Analyses Section */}
      <Accordion 
        expanded={expandedSections.analyses} 
        onChange={() => handleSectionToggle('analyses')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScienceIcon color="primary" />
            <Typography variant="h6">Résultats d'analyses</Typography>
            {analyses && (
              <Chip 
                label={analyses.length} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {analyses && analyses.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Analyse</TableCell>
                    <TableCell>Valeur</TableCell>
                    <TableCell>Unité</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Médecin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analyses.map((analyse, index) => (
                    <TableRow key={index}>
                      <TableCell>{analyse.nom_analyse}</TableCell>
                      <TableCell>
                        {analyse.valeur_numerique || analyse.valeur_texte || 'Non disponible'}
                      </TableCell>
                      <TableCell>{analyse.unite || '-'}</TableCell>
                      <TableCell>{getAnalysisStatus(analyse)}</TableCell>
                      <TableCell>{formatDate(analyse.date_realisation)}</TableCell>
                      <TableCell>Dr. {analyse.medecin_nom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">Aucune analyse disponible</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Consultations History Section */}
      <Accordion 
        expanded={expandedSections.consultations} 
        onChange={() => handleSectionToggle('consultations')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon color="primary" />
            <Typography variant="h6">Historique des consultations</Typography>
            {consultations && (
              <Chip 
                label={consultations.length} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {consultations && consultations.length > 0 ? (
            <Stack spacing={2}>
              {consultations.map((consultation, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">{formatDate(consultation.date_consultation)}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Médecin</Typography>
                        <Typography variant="body1">Dr. {consultation.medecin_nom}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Motif</Typography>
                        <Typography variant="body1">{consultation.motif}</Typography>
                      </Grid>
                      {consultation.diagnostic && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Diagnostic</Typography>
                          <Typography variant="body1">{consultation.diagnostic}</Typography>
                        </Grid>
                      )}
                      {consultation.conclusion && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Conclusion</Typography>
                          <Typography variant="body1">{consultation.conclusion}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">Aucune consultation enregistrée</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Medical History Section */}
      <Accordion 
        expanded={expandedSections.history} 
        onChange={() => handleSectionToggle('history')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6">Antécédents médicaux</Typography>
            {antecedents && (
              <Chip 
                label={antecedents.length} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {antecedents && antecedents.length > 0 ? (
            <Stack spacing={2}>
              {antecedents.map((antecedent, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                        <Chip 
                          label={antecedent.type} 
                          color={antecedent.type === 'medical' ? 'primary' : 
                                antecedent.type === 'chirurgical' ? 'secondary' : 'default'}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">{formatDate(antecedent.date_debut)}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                        <Typography variant="body1">{antecedent.description}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">Aucun antécédent médical enregistré</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Vital Signs Section */}
      <Accordion 
        expanded={expandedSections.vitals} 
        onChange={() => handleSectionToggle('vitals')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MedicalIcon color="primary" />
            <Typography variant="h6">Constantes vitales</Typography>
            {constantes && (
              <Chip 
                label={constantes.length} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {constantes && constantes.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Température (°C)</TableCell>
                    <TableCell>Tension (mmHg)</TableCell>
                    <TableCell>Pouls (/min)</TableCell>
                    <TableCell>Poids (kg)</TableCell>
                    <TableCell>Taille (cm)</TableCell>
                    <TableCell>IMC</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {constantes.map((constante, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(constante.date_mesure)}</TableCell>
                      <TableCell>{constante.temperature || '-'}</TableCell>
                      <TableCell>
                        {constante.tension_arterielle_systolique && constante.tension_arterielle_diastolique ? 
                          `${constante.tension_arterielle_systolique}/${constante.tension_arterielle_diastolique}` : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>{constante.frequence_cardiaque || '-'}</TableCell>
                      <TableCell>{constante.poids || '-'}</TableCell>
                      <TableCell>{constante.taille || '-'}</TableCell>
                      <TableCell>{constante.imc || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">Aucune constante vitale enregistrée</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Edit Personal Information Dialog */}
      <Dialog open={editingPersonalInfo} onClose={() => setEditingPersonalInfo(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier mes informations personnelles</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Vous ne pouvez modifier que vos informations de contact et personnelles. 
            Les données médicales ne peuvent être modifiées que par votre médecin.
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Adresse"
                value={personalInfo.adresse}
                onChange={(e) => setPersonalInfo({...personalInfo, adresse: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ville"
                value={personalInfo.ville}
                onChange={(e) => setPersonalInfo({...personalInfo, ville: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code postal"
                value={personalInfo.code_postal}
                onChange={(e) => setPersonalInfo({...personalInfo, code_postal: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Pays"
                value={personalInfo.pays}
                onChange={(e) => setPersonalInfo({...personalInfo, pays: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={personalInfo.telephone}
                onChange={(e) => setPersonalInfo({...personalInfo, telephone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Profession"
                value={personalInfo.profession}
                onChange={(e) => setPersonalInfo({...personalInfo, profession: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact d'urgence - Nom"
                value={personalInfo.contact_urgence_nom}
                onChange={(e) => setPersonalInfo({...personalInfo, contact_urgence_nom: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact d'urgence - Téléphone"
                value={personalInfo.contact_urgence_telephone}
                onChange={(e) => setPersonalInfo({...personalInfo, contact_urgence_telephone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact d'urgence - Relation"
                value={personalInfo.contact_urgence_relation}
                onChange={(e) => setPersonalInfo({...personalInfo, contact_urgence_relation: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingPersonalInfo(false)}>Annuler</Button>
          <Button onClick={handlePersonalInfoUpdate} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
      
      {/* AI Diagnosis Chatbot */}
      <DiagnosisChatbot />
    </Box>
  );
};

export default MedicalRecord; 
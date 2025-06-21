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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  MedicalServices,
  Add,
  Edit,
  Delete,
  Visibility,
  Schedule,
  Person,
  LocalHospital,
  AccessTime,
  CalendarToday,
  Refresh,
  ExpandMore,
  CheckCircle,
  Warning,
  Cancel
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import hospitalService from '../../services/hospitalService';

const SurgeryScheduleTab = ({ onSuccess, onError, onRefresh }) => {
  const [surgeries, setSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surgeryDialog, setSurgeryDialog] = useState({ open: false, surgery: null, mode: 'add' });
  const [viewDialog, setViewDialog] = useState({ open: false, surgery: null });
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [operatingRooms, setOperatingRooms] = useState([]);
  
  const [surgeryForm, setSurgeryForm] = useState({
    patient_id: '',
    primary_surgeon_id: '',
    assistant_surgeon_id: '',
    anesthesiologist_id: '',
    scheduled_date: new Date(),
    estimated_duration: 60,
    surgery_type: '',
    procedure_name: '',
    operating_room: '',
    priority: 'routine',
    pre_op_notes: '',
    special_requirements: '',
    equipment_needed: ''
  });

  const surgeryStatuses = [
    { value: 'scheduled', label: 'Programmée', color: '#2196f3' },
    { value: 'in_progress', label: 'En cours', color: '#ff9800' },
    { value: 'completed', label: 'Terminée', color: '#4caf50' },
    { value: 'cancelled', label: 'Annulée', color: '#f44336' },
    { value: 'postponed', label: 'Reportée', color: '#9c27b0' }
  ];

  const surgeryPriorities = [
    { value: 'emergency', label: 'Urgence', color: '#f44336' },
    { value: 'urgent', label: 'Urgent', color: '#ff9800' },
    { value: 'routine', label: 'Programmée', color: '#4caf50' },
    { value: 'elective', label: 'Électif', color: '#2196f3' }
  ];

  const surgeryTypes = [
    'Chirurgie générale',
    'Chirurgie orthopédique',
    'Chirurgie cardiaque',
    'Neurochirurgie',
    'Chirurgie plastique',
    'Chirurgie urologique',
    'Chirurgie gynécologique',
    'Chirurgie ophtalmologique',
    'Chirurgie ORL',
    'Chirurgie thoracique',
    'Chirurgie vasculaire',
    'Chirurgie pédiatrique'
  ];

  useEffect(() => {
    fetchSurgeries();
    fetchDoctors();
    fetchPatients();
    fetchOperatingRooms();
  }, []);

  const fetchSurgeries = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getSurgeries();
      setSurgeries(response.surgeries || []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      onError('Erreur lors du chargement des chirurgies');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await hospitalService.getHospitalDoctors();
      setDoctors(response.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await hospitalService.getHospitalPatients();
      setPatients(response.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchOperatingRooms = async () => {
    try {
      const response = await hospitalService.getOperatingRooms();
      setOperatingRooms(response.rooms || []);
    } catch (error) {
      console.error('Error fetching operating rooms:', error);
    }
  };

  const handleAddSurgery = () => {
    setSurgeryForm({
      patient_id: '',
      primary_surgeon_id: '',
      assistant_surgeon_id: '',
      anesthesiologist_id: '',
      scheduled_date: new Date(),
      estimated_duration: 60,
      surgery_type: '',
      procedure_name: '',
      operating_room: '',
      priority: 'routine',
      pre_op_notes: '',
      special_requirements: '',
      equipment_needed: ''
    });
    setSurgeryDialog({ open: true, surgery: null, mode: 'add' });
  };

  const handleEditSurgery = (surgery) => {
    setSurgeryForm({
      patient_id: surgery.patient_id,
      primary_surgeon_id: surgery.primary_surgeon_id,
      assistant_surgeon_id: surgery.assistant_surgeon_id || '',
      anesthesiologist_id: surgery.anesthesiologist_id || '',
      scheduled_date: new Date(surgery.scheduled_date),
      estimated_duration: surgery.estimated_duration,
      surgery_type: surgery.surgery_type,
      procedure_name: surgery.procedure_name,
      operating_room: surgery.operating_room,
      priority: surgery.priority,
      pre_op_notes: surgery.pre_op_notes || '',
      special_requirements: surgery.special_requirements || '',
      equipment_needed: surgery.equipment_needed || ''
    });
    setSurgeryDialog({ open: true, surgery: surgery, mode: 'edit' });
  };

  const handleSaveSurgery = async () => {
    try {
      if (surgeryDialog.mode === 'add') {
        await hospitalService.createSurgery(surgeryForm);
        onSuccess('Chirurgie programmée avec succès');
      } else {
        await hospitalService.updateSurgery(surgeryDialog.surgery.id, surgeryForm);
        onSuccess('Chirurgie mise à jour avec succès');
      }
      setSurgeryDialog({ open: false, surgery: null, mode: 'add' });
      fetchSurgeries();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleViewSurgery = (surgery) => {
    setViewDialog({ open: true, surgery: surgery });
  };

  const handleUpdateStatus = async (surgeryId, newStatus) => {
    try {
      await hospitalService.updateSurgeryStatus(surgeryId, newStatus);
      onSuccess('Statut mis à jour avec succès');
      fetchSurgeries();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = surgeryStatuses.find(s => s.value === status);
    return <Chip label={statusConfig.label} size="small" sx={{ backgroundColor: statusConfig.color, color: 'white' }} />;
  };

  const getPriorityChip = (priority) => {
    const priorityConfig = surgeryPriorities.find(p => p.value === priority);
    return <Chip label={priorityConfig.label} size="small" sx={{ backgroundColor: priorityConfig.color, color: 'white' }} />;
  };

  const filteredSurgeries = surgeries.filter(surgery => {
    const statusMatch = statusFilter === 'all' || surgery.status === statusFilter;
    const dateMatch = dateFilter === 'all' || 
      (dateFilter === 'today' && new Date(surgery.scheduled_date).toDateString() === new Date().toDateString()) ||
      (dateFilter === 'week' && new Date(surgery.scheduled_date) >= new Date() && new Date(surgery.scheduled_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    
    return statusMatch && dateMatch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des chirurgies programmées...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Chirurgies Programmées
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddSurgery}
              sx={{ bgcolor: 'primary.main' }}
            >
              Programmer une Chirurgie
            </Button>
            <Tooltip title="Actualiser">
              <IconButton onClick={fetchSurgeries} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Surgery Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {surgeryStatuses.map((status) => {
            const statusSurgeries = surgeries.filter(s => s.status === status.value);
            return (
              <Grid item xs={12} sm={6} md={2.4} key={status.value}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <MedicalServices sx={{ color: status.color, fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: status.color }}>
                      {statusSurgeries.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {status.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Statut"
                >
                  <MenuItem value="all">Tous les statuts</MenuItem>
                  {surgeryStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Période</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Période"
                >
                  <MenuItem value="all">Toutes les dates</MenuItem>
                  <MenuItem value="today">Aujourd'hui</MenuItem>
                  <MenuItem value="week">Cette semaine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                {filteredSurgeries.length} chirurgie(s) trouvée(s)
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* Surgeries Table */}
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Procédure</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Chirurgien</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date/Heure</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Salle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priorité</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSurgeries.map((surgery) => (
                <TableRow key={surgery.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        {surgery.patient_name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {surgery.patient_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {surgery.patient_cne}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {surgery.procedure_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {surgery.surgery_type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Dr. {surgery.surgeon_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                      <Box>
                        <Typography variant="body2">
                          {new Date(surgery.scheduled_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(surgery.scheduled_date).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{surgery.operating_room}</Typography>
                  </TableCell>
                  <TableCell>
                    {getPriorityChip(surgery.priority)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(surgery.status)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Voir détails">
                        <IconButton size="small" onClick={() => handleViewSurgery(surgery)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {surgery.status === 'scheduled' && (
                        <Tooltip title="Modifier">
                          <IconButton size="small" onClick={() => handleEditSurgery(surgery)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                      {surgery.status === 'scheduled' && (
                        <Tooltip title="Marquer en cours">
                          <IconButton 
                            size="small" 
                            onClick={() => handleUpdateStatus(surgery.id, 'in_progress')}
                            color="warning"
                          >
                            <Schedule />
                          </IconButton>
                        </Tooltip>
                      )}
                      {surgery.status === 'in_progress' && (
                        <Tooltip title="Marquer terminée">
                          <IconButton 
                            size="small" 
                            onClick={() => handleUpdateStatus(surgery.id, 'completed')}
                            color="success"
                          >
                            <CheckCircle />
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

        {/* Add/Edit Surgery Dialog */}
        <Dialog open={surgeryDialog.open} onClose={() => setSurgeryDialog({ open: false, surgery: null, mode: 'add' })} maxWidth="md" fullWidth>
          <DialogTitle>
            {surgeryDialog.mode === 'add' ? 'Programmer une Chirurgie' : 'Modifier la Chirurgie'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    value={surgeryForm.patient_id}
                    onChange={(e) => setSurgeryForm(prev => ({ ...prev, patient_id: e.target.value }))}
                    label="Patient"
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.prenom} {patient.nom} - {patient.CNE}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Chirurgien Principal</InputLabel>
                  <Select
                    value={surgeryForm.primary_surgeon_id}
                    onChange={(e) => setSurgeryForm(prev => ({ ...prev, primary_surgeon_id: e.target.value }))}
                    label="Chirurgien Principal"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        Dr. {doctor.prenom} {doctor.nom} - {doctor.specialite}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de Chirurgie</InputLabel>
                  <Select
                    value={surgeryForm.surgery_type}
                    onChange={(e) => setSurgeryForm(prev => ({ ...prev, surgery_type: e.target.value }))}
                    label="Type de Chirurgie"
                  >
                    {surgeryTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom de la Procédure"
                  value={surgeryForm.procedure_name}
                  onChange={(e) => setSurgeryForm(prev => ({ ...prev, procedure_name: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Date et Heure"
                  value={surgeryForm.scheduled_date}
                  onChange={(newValue) => setSurgeryForm(prev => ({ ...prev, scheduled_date: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Durée Estimée (minutes)"
                  type="number"
                  value={surgeryForm.estimated_duration}
                  onChange={(e) => setSurgeryForm(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Salle d'Opération</InputLabel>
                  <Select
                    value={surgeryForm.operating_room}
                    onChange={(e) => setSurgeryForm(prev => ({ ...prev, operating_room: e.target.value }))}
                    label="Salle d'Opération"
                  >
                    {operatingRooms.map((room) => (
                      <MenuItem key={room.id} value={room.name}>{room.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priorité</InputLabel>
                  <Select
                    value={surgeryForm.priority}
                    onChange={(e) => setSurgeryForm(prev => ({ ...prev, priority: e.target.value }))}
                    label="Priorité"
                  >
                    {surgeryPriorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>{priority.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes Pré-opératoires"
                  value={surgeryForm.pre_op_notes}
                  onChange={(e) => setSurgeryForm(prev => ({ ...prev, pre_op_notes: e.target.value }))}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Équipements Nécessaires"
                  value={surgeryForm.equipment_needed}
                  onChange={(e) => setSurgeryForm(prev => ({ ...prev, equipment_needed: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSurgeryDialog({ open: false, surgery: null, mode: 'add' })}>
              Annuler
            </Button>
            <Button onClick={handleSaveSurgery} variant="contained">
              {surgeryDialog.mode === 'add' ? 'Programmer' : 'Modifier'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Surgery Details Dialog */}
        <Dialog open={viewDialog.open} onClose={() => setViewDialog({ open: false, surgery: null })} maxWidth="md" fullWidth>
          <DialogTitle>
            Détails de la Chirurgie
          </DialogTitle>
          <DialogContent>
            {viewDialog.surgery && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {viewDialog.surgery.patient_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Procédure</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {viewDialog.surgery.procedure_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date et Heure</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {new Date(viewDialog.surgery.scheduled_date).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Durée Estimée</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {viewDialog.surgery.estimated_duration} minutes
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Salle d'Opération</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {viewDialog.surgery.operating_room}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Priorité</Typography>
                    <Box sx={{ mb: 2 }}>
                      {getPriorityChip(viewDialog.surgery.priority)}
                    </Box>
                  </Grid>
                  {viewDialog.surgery.pre_op_notes && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Notes Pré-opératoires</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewDialog.surgery.pre_op_notes}
                      </Typography>
                    </Grid>
                  )}
                  {viewDialog.surgery.equipment_needed && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Équipements Nécessaires</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {viewDialog.surgery.equipment_needed}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialog({ open: false, surgery: null })}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SurgeryScheduleTab; 
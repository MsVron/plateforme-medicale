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
  LinearProgress,
  Avatar,
  Autocomplete
} from '@mui/material';
import {
  Bed,
  Add,
  Edit,
  Delete,
  PersonAdd,
  SwapHoriz,
  Refresh
} from '@mui/icons-material';
import hospitalService from '../../services/hospitalService';

const BedManagementTab = ({ onSuccess, onError, onRefresh, stats }) => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bedDialog, setBedDialog] = useState({ open: false, bed: null, mode: 'add' });
  const [assignmentDialog, setAssignmentDialog] = useState({ open: false, bed: null });
  const [transferDialog, setTransferDialog] = useState({ open: false, bed: null });
  const [wardFilter, setWardFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wards, setWards] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availablePatients, setAvailablePatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [bedForm, setBedForm] = useState({
    bed_number: '',
    ward_name: '',
    room_number: '',
    bed_type: 'standard',
    maintenance_status: 'available'
  });

  const [assignmentForm, setAssignmentForm] = useState({
    patient_id: '',
    doctor_id: '',
    admission_reason: '',
    notes: ''
  });

  const [transferForm, setTransferForm] = useState({
    new_bed_id: '',
    transfer_reason: '',
    notes: ''
  });

  const bedTypes = [
    { value: 'standard', label: 'Standard', color: '#2196f3' },
    { value: 'icu', label: 'UCI/Réanimation', color: '#f44336' },
    { value: 'emergency', label: 'Urgences', color: '#ff9800' },
    { value: 'maternity', label: 'Maternité', color: '#e91e63' },
    { value: 'pediatric', label: 'Pédiatrie', color: '#9c27b0' },
    { value: 'isolation', label: 'Isolement', color: '#607d8b' }
  ];

  const maintenanceStatuses = [
    { value: 'available', label: 'Disponible', color: '#4caf50' },
    { value: 'maintenance', label: 'Maintenance', color: '#ff9800' },
    { value: 'out_of_service', label: 'Hors service', color: '#f44336' }
  ];

  useEffect(() => {
    fetchBeds();
    fetchWards();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const response = await hospitalService.getBeds();
      setBeds(response.beds || []);
    } catch (error) {
      console.error('Error fetching beds:', error);
      onError('Erreur lors du chargement des lits');
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async () => {
    try {
      const response = await hospitalService.getWards();
      setWards(response.wards || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await hospitalService.getHospitalPatients();
      setPatients(response.patients || []);
      // Filter patients who are not currently assigned to beds
      const unassignedPatients = response.patients?.filter(p => !p.bed_number) || [];
      setAvailablePatients(unassignedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
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

  const handleAddBed = () => {
    setBedForm({
      bed_number: '',
      ward_name: '',
      room_number: '',
      bed_type: 'standard',
      maintenance_status: 'available'
    });
    setBedDialog({ open: true, bed: null, mode: 'add' });
  };

  const handleEditBed = (bed) => {
    setBedForm({
      bed_number: bed.bed_number,
      ward_name: bed.ward_name,
      room_number: bed.room_number || '',
      bed_type: bed.bed_type,
      maintenance_status: bed.maintenance_status
    });
    setBedDialog({ open: true, bed: bed, mode: 'edit' });
  };

  const handleSaveBed = async () => {
    try {
      if (bedDialog.mode === 'add') {
        await hospitalService.createBed(bedForm);
        onSuccess('Lit ajouté avec succès');
      } else {
        await hospitalService.updateBed(bedDialog.bed.id, bedForm);
        onSuccess('Lit mis à jour avec succès');
      }
      setBedDialog({ open: false, bed: null, mode: 'add' });
      fetchBeds();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleAssignPatient = (bed) => {
    setAssignmentForm({
      patient_id: '',
      doctor_id: '',
      admission_reason: '',
      notes: ''
    });
    setAssignmentDialog({ open: true, bed: bed });
  };

  const handleSaveAssignment = async () => {
    try {
      await hospitalService.assignPatientToBed(assignmentDialog.bed.id, assignmentForm);
      onSuccess('Patient assigné au lit avec succès');
      setAssignmentDialog({ open: false, bed: null });
      fetchBeds();
      fetchPatients();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Erreur lors de l\'assignation');
    }
  };

  const handleTransferPatient = (bed) => {
    setTransferForm({
      new_bed_id: '',
      transfer_reason: '',
      notes: ''
    });
    setTransferDialog({ open: true, bed: bed });
  };

  const handleSaveTransfer = async () => {
    try {
      await hospitalService.transferPatient(transferDialog.bed.id, transferForm);
      onSuccess('Patient transféré avec succès');
      setTransferDialog({ open: false, bed: null });
      fetchBeds();
      onRefresh();
    } catch (error) {
      onError(error.message || 'Erreur lors du transfert');
    }
  };

  const getStatusChip = (bed) => {
    if (bed.maintenance_status !== 'available') {
      const status = maintenanceStatuses.find(s => s.value === bed.maintenance_status);
      return <Chip label={status.label} size="small" sx={{ backgroundColor: status.color, color: 'white' }} />;
    }
    
    if (bed.is_occupied) {
      return <Chip label="Occupé" size="small" color="error" />;
    }
    
    return <Chip label="Libre" size="small" color="success" />;
  };

  const getBedTypeChip = (bedType) => {
    const type = bedTypes.find(t => t.value === bedType);
    return <Chip label={type.label} size="small" sx={{ backgroundColor: type.color, color: 'white' }} />;
  };

  const filteredBeds = beds.filter(bed => {
    return (wardFilter === 'all' || bed.ward_name === wardFilter) &&
           (typeFilter === 'all' || bed.bed_type === typeFilter) &&
           (statusFilter === 'all' || 
            (statusFilter === 'occupied' && bed.is_occupied) ||
            (statusFilter === 'available' && !bed.is_occupied && bed.maintenance_status === 'available') ||
            (statusFilter === 'maintenance' && bed.maintenance_status !== 'available'));
  });

  const availableBedsForTransfer = beds.filter(bed => 
    !bed.is_occupied && 
    bed.maintenance_status === 'available' && 
    bed.id !== transferDialog.bed?.id
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement de la gestion des lits...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Gestion des Lits Hospitaliers
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddBed}
            sx={{ bgcolor: 'primary.main' }}
          >
            Ajouter un Lit
          </Button>
          <Tooltip title="Actualiser">
            <IconButton onClick={fetchBeds} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Bed Statistics Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {bedTypes.map((type) => {
          const typeBeds = beds.filter(b => b.bed_type === type.value);
          const occupiedBeds = typeBeds.filter(b => b.is_occupied);
          const occupancyRate = typeBeds.length > 0 ? Math.round((occupiedBeds.length / typeBeds.length) * 100) : 0;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={type.value}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Bed sx={{ color: type.color, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {type.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: type.color, mb: 1 }}>
                    {occupiedBeds.length}/{typeBeds.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={occupancyRate}
                    sx={{ 
                      mb: 1, 
                      height: 6, 
                      borderRadius: 3,
                      '& .MuiLinearProgress-bar': { backgroundColor: type.color }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {occupancyRate}% d'occupation
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
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Service</InputLabel>
              <Select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                label="Service"
              >
                <MenuItem value="all">Tous les services</MenuItem>
                {wards.map((ward) => (
                  <MenuItem key={ward.name} value={ward.name}>{ward.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type de lit</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type de lit"
              >
                <MenuItem value="all">Tous les types</MenuItem>
                {bedTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="all">Tous les statuts</MenuItem>
                <MenuItem value="available">Disponibles</MenuItem>
                <MenuItem value="occupied">Occupés</MenuItem>
                <MenuItem value="maintenance">En maintenance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              {filteredBeds.length} lit(s) trouvé(s)
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Beds Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lit</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Chambre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBeds.map((bed) => (
              <TableRow key={bed.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bed sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {bed.bed_number}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{bed.ward_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{bed.room_number || '-'}</Typography>
                </TableCell>
                <TableCell>
                  {getBedTypeChip(bed.bed_type)}
                </TableCell>
                <TableCell>
                  {getStatusChip(bed)}
                </TableCell>
                <TableCell>
                  {bed.patient_prenom && bed.patient_nom ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        {bed.patient_prenom.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {bed.patient_prenom} {bed.patient_nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Admis le {bed.admission_date ? new Date(bed.admission_date).toLocaleDateString() : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Libre
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleEditBed(bed)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    {!bed.is_occupied && bed.maintenance_status === 'available' && (
                      <Tooltip title="Assigner un patient">
                        <IconButton size="small" color="primary" onClick={() => handleAssignPatient(bed)}>
                          <PersonAdd />
                        </IconButton>
                      </Tooltip>
                    )}
                    {bed.is_occupied && (
                      <Tooltip title="Transférer le patient">
                        <IconButton size="small" color="warning" onClick={() => handleTransferPatient(bed)}>
                          <SwapHoriz />
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

      {/* Add/Edit Bed Dialog */}
      <Dialog open={bedDialog.open} onClose={() => setBedDialog({ open: false, bed: null, mode: 'add' })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {bedDialog.mode === 'add' ? 'Ajouter un Lit' : 'Modifier le Lit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Numéro de lit"
                value={bedForm.bed_number}
                onChange={(e) => setBedForm(prev => ({ ...prev, bed_number: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Numéro de chambre"
                value={bedForm.room_number}
                onChange={(e) => setBedForm(prev => ({ ...prev, room_number: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Service/Ward"
                value={bedForm.ward_name}
                onChange={(e) => setBedForm(prev => ({ ...prev, ward_name: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type de lit</InputLabel>
                <Select
                  value={bedForm.bed_type}
                  onChange={(e) => setBedForm(prev => ({ ...prev, bed_type: e.target.value }))}
                  label="Type de lit"
                >
                  {bedTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Statut de maintenance</InputLabel>
                <Select
                  value={bedForm.maintenance_status}
                  onChange={(e) => setBedForm(prev => ({ ...prev, maintenance_status: e.target.value }))}
                  label="Statut de maintenance"
                >
                  {maintenanceStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBedDialog({ open: false, bed: null, mode: 'add' })}>
            Annuler
          </Button>
          <Button onClick={handleSaveBed} variant="contained">
            {bedDialog.mode === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Assignment Dialog */}
      <Dialog open={assignmentDialog.open} onClose={() => setAssignmentDialog({ open: false, bed: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assigner un Patient au Lit {assignmentDialog.bed?.bed_number}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={availablePatients}
                getOptionLabel={(patient) => `${patient.prenom} ${patient.nom} (${patient.CNE})`}
                value={availablePatients.find(p => p.id === assignmentForm.patient_id) || null}
                onChange={(event, newValue) => {
                  setAssignmentForm(prev => ({ ...prev, patient_id: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionner un patient"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(doctor) => `Dr. ${doctor.prenom} ${doctor.nom} - ${doctor.specialite}`}
                value={doctors.find(d => d.id === assignmentForm.doctor_id) || null}
                onChange={(event, newValue) => {
                  setAssignmentForm(prev => ({ ...prev, doctor_id: newValue?.id || '' }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Médecin responsable"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Motif d'admission"
                value={assignmentForm.admission_reason}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, admission_reason: e.target.value }))}
                fullWidth
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={assignmentForm.notes}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignmentDialog({ open: false, bed: null })}>
            Annuler
          </Button>
          <Button onClick={handleSaveAssignment} variant="contained">
            Assigner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient Transfer Dialog */}
      <Dialog open={transferDialog.open} onClose={() => setTransferDialog({ open: false, bed: null })} maxWidth="sm" fullWidth>
        <DialogTitle>
          Transférer le Patient du Lit {transferDialog.bed?.bed_number}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Nouveau lit</InputLabel>
                <Select
                  value={transferForm.new_bed_id}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, new_bed_id: e.target.value }))}
                  label="Nouveau lit"
                  required
                >
                  {availableBedsForTransfer.map((bed) => (
                    <MenuItem key={bed.id} value={bed.id}>
                      Lit {bed.bed_number} - {bed.ward_name} ({bed.bed_type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Motif du transfert"
                value={transferForm.transfer_reason}
                onChange={(e) => setTransferForm(prev => ({ ...prev, transfer_reason: e.target.value }))}
                fullWidth
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={transferForm.notes}
                onChange={(e) => setTransferForm(prev => ({ ...prev, notes: e.target.value }))}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog({ open: false, bed: null })}>
            Annuler
          </Button>
          <Button onClick={handleSaveTransfer} variant="contained">
            Transférer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BedManagementTab; 
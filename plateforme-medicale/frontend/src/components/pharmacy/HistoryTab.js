import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker
} from '@mui/material';
import {
  History,
  Person,
  CheckCircle,
  LocalPharmacy,
  Search,
  Refresh,
  Medication,
  CalendarToday,
  FilterList
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import pharmacyService from '../../services/pharmacyService';

const HistoryTab = ({ onSuccess, onError, onRefresh }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: null,
    dateTo: null
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, history]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await pharmacyService.getPrescriptionHistory();
      setHistory(response.prescriptions || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      onError(error.message || 'Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    // Search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(prescription =>
        prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient_cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(prescription => {
        const totalMedications = prescription.medications?.length || 0;
        const dispensedMedications = prescription.medications?.filter(m => m.dispensed).length || 0;
        
        switch (filters.status) {
          case 'completed':
            return dispensedMedications === totalMedications && totalMedications > 0;
          case 'partial':
            return dispensedMedications > 0 && dispensedMedications < totalMedications;
          case 'pending':
            return dispensedMedications === 0;
          default:
            return true;
        }
      });
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(prescription => 
        new Date(prescription.date_prescription) >= filters.dateFrom
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(prescription => 
        new Date(prescription.date_prescription) <= filters.dateTo
      );
    }

    setFilteredHistory(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getPrescriptionStatusChip = (prescription) => {
    const totalMedications = prescription.medications?.length || 0;
    const dispensedMedications = prescription.medications?.filter(m => m.dispensed).length || 0;
    
    if (dispensedMedications === 0) {
      return <Chip label="Non dispensée" color="error" size="small" />;
    } else if (dispensedMedications === totalMedications) {
      return <Chip label="Complètement dispensée" color="success" size="small" icon={<CheckCircle />} />;
    } else {
      return <Chip label="Partiellement dispensée" color="warning" size="small" icon={<LocalPharmacy />} />;
    }
  };

  const calculateDaysAgo = (date) => {
    const prescriptionDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - prescriptionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPharmacyName = (prescription) => {
    // This would come from the prescription data showing which pharmacy dispensed it
    return prescription.pharmacy_name || 'Notre pharmacie';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement de l'historique...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            Historique des Prescriptions ({filteredHistory.length})
          </Typography>
          <Tooltip title="Actualiser l'historique">
            <IconButton onClick={fetchHistory} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par nom, CNE ou médecin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Statut"
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="completed">Complètement dispensée</MenuItem>
                    <MenuItem value="partial">Partiellement dispensée</MenuItem>
                    <MenuItem value="pending">Non dispensée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Date de début"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Date de fin"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {filteredHistory.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 4 }}>
            <CardContent>
              <History sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {searchTerm || filters.status !== 'all' || filters.dateFrom || filters.dateTo
                  ? 'Aucune prescription trouvée avec ces critères'
                  : 'Aucun historique disponible'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredHistory.map((prescription) => (
              <Grid item xs={12} key={prescription.id}>
                <Card sx={{ 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent>
                    {/* Prescription Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {prescription.patient_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            CNE: {prescription.patient_cne}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        {getPrescriptionStatusChip(prescription)}
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          <CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />
                          {new Date(prescription.date_prescription).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Doctor and Pharmacy Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Prescrit par:</strong> Dr. {prescription.doctor_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.doctor_specialty}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="primary.main">
                          <strong>Pharmacie:</strong> {getPharmacyName(prescription)}
                        </Typography>
                        {prescription.dispensed_date && (
                          <Typography variant="body2" color="success.main">
                            <strong>Dispensé le:</strong> {new Date(prescription.dispensed_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    {/* Medications Table */}
                    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                      <Table size="small">
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                          <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médicament</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dosage</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fréquence</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durée</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Dispensation</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {prescription.medications?.map((medication) => (
                            <TableRow 
                              key={medication.id}
                              sx={{ 
                                '&:hover': { backgroundColor: 'rgba(76, 161, 175, 0.04)' },
                                backgroundColor: medication.dispensed ? 'rgba(76, 175, 80, 0.04)' : 'rgba(244, 67, 54, 0.04)'
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Medication sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {medication.nom}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{medication.dosage}</TableCell>
                              <TableCell>{medication.frequence}</TableCell>
                              <TableCell>{medication.duree}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={medication.dispensed ? "Dispensé" : "Non dispensé"}
                                  color={medication.dispensed ? "success" : "error"}
                                  size="small"
                                  icon={medication.dispensed ? <CheckCircle /> : <LocalPharmacy />}
                                />
                              </TableCell>
                              <TableCell>
                                {medication.dispensed && medication.dispensed_date ? (
                                  <Typography variant="body2" color="success.main">
                                    {new Date(medication.dispensed_date).toLocaleDateString()}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    Non dispensé
                                  </Typography>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default HistoryTab; 
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
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocalPharmacy,
  Person,
  CheckCircle,
  Schedule,
  Search,
  Refresh,
  Medication
} from '@mui/icons-material';
import pharmacyService from '../../services/pharmacyService';

const PrescriptionsTab = ({ onSuccess, onError, onRefresh }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispensing, setDispensing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    // Filter prescriptions based on search term
    if (searchTerm.trim() === '') {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter(prescription =>
        prescription.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patient_cne.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await pharmacyService.getPrescriptionHistory({ status: 'pending' });
      setPrescriptions(response.prescriptions || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      onError(error.message || 'Erreur lors du chargement des prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDispenseMedication = async (prescriptionId, medicationId, dispensed) => {
    try {
      setDispensing(true);
      await pharmacyService.dispenseMedication(prescriptionId, {
        medication_id: medicationId,
        dispensed: dispensed,
        dispensed_date: new Date().toISOString()
      });
      
      // Refresh prescriptions
      await fetchPrescriptions();
      onSuccess(dispensed ? 'Médicament marqué comme dispensé' : 'Médicament marqué comme non dispensé');
      onRefresh();
    } catch (error) {
      console.error('Dispense error:', error);
      onError(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setDispensing(false);
    }
  };

  const getPrescriptionStatusChip = (prescription) => {
    const totalMedications = prescription.medications?.length || 0;
    const dispensedMedications = prescription.medications?.filter(m => m.dispensed).length || 0;
    
    if (dispensedMedications === 0) {
      return <Chip label="Non dispensée" color="error" size="small" icon={<Schedule />} />;
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des prescriptions...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Prescriptions en Attente ({filteredPrescriptions.length})
        </Typography>
        <Tooltip title="Actualiser la liste">
          <IconButton onClick={fetchPrescriptions} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Rechercher par nom de patient, CNE ou médecin..."
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
        </CardContent>
      </Card>

      {filteredPrescriptions.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <LocalPharmacy sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'Aucune prescription trouvée avec ces critères' : 'Aucune prescription en attente'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredPrescriptions.map((prescription) => (
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
                        Il y a {calculateDaysAgo(prescription.date_prescription)} jour(s)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Doctor Info */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Prescrit par:</strong> Dr. {prescription.doctor_name} - {prescription.doctor_specialty}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Date de prescription:</strong> {new Date(prescription.date_prescription).toLocaleDateString()}
                  </Typography>

                  {/* Medications Table */}
                  <TableContainer component={Paper} sx={{ mt: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Médicament</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dosage</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fréquence</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durée</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Instructions</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Statut</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prescription.medications?.map((medication) => (
                          <TableRow 
                            key={medication.id}
                            sx={{ 
                              '&:hover': { backgroundColor: 'rgba(76, 161, 175, 0.04)' },
                              backgroundColor: medication.dispensed ? 'rgba(76, 175, 80, 0.04)' : 'inherit'
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
                              <Typography variant="caption" color="text.secondary">
                                {medication.instructions || 'Aucune instruction spéciale'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={medication.dispensed || false}
                                    onChange={(e) => handleDispenseMedication(
                                      prescription.id, 
                                      medication.id, 
                                      e.target.checked
                                    )}
                                    disabled={dispensing}
                                    color="primary"
                                  />
                                }
                                label={
                                  <Typography variant="body2" color={medication.dispensed ? 'success.main' : 'text.secondary'}>
                                    {medication.dispensed ? "Dispensé" : "Non dispensé"}
                                  </Typography>
                                }
                              />
                              {medication.dispensed && medication.dispensed_date && (
                                <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                                  Le {new Date(medication.dispensed_date).toLocaleDateString()}
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
  );
};

export default PrescriptionsTab; 
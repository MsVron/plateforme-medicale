import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  Person,
  LocalPharmacy,
  Medication,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import pharmacyService from '../../services/pharmacyService';

const PatientSearchTab = ({ onSuccess, onError, onRefresh }) => {
  const [searchForm, setSearchForm] = useState({
    prenom: '',
    nom: '',
    cne: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [prescriptionDialog, setPrescriptionDialog] = useState({
    open: false,
    patient: null,
    prescriptions: []
  });
  const [dispensing, setDispensing] = useState(false);

  const handleSearchChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchForm.prenom && !searchForm.nom && !searchForm.cne) {
      onError('Veuillez saisir au moins un critère de recherche');
      return;
    }

    try {
      setSearching(true);
      const response = await pharmacyService.searchPatients(searchForm);
      setSearchResults(response.patients || []);
      
      if (response.patients?.length === 0) {
        onError('Aucun patient trouvé avec ces critères');
      }
    } catch (error) {
      console.error('Search error:', error);
      onError(error.message || 'Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  };

  const handleViewPrescriptions = async (patient) => {
    try {
      const response = await pharmacyService.getPatientPrescriptions(patient.id);
      setPrescriptionDialog({
        open: true,
        patient: patient,
        prescriptions: response.prescriptions || []
      });
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      onError(error.message || 'Erreur lors du chargement des prescriptions');
    }
  };

  const handleDispenseMedication = async (prescriptionMedicationId, quantity) => {
    try {
      setDispensing(true);
      await pharmacyService.dispenseMedication(prescriptionMedicationId, {
        quantity_dispensed: quantity,
        notes: 'Dispensé via interface pharmacie'
      });
      
      // Refresh prescriptions
      const response = await pharmacyService.getPatientPrescriptions(prescriptionDialog.patient.id);
      setPrescriptionDialog(prev => ({
        ...prev,
        prescriptions: response.prescriptions || []
      }));
      
      onSuccess('Médicament dispensé avec succès');
      onRefresh();
    } catch (error) {
      console.error('Dispense error:', error);
      onError(error.message || 'Erreur lors de la dispensation');
    } finally {
      setDispensing(false);
    }
  };

  const getPrescriptionStatusChip = (prescription) => {
    const status = prescription.dispensing_status;
    
    if (status === 'pending') {
      return <Chip label="Non dispensée" color="error" size="small" icon={<Schedule />} />;
    } else if (status === 'completed') {
      return <Chip label="Complètement dispensée" color="success" size="small" icon={<CheckCircle />} />;
    } else if (status === 'partial') {
      return <Chip label="Partiellement dispensée" color="warning" size="small" icon={<LocalPharmacy />} />;
    }
    return <Chip label="Statut inconnu" color="default" size="small" />;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.dark' }}>
        Rechercher un Patient
      </Typography>

      {/* Search Form */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Prénom"
                value={searchForm.prenom}
                onChange={(e) => handleSearchChange('prenom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nom"
                value={searchForm.nom}
                onChange={(e) => handleSearchChange('nom', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CNE"
                value={searchForm.cne}
                onChange={(e) => handleSearchChange('cne', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={searching ? <CircularProgress size={20} /> : <Search />}
                onClick={handleSearch}
                disabled={searching}
                sx={{
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5
                }}
              >
                {searching ? 'Recherche...' : 'Rechercher'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Résultats de recherche ({searchResults.length})
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((patient) => (
              <Grid item xs={12} md={6} key={patient.id}>
                <Card sx={{ 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)' }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {patient.prenom} {patient.nom}
                        </Typography>
                      </Box>
                      {patient.has_prescriptions && (
                        <Chip 
                          label="Prescriptions" 
                          color="primary" 
                          size="small"
                          icon={<LocalPharmacy />}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>CNE:</strong> {patient.CNE}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Date de naissance:</strong> {new Date(patient.date_naissance).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Téléphone:</strong> {patient.telephone || 'Non renseigné'}
                    </Typography>

                    {patient.last_prescription_date && (
                      <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                        <strong>Dernière prescription:</strong> {new Date(patient.last_prescription_date).toLocaleDateString()}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<LocalPharmacy />}
                        onClick={() => handleViewPrescriptions(patient)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Voir Prescriptions
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Prescriptions Dialog */}
      <Dialog 
        open={prescriptionDialog.open} 
        onClose={() => setPrescriptionDialog({ open: false, patient: null, prescriptions: [] })}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Prescriptions de {prescriptionDialog.patient?.prenom} {prescriptionDialog.patient?.nom}
        </DialogTitle>
        <DialogContent>
          {prescriptionDialog.prescriptions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocalPharmacy sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Aucune prescription trouvée
              </Typography>
            </Box>
          ) : (
            prescriptionDialog.prescriptions.map((prescription) => (
              <Card key={prescription.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Prescription du {new Date(prescription.date_prescription).toLocaleDateString()}
                    </Typography>
                    {getPrescriptionStatusChip(prescription)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Médecin:</strong> {prescription.medecin_nom} - {prescription.medecin_specialite}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Durée du traitement:</strong> {prescription.duree_traitement} jours
                  </Typography>
                  {prescription.instructions_speciales && (
                    <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                      <strong>Instructions spéciales:</strong> {prescription.instructions_speciales}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Médicament:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2"><strong>Nom:</strong> {prescription.medicament_nom}</Typography>
                        <Typography variant="body2"><strong>Forme:</strong> {prescription.medicament_forme}</Typography>
                        <Typography variant="body2"><strong>Dosage:</strong> {prescription.medicament_dosage}</Typography>
                        <Typography variant="body2"><strong>Posologie:</strong> {prescription.posologie}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2"><strong>Quantité prescrite:</strong> {prescription.quantite}</Typography>
                        <Typography variant="body2"><strong>Quantité dispensée:</strong> {prescription.total_dispensed}</Typography>
                        <Typography variant="body2"><strong>Quantité restante:</strong> {prescription.remaining_quantity}</Typography>
                        <Typography variant="body2"><strong>Durée:</strong> {prescription.duree_jours} jours</Typography>
                      </Grid>
                    </Grid>
                    
                    {prescription.instructions && (
                      <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                        <strong>Instructions:</strong> {prescription.instructions}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      {prescription.dispensing_status === 'completed' ? (
                        <Chip 
                          label="Complètement dispensé" 
                          color="success" 
                          icon={<CheckCircle />}
                        />
                      ) : prescription.dispensing_status === 'partial' ? (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label="Partiellement dispensé" 
                            color="warning" 
                            icon={<LocalPharmacy />}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleDispenseMedication(prescription.prescription_medication_id, prescription.remaining_quantity)}
                            disabled={dispensing || prescription.remaining_quantity <= 0}
                            startIcon={<LocalPharmacy />}
                          >
                            Dispenser le reste ({prescription.remaining_quantity})
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => handleDispenseMedication(prescription.prescription_medication_id, prescription.quantite)}
                          disabled={dispensing}
                          startIcon={<LocalPharmacy />}
                        >
                          Dispenser ({prescription.quantite})
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setPrescriptionDialog({ open: false, patient: null, prescriptions: [] })}
            variant="contained"
            sx={{ fontWeight: 'bold' }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientSearchTab; 
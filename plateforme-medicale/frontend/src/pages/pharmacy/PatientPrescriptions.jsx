import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  LocalPharmacy,
  CheckCircle,
  Schedule,
  History,
  Person,
  CalendarToday,
  Medication,
  ShoppingCart
} from '@mui/icons-material';
import pharmacyService from '../../services/pharmacyService';

const PatientPrescriptions = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [error, setError] = useState('');
  
  // Dispensing dialog state
  const [dispensingDialog, setDispensingDialog] = useState({
    open: false,
    prescription: null,
    notes: '',
    unitPrice: '',
    totalPrice: '',
    patientCopay: ''
  });
  const [dispensing, setDispensing] = useState(false);

  useEffect(() => {
    loadPatientPrescriptions();
  }, [patientId]);

  const loadPatientPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await pharmacyService.getPatientPrescriptions(patientId);
      setPatient(response.patient);
      setPrescriptions(response.prescriptions || []);
      setMedicationHistory(response.medicationHistory || []);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      setError(error.message || 'Erreur lors du chargement des prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDispenseMedication = async () => {
    try {
      setDispensing(true);
      await pharmacyService.dispenseMedication(dispensingDialog.prescription.prescription_id, {
        notes: dispensingDialog.notes,
        unit_price: dispensingDialog.unitPrice ? parseFloat(dispensingDialog.unitPrice) : null,
        total_price: dispensingDialog.totalPrice ? parseFloat(dispensingDialog.totalPrice) : null,
        patient_copay: dispensingDialog.patientCopay ? parseFloat(dispensingDialog.patientCopay) : null
      });
      
      // Refresh data
      await loadPatientPrescriptions();
      
      // Close dialog
      setDispensingDialog({
        open: false,
        prescription: null,
        notes: '',
        unitPrice: '',
        totalPrice: '',
        patientCopay: ''
      });
      
    } catch (error) {
      console.error('Dispense error:', error);
      setError(error.message || 'Erreur lors de la dispensation');
    } finally {
      setDispensing(false);
    }
  };

  const openDispensingDialog = (prescription) => {
    setDispensingDialog({
      open: true,
      prescription,
      notes: '',
      unitPrice: '',
      totalPrice: '',
      patientCopay: ''
    });
  };

  const getDispensingStatusChip = (prescription) => {
    const status = prescription.dispensing_status;
    
    switch (status) {
      case 'not_dispensed':
        return <Chip label="Non dispensé" color="error" size="small" icon={<Schedule />} />;
      case 'ongoing_permanent':
        return <Chip label="Traitement permanent" color="info" size="small" icon={<History />} />;
      case 'completed':
        return <Chip label="Complété" color="success" size="small" icon={<CheckCircle />} />;
      case 'in_progress':
        return <Chip label="En cours" color="warning" size="small" icon={<LocalPharmacy />} />;
      default:
        return <Chip label="Statut inconnu" color="default" size="small" />;
    }
  };

  const getPurchaseInfo = (prescription) => {
    if (prescription.dispensing_status === 'not_dispensed') {
      return <Typography variant="body2" color="text.secondary">Pas encore dispensé</Typography>;
    }
    
    if (prescription.est_permanent && prescription.last_purchase_date) {
      return (
        <Box>
          <Typography variant="body2" color="success.main">
            <strong>Dernier achat:</strong> {new Date(prescription.last_purchase_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Traitement permanent en cours
          </Typography>
        </Box>
      );
    }
    
    if (prescription.last_dispensing_date) {
      return (
        <Box>
          <Typography variant="body2" color="success.main">
            <strong>Dispensé le:</strong> {new Date(prescription.last_dispensing_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Traitement terminé
          </Typography>
        </Box>
      );
    }
    
    return <Typography variant="body2" color="text.secondary">Information indisponible</Typography>;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/pharmacy/dashboard')}
        >
          Retour au tableau de bord
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/pharmacy/dashboard')}
            sx={{ 
              mr: 2,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Retour
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
            Ordonnances de {patient?.prenom} {patient?.nom}
          </Typography>
        </Box>
      </Box>

      {/* Patient Info Card */}
      <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Informations du patient
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                <strong>CIN:</strong> {patient?.CNE}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                <strong>Date de naissance:</strong> {patient?.date_naissance ? new Date(patient.date_naissance).toLocaleDateString() : 'Non renseignée'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                <strong>Téléphone:</strong> {patient?.telephone || 'Non renseigné'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="primary.main">
                <strong>Total prescriptions:</strong> {prescriptions.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Prescriptions */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
        Prescriptions médicales
      </Typography>
      
      {prescriptions.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <LocalPharmacy sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Aucune prescription trouvée
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ mb: 4 }}>
          {prescriptions.map((prescription) => (
            <Card key={prescription.prescription_id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {prescription.medicament_nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Prescrit le {new Date(prescription.date_prescription).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Médecin:</strong> {prescription.medecin_nom} - {prescription.medecin_specialite}
                    </Typography>
                  </Box>
                  {getDispensingStatusChip(prescription)}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                      <Medication sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Détails du médicament
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Forme:</strong> {prescription.medicament_forme}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Dosage:</strong> {prescription.medicament_dosage}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Molécule:</strong> {prescription.nom_molecule}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Posologie:</strong> {prescription.posologie}
                    </Typography>
                    {prescription.instructions && (
                      <Typography variant="body2" color="primary.main">
                        <strong>Instructions:</strong> {prescription.instructions}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                      <ShoppingCart sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Statut de dispensation
                    </Typography>
                    {getPurchaseInfo(prescription)}
                    
                    {prescription.dispensing_notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Notes:</strong> {prescription.dispensing_notes}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                      {prescription.dispensing_status === 'not_dispensed' || 
                       (prescription.est_permanent && prescription.dispensing_status === 'ongoing_permanent') ? (
                        <Button
                          variant="contained"
                          startIcon={<LocalPharmacy />}
                          onClick={() => openDispensingDialog(prescription)}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {prescription.est_permanent ? 'Nouveau retrait' : 'Dispenser'}
                        </Button>
                      ) : (
                        <Chip 
                          label="Déjà dispensé" 
                          color="success" 
                          icon={<CheckCircle />}
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Medication History */}
      {medicationHistory.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
            Historique des dispensations
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Médicament</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Pharmacie</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dispensé par</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicationHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.dispensing_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.medicament_nom}</TableCell>
                    <TableCell>{record.pharmacy_name}</TableCell>
                    <TableCell>{record.dispensed_by}</TableCell>
                    <TableCell>
                      {record.is_permanent_medication ? (
                        <Chip label="Permanent" color="info" size="small" />
                      ) : (
                        <Chip label="Terminé" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Dispensing Dialog */}
      <Dialog 
        open={dispensingDialog.open} 
        onClose={() => !dispensing && setDispensingDialog({ ...dispensingDialog, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
          Dispenser {dispensingDialog.prescription?.medicament_nom}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Notes (optionnel)"
              multiline
              rows={3}
              value={dispensingDialog.notes}
              onChange={(e) => setDispensingDialog({ ...dispensingDialog, notes: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Prix unitaire (DH)"
                  type="number"
                  value={dispensingDialog.unitPrice}
                  onChange={(e) => setDispensingDialog({ ...dispensingDialog, unitPrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Prix total (DH)"
                  type="number"
                  value={dispensingDialog.totalPrice}
                  onChange={(e) => setDispensingDialog({ ...dispensingDialog, totalPrice: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Participation patient (DH)"
                  type="number"
                  value={dispensingDialog.patientCopay}
                  onChange={(e) => setDispensingDialog({ ...dispensingDialog, patientCopay: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDispensingDialog({ ...dispensingDialog, open: false })}
            disabled={dispensing}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleDispenseMedication}
            disabled={dispensing}
            startIcon={dispensing ? <CircularProgress size={20} /> : <LocalPharmacy />}
            sx={{ fontWeight: 'bold' }}
          >
            {dispensing ? 'Dispensation...' : 'Confirmer la dispensation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientPrescriptions; 
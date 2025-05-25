import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import { formatDate } from '../../utils/dateUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  TimeScale
);

const WeightHeightHistory = ({ patientId, onSuccess, onError }) => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [formData, setFormData] = useState({
    poids: '',
    taille: '',
    date_mesure: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchMeasurements();
  }, [patientId]);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/medecin/patients/${patientId}/measurements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeasurements(response.data.measurements || []);
    } catch (err) {
      console.error('Error fetching measurements:', err);
      onError('Erreur lors de la récupération de l\'historique des mesures');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeasurement = () => {
    setEditingMeasurement(null);
    setFormData({
      poids: '',
      taille: '',
      date_mesure: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditMeasurement = (measurement) => {
    setEditingMeasurement(measurement);
    setFormData({
      poids: measurement.poids || '',
      taille: measurement.taille || '',
      date_mesure: measurement.date_mesure ? measurement.date_mesure.split('T')[0] : '',
      notes: measurement.notes || ''
    });
    setDialogOpen(true);
  };

  const handleSaveMeasurement = async () => {
    try {
      const token = localStorage.getItem('token');
      const measurementData = {
        poids: formData.poids ? parseFloat(formData.poids) : null,
        taille: formData.taille ? parseInt(formData.taille) : null,
        date_mesure: formData.date_mesure,
        notes: formData.notes
      };

      if (editingMeasurement) {
        await axios.put(
          `/medecin/patients/${patientId}/measurements/${editingMeasurement.id}`,
          measurementData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSuccess('Mesure mise à jour avec succès');
      } else {
        await axios.post(
          `/medecin/patients/${patientId}/measurements`,
          measurementData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSuccess('Mesure ajoutée avec succès');
      }

      setDialogOpen(false);
      fetchMeasurements();
    } catch (err) {
      console.error('Error saving measurement:', err);
      onError(err.response?.data?.message || 'Erreur lors de la sauvegarde de la mesure');
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette mesure ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/medecin/patients/${patientId}/measurements/${measurementId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess('Mesure supprimée avec succès');
      fetchMeasurements();
    } catch (err) {
      console.error('Error deleting measurement:', err);
      onError('Erreur lors de la suppression de la mesure');
    }
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: 'Insuffisance pondérale', color: 'info' };
    if (bmiValue < 25) return { label: 'Poids normal', color: 'success' };
    if (bmiValue < 30) return { label: 'Surpoids', color: 'warning' };
    return { label: 'Obésité', color: 'error' };
  };

  const getWeightTrend = () => {
    if (measurements.length < 2) return null;
    const latest = measurements[0];
    const previous = measurements[1];
    if (!latest.poids || !previous.poids) return null;
    
    const diff = latest.poids - previous.poids;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
      value: Math.abs(diff).toFixed(1)
    };
  };

  const prepareChartData = () => {
    const sortedMeasurements = [...measurements].reverse(); // Oldest first for chart
    
    const weightData = sortedMeasurements
      .filter(m => m.poids)
      .map(m => ({
        x: new Date(m.date_mesure),
        y: m.poids
      }));

    const heightData = sortedMeasurements
      .filter(m => m.taille)
      .map(m => ({
        x: new Date(m.date_mesure),
        y: m.taille
      }));

    return {
      datasets: [
        {
          label: 'Poids (kg)',
          data: weightData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          yAxisID: 'y',
          tension: 0.1
        },
        {
          label: 'Taille (cm)',
          data: heightData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y1',
          tension: 0.1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Évolution du poids et de la taille'
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            day: 'dd/MM/yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Poids (kg)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Taille (cm)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const weightTrend = getWeightTrend();
  const latestMeasurement = measurements[0];
  const latestBMI = latestMeasurement ? calculateBMI(latestMeasurement.poids, latestMeasurement.taille) : null;
  const bmiCategory = getBMICategory(latestBMI);

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {latestMeasurement?.poids && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {latestMeasurement.poids} kg
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Poids actuel
                </Typography>
                {weightTrend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                    {weightTrend.direction === 'up' ? (
                      <TrendingUpIcon color="error" />
                    ) : weightTrend.direction === 'down' ? (
                      <TrendingDownIcon color="success" />
                    ) : (
                      <RemoveIcon color="info" />
                    )}
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {weightTrend.direction === 'stable' ? 'Stable' : `${weightTrend.value} kg`}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {latestMeasurement?.taille && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {latestMeasurement.taille} cm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Taille
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {latestBMI && (
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {latestBMI}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  IMC
                </Typography>
                {bmiCategory && (
                  <Chip 
                    label={bmiCategory.label} 
                    color={bmiCategory.color} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {measurements.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mesures enregistrées
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddMeasurement}
                size="small"
                sx={{ mt: 1 }}
              >
                Ajouter
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      {measurements.length > 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TimelineIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Évolution des mesures</Typography>
          </Box>
          <Box sx={{ height: 400 }}>
            <Line data={prepareChartData()} options={chartOptions} />
          </Box>
        </Paper>
      )}

      {/* Measurements Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Historique des mesures</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddMeasurement}
          >
            Ajouter une mesure
          </Button>
        </Box>

        {measurements.length === 0 ? (
          <Alert severity="info">
            Aucune mesure enregistrée. Cliquez sur "Ajouter une mesure" pour commencer.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Poids (kg)</TableCell>
                  <TableCell>Taille (cm)</TableCell>
                  <TableCell>IMC</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements.map((measurement) => {
                  const bmi = calculateBMI(measurement.poids, measurement.taille);
                  const bmiCat = getBMICategory(bmi);
                  
                  return (
                    <TableRow key={measurement.id}>
                      <TableCell>
                        {formatDate(measurement.date_mesure)}
                      </TableCell>
                      <TableCell>
                        {measurement.poids ? `${measurement.poids} kg` : '-'}
                      </TableCell>
                      <TableCell>
                        {measurement.taille ? `${measurement.taille} cm` : '-'}
                      </TableCell>
                      <TableCell>
                        {bmi ? (
                          <Box>
                            <Typography variant="body2">{bmi}</Typography>
                            {bmiCat && (
                              <Chip 
                                label={bmiCat.label} 
                                color={bmiCat.color} 
                                size="small" 
                              />
                            )}
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {measurement.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Modifier">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditMeasurement(measurement)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteMeasurement(measurement.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMeasurement ? 'Modifier la mesure' : 'Ajouter une mesure'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Poids (kg)"
                type="number"
                value={formData.poids}
                onChange={(e) => setFormData(prev => ({ ...prev, poids: e.target.value }))}
                fullWidth
                inputProps={{ min: 0, max: 500, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Taille (cm)"
                type="number"
                value={formData.taille}
                onChange={(e) => setFormData(prev => ({ ...prev, taille: e.target.value }))}
                fullWidth
                inputProps={{ min: 0, max: 300 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date de mesure"
                type="date"
                value={formData.date_mesure}
                onChange={(e) => setFormData(prev => ({ ...prev, date_mesure: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Notes sur cette mesure..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveMeasurement}
            variant="contained"
            disabled={!formData.poids && !formData.taille}
          >
            {editingMeasurement ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WeightHeightHistory; 
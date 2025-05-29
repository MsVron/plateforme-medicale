import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Chip,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import {
  Event,
  Schedule,
  TrendingUp,
  TrendingDown,
  Assessment,
  FilterList,
  GetApp,
  AccessTime,
  CalendarToday,
  Cancel,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

const StatsAppointments = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  useEffect(() => {
    fetchAppointmentStats();
  }, [selectedPeriod, filterSpecialty]);

  const fetchAppointmentStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/superadmin/stats/appointments?period=${selectedPeriod}&specialty=${filterSpecialty}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Erreur lors de la récupération des statistiques de rendez-vous');
      }
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      setError('Erreur lors de la récupération des statistiques de rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // Export functionality
    const csvData = generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `rapport-rendez-vous-${selectedPeriod}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateCSVData = () => {
    if (!stats) return '';
    
    let csv = 'Date,Total Rendez-vous,Confirmés,Annulés,Absents\n';
    (stats.dailyStats || []).forEach(day => {
      csv += `${day.date},${day.total},${day.confirmed},${day.cancelled},${day.absent}\n`;
    });
    return csv;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#DDA0DD'];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getStatusColor = (status) => {
    const colors = {
      'planifié': '#3B82F6',
      'confirmé': '#10B981',
      'en cours': '#F59E0B',
      'terminé': '#6B7280',
      'annulé': '#EF4444',
      'patient absent': '#F97316'
    };
    return colors[status] || '#6B7280';
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
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Event sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Analyses des Rendez-vous
          </Typography>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<GetApp />}
          onClick={handleExportData}
        >
          Exporter les données
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Période</InputLabel>
            <Select
              value={selectedPeriod}
              label="Période"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Spécialité</InputLabel>
            <Select
              value={filterSpecialty}
              label="Spécialité"
              onChange={(e) => setFilterSpecialty(e.target.value)}
            >
              <MenuItem value="all">Toutes les spécialités</MenuItem>
              {(stats?.specialties || []).map((specialty) => (
                <MenuItem key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Rendez-vous
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats?.overview?.totalAppointments || 0)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {stats?.overview?.appointmentGrowth >= 0 ? (
                      <TrendingUp sx={{ fontSize: 16 }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 16 }} />
                    )}
                    <Typography variant="caption">
                      {Math.abs(stats?.overview?.appointmentGrowth || 0)}% vs période précédente
                    </Typography>
                  </Box>
                </Box>
                <Event sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Taux de Réalisation
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats?.overview?.completionRate || 0}%
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {formatNumber(stats?.overview?.completedAppointments || 0)} terminés
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Taux d'Annulation
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats?.overview?.cancellationRate || 0}%
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {formatNumber(stats?.overview?.cancelledAppointments || 0)} annulés
                  </Typography>
                </Box>
                <Cancel sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Temps d'Attente Moyen
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stats?.overview?.avgWaitTime || 0} min
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    délai moyen de prise en charge
                  </Typography>
                </Box>
                <AccessTime sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analysis */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp />
                  <Typography variant="h6">Évolution des Rendez-vous</Typography>
                </Box>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={stats?.dailyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="total" fill="#8884d8" name="Total RDV" />
                  <Bar yAxisId="left" dataKey="confirmed" fill="#82ca9d" name="Confirmés" />
                  <Line yAxisId="right" type="monotone" dataKey="completionRate" stroke="#ff7300" name="Taux de réalisation %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Répartition par Statut" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(stats?.statusDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <Box sx={{ mt: 2 }}>
                {(stats?.statusDistribution || []).map((status, index) => (
                  <Paper key={index} sx={{ p: 1, mb: 1, bgcolor: 'grey.50' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="medium">
                        {status.name}
                      </Typography>
                      <Chip 
                        label={formatNumber(status.count)} 
                        size="small"
                        sx={{ 
                          bgcolor: getStatusColor(status.name),
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Analytics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Heures de Pointe" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.hourlyDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Performance par Spécialité" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.specialtyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#82ca9d" name="Réalisés" />
                  <Bar dataKey="cancelled" fill="#ff8042" name="Annulés" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights */}
      <Card>
        <CardHeader 
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <Assessment />
              <Typography variant="h6">Insights et Recommandations</Typography>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Heure de pointe:</strong> {stats?.insights?.peakHour || '14h-15h'} 
                  avec {stats?.insights?.peakHourCount || 0} rendez-vous en moyenne
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={4}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Taux d'absence élevé:</strong> {stats?.insights?.absenteeSpecialty || 'Cardiologie'} 
                  ({stats?.insights?.absenteeRate || 0}% d'absences)
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={4}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Meilleure performance:</strong> {stats?.insights?.bestSpecialty || 'Médecine générale'} 
                  ({stats?.insights?.bestCompletionRate || 0}% de réalisation)
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsAppointments; 
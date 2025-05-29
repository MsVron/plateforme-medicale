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
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  Dashboard,
  People,
  MedicalServices,
  Business,
  Event,
  TrendingUp,
  Assessment,
  Timeline,
  Speed,
  LocalHospital
} from '@mui/icons-material';

const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/superadmin/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Erreur lors de la récupération des statistiques');
      }
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      setError('Erreur lors de la récupération des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
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
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Dashboard sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Vue d'ensemble - Statistiques Avancées
        </Typography>
      </Box>

      {/* Key Performance Indicators */}
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
                    Utilisateurs Totaux
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats?.overview?.totalUsers || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    +{stats?.overview?.userGrowthPercent || 0}% ce mois
                  </Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Rendez-vous Actifs
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats?.overview?.activeAppointments || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stats?.overview?.completionRate || 0}% taux de réalisation
                  </Typography>
                </Box>
                <Event sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    Médecins Actifs
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats?.overview?.activeDoctors || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stats?.overview?.doctorUtilization || 0}% d'utilisation
                  </Typography>
                </Box>
                <MedicalServices sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Institutions
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {formatNumber(stats?.overview?.totalInstitutions || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {stats?.overview?.institutionEfficiency || 0}% efficacité
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health Indicators */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <Speed />
                  <Typography variant="h6">Santé du Système</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Performance Base de Données</Typography>
                  <Typography variant="body2" color="primary">
                    {stats?.systemHealth?.dbPerformance || 95}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.systemHealth?.dbPerformance || 95} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Taux de Disponibilité</Typography>
                  <Typography variant="body2" color="success.main">
                    {stats?.systemHealth?.uptime || 99.8}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.systemHealth?.uptime || 99.8} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Utilisation Serveur</Typography>
                  <Typography variant="body2" color="warning.main">
                    {stats?.systemHealth?.serverUsage || 73}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.systemHealth?.serverUsage || 73} 
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Répartition des Utilisateurs par Rôle" />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats?.usersByRole || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {(stats?.usersByRole || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity Trends */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <TrendingUp />
                  <Typography variant="h6">Tendances d'Activité (30 derniers jours)</Typography>
                </Box>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats?.activityTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="appointments" 
                    stackId="1"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Rendez-vous"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="newUsers" 
                    stackId="1"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Nouveaux Utilisateurs"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consultations" 
                    stackId="1"
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    name="Consultations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <Assessment />
                  <Typography variant="h6">Métriques Clés</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospital color="primary" />
                      <Typography fontWeight="medium">Temps moyen de consultation</Typography>
                    </Box>
                    <Chip 
                      label={`${stats?.keyMetrics?.avgConsultationTime || 45} min`} 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Event color="success" />
                      <Typography fontWeight="medium">Taux de présence</Typography>
                    </Box>
                    <Chip 
                      label={`${stats?.keyMetrics?.attendanceRate || 87}%`} 
                      color="success" 
                      variant="outlined"
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Timeline color="warning" />
                      <Typography fontWeight="medium">Temps d'attente moyen</Typography>
                    </Box>
                    <Chip 
                      label={`${stats?.keyMetrics?.avgWaitTime || 23} min`} 
                      color="warning" 
                      variant="outlined"
                    />
                  </Box>
                </Paper>

                <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                      <People color="info" />
                      <Typography fontWeight="medium">Satisfaction patient</Typography>
                    </Box>
                    <Chip 
                      label={`${stats?.keyMetrics?.patientSatisfaction || 4.2}/5`} 
                      color="info" 
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Alerts */}
      {stats?.recentAlerts && stats.recentAlerts.length > 0 && (
        <Card>
          <CardHeader title="Alertes Récentes du Système" />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {stats.recentAlerts.map((alert, index) => (
                <Alert 
                  key={index} 
                  severity={alert.severity || 'info'}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{alert.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(alert.timestamp).toLocaleString('fr-FR')}
                    </Typography>
                  </Box>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StatsOverview; 
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
  LinearProgress,
  Divider
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
  LocalHospital,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
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
      const response = await fetch('/api/admin/superadmin/stats/overview', {
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

  const getSystemHealthColor = (failureRate) => {
    if (failureRate < 1) return '#4CAF50'; // Green
    if (failureRate < 5) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getSystemHealthStatus = (failureRate) => {
    if (failureRate < 1) return 'Excellent';
    if (failureRate < 5) return 'Attention';
    return 'Critique';
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
      <Alert severity="error">
        <AlertTitle>Erreur</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info">
        <AlertTitle>Aucune donnée</AlertTitle>
        Aucune statistique disponible pour le moment.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vue d'ensemble - Statistiques Générales
      </Typography>

      {/* System Failures Alert */}
      {stats.systemFailures && stats.systemFailures.failure_rate > 5 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Alerte Système Critique</AlertTitle>
          Taux d'échec élevé détecté: {stats.systemFailures.failure_rate?.toFixed(2)}% 
          ({stats.systemFailures.failures_24h} échecs dans les dernières 24h)
        </Alert>
      )}

      {/* Main Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Patients
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.patients?.total || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{stats.patients?.new_this_month || 0} ce mois
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.patients?.complete_profiles / stats.patients?.total) * 100 || 0} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {((stats.patients?.complete_profiles / stats.patients?.total) * 100 || 0).toFixed(1)}% profils complets
                  </Typography>
                </Box>
                <People color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Médecins
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.doctors?.total || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{stats.doctors?.new_this_month || 0} ce mois
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.doctors?.accepting_patients / stats.doctors?.total) * 100 || 0} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {((stats.doctors?.accepting_patients / stats.doctors?.total) * 100 || 0).toFixed(1)}% acceptent nouveaux patients
                  </Typography>
                </Box>
                <MedicalServices color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Institutions
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.institutions?.total || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{stats.institutions?.new_this_month || 0} ce mois
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stats.institutions?.unique_types || 0} types différents
                  </Typography>
                </Box>
                <Business color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Rendez-vous
                  </Typography>
                  <Typography variant="h4">
                    {formatNumber(stats.appointments?.total || 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +{stats.appointments?.this_month || 0} ce mois
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.appointments?.completed / stats.appointments?.total) * 100 || 0} 
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    {((stats.appointments?.completed / stats.appointments?.total) * 100 || 0).toFixed(1)}% terminés
                  </Typography>
                </Box>
                <Event color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health & Performance */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Santé du Système" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="textSecondary">
                      Taux de Réussite
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        color: getSystemHealthColor(stats.systemFailures?.failure_rate || 0),
                        fontWeight: 'bold'
                      }}
                    >
                      {(100 - (stats.systemFailures?.failure_rate || 0)).toFixed(1)}%
                    </Typography>
                    <Chip 
                      label={getSystemHealthStatus(stats.systemFailures?.failure_rate || 0)}
                      color={stats.systemFailures?.failure_rate < 1 ? 'success' : stats.systemFailures?.failure_rate < 5 ? 'warning' : 'error'}
                      icon={stats.systemFailures?.failure_rate < 1 ? <CheckCircleIcon /> : <WarningIcon />}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="textSecondary">
                      Échecs 24h
                    </Typography>
                    <Typography variant="h3" color="error.main">
                      {formatNumber(stats.systemFailures?.failures_24h || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      sur {formatNumber(stats.systemFailures?.total_operations || 0)} opérations
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="textSecondary">
                      Échecs 7 jours
                    </Typography>
                    <Typography variant="h3" color="warning.main">
                      {formatNumber(stats.systemFailures?.failures_7d || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tendance hebdomadaire
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Activité Utilisateurs" />
            <CardContent>
              <Box mb={2}>
                <Typography variant="h6" color="textSecondary">
                  Utilisateurs Actifs
                </Typography>
                <Typography variant="h4">
                  {formatNumber(stats.systemMetrics?.active_users_24h || 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Dernières 24h
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Total Utilisateurs
                </Typography>
                <Typography variant="h4">
                  {formatNumber(stats.systemMetrics?.total_users || 0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tous rôles confondus
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Medical Activity Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Activité Médicale" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <LocalHospital color="primary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                      Consultations
                    </Typography>
                    <Typography variant="h4">
                      {formatNumber(stats.medicalActivity?.total_consultations || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      +{stats.medicalActivity?.consultations_this_month || 0} ce mois
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Assessment color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                      Analyses
                    </Typography>
                    <Typography variant="h4">
                      {formatNumber(stats.medicalActivity?.total_analyses || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Laboratoire
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Timeline color="success" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                      Prescriptions
                    </Typography>
                    <Typography variant="h4">
                      {formatNumber(stats.medicalActivity?.total_prescriptions || 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Médicaments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Speed color="warning" sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" color="textSecondary">
                      Performance
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {(100 - (stats.systemFailures?.failure_rate || 0)).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Disponibilité
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Alertes Système" />
            <CardContent>
              {stats.systemFailures?.failure_rate > 1 ? (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle>Attention</AlertTitle>
                  Taux d'échec supérieur à la normale: {stats.systemFailures.failure_rate.toFixed(2)}%
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>Système Stable</AlertTitle>
                  Tous les systèmes fonctionnent normalement
                </Alert>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2">Opérations réussies</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {((100 - (stats.systemFailures?.failure_rate || 0))).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={100 - (stats.systemFailures?.failure_rate || 0)} 
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Résumé Rapide" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Nouveaux patients
                  </Typography>
                  <Typography variant="h6">
                    +{stats.patients?.new_this_month || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Nouveaux médecins
                  </Typography>
                  <Typography variant="h6">
                    +{stats.doctors?.new_this_month || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    RDV ce mois
                  </Typography>
                  <Typography variant="h6">
                    {formatNumber(stats.appointments?.this_month || 0)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Institutions actives
                  </Typography>
                  <Typography variant="h6">
                    {formatNumber(stats.institutions?.active || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsOverview; 
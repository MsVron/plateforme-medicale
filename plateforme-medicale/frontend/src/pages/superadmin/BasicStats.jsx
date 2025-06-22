import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  LocalPharmacy as LocalPharmacyIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  CheckCircle as CheckCircleIcon,
  AccountBox as AccountBoxIcon
} from '@mui/icons-material';

const BasicStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBasicStats();
  }, []);

  const fetchBasicStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/superadmin/basic-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching basic stats:', error);
      setError(`Erreur lors de la récupération des statistiques de base: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  };

  const StatCard = ({ title, value, icon, color = '#1976d2', subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
              {formatNumber(value)}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
        📊 Statistiques de Base
      </Typography>
      
      {/* Core Entity Counts */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Entités Principales
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={stats?.basic?.total_patients}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#4CAF50"
            subtitle={`${formatNumber(stats?.active?.active_patients)} actifs`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Médecins"
            value={stats?.basic?.total_doctors}
            icon={<MedicalServicesIcon sx={{ fontSize: 40 }} />}
            color="#2196F3"
            subtitle={`${formatNumber(stats?.active?.active_doctors)} actifs`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Institutions"
            value={stats?.basic?.total_institutions}
            icon={<BusinessIcon sx={{ fontSize: 40 }} />}
            color="#FF9800"
            subtitle={`${formatNumber(stats?.active?.active_institutions)} actives`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Utilisateurs"
            value={stats?.basic?.total_users}
            icon={<AccountBoxIcon sx={{ fontSize: 40 }} />}
            color="#9C27B0"
            subtitle={`${formatNumber(stats?.active?.active_users)} actifs`}
          />
        </Grid>
      </Grid>

      {/* Medical Activity */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'white' }}>
        Activité Médicale
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rendez-vous"
            value={stats?.basic?.total_appointments}
            icon={<EventIcon sx={{ fontSize: 40 }} />}
            color="#E91E63"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Analyses Lab"
            value={stats?.basic?.total_lab_tests}
            icon={<ScienceIcon sx={{ fontSize: 40 }} />}
            color="#795548"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Prescriptions"
            value={stats?.basic?.total_prescriptions}
            icon={<LocalPharmacyIcon sx={{ fontSize: 40 }} />}
            color="#607D8B"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Growth Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Croissance Récente
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box textAlign="center" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {formatNumber(stats?.growth?.new_patients_month)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nouveaux patients (30j)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    {formatNumber(stats?.growth?.new_doctors_month)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nouveaux médecins (30j)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                    {formatNumber(stats?.growth?.new_institutions_month)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nouvelles institutions (30j)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="h5" sx={{ color: '#E91E63', fontWeight: 'bold' }}>
                    {formatNumber(stats?.growth?.new_appointments_week)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nouveaux RDV (7j)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Institution Types */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Types d'Institutions
            </Typography>
            {stats?.institutionTypes?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.institutionTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {stats.institutionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="textSecondary" textAlign="center">
                Aucune donnée disponible
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Today's Activity */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          <TodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Activité d'Aujourd'hui
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center" sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {formatNumber(stats?.today?.appointments_today)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rendez-vous aujourd'hui
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center" sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {formatNumber(stats?.today?.active_users_today)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Utilisateurs actifs aujourd'hui
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box textAlign="center" sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: 1 }}>
              <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                {formatNumber(stats?.today?.verified_patients)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Patients vérifiés
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BasicStats; 
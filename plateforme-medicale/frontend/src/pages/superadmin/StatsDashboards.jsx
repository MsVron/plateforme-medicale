import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Alert,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  Fullscreen as FullscreenIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const StatsDashboards = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState('overview');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [createDashboardOpen, setCreateDashboardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: 'month',
    region: 'all',
    institutionType: 'all',
    specialty: 'all'
  });
  const [dashboards, setDashboards] = useState([]);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [metrics, setMetrics] = useState({
    realTimeData: {},
    reports: [],
    alerts: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/dashboards?filters=${JSON.stringify(filters)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboards(data.dashboards || []);
          setCurrentDashboard(data.dashboards?.[0] || null);
          setMetrics(data.metrics || {
            realTimeData: {},
            reports: [],
            alerts: []
          });
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to basic data if API fails
        const fallbackDashboards = [
          {
            id: 'overview',
            name: 'Vue d\'ensemble',
            description: 'Tableau de bord principal avec métriques clés',
            widgets: ['total_users', 'appointments', 'revenue', 'satisfaction'],
            isDefault: true,
            lastUpdated: new Date().toISOString()
          }
        ];
        
        const fallbackMetrics = {
          realTimeData: {
            activeUsers: 0,
            ongoingConsultations: 0,
            systemLoad: 0,
            alertsCount: 0,
            recentActivity: [],
            performanceMetrics: []
          },
          reports: [],
          alerts: []
        };
        
        setDashboards(fallbackDashboards);
        setCurrentDashboard(fallbackDashboards[0]);
        setMetrics(fallbackMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filters]);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        realTimeData: {
          ...prev.realTimeData,
          activeUsers: prev.realTimeData.activeUsers + Math.floor(Math.random() * 10 - 5),
          ongoingConsultations: Math.max(0, prev.realTimeData.ongoingConsultations + Math.floor(Math.random() * 6 - 3)),
          systemLoad: Math.max(0, Math.min(100, prev.realTimeData.systemLoad + (Math.random() * 4 - 2)))
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeEnabled]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportReport = (reportType) => {
    console.log(`Exporting ${reportType} report...`);
    // Implementation for exporting reports
  };

  const downloadReport = (reportId) => {
    console.log(`Downloading report ${reportId}...`);
    // Implementation for downloading reports
  };

  const createCustomDashboard = (dashboardData) => {
    console.log('Creating custom dashboard:', dashboardData);
    setCreateDashboardOpen(false);
    // Implementation for creating custom dashboard
  };

  const getAlertColor = (type) => {
    const colors = {
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
      success: '#4caf50'
    };
    return colors[type] || '#9e9e9e';
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: '#4caf50',
      good: '#8bc34a',
      warning: '#ff9800',
      error: '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Tableaux de Bord Personnalisés
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Dashboards interactifs, rapports exportables et métriques en temps réel
        </Typography>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Tableau de bord</InputLabel>
            <Select 
              value={selectedDashboard} 
              onChange={(e) => setSelectedDashboard(e.target.value)}
              label="Tableau de bord"
            >
              {dashboards.map((dashboard) => (
                <MenuItem key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          >
            Filtres
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateDashboardOpen(true)}
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          >
            Nouveau
          </Button>
          
          <FormControlLabel
            control={
              <Switch
                checked={realTimeEnabled}
                onChange={(e) => setRealTimeEnabled(e.target.checked)}
                sx={{ 
                  '& .MuiSwitch-thumb': { bgcolor: 'white' },
                  '& .MuiSwitch-track': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              />
            }
            label={
              <Typography sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                {realTimeEnabled ? <PlayIcon /> : <PauseIcon />}
                Temps réel
              </Typography>
            }
          />
          
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => exportReport('dashboard')}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Exporter
          </Button>
        </Box>
      </Box>

      {/* Real-time Metrics Banner */}
      {realTimeEnabled && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {metrics.realTimeData.activeUsers?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption">Utilisateurs actifs</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      {metrics.realTimeData.ongoingConsultations}
                    </Typography>
                    <Typography variant="caption">Consultations en cours</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                      {metrics.realTimeData.systemLoad?.toFixed(1)}%
                    </Typography>
                    <Typography variant="caption">Charge système</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                      {metrics.realTimeData.alertsCount}
                    </Typography>
                    <Typography variant="caption">Alertes actives</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Mise à jour: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Métriques" />
          <Tab label="Rapports" />
          <Tab label="Alertes" />
          <Tab label="Configuration" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Grid container spacing={3}>
        {/* Metrics Tab */}
        {activeTab === 0 && (
          <>
            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  Métriques de Performance
                </Typography>
                {metrics.realTimeData.performanceMetrics?.map((metric, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1">{metric.metric}</Typography>
                      <Chip 
                        label={metric.status}
                        size="small"
                        sx={{ bgcolor: getStatusColor(metric.status), color: 'white' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {metric.value}
                        {metric.unit && metric.unit}
                        {metric.max && `/${metric.max}`}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.max ? (metric.value / metric.max) * 100 : 
                             metric.metric.includes('Temps') ? Math.max(0, 100 - (metric.value / 500) * 100) :
                             metric.value} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getStatusColor(metric.status)
                        }
                      }}
                    />
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Activité Récente
                </Typography>
                {metrics.realTimeData.recentActivity?.map((activity, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, borderLeft: `4px solid ${getAlertColor(activity.type)}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {activity.event}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Custom Widgets Area */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center', minHeight: 200 }}>
                <DashboardIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Zone de Widgets Personnalisés
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ajoutez des widgets personnalisés selon vos besoins d'analyse
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setCreateDashboardOpen(true)}
                >
                  Ajouter un Widget
                </Button>
              </Paper>
            </Grid>
          </>
        )}

        {/* Reports Tab */}
        {activeTab === 1 && (
          <>
            {/* Report Generation */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Générer Nouveau Rapport
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Type de rapport</InputLabel>
                  <Select defaultValue="">
                    <MenuItem value="medical_activity">Activité Médicale</MenuItem>
                    <MenuItem value="financial">Performance Financière</MenuItem>
                    <MenuItem value="institution_performance">Performance Institutions</MenuItem>
                    <MenuItem value="user_analytics">Analytique Utilisateurs</MenuItem>
                    <MenuItem value="compliance">Conformité GDPR</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Période</InputLabel>
                  <Select defaultValue="month">
                    <MenuItem value="week">7 derniers jours</MenuItem>
                    <MenuItem value="month">30 derniers jours</MenuItem>
                    <MenuItem value="quarter">3 derniers mois</MenuItem>
                    <MenuItem value="year">12 derniers mois</MenuItem>
                    <MenuItem value="custom">Période personnalisée</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Format</InputLabel>
                  <Select defaultValue="pdf">
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AssessmentIcon />}
                  onClick={() => exportReport('custom')}
                >
                  Générer Rapport
                </Button>
              </Paper>
            </Grid>

            {/* Available Reports */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Rapports Disponibles
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom du rapport</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Période</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Taille</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metrics.reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.name}</TableCell>
                          <TableCell>
                            <Chip label={report.type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell>
                            <Chip 
                              label={report.status === 'ready' ? 'Prêt' : 'En cours...'}
                              size="small"
                              color={report.status === 'ready' ? 'success' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>{report.size || '-'}</TableCell>
                          <TableCell align="right">
                            {report.status === 'ready' && (
                              <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => downloadReport(report.id)}
                              >
                                Télécharger
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </>
        )}

        {/* Alerts Tab */}
        {activeTab === 2 && (
          <>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  Alertes Système
                </Typography>
                {metrics.alerts.map((alert) => (
                  <Alert 
                    key={alert.id}
                    severity={alert.type}
                    sx={{ mb: 2 }}
                    action={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                  </Alert>
                ))}
              </Paper>
            </Grid>
          </>
        )}

        {/* Configuration Tab */}
        {activeTab === 3 && (
          <>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Paramètres de Mise à Jour
                </Typography>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Mise à jour automatique"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notifications par email"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Mode sombre"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Fréquence de mise à jour</InputLabel>
                  <Select defaultValue="5">
                    <MenuItem value="1">1 minute</MenuItem>
                    <MenuItem value="5">5 minutes</MenuItem>
                    <MenuItem value="15">15 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Gestion des Dashboards
                </Typography>
                {dashboards.map((dashboard) => (
                  <Box key={dashboard.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {dashboard.name}
                      </Typography>
                      <Box>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        {!dashboard.isDefault && (
                          <IconButton size="small">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {dashboard.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Mis à jour: {new Date(dashboard.lastUpdated).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filtres Avancés</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Période</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <MenuItem value="week">7 derniers jours</MenuItem>
                  <MenuItem value="month">30 derniers jours</MenuItem>
                  <MenuItem value="quarter">3 derniers mois</MenuItem>
                  <MenuItem value="year">12 derniers mois</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Région</InputLabel>
                <Select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <MenuItem value="all">Toutes les régions</MenuItem>
                  <MenuItem value="casablanca">Casablanca-Settat</MenuItem>
                  <MenuItem value="rabat">Rabat-Salé-Kénitra</MenuItem>
                  <MenuItem value="marrakech">Marrakech-Safi</MenuItem>
                  <MenuItem value="fes">Fès-Meknès</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type d'institution</InputLabel>
                <Select
                  value={filters.institutionType}
                  onChange={(e) => handleFilterChange('institutionType', e.target.value)}
                >
                  <MenuItem value="all">Tous types</MenuItem>
                  <MenuItem value="hospital">Hôpitaux</MenuItem>
                  <MenuItem value="clinic">Cliniques</MenuItem>
                  <MenuItem value="private">Cabinets privés</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Spécialité</InputLabel>
                <Select
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                >
                  <MenuItem value="all">Toutes spécialités</MenuItem>
                  <MenuItem value="general">Médecine générale</MenuItem>
                  <MenuItem value="cardiology">Cardiologie</MenuItem>
                  <MenuItem value="pediatrics">Pédiatrie</MenuItem>
                  <MenuItem value="dermatology">Dermatologie</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => setFilterDialogOpen(false)}>
            Appliquer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dashboard Dialog */}
      <Dialog open={createDashboardOpen} onClose={() => setCreateDashboardOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Créer un Nouveau Dashboard</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du dashboard"
                placeholder="Ex: Dashboard Marketing"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Description du dashboard..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Sélectionner les widgets à inclure:
              </Typography>
              <Grid container spacing={1}>
                {['Utilisateurs actifs', 'Consultations', 'Revenus', 'Satisfaction', 'Performance', 'Alertes'].map((widget) => (
                  <Grid item xs={12} sm={6} md={4} key={widget}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={widget}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDashboardOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={() => createCustomDashboard()}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatsDashboards; 
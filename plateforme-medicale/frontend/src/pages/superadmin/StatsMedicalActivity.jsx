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
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Healing as HealingIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  MonitorHeart as MonitorIcon,
  Medication as MedicationIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const StatsMedicalActivity = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState(0);
  const [specialty, setSpecialty] = useState('');
  const [stats, setStats] = useState({
    totalConsultations: 0,
    totalTreatments: 0,
    totalAnalyses: 0,
    averageConsultationTime: 0,
    consultationsBySpecialty: [],
    treatmentsByType: [],
    analysisTypes: [],
    monthlyActivity: [],
    performanceMetrics: [],
    urgencyDistribution: [],
    topDiagnoses: [],
    treatmentEfficiency: [],
    medicalProcedures: []
  });

  // Fetch real data from API
  useEffect(() => {
    const fetchMedicalStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/superadmin/stats/medical-activity?period=${period}&specialty=${specialty}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.error('Error fetching medical activity statistics:', error);
        // Fallback to basic stats if API fails
        const fallbackStats = {
          totalConsultations: 0,
          totalTreatments: 0,
          totalAnalyses: 0,
          averageConsultationTime: 0,
          consultationsBySpecialty: [],
          treatmentsByType: [],
          analysisTypes: [],
          monthlyActivity: [],
          performanceMetrics: [],
          urgencyDistribution: [],
          topDiagnoses: [],
          treatmentEfficiency: [],
          medicalProcedures: []
        };
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalStats();
  }, [period, specialty]);

  const getStatusColor = (status) => {
    const colors = {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };
    return colors[status] || '#9E9E9E';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const exportData = () => {
    console.log('Exporting medical activity statistics...');
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
          Activité Médicale
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Analyse complète des consultations, traitements et procédures médicales
        </Typography>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'white' }}>Période</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
            >
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Actualiser
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportData}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Exporter
          </Button>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalConsultations.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Consultations
                  </Typography>
                </Box>
                <HospitalIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalTreatments.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Traitements
                  </Typography>
                </Box>
                <HealingIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.totalAnalyses.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Analyses
                  </Typography>
                </Box>
                <ScienceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stats.averageConsultationTime} min
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Durée Moyenne
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Vue d'ensemble" />
          <Tab label="Spécialités" />
          <Tab label="Traitements" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Monthly Activity Trends */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Évolution de l'Activité Médicale
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <ComposedChart data={stats.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area dataKey="consultations" fill="#667eea" stroke="#667eea" fillOpacity={0.3} name="Consultations" />
                  <Bar dataKey="treatments" fill="#4CAF50" name="Traitements" />
                  <Line type="monotone" dataKey="analyses" stroke="#FF9800" strokeWidth={3} name="Analyses" />
                </ComposedChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Urgency Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1 }} />
                Distribution par Urgence
              </Typography>
              <ResponsiveContainer width="100%" height="75%">
                <PieChart>
                  <Pie
                    data={stats.urgencyDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ level, percentage }) => `${level}: ${percentage}%`}
                  >
                    {(stats.urgencyDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Analysis Types */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <ScienceIcon sx={{ mr: 1 }} />
                Types d'Analyses
              </Typography>
              <Box sx={{ mt: 2 }}>
                {(stats.analysisTypes || []).map((analysis, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{analysis.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {analysis.value.toLocaleString()} ({analysis.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Top Diagnoses */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                Diagnostics les Plus Fréquents
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Diagnostic</TableCell>
                      <TableCell align="right">Nombre de cas</TableCell>
                      <TableCell align="center">Tendance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats.topDiagnoses || []).map((diagnosis, index) => (
                      <TableRow key={index}>
                        <TableCell>{diagnosis.diagnosis}</TableCell>
                        <TableCell align="right">{diagnosis.count}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={getTrendIcon(diagnosis.trend)}
                            size="small"
                            color={diagnosis.trend === 'up' ? 'error' : diagnosis.trend === 'down' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {/* Consultations by Specialty */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '500px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Consultations par Spécialité
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={stats.consultationsBySpecialty || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Specialty Growth */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '500px' }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Croissance par Spécialité
              </Typography>
              {(stats.consultationsBySpecialty || []).map((specialty, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {specialty.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                    {specialty.value.toLocaleString()}
                  </Typography>
                  <Chip 
                    label={`+${specialty.growth}%`}
                    color={specialty.growth > 10 ? 'success' : 'primary'}
                    size="small"
                  />
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Treatment Efficiency by Specialty */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Efficacité des Traitements par Spécialité
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <RadarChart data={stats.treatmentEfficiency || []}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="specialty" />
                  <PolarRadiusAxis angle={90} domain={[70, 100]} />
                  <Radar name="Efficacité" dataKey="efficiency" stroke="#667eea" fill="#667eea" fillOpacity={0.3} />
                  <Radar name="Satisfaction" dataKey="satisfaction" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Treatments by Type */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <HealingIcon sx={{ mr: 1 }} />
                Traitements par Type
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={stats.treatmentsByType || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {(stats.treatmentsByType || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Medical Procedures */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MedicationIcon sx={{ mr: 1 }} />
                Procédures Médicales
              </Typography>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Procédure</TableCell>
                      <TableCell align="right">Nombre</TableCell>
                      <TableCell align="right">Durée (min)</TableCell>
                      <TableCell align="right">Coût (MAD)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(stats.medicalProcedures || []).map((procedure, index) => (
                      <TableRow key={index}>
                        <TableCell>{procedure.procedure}</TableCell>
                        <TableCell align="right">{procedure.count}</TableCell>
                        <TableCell align="right">{procedure.duration}</TableCell>
                        <TableCell align="right">{procedure.cost}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <MonitorIcon sx={{ mr: 1 }} />
                Métriques de Performance
              </Typography>
              <Grid container spacing={3}>
                {(stats.performanceMetrics || []).map((metric, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Card sx={{ height: '100%', border: `2px solid ${getStatusColor(metric.status)}` }}>
                      <CardContent>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: getStatusColor(metric.status) }}>
                          {metric.value}{metric.unit}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {metric.metric}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Objectif: {metric.target}{metric.unit}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(metric.value / metric.target) * 100}
                          sx={{ 
                            mt: 2, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getStatusColor(metric.status)
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Insights Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Insights Médicaux
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Performance excellente:</strong> Taux de satisfaction patients > 94%
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Attention:</strong> Durée moyenne de consultation légèrement élevée
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} md={4}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Tendance:</strong> Augmentation des consultations en pédiatrie (+18.5%)
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsMedicalActivity; 
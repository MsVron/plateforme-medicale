import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Alert,
    AlertTitle,
    Box,
    Grid,
    CircularProgress,
    Paper,
    LinearProgress,
    Divider,
    Tabs,
    Tab,
    Button,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area,
    ComposedChart,
    RadialBarChart,
    RadialBar
} from 'recharts';
import { 
    People as Users, 
    PersonCheck as UserCheck, 
    Business as Building2, 
    Event as Calendar, 
    TrendingUp,
    Timeline as Activity,
    MedicalServices as Stethoscope,
    Warning as AlertTriangle,
    BarChart as BarChartIcon,
    CheckCircle as CheckCircle,
    Error as ErrorIcon,
    Science as ScienceIcon,
    LocalPharmacy as PharmacyIcon,
    LocalHospital as HospitalIcon,
    LocationOn as LocationIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Insights as InsightsIcon,
    Dashboard as DashboardIcon,
    Analytics as AnalyticsIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/statistics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError('Erreur lors de la récupération des statistiques');
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError('Erreur lors de la récupération des statistiques');
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num || 0);
    };

    const formatPercentage = (num) => {
        return `${(num || 0).toFixed(1)}%`;
    };

    const getSystemHealthColor = (failureRate) => {
        if (failureRate < 1) return '#4CAF50'; // Green
        if (failureRate < 5) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    const getSystemHealthStatus = (failureRate) => {
        if (failureRate < 1) return 'Excellent';
        if (failureRate < 5) return 'Bon';
        return 'Attention Requise';
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" gutterBottom>
                    Tableau de Bord Administratif
                </Typography>
                <Box>
                    <Tooltip title="Actualiser les données">
                        <IconButton onClick={fetchStatistics} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Exporter le rapport">
                        <IconButton color="primary">
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* System Health Alert */}
            {stats.systemHealth && stats.systemHealth.failure_rate > 5 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Alerte Système Critique</AlertTitle>
                    Taux d'échec élevé détecté: {formatPercentage(stats.systemHealth.failure_rate)} 
                    ({stats.systemHealth.failures_24h} échecs dans les dernières 24h)
                </Alert>
            )}

            {/* Key Insights */}
            {stats.insights && (
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <InsightsIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Insights Clés</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Spécialité Top Performance</Typography>
                                <Typography variant="h6">{stats.insights.topPerformingSpecialty}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Ville la Plus Active</Typography>
                                <Typography variant="h6">{stats.insights.mostActiveCity}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Croissance Patients</Typography>
                                <Typography variant="h6">+{stats.insights.patientGrowthRate}%</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>État Système</Typography>
                                <Typography variant="h6">{stats.insights.systemHealthStatus}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Patients
                                    </Typography>
                                    <Typography variant="h4">
                                        {formatNumber(stats.overview?.patients)}
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        +{stats.detailedStats?.patients?.new_patients_week || 0} cette semaine
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {formatPercentage((stats.detailedStats?.patients?.complete_profiles / stats.overview?.patients) * 100)} profils complets
                                    </Typography>
                                </Box>
                                <Users color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Médecins
                                    </Typography>
                                    <Typography variant="h4">
                                        {formatNumber(stats.overview?.doctors)}
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        {stats.detailedStats?.doctors?.active_doctors || 0} actifs
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {stats.detailedStats?.doctors?.accepting_patients || 0} acceptent nouveaux patients
                                    </Typography>
                                </Box>
                                <Stethoscope color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Institutions
                                    </Typography>
                                    <Typography variant="h4">
                                        {formatNumber(stats.overview?.institutions)}
                                    </Typography>
                                    <Typography variant="body2" color="warning.main">
                                        {stats.detailedStats?.institutions?.pending_approval || 0} en attente
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {stats.detailedStats?.institutions?.active_institutions || 0} actives
                                    </Typography>
                                </Box>
                                <Building2 color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Rendez-vous
                                    </Typography>
                                    <Typography variant="h4">
                                        {formatNumber(stats.overview?.appointments)}
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        +{stats.detailedStats?.appointments?.appointments_week || 0} cette semaine
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {Math.round(stats.detailedStats?.appointments?.avg_duration || 0)} min moyenne
                                    </Typography>
                                </Box>
                                <Calendar color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabs for Different Views */}
            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                    <Tab label="Vue d'ensemble" icon={<DashboardIcon />} />
                    <Tab label="Analyses Médicales" icon={<ScienceIcon />} />
                    <Tab label="Hôpitaux" icon={<HospitalIcon />} />
                    <Tab label="Pharmacies" icon={<PharmacyIcon />} />
                    <Tab label="Géographie" icon={<LocationIcon />} />
                    <Tab label="Système" icon={<AssessmentIcon />} />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {/* Appointments by Status */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Statut des Rendez-vous" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={stats.appointmentsByStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {stats.appointmentsByStatus?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Monthly Trends */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Tendances Mensuelles" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={stats.monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                                        <Line type="monotone" dataKey="appointments" stroke="#82ca9d" name="RDV" />
                                        <Line type="monotone" dataKey="consultations" stroke="#ffc658" name="Consultations" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Specialty Performance */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Performance par Spécialité" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={stats.specialtyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="total_doctors" fill="#8884d8" name="Médecins" />
                                        <Bar dataKey="total_appointments" fill="#82ca9d" name="RDV" />
                                        <Bar dataKey="total_reviews" fill="#ffc658" name="Avis" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Institution Performance Overview */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Performance des Institutions" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={stats.institutionPerformance?.slice(0, 8)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="doctors" fill="#8884d8" name="Médecins" />
                                        <Bar dataKey="appointments" fill="#82ca9d" name="RDV" />
                                        <Bar dataKey="success_rate" fill="#ffc658" name="Taux Succès %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    {/* Medical Analysis Statistics */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Analyses Médicales par Catégorie" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={stats.analysisStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="total_tests" fill="#8884d8" name="Tests Totaux" />
                                        <Bar dataKey="completed" fill="#82ca9d" name="Complétés" />
                                        <Bar dataKey="validated" fill="#00C49F" name="Validés" />
                                        <Bar dataKey="critical_results" fill="#ff7300" name="Résultats Critiques" />
                                        <Bar dataKey="urgent_tests" fill="#FF8042" name="Tests Urgents" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 2 && (
                <Grid container spacing={3}>
                    {/* Hospital Statistics */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Admissions Hospitalières</Typography>
                                <Typography variant="h3" color="primary">
                                    {formatNumber(stats.detailedStats?.hospital?.total_admissions)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {stats.detailedStats?.hospital?.current_admissions || 0} actuellement hospitalisés
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(stats.detailedStats?.hospital?.current_admissions / stats.detailedStats?.hospital?.total_admissions) * 100 || 0} 
                                    sx={{ mt: 1 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Chirurgies</Typography>
                                <Typography variant="h3" color="secondary">
                                    {formatNumber(stats.detailedStats?.hospital?.total_surgeries)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {stats.detailedStats?.hospital?.completed_surgeries || 0} complétées
                                </Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(stats.detailedStats?.hospital?.completed_surgeries / stats.detailedStats?.hospital?.total_surgeries) * 100 || 0} 
                                    sx={{ mt: 1 }}
                                    color="secondary"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Durée Moyenne de Séjour</Typography>
                                <Typography variant="h3" color="info">
                                    {Math.round(stats.detailedStats?.hospital?.avg_stay_days || 0)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    jours en moyenne
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 3 && (
                <Grid container spacing={3}>
                    {/* Pharmacy Statistics */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Statut des Prescriptions" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Dispensées', value: stats.detailedStats?.pharmacy?.dispensed || 0 },
                                                { name: 'En Attente', value: stats.detailedStats?.pharmacy?.pending || 0 },
                                                { name: 'Expirées', value: stats.detailedStats?.pharmacy?.expired || 0 }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {[0, 1, 2].map((index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Médicaments Uniques</Typography>
                                <Typography variant="h3" color="primary">
                                    {formatNumber(stats.detailedStats?.pharmacy?.unique_medications)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                                    Total Prescriptions: {formatNumber(stats.detailedStats?.pharmacy?.total_prescriptions)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Ce mois: {formatNumber(stats.detailedStats?.pharmacy?.prescriptions_month)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 4 && (
                <Grid container spacing={3}>
                    {/* Geographic Distribution */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Distribution Géographique" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={stats.geographicStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="city" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                                        <Bar dataKey="doctors" fill="#82ca9d" name="Médecins" />
                                        <Bar dataKey="institutions" fill="#ffc658" name="Institutions" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {activeTab === 5 && (
                <Grid container spacing={3}>
                    {/* System Health */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Santé du Système" />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Taux de Réussite
                                            </Typography>
                                            <Typography 
                                                variant="h4" 
                                                sx={{ 
                                                    color: getSystemHealthColor(stats.systemHealth?.failure_rate || 0),
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {formatPercentage(stats.systemHealth?.success_rate)}
                                            </Typography>
                                            <Chip 
                                                label={getSystemHealthStatus(stats.systemHealth?.failure_rate || 0)}
                                                color={stats.systemHealth?.failure_rate < 1 ? 'success' : stats.systemHealth?.failure_rate < 5 ? 'warning' : 'error'}
                                                size="small"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Opérations 24h
                                            </Typography>
                                            <Typography variant="h4">
                                                {formatNumber(stats.systemHealth?.operations_24h)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {stats.systemHealth?.failures_24h || 0} échecs
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Utilisateurs Actifs
                                            </Typography>
                                            <Typography variant="h4">
                                                {formatNumber(stats.systemHealth?.active_users_24h)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Dernières 24h
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Total Opérations
                                            </Typography>
                                            <Typography variant="h4">
                                                {formatNumber(stats.systemHealth?.total_operations)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Cette période
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* User Activity */}
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Activité des Utilisateurs" />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" color="textSecondary">Total Utilisateurs</Typography>
                                        <Typography variant="h4">{formatNumber(stats.detailedStats?.userActivity?.total_users)}</Typography>
                                        <Typography variant="body2" color="success.main">
                                            {stats.detailedStats?.userActivity?.verified_users || 0} vérifiés
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" color="textSecondary">Actifs 24h</Typography>
                                        <Typography variant="h4">{formatNumber(stats.detailedStats?.userActivity?.users_24h)}</Typography>
                                        <Typography variant="body2" color="info.main">
                                            {stats.detailedStats?.userActivity?.users_week || 0} cette semaine
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" color="textSecondary">Par Type</Typography>
                                        <Typography variant="body2">
                                            Patients: {stats.detailedStats?.userActivity?.patient_users || 0}
                                        </Typography>
                                        <Typography variant="body2">
                                            Médecins: {stats.detailedStats?.userActivity?.doctor_users || 0}
                                        </Typography>
                                        <Typography variant="body2">
                                            Institutions: {stats.detailedStats?.userActivity?.institution_users || 0}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Statistics; 
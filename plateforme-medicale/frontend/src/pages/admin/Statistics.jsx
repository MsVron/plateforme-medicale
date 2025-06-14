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
    LocalPharmacy as PharmacyIcon
} from '@mui/icons-material';

const Statistics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

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
                Statistiques de la Plateforme
            </Typography>

            {/* System Health Alert */}
            {stats.systemHealth && stats.systemHealth.failure_rate > 5 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Alerte Système</AlertTitle>
                    Taux d'échec élevé détecté: {stats.systemHealth.failure_rate?.toFixed(2)}% 
                    ({stats.systemHealth.failures_24h} échecs dans les dernières 24h)
                </Alert>
            )}

            {/* Overview Cards */}
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
                                        {formatNumber(stats.overview?.patients || 0)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        +{stats.recentActivity?.patients || 0} cette semaine
                                    </Typography>
                                </Box>
                                <Users color="primary" sx={{ fontSize: 40 }} />
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
                                        {formatNumber(stats.overview?.doctors || 0)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Actifs
                                    </Typography>
                                </Box>
                                <Stethoscope color="primary" sx={{ fontSize: 40 }} />
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
                                        {formatNumber(stats.overview?.institutions || 0)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Partenaires
                                    </Typography>
                                </Box>
                                <Building2 color="primary" sx={{ fontSize: 40 }} />
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
                                        {formatNumber(stats.overview?.appointments || 0)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        +{stats.recentActivity?.appointments || 0} cette semaine
                                    </Typography>
                                </Box>
                                <Calendar color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* System Health Metrics */}
            {stats.systemHealth && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
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
                                                    color: getSystemHealthColor(stats.systemHealth.failure_rate || 0),
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {(100 - (stats.systemHealth.failure_rate || 0)).toFixed(1)}%
                                            </Typography>
                                            <Chip 
                                                label={getSystemHealthStatus(stats.systemHealth.failure_rate || 0)}
                                                color={stats.systemHealth.failure_rate < 1 ? 'success' : stats.systemHealth.failure_rate < 5 ? 'warning' : 'error'}
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
                                                {formatNumber(stats.systemHealth.operations_24h || 0)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {stats.systemHealth.failures_24h || 0} échecs
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Utilisateurs Affectés
                                            </Typography>
                                            <Typography variant="h4">
                                                {formatNumber(stats.systemHealth.affected_users || 0)}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Par les échecs
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" color="textSecondary">
                                                Total Opérations
                                            </Typography>
                                            <Typography variant="h4">
                                                {formatNumber(stats.systemHealth.total_operations || 0)}
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
                </Grid>
            )}

            {/* Medical Analysis & Prescriptions */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.analysisStats && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Analyses Médicales" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.analysisStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total_tests" fill="#8884d8" name="Tests Totaux" />
                                        <Bar dataKey="completed" fill="#82ca9d" name="Complétés" />
                                        <Bar dataKey="critical_results" fill="#ff7300" name="Résultats Critiques" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {stats.prescriptionStats && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Prescriptions" />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                            <Typography variant="h6">Prescriptions Totales</Typography>
                                            <Typography variant="h4" color="primary">
                                                {formatNumber(stats.prescriptionStats.total_prescriptions || 0)}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                            <Typography variant="h6">Médicaments Uniques</Typography>
                                            <Typography variant="h4" color="secondary">
                                                {formatNumber(stats.prescriptionStats.unique_medications || 0)}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="h6">Ce Mois</Typography>
                                            <Typography variant="h4" color="success.main">
                                                {formatNumber(stats.prescriptionStats.prescriptions_this_month || 0)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Appointments by Status */}
                {stats.appointmentsByStatus && stats.appointmentsByStatus.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Rendez-vous par Statut" />
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
                                            {stats.appointmentsByStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Specialties */}
                {stats.specialtyStats && stats.specialtyStats.length > 0 && (
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Médecins par Spécialité" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.specialtyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" name="Total" />
                                        <Bar dataKey="active_count" fill="#82ca9d" name="Actifs" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Monthly Trends */}
            {stats.monthlyTrends && stats.monthlyTrends.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Tendances Mensuelles" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={stats.monthlyTrends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="patients" stroke="#8884d8" name="Nouveaux Patients" />
                                        <Line type="monotone" dataKey="appointments" stroke="#82ca9d" name="Rendez-vous" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Institution Performance */}
            {stats.institutionStats && stats.institutionStats.length > 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title="Performance des Institutions" />
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={stats.institutionStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="doctors" fill="#8884d8" name="Médecins" />
                                        <Bar dataKey="appointments" fill="#82ca9d" name="Rendez-vous" />
                                        <Bar dataKey="success_rate" fill="#ffc658" name="Taux de Réussite %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Statistics; 
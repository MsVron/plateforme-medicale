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
    Paper
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
    Legend
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
    BarChart as BarChartIcon
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

    if (!stats) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                <AlertTitle>Aucune donnée</AlertTitle>
                Aucune donnée disponible
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <BarChartIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                    Tableau de Bord - Statistiques
                </Typography>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Total Patients
                                    </Typography>
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {formatNumber(stats.overview.patients)}
                                    </Typography>
                                </Box>
                                <Users sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Médecins Actifs
                                    </Typography>
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {formatNumber(stats.overview.doctors)}
                                    </Typography>
                                </Box>
                                <Stethoscope sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Institutions
                                    </Typography>
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {formatNumber(stats.overview.institutions)}
                                    </Typography>
                                </Box>
                                <Building2 sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                        color: 'white'
                    }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Rendez-vous
                                    </Typography>
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {formatNumber(stats.overview.appointments)}
                                    </Typography>
                                </Box>
                                <Calendar sx={{ fontSize: 48, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Activity />
                                    <Typography variant="h6">
                                        Activité Récente (7 derniers jours)
                                    </Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Calendar color="primary" />
                                            <Typography fontWeight="medium">Nouveaux rendez-vous</Typography>
                                        </Box>
                                        <Chip label={stats.recentActivity.appointments} color="primary" />
                                    </Box>
                                </Paper>
                                <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Users color="success" />
                                            <Typography fontWeight="medium">Nouveaux patients</Typography>
                                        </Box>
                                        <Chip label={stats.recentActivity.patients} color="success" />
                                    </Box>
                                </Paper>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Appointment Status Distribution */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Statut des Rendez-vous" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
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
            </Grid>

            {/* Monthly Trends */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} lg={8}>
                    <Card>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <TrendingUp />
                                    <Typography variant="h6">Évolution Mensuelle</Typography>
                                </Box>
                            }
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stats.monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="patients" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        name="Nouveaux Patients"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="appointments" 
                                        stroke="#82ca9d" 
                                        strokeWidth={2}
                                        name="Rendez-vous"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card>
                        <CardHeader title="Spécialités Populaires" />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.specialtyStats} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Institution Performance */}
            <Card>
                <CardHeader 
                    title={
                        <Box display="flex" alignItems="center" gap={1}>
                            <Building2 />
                            <Typography variant="h6">Performance des Institutions</Typography>
                        </Box>
                    }
                />
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.institutionStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="patients" fill="#8884d8" name="Patients" />
                            <Bar dataKey="appointments" fill="#82ca9d" name="Rendez-vous" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Statistics; 
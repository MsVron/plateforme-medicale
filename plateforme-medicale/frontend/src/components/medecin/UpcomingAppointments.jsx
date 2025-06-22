import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Popover
} from '@mui/material';
import { formatDate } from '../../utils/dateUtils';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Place as PlaceIcon,
  Today as TodayIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PersonOff as PersonOffIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [paginatedAppointments, setPaginatedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [displayDateFilter, setDisplayDateFilter] = useState('');
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [confirmDialog, setConfirmDialog] = useState({ open: false, appointmentId: null, action: null });
  const rowsPerPage = 10;

  // Status colors
  const statusColors = {
    'planifié': 'info',
    'confirmé': 'success',
    'en cours': 'warning',
    'terminé': 'default',
    'annulé': 'error',
    'patient absent': 'error'
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, dateFilter]);

  useEffect(() => {
    applyPagination();
  }, [filteredAppointments, page]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch all appointments without pagination to handle filtering properly
      const response = await axios.get(`http://localhost:5000/api/medecin/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: 1000, // Get a large number to fetch all appointments
          offset: 0
        }
      });
      
      console.log('=== APPOINTMENTS FETCHED ===');
      console.log('Total appointments:', response.data.appointments.length);
      console.log('Appointments data:', response.data.appointments);
      console.log('============================');
      setAppointments(response.data.appointments);
      setFilteredAppointments(response.data.appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Impossible de récupérer les rendez-vous. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleDateFilter = (event) => {
    const inputValue = event.target.value;
    
    // Handle dd/MM/yyyy input format
    if (inputValue.includes('/')) {
      const [day, month, year] = inputValue.split('/');
      if (day && month && year && day.length <= 2 && month.length <= 2 && year.length === 4) {
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        setDateFilter(isoDate);
        setDisplayDateFilter(inputValue);
        return;
      }
    }
    
    // Handle direct input (typing)
    setDisplayDateFilter(inputValue);
    
    // Try to parse and convert to ISO format for filtering
    if (inputValue.length === 10 && inputValue.includes('/')) {
      const [day, month, year] = inputValue.split('/');
      if (day && month && year) {
        const parsedDay = parseInt(day);
        const parsedMonth = parseInt(month);
        const parsedYear = parseInt(year);
        
        if (parsedDay >= 1 && parsedDay <= 31 && 
            parsedMonth >= 1 && parsedMonth <= 12 && 
            parsedYear >= 1900 && parsedYear <= 2100) {
          const isoDate = `${parsedYear}-${parsedMonth.toString().padStart(2, '0')}-${parsedDay.toString().padStart(2, '0')}`;
          setDateFilter(isoDate);
        }
      }
    } else if (inputValue === '') {
      setDateFilter('');
    }
  };

  // Convert date from yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return formatDate(date.toISOString());
    } catch (error) {
      return dateString;
    }
  };

  // Convert date from dd/mm/yyyy to yyyy-mm-dd for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      return dateString;
    }
  };

  const handleCalendarOpen = (event) => {
    setCalendarAnchor(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setCalendarAnchor(null);
  };

  const handleCalendarDateSelect = (selectedDate) => {
    // Use local date to avoid timezone issues
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    
    const isoDate = `${year}-${month}-${day}`;
    const displayDate = `${day}/${month}/${year}`;
    
    setDateFilter(isoDate);
    setDisplayDateFilter(displayDate);
    handleCalendarClose();
  };

  // Enhanced calendar component with navigation
  const SimpleCalendar = () => {
    const today = new Date();
    const currentMonth = calendarDate.getMonth();
    const currentYear = calendarDate.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    // Navigation functions
    const goToPreviousMonth = () => {
      setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
    };
    
    const goToNextMonth = () => {
      setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
    };
    
    const goToToday = () => {
      setCalendarDate(new Date());
    };
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Box key={`empty-${i}`} sx={{ width: 32, height: 32 }} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      
      // Use local date formatting to avoid timezone issues
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = date.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      
      const isSelected = dateFilter === dateString;
      
      days.push(
        <Button
          key={day}
          onClick={() => handleCalendarDateSelect(date)}
          sx={{
            minWidth: 32,
            width: 32,
            height: 32,
            p: 0,
            fontSize: '0.875rem',
            color: isSelected ? 'white' : isToday ? 'primary.main' : 'text.primary',
            backgroundColor: isSelected ? 'primary.main' : 'transparent',
            border: isToday && !isSelected ? '1px solid' : 'none',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          {day}
        </Button>
      );
    }
    
    return (
      <Box sx={{ p: 2, width: 320 }}>
        {/* Header with navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={goToPreviousMonth} size="small">
            <ChevronLeftIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" align="center">
              {monthNames[currentMonth]} {currentYear}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={goToToday}
              sx={{ 
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                fontSize: '0.75rem'
              }}
            >
              Aujourd'hui
            </Button>
          </Box>
          
          <IconButton onClick={goToNextMonth} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
        
        {/* Days of week header */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(dayName => (
            <Typography key={dayName} variant="caption" align="center" sx={{ fontWeight: 'bold', py: 1 }}>
              {dayName}
            </Typography>
          ))}
        </Box>
        
        {/* Calendar grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {days}
        </Box>
        
        {/* Quick navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 1 }}>
          <Button
            size="small"
            variant="text"
            onClick={() => setCalendarDate(new Date(currentYear - 1, currentMonth, 1))}
            sx={{ fontSize: '0.75rem' }}
          >
            {currentYear - 1}
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => setCalendarDate(new Date(currentYear + 1, currentMonth, 1))}
            sx={{ fontSize: '0.75rem' }}
          >
            {currentYear + 1}
          </Button>
        </Box>
      </Box>
    );
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patient_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.patient_prenom + ' ' + appointment.patient_nom).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(appointment => {
        // Extract just the date part from the appointment datetime
        const appointmentDateOnly = appointment.date_heure_debut.split('T')[0];
        
        // Compare the date strings directly (both in YYYY-MM-DD format)
        return appointmentDateOnly === dateFilter;
      });
    }

      setFilteredAppointments(filtered);
    
    // Reset to first page when filters change
    setPage(1);
  };

  const applyPagination = () => {
    const totalFilteredAppointments = filteredAppointments.length;
    const newTotalPages = Math.ceil(totalFilteredAppointments / rowsPerPage);
    
    // Calculate start and end indices for current page
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    // Get appointments for current page
    const currentPageAppointments = filteredAppointments.slice(startIndex, endIndex);
    
    setPaginatedAppointments(currentPageAppointments);
    setTotalPages(newTotalPages);
    
    // If current page is beyond available pages, reset to page 1
    if (page > newTotalPages && newTotalPages > 0) {
      setPage(1);
    }
  };

  const handleAttendanceAction = (appointmentId, action) => {
    setConfirmDialog({ 
      open: true, 
      appointmentId, 
      action,
      title: action === 'present' ? 'Confirmer la présence' : 'Marquer comme absent',
      message: action === 'present' 
        ? 'Confirmer que le patient s\'est présenté au rendez-vous ?' 
        : 'Marquer le patient comme absent ?'
    });
  };

  const handleConfirmAttendance = async () => {
    try {
      const { appointmentId, action } = confirmDialog;
      const token = localStorage.getItem('token');
      
      const newStatus = action === 'present' ? 'en cours' : 'patient absent';
      
      await axios.put(
        `http://localhost:5000/api/medecin/appointments/${appointmentId}/status`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, statut: newStatus }
          : appointment
      );
      setAppointments(updatedAppointments);
      
      setConfirmDialog({ open: false, appointmentId: null, action: null });
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Erreur lors de la mise à jour du statut du rendez-vous');
      setConfirmDialog({ open: false, appointmentId: null, action: null });
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ open: false, appointmentId: null, action: null });
  };

  // Check if appointment is today or in the past (for attendance tracking)
  const canTrackAttendance = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    
    // Set both dates to start of day for comparison
    today.setHours(0, 0, 0, 0);
    appointment.setHours(0, 0, 0, 0);
    
    const canTrack = appointment <= today;
    console.log('=== ATTENDANCE CHECK ===');
    console.log('Appointment date:', appointmentDate);
    console.log('Today:', today.toISOString());
    console.log('Appointment (normalized):', appointment.toISOString());
    console.log('Can track attendance:', canTrack);
    console.log('========================');
    return canTrack;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (appointments.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Aucun rendez-vous à venir
        </Typography>
        <Typography variant="body1">
          Vous n'avez pas de rendez-vous programmés pour le moment.
        </Typography>
      </Paper>
    );
  }

  if (filteredAppointments.length === 0 && (searchTerm || dateFilter)) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
          <TodayIcon sx={{ mr: 1, color: 'white' }} /> Rendez-vous à venir
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <TextField
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  width: 300,
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <TextField
                    type="text"
                    label="Filtrer par date"
                    placeholder="jj/mm/aaaa"
                    value={displayDateFilter}
                    onChange={handleDateFilter}
                    InputLabelProps={{
                      shrink: true,
                      sx: { color: 'rgba(255, 255, 255, 0.7)' }
                    }}
                    inputProps={{
                      maxLength: 10,
                      pattern: "\\d{2}/\\d{2}/\\d{4}"
                    }}
                    sx={{ 
                      width: 200,
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white',
                        },
                      },
                    }}
                    onKeyDown={(e) => {
                      if (!/[\d/]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        e.preventDefault();
                      }
                      
                      if (/\d/.test(e.key)) {
                        const currentValue = e.target.value;
                        if (currentValue.length === 2 || currentValue.length === 5) {
                          if (!currentValue.endsWith('/')) {
                            e.target.value = currentValue + '/';
                            setDisplayDateFilter(currentValue + '/');
                          }
                        }
                      }
                    }}
                  />
                  <Tooltip title="Ouvrir le calendrier">
                    <IconButton
                      onClick={handleCalendarOpen}
                      sx={{
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        mt: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      <CalendarIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                {dateFilter && (
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mt: 0.5 }}>
                    ✓ Date sélectionnée: {formatDateForDisplay(dateFilter)}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setDisplayDateFilter('');
                  handleCalendarClose();
                }}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Effacer les filtres
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Aucun rendez-vous trouvé
          </Typography>
          <Typography variant="body1">
            Aucun rendez-vous ne correspond aux critères de recherche sélectionnés.
          </Typography>
        </Paper>

        <Popover
          open={Boolean(calendarAnchor)}
          anchorEl={calendarAnchor}
          onClose={handleCalendarClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <SimpleCalendar />
        </Popover>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', color: 'white' }}>
        <TodayIcon sx={{ mr: 1, color: 'white' }} /> Rendez-vous à venir
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
        <TextField
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
          }}
              sx={{ 
                width: 300,
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />
          </Grid>
          <Grid item>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TextField
                  type="text"
                  label="Filtrer par date"
                  placeholder="jj/mm/aaaa"
                  value={displayDateFilter}
                  onChange={handleDateFilter}
                  InputLabelProps={{
                    shrink: true,
                    sx: { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                  inputProps={{
                    maxLength: 10,
                    pattern: "\\d{2}/\\d{2}/\\d{4}"
                  }}
                  sx={{ 
                    width: 200,
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: 1,
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                  }}
                  onKeyDown={(e) => {
                    // Allow only numbers, backspace, delete, and forward slash
                    if (!/[\d/]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                      e.preventDefault();
                    }
                    
                    // Auto-add slashes
                    if (/\d/.test(e.key)) {
                      const currentValue = e.target.value;
                      if (currentValue.length === 2 || currentValue.length === 5) {
                        if (!currentValue.endsWith('/')) {
                          e.target.value = currentValue + '/';
                          setDisplayDateFilter(currentValue + '/');
                        }
                      }
                    }
                  }}
                />
                <Tooltip title="Ouvrir le calendrier">
                  <IconButton
                    onClick={handleCalendarOpen}
                    sx={{
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      mt: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'white',
                      },
                    }}
                  >
                    <CalendarIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {dateFilter && (
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', mt: 0.5 }}>
                  ✓ Date sélectionnée: {formatDateForDisplay(dateFilter)}
                </Typography>
              )}
            </Box>
          </Grid>
          {(searchTerm || dateFilter) && (
            <Grid item>
              <Button
                variant="outlined"
                                 onClick={() => {
                   setSearchTerm('');
                   setDateFilter('');
                   setDisplayDateFilter('');
                   handleCalendarClose();
                 }}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Effacer les filtres
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heure</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>Lieu</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.map((appointment) => {
              const showAttendanceButtons = canTrackAttendance(appointment.date_heure_debut) && 
                                          appointment.statut !== 'patient absent' && 
                                          appointment.statut !== 'en cours' && 
                                          appointment.statut !== 'terminé';
              
              console.log('=== BUTTON VISIBILITY CHECK ===');
              console.log('Appointment ID:', appointment.id);
              console.log('Appointment Date:', appointment.date_heure_debut);
              console.log('Appointment Status:', appointment.statut);
              console.log('Can track attendance:', canTrackAttendance(appointment.date_heure_debut));
              console.log('Show attendance buttons:', showAttendanceButtons);
              console.log('===============================');
              
              return (
              <TableRow key={appointment.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.date_formatted}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.heure_debut_formatted} - {appointment.heure_fin_formatted}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Link to={`/medecin/patients/${appointment.patient_id}/dossier`}>
                      {appointment.patient_prenom} {appointment.patient_nom}
                    </Link>
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      ({appointment.patient_age} ans)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{appointment.motif}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlaceIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    {appointment.institution_nom}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={appointment.statut} 
                    color={statusColors[appointment.statut]} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {/* Attendance tracking buttons - only show for today's appointments or past ones */}
                      {showAttendanceButtons && (
                        <>
                          <Tooltip title="Patient présent">
                            <IconButton 
                              onClick={() => handleAttendanceAction(appointment.id, 'present')}
                              size="small"
                              color="success"
                              sx={{ minWidth: 'auto' }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Patient absent">
                      <IconButton 
                              onClick={() => handleAttendanceAction(appointment.id, 'absent')}
                        size="small"
                              color="error"
                              sx={{ minWidth: 'auto' }}
                      >
                              <PersonOffIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                        </>
                      )}
                      
                      {/* Regular action buttons */}
                    <Tooltip title="Dossier médical">
                      <IconButton 
                        component={Link} 
                        to={`/medecin/patients/${appointment.patient_id}/dossier`}
                        size="small"
                        color="secondary"
                          sx={{ minWidth: 'auto' }}
                      >
                        <MedicalIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                      <Tooltip title="Consultation">
                      <IconButton 
                        component={Link} 
                          to={`/medecin/patients/${appointment.patient_id}/dossier`}
                        size="small"
                          color="info"
                          sx={{ minWidth: 'auto' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiPaginationItem-root:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'white',
              },
              '& .Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderColor: 'white',
              },
              '& .Mui-selected:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </Box>
      )}

      {/* Calendar Popover */}
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}
        onClose={handleCalendarClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <SimpleCalendar />
      </Popover>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCloseConfirmDialog}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="inherit">
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmAttendance} 
            color={confirmDialog.action === 'present' ? 'success' : 'error'}
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpcomingAppointments; 
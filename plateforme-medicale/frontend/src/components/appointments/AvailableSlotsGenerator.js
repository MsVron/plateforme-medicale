import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  styled,
  Button,
  Paper
} from '@mui/material';
import { format, parseISO, addMinutes, isBefore, isWithinInterval } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';

// Styled components for time slots
const TimeSlotList = styled('ul')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  padding: 0,
  margin: '16px 0',
  listStyle: 'none',
  '& li': {
    display: 'inline-block'
  }
});

const TimeSlotButton = styled(Button)(({ theme, isbooked }) => ({
  minWidth: '90px',
  margin: '4px',
  '&.selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  },
  ...(isbooked === 'true' && {
    opacity: 0.5,
    textDecoration: 'line-through',
    pointerEvents: 'none',
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  })
}));

const TimeSlotSection = styled(Box)({
  marginBottom: '24px',
  '& .section-title': {
    marginBottom: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
});

const AvailableSlotsGenerator = ({ doctorSchedule, bookedSlots = [], onSelectSlot, selectedSlot }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupedSlots, setGroupedSlots] = useState({ morning: [], afternoon: [] });

  // Function to generate time slots
  const generateTimeSlots = () => {
    try {
      setLoading(true);
      const slots = [];

      if (!doctorSchedule) {
        setError('Doctor schedule not available');
        return;
      }

      // Parse doctor's schedule
      const startTime = parseISO(doctorSchedule.heure_debut);
      const endTime = parseISO(doctorSchedule.heure_fin);
      const interval = doctorSchedule.intervalle_minutes || 30;
      
      // Create lunch break time range if applicable
      let lunchStart = null;
      let lunchEnd = null;
      if (doctorSchedule.a_pause_dejeuner) {
        lunchStart = parseISO(doctorSchedule.heure_debut_pause);
        lunchEnd = parseISO(doctorSchedule.heure_fin_pause);
      }

      // Convert booked slots to Date objects for comparison
      const bookedTimeRanges = bookedSlots.map(slot => ({
        start: typeof slot.start === 'string' ? parseISO(slot.start) : slot.start,
        end: typeof slot.end === 'string' ? parseISO(slot.end) : slot.end
      }));

      // Generate all possible time slots
      let currentSlot = startTime;
      let slotNumber = 1;

      while (isBefore(currentSlot, endTime)) {
        const slotEnd = addMinutes(currentSlot, interval);
        
        // Check if this slot is during lunch break
        let isDuringLunch = false;
        if (lunchStart && lunchEnd) {
          isDuringLunch = isWithinInterval(currentSlot, { start: lunchStart, end: lunchEnd }) ||
                          isWithinInterval(slotEnd, { start: lunchStart, end: lunchEnd });
        }

        // Check if slot conflicts with booked appointments
        const isBooked = bookedTimeRanges.some(timeRange => 
          isWithinInterval(currentSlot, timeRange) || 
          isWithinInterval(slotEnd, timeRange)
        );

        if (!isDuringLunch) {
          slots.push({
            number: slotNumber,
            debut: currentSlot,
            fin: slotEnd,
            isBooked
          });
          slotNumber++;
        }

        currentSlot = slotEnd;
      }

      setAvailableSlots(slots);

      // Group slots by morning/afternoon
      const grouped = slots.reduce((acc, slot) => {
        const hour = slot.debut.getHours();
        if (hour < 12) {
          acc.morning.push(slot);
        } else {
          acc.afternoon.push(slot);
        }
        return acc;
      }, { morning: [], afternoon: [] });

      setGroupedSlots(grouped);
    } catch (err) {
      console.error('Error generating time slots:', err);
      setError('Failed to generate time slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorSchedule) {
      generateTimeSlots();
    }
  }, [doctorSchedule, bookedSlots]);

  // Render time slots by section (morning/afternoon)
  const TimeSlots = ({ title, slots }) => {
    if (!slots || slots.length === 0) return null;
    
    return (
      <TimeSlotSection>
        <Typography variant="subtitle1" className="section-title" color="primary">
          <AccessTimeIcon fontSize="small" />
          {title}
        </Typography>
        <TimeSlotList>
          {slots.map((slot) => (
            <li key={`slot-${slot.number}`}>
              <TimeSlotButton
                variant="outlined"
                isbooked={slot.isBooked.toString()}
                className={selectedSlot && 
                  selectedSlot.debut.getTime() === slot.debut.getTime() ? 'selected' : ''}
                onClick={() => !slot.isBooked && onSelectSlot(slot)}
                disabled={slot.isBooked}
              >
                {format(slot.debut, 'h:mm a')}
              </TimeSlotButton>
            </li>
          ))}
        </TimeSlotList>
      </TimeSlotSection>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (availableSlots.length === 0) {
    return <Alert severity="info">No available slots for this day</Alert>;
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon fontSize="small" />
          Available Time Slots
        </Typography>
        
        <Box>
          <TimeSlots title="Morning" slots={groupedSlots.morning} />
          <TimeSlots title="Afternoon" slots={groupedSlots.afternoon} />
        </Box>
      </Paper>
      
      {selectedSlot && (
        <Box mt={2}>
          <Alert severity="info">
            Selected slot: {format(selectedSlot.debut, 'h:mm a')} - {format(selectedSlot.fin, 'h:mm a')}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default AvailableSlotsGenerator; 
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { parseISO } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatTime, formatDate } from '../../utils/dateUtils';

// Styled components for the horizontal time slider
const TimeSlotContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  whiteSpace: 'nowrap',
  padding: theme.spacing(1, 0),
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const TimeSlotList = styled('ul')({
  display: 'inline-flex',
  padding: 0,
  margin: 0,
  listStyle: 'none',
  '& li': {
    display: 'inline-block',
    marginRight: '8px',
    '&:last-child': {
      marginRight: 0,
    },
  },
});

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '80px',
  padding: theme.spacing(1),
  borderRadius: '8px',
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

// Custom CSS classes to match the requested styles
const customStyles = {
  '.time-select .md-headline + .md-layout.md-align-center': {
    display: 'block',
  },
  '.time-selection-col-header': {
    display: 'none',
  },
  '.time-listing-icon': {
    display: 'none',
  },
  'ul.time-listing': {
    display: 'inline',
    paddingBottom: 0,
  },
  'ul.time-listing li': {
    display: 'inline-block',
  },
  '.md-layout.md-column.md-column-center': {
    display: 'inline',
  },
};

/**
 * HorizontalTimeSlider Component
 * Displays available appointment slots in a horizontal slider format
 * 
 * @param {Object} props
 * @param {Array} props.slots - Available time slots
 * @param {string} props.selectedDate - The selected date in ISO format
 * @param {Object} props.selectedSlot - Currently selected time slot
 * @param {Function} props.onSelectSlot - Function to call when a slot is selected
 * @param {boolean} props.loading - Whether slots are currently loading
 */
const HorizontalTimeSlider = ({ 
  slots = [], 
  selectedDate, 
  selectedSlot, 
  onSelectSlot,
  loading = false
}) => {
  // Format the selected date using dateUtils
  const formattedDate = selectedDate ? formatDate(selectedDate) : '';
  
  // Debug to check what data is coming in
  console.log('DEBUG: HorizontalTimeSlider rendering with:', {
    slotsLength: slots.length,
    firstFewSlots: slots.slice(0, 3),
    selectedDate: selectedDate,
    formattedDate: formattedDate,
    selectedSlot: selectedSlot
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography variant="body2">Chargement des créneaux disponibles...</Typography>
      </Box>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="text.secondary" align="center">
          Aucun créneau disponible pour ce jour.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }} className="time-select">
      <Box display="flex" alignItems="center" mb={2}>
        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" color="primary">
          Créneaux disponibles pour le {formattedDate}
        </Typography>
      </Box>

      <TimeSlotContainer className="md-layout md-align-center">
        <TimeSlotList className="time-listing">
          {slots.map((slot, index) => {
            // Format the time using the dateUtils formatTime function
            let timeDisplay;
            
            try {
              if (typeof slot === 'string') {
                timeDisplay = formatTime(slot);
              } else if (slot.time) {
                timeDisplay = slot.time;
              } else if (slot.debut) {
                // Handle if debut is already a Date object or a string
                timeDisplay = formatTime(slot.debut);
              }
              
              if (!timeDisplay) {
                console.error('DEBUG: Could not format time for slot:', slot);
                timeDisplay = 'Invalid Time';
              }
            } catch (error) {
              console.error('DEBUG: Error formatting time for slot:', slot, error);
              timeDisplay = 'Error';
            }

            // Determine if this slot is selected
            let isSelected = false;
            try {
              if (selectedSlot) {
                if (typeof selectedSlot === 'string' && typeof slot === 'string') {
                  isSelected = selectedSlot === slot;
                } else if (selectedSlot.debut && slot.debut) {
                  // Compare using string representation if both are date strings
                  if (typeof selectedSlot.debut === 'string' && typeof slot.debut === 'string') {
                    isSelected = selectedSlot.debut === slot.debut;
                  } 
                  // Compare using timestamp if both are Date objects
                  else if (selectedSlot.debut instanceof Date && slot.debut instanceof Date) {
                    isSelected = selectedSlot.debut.getTime() === slot.debut.getTime();
                  }
                  // If mixed types, parse and compare
                  else {
                    const selDate = typeof selectedSlot.debut === 'string' ? parseISO(selectedSlot.debut) : selectedSlot.debut;
                    const slotDate = typeof slot.debut === 'string' ? parseISO(slot.debut) : slot.debut;
                    isSelected = selDate.getTime() === slotDate.getTime();
                  }
                } else if (selectedSlot.time && slot.time) {
                  isSelected = selectedSlot.time === slot.time;
                }
              }
            } catch (error) {
              console.error('DEBUG: Error determining if slot is selected:', { selectedSlot, slot, error });
            }

            return (
              <li key={index} className="md-layout md-column md-column-center">
                <TimeSlotButton
                  variant={isSelected ? "contained" : "outlined"}
                  color="primary"
                  selected={isSelected}
                  onClick={() => {
                    console.log('DEBUG: Selected slot:', slot);
                    onSelectSlot(slot);
                  }}
                >
                  {timeDisplay}
                </TimeSlotButton>
              </li>
            );
          })}
        </TimeSlotList>
      </TimeSlotContainer>
    </Paper>
  );
};

export default HorizontalTimeSlider; 
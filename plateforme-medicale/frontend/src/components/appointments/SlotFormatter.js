import React from 'react';
import { Box, Typography, Paper, List, ListItem, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * Component that displays formatted time slots according to requirements
 * 
 * @param {Object} props
 * @param {Array} props.slots - The time slots to display
 * @param {string} props.title - Optional title for the slots
 * @param {boolean} props.showNumbers - Whether to show slot numbers
 * @param {boolean} props.showEmptyMessage - Whether to show a message when no slots are available
 */
const SlotFormatter = ({ 
  slots = [], 
  title = "Available Appointment Slots", 
  showNumbers = true,
  showEmptyMessage = true
}) => {
  if (slots.length === 0 && showEmptyMessage) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No available slots
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon color="primary" />
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {slots.map((slot, index) => (
          <React.Fragment key={index}>
            <ListItem sx={{ py: 1 }}>
              <Typography variant="body1">
                {showNumbers ? `Slot ${index + 1}: ` : ''}{slot.time || slot}
              </Typography>
            </ListItem>
            {index < slots.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default SlotFormatter;

/**
 * Helper function to format input data into the expected format
 * for the SlotFormatter component
 * 
 * @param {Object} doctorSchedule - The doctor's schedule
 * @param {Array} bookedSlots - Already booked slots
 * @param {Function} dateFormatter - Function to format dates
 * @returns {Array} Formatted slots
 */
export const formatSlotsFromSchedule = (doctorSchedule, bookedSlots = [], dateFormatter) => {
  // Implementation would be similar to the backend utility
  // This is a placeholder for the actual implementation
  return [];
};

/**
 * Example of use:
 * 
 * const doctorSchedule = {
 *   startTime: '09:00',
 *   endTime: '17:00',
 *   interval: 30, // minutes
 *   lunchBreak: {
 *     start: '12:00',
 *     end: '13:00'
 *   }
 * };
 * 
 * const bookedSlots = [
 *   '10:00', '11:30'
 * ];
 * 
 * // Render formatted slots:
 * <SlotFormatter 
 *   slots={[
 *     { time: '9:00 AM' },
 *     { time: '9:30 AM' },
 *     { time: '10:30 AM' },
 *     // ...etc.
 *   ]}
 *   title="Available Appointment Times"
 * />
 */ 
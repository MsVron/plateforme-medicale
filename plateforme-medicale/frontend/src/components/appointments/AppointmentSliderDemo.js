import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
  Grid,
  Alert
} from '@mui/material';
import HorizontalTimeSlider from './HorizontalTimeSlider';
import { formatDate, formatTime } from '../../utils/dateUtils';
import './HorizontalTimeSlider.css';

/**
 * Demo component to showcase the horizontal time slider with example data
 * matching the specific requirements
 */
const AppointmentSliderDemo = () => {
  // Example data based on the requirements
  const selectedDate = "2025-05-20"; // For 20/05/2025
  const formattedDisplayDate = formatDate(selectedDate);
  
  // Doctor's schedule as required: 09:00 to 17:00 with 30-minute intervals
  const doctorSchedule = {
    startTime: '09:00', // 9:00 AM
    endTime: '17:00',   // 5:00 PM
    interval: 30        // 30 minutes per appointment
  };
  
  // Booked slots as required: 10:00, 11:30
  const bookedTimes = ['10:00', '11:30'];
  
  // Generate all available slots
  const generateSlots = () => {
    const slots = [];
    let current = 9 * 60; // 9:00 in minutes
    const end = 17 * 60;  // 17:00 in minutes
    let slotNumber = 1;
    
    while (current < end) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Check if this time is booked
      const isBooked = bookedTimes.includes(timeString);
      
      if (!isBooked) {
        slots.push({
          slot: slotNumber,
          time: timeString
        });
        slotNumber++;
      }
      
      current += doctorSchedule.interval;
    }
    
    return slots;
  };
  
  // Generate the slots
  const availableSlots = generateSlots();
  
  // State for selected slot
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    console.log('Selected slot:', slot);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Appointment Slot Selection
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Example: Doctor's Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Date:</strong> {formattedDisplayDate}
              </Typography>
              <Typography variant="body1">
                <strong>Doctor's availability:</strong> {doctorSchedule.startTime} to {doctorSchedule.endTime}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                <strong>Appointment interval:</strong> {doctorSchedule.interval} minutes
              </Typography>
              <Typography variant="body1">
                <strong>Booked slots:</strong> {bookedTimes.join(', ')}
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Available Appointment Slots
          </Typography>
          
          <HorizontalTimeSlider
            slots={availableSlots}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />
          
          {selectedSlot && (
            <Alert severity="info" sx={{ mt: 2 }}>
              You selected: {selectedSlot.time}
            </Alert>
          )}
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Expected Output Format as Per Requirements
          </Typography>
          <Typography variant="body2" paragraph>
            A horizontal slider displaying available slots:
          </Typography>
          <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap', py: 1 }}>
            {availableSlots.map((slot, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'inline-block', 
                  mx: 1, 
                  px: 2, 
                  py: 1, 
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  bgcolor: '#f5f5f5'
                }}
              >
                {slot.time}
              </Box>
            ))}
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>Date:</strong> {formattedDisplayDate}
          </Typography>
          <Typography variant="body2">
            <strong>Note:</strong> Booked slots (10:00, 11:30) are excluded from the slider.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentSliderDemo; 
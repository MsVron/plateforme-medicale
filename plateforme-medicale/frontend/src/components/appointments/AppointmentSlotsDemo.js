import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider 
} from '@mui/material';
import AvailableSlotsGenerator from './AvailableSlotsGenerator';

// Demo component to showcase how the slot generator works
const AppointmentSlotsDemo = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Example doctor schedule (9:00 AM to 5:00 PM with 30 minute slots)
  const exampleDoctorSchedule = {
    heure_debut: '2023-04-15T09:00:00',
    heure_fin: '2023-04-15T17:00:00',
    intervalle_minutes: 30,
    a_pause_dejeuner: false
  };
  
  // Example with lunch break
  const exampleWithLunchBreak = {
    heure_debut: '2023-04-15T09:00:00',
    heure_fin: '2023-04-15T17:00:00',
    intervalle_minutes: 30,
    a_pause_dejeuner: true,
    heure_debut_pause: '2023-04-15T12:00:00',
    heure_fin_pause: '2023-04-15T13:00:00'
  };
  
  // Example booked slots (10:00 AM and 11:30 AM as specified in requirements)
  const exampleBookedSlots = [
    {
      start: '2023-04-15T10:00:00',
      end: '2023-04-15T10:30:00'
    },
    {
      start: '2023-04-15T11:30:00',
      end: '2023-04-15T12:00:00'
    }
  ];

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    console.log('Selected slot:', slot);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Appointment Slots Demo
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Example: Doctor Schedule without Lunch Break
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Doctor's availability: 9:00 AM to 5:00 PM
            <br />
            Appointment interval: 30 minutes
            <br />
            Booked slots: 10:00 AM, 11:30 AM
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <AvailableSlotsGenerator
            doctorSchedule={exampleDoctorSchedule}
            bookedSlots={exampleBookedSlots}
            onSelectSlot={handleSelectSlot}
            selectedSlot={selectedSlot}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Example: Doctor Schedule with Lunch Break
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Doctor's availability: 9:00 AM to 5:00 PM
            <br />
            Appointment interval: 30 minutes
            <br />
            Lunch break: 12:00 PM to 1:00 PM
            <br />
            Booked slots: 10:00 AM, 11:30 AM
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <AvailableSlotsGenerator
            doctorSchedule={exampleWithLunchBreak}
            bookedSlots={exampleBookedSlots}
            onSelectSlot={handleSelectSlot}
            selectedSlot={selectedSlot}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentSlotsDemo; 
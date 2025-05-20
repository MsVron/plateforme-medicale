import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AppointmentSlotsExamplePage = () => {
  // Example data as per requirements
  const doctorAvailability = {
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    interval: 30 // minutes
  };
  
  const bookedSlots = ['10:00 AM', '11:30 AM'];
  
  // This is the exact output format requested in the requirements
  const availableSlots = [
    { slot: 1, time: '9:00 AM' },
    { slot: 2, time: '9:30 AM' },
    { slot: 3, time: '10:30 AM' },
    { slot: 4, time: '11:00 AM' },
    { slot: 5, time: '12:00 PM' },
    { slot: 6, time: '12:30 PM' },
    { slot: 7, time: '1:00 PM' },
    { slot: 8, time: '1:30 PM' },
    { slot: 9, time: '2:00 PM' },
    { slot: 10, time: '2:30 PM' },
    { slot: 11, time: '3:00 PM' },
    { slot: 12, time: '3:30 PM' },
    { slot: 13, time: '4:00 PM' },
    { slot: 14, time: '4:30 PM' }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Available Appointment Slots
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Doctor's Schedule
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Availability:</strong> {doctorAvailability.startTime} to {doctorAvailability.endTime}
            <br />
            <strong>Appointment interval:</strong> {doctorAvailability.interval} minutes
            <br />
            <strong>Booked slots:</strong> {bookedSlots.join(', ')}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" color="primary">
              Available Slots
            </Typography>
          </Box>
          
          <List sx={{ width: '100%' }}>
            {availableSlots.map((slot, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">
                    Slot {slot.slot}: {slot.time}
                  </Typography>
                </ListItem>
                {index < availableSlots.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentSlotsExamplePage; 
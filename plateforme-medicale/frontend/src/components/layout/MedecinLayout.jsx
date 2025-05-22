import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import MedecinSidebar from './MedecinSidebar';

const MedecinLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MedecinSidebar>
        <Outlet />
      </MedecinSidebar>
    </Box>
  );
};

export default MedecinLayout; 
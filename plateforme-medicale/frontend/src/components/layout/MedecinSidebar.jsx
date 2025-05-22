import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  Typography, IconButton, Collapse, useMediaQuery, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ExpandLess, ExpandMore,
  Menu as MenuIcon,
  Search as SearchIcon,
  MedicalServices as MedicalIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const MedecinSidebar = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [patientsOpen, setPatientsOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handlePatientsClick = () => {
    setPatientsOpen(!patientsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Espace Médecin
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/medecin/dashboard" 
          selected={isActive('/medecin/dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon color={isActive('/medecin/dashboard') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/medecin/appointments" 
          selected={isActive('/medecin/appointments')}
        >
          <ListItemIcon>
            <EventIcon color={isActive('/medecin/appointments') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Rendez-vous" />
        </ListItem>
        
        <ListItem 
          button 
          component={Link} 
          to="/medecin/calendar" 
          selected={isActive('/medecin/calendar')}
        >
          <ListItemIcon>
            <CalendarIcon color={isActive('/medecin/calendar') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Calendrier" />
        </ListItem>
        
        <ListItem button onClick={handlePatientsClick}>
          <ListItemIcon>
            <PeopleIcon color={location.pathname.includes('/medecin/patients') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Patients" />
          {patientsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={patientsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/medecin/patients/search" 
              selected={isActive('/medecin/patients/search')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <SearchIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Rechercher" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/medecin/patients/add" 
              selected={isActive('/medecin/patients/add')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ajouter un patient" />
            </ListItem>
          </List>
        </Collapse>
      </List>
      
      <Divider />
      
      <List>
        <ListItem 
          button 
          component={Link} 
          to="/medecin/settings" 
          selected={isActive('/medecin/settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
        
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxSizing: 'border-box' 
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={open}
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100vh'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default MedecinSidebar; 
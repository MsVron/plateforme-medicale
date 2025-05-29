import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Divider, Collapse } from '@mui/material';
import { ExitToApp, ExpandLess, ExpandMore } from '@mui/icons-material';
import '../../styles/Sidebar.css'; // Import the Sidebar CSS

const DashboardLayoutView = ({ user, sidebarItems, handleLogout }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemText) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const renderMenuItem = (item, depth = 0) => {
    if (item.expandable && item.subItems) {
      const isExpanded = expandedItems[item.text];
      
      return (
        <React.Fragment key={item.text}>
          <ListItem
            button
            onClick={() => toggleExpanded(item.text)}
            sx={{
              color: 'white',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              margin: '4px 12px',
              pl: depth * 2 + 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => renderMenuItem(subItem, depth + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem
        button
        key={item.text}
        component={NavLink}
        to={item.path}
        sx={{
          color: 'white',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          margin: '4px 12px',
          pl: depth * 2 + 2,
          '&.active': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateX(4px)',
            '& .MuiListItemIcon-root': { color: 'white' },
          },
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateX(4px)',
          }
        }}
      >
        <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          sx={{ 
            fontSize: depth > 0 ? '0.875rem' : '1rem',
            opacity: depth > 0 ? 0.9 : 1 
          }} 
        />
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {user.prenom} {user.nom}
          </Typography>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <List>
          {sidebarItems[user.role]?.map((item) => renderMenuItem(item))}
        </List>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToApp />}
            fullWidth
            onClick={handleLogout}
            sx={{
              backgroundColor: '#e74c3c',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#c0392b',
              }
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayoutView;
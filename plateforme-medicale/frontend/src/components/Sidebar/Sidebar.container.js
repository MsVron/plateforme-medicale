import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  BarChart as BarChartIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  Favorite as FavoriteIcon,
  DocumentScanner as DocumentIcon,
} from '@mui/icons-material';
import SidebarView from './Sidebar.view';

const SidebarContainer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Utilisateur', role: '' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Define menu items based on user role
  let menuItems = [];
  
  if (user.role === 'admin') {
    menuItems = [
      { text: 'Gestion des médecins', path: '/admin/medecins', icon: <PeopleIcon /> },
      { text: 'Gestion des institutions', path: '/admin/institutions', icon: <BusinessIcon /> },
      { text: 'Gestion des accès', path: '/admin/acces', icon: <SecurityIcon /> },
      { text: 'Statistiques', path: '/admin/statistiques', icon: <BarChartIcon /> },
    ];
  } else if (user.role === 'patient') {
    menuItems = [
      { text: 'Accueil Patient', path: '/patient', icon: <DocumentIcon /> },
      { text: 'Rechercher un médecin', path: '/patient/doctor-search', icon: <SearchIcon /> },
      { text: 'Mes rendez-vous', path: '/patient/appointments', icon: <CalendarIcon /> },
      { text: 'Médecins favoris', path: '/patient/favorites', icon: <FavoriteIcon /> },
    ];
  }

  return (
    <SidebarView
      user={user}
      menuItems={menuItems}
      handleNavigate={handleNavigate}
      handleLogout={handleLogout}
    />
  );
};

export default SidebarContainer;
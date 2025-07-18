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
  MedicalServices as MedicalIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  PersonAdd as PersonAddIcon,
  LocalPharmacy as PharmacyIcon,
  AssignmentInd as AssignmentIndIcon,
  FolderOpen as FolderOpenIcon,
  ManageAccounts as ManageAccountsIcon,
  LocalHospital as LocalHospitalIcon,
  Bed as BedIcon,
  PersonSearch as PersonSearchIcon
} from '@mui/icons-material';
import SidebarView from './Sidebar.view';

const SidebarContainer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Utilisateur', role: '' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger theme reset to default
    window.dispatchEvent(new Event('userDataChanged'));
    
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Define menu items based on user role
  let menuItems = [];
  
  if (user.role === 'super_admin') {
    menuItems = [
      { text: 'Gestion des Institutions', path: '/admin/institutions', icon: <BusinessIcon /> },
      { text: 'Statistiques', path: '/admin/statistics', icon: <BarChartIcon /> },
      { text: 'Gestion des Admins', path: '/admin/admin-management', icon: <ManageAccountsIcon /> },
    ];
  } else if (user.role === 'admin') {
    menuItems = [
      { text: 'Gestion des Institutions', path: '/admin/institutions', icon: <BusinessIcon /> },
      { text: 'Statistiques', path: '/admin/statistics', icon: <BarChartIcon /> },
    ];
  } else if (user.role === 'patient') {
    menuItems = [
      { text: 'Dossier Médical', path: '/patient/medical-record', icon: <FolderOpenIcon /> },
      { text: 'Rechercher un médecin', path: '/patient/doctor-search', icon: <SearchIcon /> },
      { text: 'Mes rendez-vous', path: '/patient/appointments', icon: <CalendarIcon /> },
      { text: 'Médecins favoris', path: '/patient/favorites', icon: <FavoriteIcon /> },
    ];
  } else if (user.role === 'medecin') {
    menuItems = [
      { text: 'Tableau de bord', path: '/medecin/dashboard', icon: <DashboardIcon /> },
      { text: 'Rendez-vous', path: '/medecin/appointments', icon: <EventIcon /> },
      { text: 'Rechercher un patient', path: '/medecin/patients/search', icon: <SearchIcon /> },
    ];
  } else if (user.role === 'hospital') {
    menuItems = [
      { text: 'Tableau de bord', path: '/hospital/dashboard', icon: <LocalHospitalIcon /> },
      { text: 'Médecins Hôpital', path: '/hospital/doctors', icon: <AssignmentIndIcon /> },
      { text: 'Patients Sans Rendez-vous', path: '/hospital/walk-in', icon: <PersonAddIcon /> },
      { text: 'Admissions', path: '/hospital/admissions', icon: <MedicalIcon /> },
    ];
  } else if (user.role === 'institution') {
    menuItems = [
      { text: 'Tableau de bord', path: '/institution/dashboard', icon: <DashboardIcon /> },
      { text: 'Gestion des médecins', path: '/institution/doctors', icon: <PeopleIcon /> },
      { text: 'Statistiques', path: '/institution/statistics', icon: <BarChartIcon /> },
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
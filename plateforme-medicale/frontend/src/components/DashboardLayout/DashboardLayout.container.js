import React from 'react';
import { useNavigate } from 'react-router-dom';
import {   AdminPanelSettings,   MedicalServices,   Person,   Business,   Lock,   BarChart,   Search,   Event,   MedicalInformation,   CalendarMonth,  Favorite,  Dashboard,  PersonAdd} from '@mui/icons-material';
import DashboardLayoutView from './DashboardLayout.view';

const DashboardLayoutContainer = () => {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return {
          prenom: user.prenom || 'Guest',
          nom: user.nom || '',
          role: user.role || 'admin',
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return {
      prenom: 'Guest',
      nom: '',
      role: 'admin',
    };
  };

  const sidebarItems = {
    super_admin: [
      { text: 'Gestion des administrateurs', path: '/admin/admins', icon: <AdminPanelSettings /> },
      { text: 'Gestion des médecins', path: '/admin/medecins', icon: <MedicalServices /> },
      { text: 'Gestion des institutions', path: '/admin/institutions', icon: <Business /> },
      { text: 'Gestion des patients', path: '/admin/patients', icon: <Person /> },
      { text: 'Gestion des accès', path: '/admin/acces', icon: <Lock /> },
      { text: 'Statistiques', path: '/admin/statistiques', icon: <BarChart /> },
    ],
    admin: [
      { text: 'Gestion des médecins', path: '/admin/medecins', icon: <MedicalServices /> },
      { text: 'Gestion des institutions', path: '/admin/institutions', icon: <Business /> },
      { text: 'Statistiques', path: '/admin/statistiques', icon: <BarChart /> },
    ],
        medecin: [      { text: 'Mon espace', path: '/medecin', icon: <Dashboard /> },      { text: 'Patient sur place', path: '/medecin/patient-direct', icon: <PersonAdd /> },      { text: 'Rendez-vous', path: '/medecin/appointments', icon: <Event /> },      { text: 'Rechercher un patient', path: '/medecin/patients/search', icon: <Search /> },      { text: 'Dossiers médicaux', path: '/medecin/medical-records', icon: <MedicalInformation /> },      { text: 'Calendrier', path: '/medecin/calendar', icon: <CalendarMonth /> },    ],
    patient: [
      { text: 'Mon espace', path: '/patient', icon: <Dashboard /> },
      { text: 'Rechercher un médecin', path: '/patient/doctor-search', icon: <Search /> },
      { text: 'Mes rendez-vous', path: '/patient/appointments', icon: <Event /> },
      { text: 'Médecins favoris', path: '/patient/favorites', icon: <Favorite /> },
    ],
    institution: [
      { text: 'Mon espace', path: '/institution', icon: <Business /> },
      { text: 'Nos patients', path: '/institution/patients', icon: <Person /> },
    ],
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <DashboardLayoutView
      user={user}
      sidebarItems={sidebarItems}
      handleLogout={handleLogout}
    />
  );
};

export default DashboardLayoutContainer;
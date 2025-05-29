import React from 'react';
import { useNavigate } from 'react-router-dom';
import {   AdminPanelSettings,   MedicalServices,   Person,   Business,   Lock,   BarChart,   Search,   Event,   MedicalInformation,   CalendarMonth,  Favorite,  Dashboard,  PersonAdd, LocalPharmacy, Assignment, Analytics, TrendingUp, People, LocationOn, Assessment, Timeline, AccountBox, Healing} from '@mui/icons-material';
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
      { text: 'Inscription patient sur site', path: '/admin/patient-registration', icon: <PersonAdd /> },
      { text: 'Recherche pharmacie', path: '/admin/pharmacy-search', icon: <LocalPharmacy /> },
      {
        text: 'Statistiques Avancées',
        icon: <Analytics />,
        expandable: true,
        subItems: [
          { text: 'Vue d\'ensemble', path: '/superadmin/stats/overview', icon: <Dashboard /> },
          { text: 'Utilisateurs du système', path: '/superadmin/stats/users', icon: <People /> },
          { text: 'Analyses des rendez-vous', path: '/superadmin/stats/appointments', icon: <Event /> },
          { text: 'Activité médicale', path: '/superadmin/stats/medical-activity', icon: <Healing /> },
          { text: 'Performance des médecins', path: '/superadmin/stats/doctors', icon: <MedicalServices /> },
          { text: 'Engagement des patients', path: '/superadmin/stats/patients', icon: <AccountBox /> },
          { text: 'Performance des institutions', path: '/superadmin/stats/institutions', icon: <Business /> },
          { text: 'Géolocalisation', path: '/superadmin/stats/geographic', icon: <LocationOn /> },
          { text: 'Tableaux de bord personnalisés', path: '/superadmin/stats/dashboards', icon: <Assessment /> },
          { text: 'Rapports d\'audit', path: '/superadmin/stats/audit', icon: <Timeline /> }
        ]
      },
      { text: 'Gestion des accès', path: '/admin/acces', icon: <Lock /> },
    ],
    admin: [
      { text: 'Gestion des médecins', path: '/admin/medecins', icon: <MedicalServices /> },
      { text: 'Gestion des institutions', path: '/admin/institutions', icon: <Business /> },
      { text: 'Inscription patient sur site', path: '/admin/patient-registration', icon: <PersonAdd /> },
      { text: 'Recherche pharmacie', path: '/admin/pharmacy-search', icon: <LocalPharmacy /> },
      { text: 'Statistiques', path: '/admin/statistics', icon: <Analytics /> },
    ],
        medecin: [      { text: 'Mon espace', path: '/medecin', icon: <Dashboard /> },      { text: 'Patient sur place', path: '/medecin/patient-direct', icon: <PersonAdd /> },      { text: 'Rendez-vous', path: '/medecin/appointments', icon: <Event /> },      { text: 'Rechercher un patient', path: '/medecin/patients/search', icon: <Search /> },      { text: 'Dossiers médicaux', path: '/medecin/medical-records', icon: <MedicalInformation /> },      { text: 'Calendrier', path: '/medecin/calendar', icon: <CalendarMonth /> },    ],
    patient: [
      { text: 'Mon espace', path: '/patient', icon: <Dashboard /> },
      { text: 'Mon dossier médical', path: '/patient/medical-record', icon: <Assignment /> },
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
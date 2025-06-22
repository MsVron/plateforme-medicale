import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminPanelSettings,
  MedicalServices,
  Person,
  Business,
  Lock,
  BarChart,
  Search,
  Event as EventIcon,
  MedicalInformation,
  CalendarMonth,
  Favorite,
  Dashboard,
  PersonAdd,
  LocalPharmacy,
  Assignment,
  Analytics,
  TrendingUp,
  People,
  LocationOn,
  Assessment,
  Timeline,
  AccountBox,
  Healing
} from '@mui/icons-material';
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
      {
        text: 'Statistiques Avancées',
        icon: <Analytics />,
        expandable: true,
        subItems: [
          { text: 'Vue d\'ensemble', path: '/superadmin/stats/overview', icon: <Dashboard /> },
          { text: 'Utilisateurs', path: '/superadmin/stats/users', icon: <People /> },
          { text: 'Activité médicale', path: '/superadmin/stats/medical-activity', icon: <Healing /> },
          { text: 'Médecins', path: '/superadmin/stats/doctors', icon: <MedicalServices /> },
          { text: 'Patients', path: '/superadmin/stats/patients', icon: <AccountBox /> },
          { text: 'Institutions', path: '/superadmin/stats/institutions', icon: <Business /> },
          { text: 'Audit système', path: '/superadmin/stats/audit', icon: <Timeline /> }
        ]
      }
    ],
    admin: [
      { text: 'Gestion des médecins', path: '/admin/medecins', icon: <MedicalServices /> },
      { text: 'Gestion des institutions', path: '/admin/institutions', icon: <Business /> },
      { text: 'Statistiques', path: '/admin/statistics', icon: <Analytics /> }
    ],
    medecin: [
      { text: 'Mon espace', path: '/medecin', icon: <Dashboard /> },
      { text: 'Rendez-vous', path: '/medecin/appointments', icon: <EventIcon /> },
      { text: 'Rechercher un patient', path: '/medecin/patients/search', icon: <Search /> }
    ],
    patient: [
      { text: 'Mon espace', path: '/patient', icon: <Dashboard /> },
      { text: 'Mon dossier médical', path: '/patient/medical-record', icon: <Assignment /> },
      { text: 'Rechercher un médecin', path: '/patient/doctor-search', icon: <Search /> },
      { text: 'Mes rendez-vous', path: '/patient/appointments', icon: <EventIcon /> },
      { text: 'Médecins favoris', path: '/patient/favorites', icon: <Favorite /> }
    ],
    institution: [
      { text: 'Mon espace', path: '/institution', icon: <Business /> },
      { text: 'Nos patients', path: '/institution/patients', icon: <Person /> }
    ],
    hospital: [
      { text: 'Tableau de bord', path: '/hospital/dashboard', icon: <Dashboard /> },
      { text: 'Rechercher patient', path: '/hospital/patients/search', icon: <Search /> },
      { text: 'Patients hôpital', path: '/hospital/patients', icon: <People /> },
      { text: 'Patient direct', path: '/hospital/patient-direct', icon: <PersonAdd /> }
    ],
    pharmacy: [
      { text: 'Tableau de bord', path: '/pharmacy/dashboard', icon: <Dashboard /> },
      { text: 'Rechercher patient', path: '/pharmacy/patients/search', icon: <Search /> },
      { text: 'Prescriptions', path: '/pharmacy/prescriptions', icon: <LocalPharmacy /> },
      { text: 'Historique', path: '/pharmacy/history', icon: <Assignment /> }
    ],
    laboratory: [
      { text: 'Tableau de bord', path: '/laboratory/dashboard', icon: <Dashboard /> },
      { text: 'Rechercher patient', path: '/laboratory/patients/search', icon: <Search /> },
      { text: 'Demandes d\'analyses', path: '/laboratory/test-requests', icon: <Assignment /> },
      { text: 'Travail en attente', path: '/laboratory/pending-work', icon: <Analytics /> }
    ]
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger theme reset to default
    window.dispatchEvent(new Event('userDataChanged'));
    
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
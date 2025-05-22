import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Login from './components/Login';
import AdminHome from './components/AdminHome';
//import MedecinHome from './components/MedecinHome';
import PatientHome from './components/PatientHome';
import InstitutionHome from './components/InstitutionHome';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import DashboardLayout from './components/DashboardLayout';
import ManageAdmins from './components/ManageAdmins';
import DoctorManagement from './components/doctors/DoctorManagement';
import { Container, Typography, Box } from '@mui/material';
import MedecinDashboard from './components/MedecinDashboard';
import PatientRegistrationForm from './components/auth/PatientRegistrationForm';
import EmailVerification from './components/EmailVerification';
import DoctorSearch from './components/DoctorSearch/DoctorSearch';
import AppointmentBookingPage from './components/appointments/AppointmentBookingPage';
import WalkInPatientPage from './pages/medecin/WalkInPatientPage';
import medicalTheme from './styles/theme';

// Import the doctor components
import { 
  Appointments as MedecinAppointments,
  PatientSearch as MedecinPatientSearch,
  MedicalRecords as MedecinMedicalRecords,
  Calendar as MedecinCalendar
} from './components/medecin';

// Admin-specific pages
// const ManageDoctors = () => (
//   <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
//     <Typography variant="h4" gutterBottom>
//       Gestion des médecins
//     </Typography>
//     <Typography>Page pour gérer les médecins (à implémenter).</Typography>
//   </Box>
// );

const ManageInstitutions = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Gestion des institutions
    </Typography>
    <Typography>Page pour gérer les institutions (à implémenter).</Typography>
  </Box>
);

const ManageAccess = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Gestion des accès
    </Typography>
    <Typography>Page pour gérer les accès (à implémenter).</Typography>
  </Box>
);

const ManagePatients = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Gestion des patients
    </Typography>
    <Typography>Page pour gérer les patients (à implémenter).</Typography>
  </Box>
);

const Statistics = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Statistiques
    </Typography>
    <Typography>Page pour les statistiques (à implémenter).</Typography>
  </Box>
);

// spécifique au patient
const PatientAppointments = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Mes rendez-vous
    </Typography>
    <Typography>Page de rendez-vous des patients (à implémenter).</Typography>
  </Box>
);

const PatientFavorites = () => (
  <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom>
      Mes médecins favoris
    </Typography>
    <Typography>Page des médecins favoris (à implémenter).</Typography>
  </Box>
);

// No need for these component definitions since we're importing them above
// // Pages spécifiques au médecin
// const MedecinAppointmentsPage = () => (
//   <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
//     <Typography variant="h4" gutterBottom>
//       Mes rendez-vous
//     </Typography>
//     <Typography>Page de gestion des rendez-vous du médecin (à implémenter).</Typography>
//   </Box>
// );

// const MedecinPatientSearchPage = () => (
//   <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
//     <Typography variant="h4" gutterBottom>
//       Rechercher un patient
//     </Typography>
//     <Typography>Page de recherche de patients (à implémenter).</Typography>
//   </Box>
// );

// const MedecinMedicalRecordsPage = () => (
//   <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
//     <Typography variant="h4" gutterBottom>
//       Dossiers médicaux
//     </Typography>
//     <Typography>Page de gestion des dossiers médicaux (à implémenter).</Typography>
//   </Box>
// );

// const MedecinCalendarPage = () => (
//   <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
//     <Typography variant="h4" gutterBottom>
//       Calendrier
//     </Typography>
//     <Typography>Page du calendrier du médecin (à implémenter).</Typography>
//   </Box>
// );

function App() {
  return (
    <ThemeProvider theme={medicalTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register/patient" element={
            <AuthRedirect>
              <PatientRegistrationForm />
            </AuthRedirect>
          } />
          <Route path="/verify-email" element={<EmailVerification />} />

          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/admins"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/medecins"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <DoctorManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/institutions"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <ManageInstitutions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManagePatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/acces"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageAccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistiques"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin', 'admin']}>
                  <MedecinDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <ManagePatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/appointments"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <MedecinAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/search"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <MedecinPatientSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/medical-records"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <MedecinMedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/calendar"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <MedecinCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/walk-in-patient"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <WalkInPatientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient', 'super_admin']}>
                  <PatientHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/doctor-search"
              element={
                <ProtectedRoute allowedRoles={['patient', 'super_admin']}>
                  <DoctorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient', 'super_admin']}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/favorites"
              element={
                <ProtectedRoute allowedRoles={['patient', 'super_admin']}>
                  <PatientFavorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment/:doctorId"
              element={
                <ProtectedRoute allowedRoles={['patient', 'super_admin']}>
                  <AppointmentBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution"
              element={
                <ProtectedRoute allowedRoles={['institution', 'super_admin', 'admin']}>
                  <InstitutionHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/patients"
              element={
                <ProtectedRoute allowedRoles={['institution', 'super_admin', 'admin']}>
                  <ManagePatients />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
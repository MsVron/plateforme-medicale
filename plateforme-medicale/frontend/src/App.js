import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Layout from './components/layout';
import MedecinDashboard from './components/MedecinDashboard';
import PatientMedicalRecord from './components/medecin/PatientMedicalRecord';
import MedicalDossier from './components/medecin/MedicalDossier';
import UpcomingAppointments from './components/medecin/UpcomingAppointments';
import PatientSearch from './pages/medecin/PatientSearch';
import MedicalRecords from './pages/medecin/MedicalRecords';
import WalkInPatientPage from './pages/medecin/WalkInPatientPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import PatientRegistrationForm from './components/auth/PatientRegistrationForm';
import EmailVerification from './components/EmailVerification';
import Unauthorized from './components/Unauthorized';
import AdminHome from './components/AdminHome';
import PatientHome from './components/PatientHome';
import InstitutionHome from './components/InstitutionHome';
import ManageAdmins from './components/ManageAdmins';
import DoctorManagement from './components/doctors/DoctorManagement';
import DoctorSearch from './components/DoctorSearch/DoctorSearch';
import AppointmentBookingPage from './components/appointments/AppointmentBookingPage';
import PatientAppointments from './components/patient/PatientAppointments';
import PatientFavorites from './components/patient/PatientFavorites';
import medicalTheme from './styles/theme';

// Import the new pages
import MedicalRecord from './pages/patient/MedicalRecord';
import InstitutionManagement from './pages/admin/InstitutionManagement';
import PharmacyManagement from './pages/admin/PharmacyManagement';
import PatientRegistration from './pages/admin/PatientRegistration';
import Statistics from './pages/admin/Statistics';

// Import Super Admin Statistics Pages
import StatsOverview from './pages/superadmin/StatsOverview';
import StatsUsers from './pages/superadmin/StatsUsers';
import StatsAppointments from './pages/superadmin/StatsAppointments';
import StatsMedicalActivity from './pages/superadmin/StatsMedicalActivity';
import StatsDoctors from './pages/superadmin/StatsDoctors';
import StatsPatients from './pages/superadmin/StatsPatients';
import StatsInstitutions from './pages/superadmin/StatsInstitutions';

import StatsDashboards from './pages/superadmin/StatsDashboards';
import StatsAudit from './pages/superadmin/StatsAudit';

// Import the doctor components
import { 
  UpcomingAppointments as MedecinAppointments,
  PatientSearch as MedecinPatientSearch,
  MedicalRecords as MedecinMedicalRecords,
  Calendar as MedecinCalendar
} from './components/medecin';

function App() {
  return (
    <ThemeProvider theme={medicalTheme}>
      <Router>
        <Routes>
          {/* Public routes */}
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

          {/* Protected routes with DashboardLayout */}
          <Route element={<DashboardLayout />}>
            {/* Admin routes */}
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
                  <InstitutionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patient-registration"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <PatientRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pharmacy-management"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <PharmacyManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                  <Statistics />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Advanced Statistics Routes */}
            <Route
              path="/superadmin/stats/overview"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/users"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/appointments"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/medical-activity"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsMedicalActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/doctors"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsDoctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/patients"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/institutions"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsInstitutions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/superadmin/stats/dashboards"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsDashboards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/stats/audit"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <StatsAudit />
                </ProtectedRoute>
              }
            />

            {/* System Failures Route */}
            <Route
              path="/superadmin/stats/system-failures"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <div style={{ padding: '20px' }}>
                    <h2>Statistiques des Pannes Système</h2>
                    <p>Cette page affiche les statistiques détaillées des échecs système et permet aux administrateurs de surveiller la santé de la plateforme.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Doctor routes */}
            <Route
              path="/medecin"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <Navigate to="/medecin/dashboard" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/appointments"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/search"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:patientId/medical-record"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientMedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:patientId/dossier"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalDossier />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/medical-records"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patient-direct"
              element={
                <ProtectedRoute allowedRoles={['medecin', 'super_admin']}>
                  <WalkInPatientPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/calendar"
              element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <MedecinCalendar />
                </ProtectedRoute>
              }
            />

            {/* Patient routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/medical-record"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <MedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/search-doctors"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DoctorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/doctor-search"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DoctorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/favorites"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientFavorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/book-appointment/:doctorId"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <AppointmentBookingPage />
                </ProtectedRoute>
              }
            />

            {/* Institution routes */}
            <Route
              path="/institution"
              element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionHome />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Incidents } from './pages/Incidents';
import { ReportIncident } from './pages/ReportIncident';
import { IncidentDetail } from './pages/IncidentDetail';
import { IncidentManagement } from './pages/IncidentManagement';
import { MapView } from './pages/MapView';
import { AssignmentPanel } from './pages/AssignmentPanel';
import { Alerts } from './pages/Alerts';
import { Activity } from './pages/Activity';
import { GuestReport } from './pages/GuestReport';

import { pageTransition } from './theme/motion';

const layoutTransition = {
  ...pageTransition,
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
};

function AnimatedLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait">
      {outlet && (
        <motion.div key={location.pathname} initial={layoutTransition.initial} animate={layoutTransition.animate} exit={layoutTransition.exit} transition={layoutTransition.transition}>
          {outlet}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AnimatedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report/guest" element={<GuestReport />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <Incidents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={['REPORTER', 'ADMIN']}>
                  <ReportIncident />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/new"
              element={
                <ProtectedRoute allowedRoles={['REPORTER', 'ADMIN']}>
                  <ReportIncident />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute>
                  <IncidentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <MapView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                  <IncidentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute allowedRoles={['RESPONDER']}>
                  <AssignmentPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
                  <Activity />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen text-ers-ink bg-ers-bg">
          <Header />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

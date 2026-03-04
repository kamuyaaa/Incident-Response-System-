import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MenuProvider } from './context/MenuContext'
import { ToastProvider } from './context/ToastContext'
import { NotificationProvider } from './context/NotificationContext'
import { ensureSchemaVersion } from './mock/seed'
import MenuDrawer from './components/MenuDrawer'
import Toast from './components/Toast'
import RequireAuth from './components/RequireAuth'
import { RequireAdmin, RequireResponder, RequireReporter } from './components/RequireRole'
import AdminLayout from './layouts/AdminLayout'
import ResponderLayout from './layouts/ResponderLayout'
import ReporterLayout from './layouts/ReporterLayout'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import IncidentsList from './pages/reporter/IncidentsList'
import IncidentNew from './pages/reporter/IncidentNew'
import IncidentDetail from './pages/reporter/IncidentDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminIncidents from './pages/admin/AdminIncidents'
import AdminIncidentDetail from './pages/admin/AdminIncidentDetail'
import AdminResponders from './pages/admin/AdminResponders'
import ResponderAssignments from './pages/responder/ResponderAssignments'
import ResponderAssignmentDetail from './pages/responder/ResponderAssignmentDetail'

ensureSchemaVersion()

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <MenuProvider>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/incidents"
                  element={
                    <RequireAuth>
                      <RequireReporter>
                        <ReporterLayout />
                      </RequireReporter>
                    </RequireAuth>
                  }
                >
                  <Route index element={<IncidentsList />} />
                  <Route path="new" element={<IncidentNew />} />
                  <Route path=":id" element={<IncidentDetail />} />
                </Route>
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    </RequireAuth>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="incidents" element={<AdminIncidents />} />
                  <Route path="incidents/:id" element={<AdminIncidentDetail />} />
                  <Route path="responders" element={<AdminResponders />} />
                </Route>
                <Route
                  path="/responder"
                  element={
                    <RequireAuth>
                      <RequireResponder>
                        <ResponderLayout />
                      </RequireResponder>
                    </RequireAuth>
                  }
                >
                  <Route index element={<ResponderAssignments />} />
                  <Route path="assignments/:id" element={<ResponderAssignmentDetail />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <MenuDrawer />
              <Toast />
            </MenuProvider>
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

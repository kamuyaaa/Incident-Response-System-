import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DemoRoleProvider } from './context/DemoRoleContext'
import { MenuProvider } from './context/MenuContext'
import { ToastProvider } from './context/ToastContext'
import { NotificationProvider } from './context/NotificationContext'
import { ensureSchemaVersion } from './mock/seed'
import MenuDrawer from './components/MenuDrawer'
import Toast from './components/Toast'
import AdminLayout from './layouts/AdminLayout'
import ResponderLayout from './layouts/ResponderLayout'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import EmergencyType from './pages/EmergencyType'
import SendReport from './pages/SendReport'
import ThankYou from './pages/ThankYou'
import TrackProgress from './pages/TrackProgress'
import ReportedByYou from './pages/ReportedByYou'
import ReportedByOthers from './pages/ReportedByOthers'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminIncidents from './pages/admin/AdminIncidents'
import AdminIncidentDetail from './pages/admin/AdminIncidentDetail'
import AdminResponders from './pages/admin/AdminResponders'
import ResponderAssignments from './pages/responder/ResponderAssignments'
import ResponderAssignmentDetail from './pages/responder/ResponderAssignmentDetail'

ensureSchemaVersion()

function AdminRoutes() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="incidents" element={<AdminIncidents />} />
      <Route path="incidents/:id" element={<AdminIncidentDetail />} />
      <Route path="responders" element={<AdminResponders />} />
    </Route>
  )
}

function ResponderRoutes() {
  return (
    <Route path="/responder" element={<ResponderLayout />}>
      <Route index element={<ResponderAssignments />} />
      <Route path="assignments/:id" element={<ResponderAssignmentDetail />} />
    </Route>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoRoleProvider>
        <ToastProvider>
          <NotificationProvider>
            <MenuProvider>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/home" element={<Home />} />
                <Route path="/report/type" element={<EmergencyType />} />
                <Route path="/report/send" element={<SendReport />} />
                <Route path="/report/thank-you" element={<ThankYou />} />
                <Route path="/report/:id/progress" element={<TrackProgress />} />
                <Route path="/reports/mine" element={<ReportedByYou />} />
                <Route path="/reports/others" element={<ReportedByOthers />} />
                <AdminRoutes />
                <ResponderRoutes />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <MenuDrawer />
              <Toast />
            </MenuProvider>
          </NotificationProvider>
        </ToastProvider>
      </DemoRoleProvider>
    </BrowserRouter>
  )
}

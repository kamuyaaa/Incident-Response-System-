import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { ResponderDashboard } from './ResponderDashboard';
import { ReporterDashboard } from './ReporterDashboard';

export function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';
  const isResponder = user?.role === 'RESPONDER';

  if (isAdmin) return <AdminDashboard />;
  if (isResponder) return <ResponderDashboard />;
  return <ReporterDashboard />;
}

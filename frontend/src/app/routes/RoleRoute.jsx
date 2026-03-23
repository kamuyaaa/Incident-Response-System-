import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../shared/hooks/useAuth";

// usage: <Route element={<RoleRoute allow={["admin"]} />} />
export default function RoleRoute({ allow = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  const role = user?.role; // "admin" | "reporter" | "responder"

  if (!role) return <Navigate to="/login" replace />;

  return allow.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
}
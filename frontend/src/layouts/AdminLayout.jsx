import { Outlet } from "react-router-dom";
import AdminNav from "../features/admin/components/AdminNav";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

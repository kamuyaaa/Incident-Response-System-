import { NavLink, useNavigate } from "react-router-dom";
import "./AdminNav.css";

export default function AdminNav() {
  const navigate = useNavigate();

  return (
    <aside className="admin-nav">
      <div className="admin-nav-brand">
        <h2>SafeReport</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="admin-nav-links">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/incidents"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Incidents Queue
        </NavLink>

        <NavLink
          to="/admin/assign"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Assign Responder
        </NavLink>

        <NavLink
          to="/account/profile"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Profile
        </NavLink>

        <button
          className="admin-nav-link logout-btn"
          onClick={() => navigate("/login")}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

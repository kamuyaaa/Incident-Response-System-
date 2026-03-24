import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";
import "./ReporterMenu.css";

export default function ReporterMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isGuest = !isAuthenticated;

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (swipeDistance > 50) {
      setOpen(false);
    }
  };

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className={`menu-overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      <aside
        className={`side-menu ${open ? "open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="menu-drag-hint"></div>

        <div className="menu-header">
          <div className="menu-user-icon">◉</div>
          <div>
            <h3>{isGuest ? "Guest Reporter" : user?.name ?? user?.fullname ?? "Your Account"}</h3>
            <p>{isGuest ? "Emergency reporting only" : user?.email ?? "No email available"}</p>
          </div>
        </div>

        <hr />

        <p className="menu-section">GENERAL</p>

        <button className="menu-item" onClick={() => goTo("/reporter/report")}>
          <span>REPORT AN INCIDENT</span>
          <span>›</span>
        </button>

        {!isGuest && (
          <>
            <button
              className="menu-item"
              onClick={() => goTo("/reporter/my-reports?tab=mine")}
            >
              <span>REPORTED BY YOU</span>
              <span>›</span>
            </button>

        <button
              className="menu-item"
              onClick={() => goTo("/reporter/my-reports?tab=others")}
            >
              <span>REPORTED BY OTHERS</span>
              <span>›</span>
            </button>
          </>
        )}

        <hr />

        <p className="menu-section">PRIVACY & SAFETY</p>

        {isGuest ? (
          <button className="menu-item" onClick={() => goTo("/login")}>
            <span>SIGN IN FOR TRACKING</span>
            <span>›</span>
          </button>
        ) : (
          <button className="menu-item" onClick={() => goTo("/account/profile")}>
            <span>ACCOUNT</span>
            <span>›</span>
          </button>
        )}

        <hr />

        <p className="menu-section danger-title">DANGER ZONE</p>

        {isGuest ? (
          <button className="menu-item danger" onClick={() => goTo("/register")}>
            <span>CREATE ACCOUNT</span>
            <span>›</span>
          </button>
        ) : (
          <button
            className="menu-item danger"
            onClick={() => {
              logout();
              goTo("/login");
            }}
          >
            <span>LOGOUT</span>
            <span>›</span>
          </button>
        )}
      </aside>
    </>
  );
}
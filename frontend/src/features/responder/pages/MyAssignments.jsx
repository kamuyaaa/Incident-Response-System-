import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./MyAssignments.css";
import ReporterMenu from "../../reporter/components/ReporterMenu";
import { useNavigate } from "react-router-dom";

export default function MyAssignments() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="responder-dashboard">
        <ReporterMenu />

        <div className="responder-header">
          <h2>Hi Jack Doe,</h2>
          <p>Here’s your incident summary</p>
        </div>

        <div className="priority-alert">
          <div className="priority-alert-text">
            <h3>High Priority Incident Nearby</h3>
            <p>Medical Emergency — TRM Mall</p>
          </div>
          <button
            className="priority-alert-btn"
            onClick={() => navigate("/responder/updates")}
          >
            Respond
          </button>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-text">
              <h3>ASSIGNED INCIDENTS</h3>
              <span className="summary-number blue">3</span>
            </div>
            <div className="summary-icon blue-bg">📋</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>IN PROGRESS</h3>
              <span className="summary-number orange">0</span>
            </div>
            <div className="summary-icon orange-bg">🕒</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>RESOLVED INCIDENTS</h3>
              <span className="summary-number green">3</span>
            </div>
            <div className="summary-icon green-bg">✅</div>
          </div>
        </div>

        <div className="active-incident-card">
          <div className="section-top">
            <h3>Active Incident</h3>
            <span className="incident-badge">Urgent</span>
          </div>

          <h4>Medical Emergency at TRM Mall</h4>
          <p className="incident-meta">📍 TRM, Thika Road</p>
          <p className="incident-meta">⏱ Reported 3 mins ago</p>

          <div className="incident-actions">
            <button onClick={() => navigate("/responder/updates")}>
              Open Incident
            </button>
            <button className="secondary-btn">Navigate</button>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>

          <div className="quick-actions-grid">
            <button onClick={() => navigate("/responder")}>
              View Assignments
            </button>
            <button onClick={() => navigate("/responder/updates")}>
              Update Status
            </button>
            <button className="secondary-btn">Call Admin</button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

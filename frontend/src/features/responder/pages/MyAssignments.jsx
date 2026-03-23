import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./MyAssignments.css";
import ReporterMenu from "../../reporter/components/ReporterMenu";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import responderService from "../services/responderService";

export default function MyAssignments() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await responderService.getAssignments(user.id);
        setAssignments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadAssignments();
    }
  }, [user]);

  const assignedCount = assignments.length;
  const inProgressCount = assignments.filter(
    (incident) => incident.status === "In Progress"
  ).length;
  const completedCount = assignments.filter(
    (incident) => incident.status === "Completed"
  ).length;

  const activeIncident = useMemo(() => {
    return (
      assignments.find((incident) => incident.status === "In Progress") ||
      assignments.find((incident) => incident.status === "Assigned") ||
      assignments[0]
    );
  }, [assignments]);

  if (loading) {
    return <PhoneFrame><div className="responder-dashboard">Loading assignments...</div></PhoneFrame>;
  }

  return (
    <PhoneFrame>
      <div className="responder-dashboard">
        <ReporterMenu />

        <div className="responder-header">
          <h2>Hi {user?.name || "Responder"},</h2>
          <p>Here’s your incident summary</p>
        </div>

        {activeIncident && (
          <div className="priority-alert">
            <div className="priority-alert-text">
              <h3>Priority Incident</h3>
              <p>{activeIncident.type} — {activeIncident.location}</p>
            </div>
            <button
              className="priority-alert-btn"
              onClick={() => navigate("/responder/updates")}
            >
              Respond
            </button>
          </div>
        )}

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-text">
              <h3>ASSIGNED INCIDENTS</h3>
              <span className="summary-number blue">{assignedCount}</span>
            </div>
            <div className="summary-icon blue-bg">📋</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>IN PROGRESS</h3>
              <span className="summary-number orange">{inProgressCount}</span>
            </div>
            <div className="summary-icon orange-bg">🕒</div>
          </div>

          <div className="summary-card">
            <div className="summary-text">
              <h3>RESOLVED INCIDENTS</h3>
              <span className="summary-number green">{completedCount}</span>
            </div>
            <div className="summary-icon green-bg">✅</div>
          </div>
        </div>

        {activeIncident && (
          <div className="active-incident-card">
            <div className="section-top">
              <h3>Active Incident</h3>
              <span className="incident-badge">{activeIncident.priority || "Active"}</span>
            </div>

            <h4>{activeIncident.type}</h4>
            <p className="incident-meta">📍 {activeIncident.location}</p>
            <p className="incident-meta">
              ⏱ Reported {new Date(activeIncident.createdAt).toLocaleString()}
            </p>

            <div className="incident-actions">
              <button onClick={() => navigate("/responder/updates")}>
                Open Incident
              </button>
              <button className="secondary-btn">Navigate</button>
            </div>
          </div>
        )}

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
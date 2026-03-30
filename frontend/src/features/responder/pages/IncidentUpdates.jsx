import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./IncidentUpdates.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ResponderMenu from "../components/ResponderMenu";
import { useAuth } from "../../../shared/hooks/useAuth";
import responderService from "../services/responderService";

const typeIcons = {
  "Medical Emergency": "🚨",
  "Fire & Rescue": "🔥",
  "Crime & Safety": "🛡️",
  "Road & Transport": "🚗",
  "Public Safety & Welfare": "👥",
  "Natural Disaster": "🌊",
};

export default function IncidentUpdates() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("assigned");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 3;

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

  const filteredAssignments = useMemo(() => {
    if (activeTab === "assigned") {
      return assignments.filter(
        (incident) => incident.status === "Assigned" || incident.status === "Unassigned"
      );
    }

    if (activeTab === "progress") {
      return assignments.filter((incident) => incident.status === "In Progress");
    }

    return assignments.filter((incident) => incident.status === "Completed");
  }, [assignments, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredAssignments.length / itemsPerPage));

  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAssignments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAssignments, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (incidentId, nextStatus) => {
    try {
      const response = await responderService.updateIncidentStatus(
        incidentId,
        nextStatus
      );

      setAssignments((prev) =>
        prev.map((incident) =>
          incident.id === incidentId ? response.incident : incident
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <PhoneFrame><div className="assignments-page">Loading incidents...</div></PhoneFrame>;
  }

  return (
    <PhoneFrame>
      <div className="assignments-page">
        <div className="assignments-topbar">
          <button
            className="assignments-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>

          <ResponderMenu />
        </div>

        <div className="assignments-tabs">
          <button
            className={`assignments-tab ${activeTab === "assigned" ? "active" : ""}`}
            onClick={() => handleTabChange("assigned")}
          >
            Assigned Incidents
          </button>

          <button
            className={`assignments-tab ${activeTab === "progress" ? "active" : ""}`}
            onClick={() => handleTabChange("progress")}
          >
            In Progress
          </button>

          <button
            className={`assignments-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => handleTabChange("completed")}
          >
            Completed
          </button>
        </div>

        <div className="assignments-list">
          {currentReports.map((report) => (
            <article key={report.id} className="assignment-card">
              <div className="assignment-card-top">
                <div className="assignment-type-wrap">
                  <span className="assignment-type-icon">
                    {typeIcons[report.type] || "📝"}
                  </span>
                  <span className="assignment-type-text">{report.type}</span>
                </div>

                <span className="assignment-date">
                  Reported: {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="assignment-description">{report.description}</p>

              <div className="assignment-meta-row">
                <span className="assignment-location">📍 {report.location}</span>
                <span className="assignment-id">Incident Id: {report.id}</span>
              </div>

              <div className="assignment-status-row">
                <span
                  className={`assignment-status ${
                    report.status === "Completed" ? "completed" : "in-progress"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <div className="incident-actions">
                {report.status !== "In Progress" && (
                  <button onClick={() => handleStatusUpdate(report.id, "In Progress")}>
                    Mark In Progress
                  </button>
                )}

                {report.status !== "Completed" && (
                  <button
                    className="secondary-btn"
                    onClick={() => handleStatusUpdate(report.id, "Completed")}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </article>
          ))}

          {currentReports.length === 0 && (
            <div className="assignment-card empty-card">
              <p className="assignment-description">No incidents found.</p>
            </div>
          )}
        </div>

        <div className="assignments-pagination">
          <button
            className="page-box"
            onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            {"<"}
          </button>

          <button className="page-number-box">{currentPage}</button>

          <button
            className="page-arrow"
            onClick={() =>
              currentPage < totalPages && setCurrentPage((prev) => prev + 1)
            }
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            {">"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
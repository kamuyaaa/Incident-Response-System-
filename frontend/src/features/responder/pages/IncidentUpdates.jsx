import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./IncidentUpdates.css";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import ReporterMenu from "../../reporter/components/ReporterMenu";

const assignedData = [
  {
    id: "#50003",
    type: "Fire & Rescue",
    icon: "🔥",
    date: "09/02/2026",
    description:
      "There is a fire in a residential building in Eastleigh, Nairobi. Smoke is coming from the upper floors, and several people are standing outside. I’m not sure if everyone has gotten out yet. I can see about three people injured so far",
    location: "Eastleigh, Nairobi",
    status: "Completed",
  },
  {
    id: "#50002",
    type: "Fire & Rescue",
    icon: "🔥",
    date: "20/01/2026",
    description:
      "A residential house caught fire late at night, trapping occupants before neighbors helped rescue them as emergency services were contacted",
    location: "Manyatta Estate, near Manyatta Roundabout, Kisumu",
    status: "Completed",
  },
  {
    id: "#50001",
    type: "Fire & Rescue",
    icon: "🔥",
    date: "04/09/2025",
    description:
      "A fire broke out in several stalls within Gikomba Market, suspected to have been caused by an electrical fault, and spread rapidly before firefighters arrived",
    location: "Gikomba Market, near Pumwani Road, Nairobi",
    status: "Completed",
  },
  {
    id: "#50000",
    type: "Medical Emergency",
    icon: "🚨",
    date: "11/08/2025",
    description:
      "An elderly man collapsed near the matatu stage and was unable to respond before medical help arrived.",
    location: "Nyamakima, Nairobi",
    status: "In Progress",
  },
];

const inProgressData = [
  {
    id: "#41001",
    type: "Road & Transport",
    icon: "🚗",
    date: "14/02/2026",
    description:
      "Two vehicles collided at a junction, causing heavy traffic and minor injuries.",
    location: "Thika Road, Nairobi",
    status: "In Progress",
  },
];

const completedData = [
  {
    id: "#32001",
    type: "Crime & Safety",
    icon: "🛡️",
    date: "10/02/2026",
    description:
      "A robbery incident was reported and the suspect was later apprehended by officers.",
    location: "CBD, Nairobi",
    status: "Completed",
  },
  {
    id: "#32002",
    type: "Public Safety & Welfare",
    icon: "👥",
    date: "08/02/2026",
    description:
      "A lost child was safely reunited with their family after being found in a crowded public area.",
    location: "Busia Town",
    status: "Completed",
  },
];

export default function MyAssignments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assigned");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const allReports =
    activeTab === "assigned"
      ? assignedData
      : activeTab === "progress"
      ? inProgressData
      : completedData;

  const totalPages = Math.max(1, Math.ceil(allReports.length / itemsPerPage));

  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allReports.slice(startIndex, startIndex + itemsPerPage);
  }, [allReports, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

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

          <ReporterMenu />
        </div>

        <div className="assignments-tabs">
          <button
            className={`assignments-tab ${
              activeTab === "assigned" ? "active" : ""
            }`}
            onClick={() => handleTabChange("assigned")}
          >
            Assigned Incidents
          </button>

          <button
            className={`assignments-tab ${
              activeTab === "progress" ? "active" : ""
            }`}
            onClick={() => handleTabChange("progress")}
          >
            In Progress
          </button>

          <button
            className={`assignments-tab ${
              activeTab === "completed" ? "active" : ""
            }`}
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
                  <span className="assignment-type-icon">{report.icon}</span>
                  <span className="assignment-type-text">{report.type}</span>
                </div>

                <span className="assignment-date">
                  Reported: {report.date}
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
                    report.status === "Completed"
                      ? "completed"
                      : "in-progress"
                  }`}
                >
                  {report.status}
                </span>
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

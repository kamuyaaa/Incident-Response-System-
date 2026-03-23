import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./MyReports.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import ReporterMenu from "../components/ReporterMenu";
import reporterService from "../services/reporterService";
import { useAuth } from "../../../shared/hooks/useAuth";

const typeIcons = {
  "Medical Emergency": "🚨",
  "Fire & Rescue": "🔥",
  "Crime & Safety": "🛡️",
  "Road & Transport": "🚗",
  "Public Safety & Welfare": "👥",
  "Natural Disaster": "🌊",
};

function mapIncidentToReport(incident) {
  return {
    id: incident.id,
    type: incident.type,
    icon: typeIcons[incident.type] || "📝",
    date: new Date(incident.createdAt).toLocaleDateString(),
    description: incident.description,
    location: incident.location,
    status: incident.status,
    reporterId: incident.reporterId,
  };
}

export default function MyReports() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const defaultTab = searchParams.get("tab") || "mine";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [currentPage, setCurrentPage] = useState(1);
  const [myReports, setMyReports] = useState([]);
  const [otherReports, setOtherReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const reportsPerPage = 3;

  useEffect(() => {
    async function loadReports() {
      try {
        const [mine, all] = await Promise.all([
          reporterService.getMyReports(user.id),
          reporterService.getAllIncidents(),
        ]);

        setMyReports(mine.map(mapIncidentToReport));
        setOtherReports(
          all
            .filter((incident) => incident.reporterId !== user.id)
            .map(mapIncidentToReport)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadReports();
    }
  }, [user]);

  const allReports = activeTab === "mine" ? myReports : otherReports;
  const totalPages = Math.max(1, Math.ceil(allReports.length / reportsPerPage));

  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    return allReports.slice(startIndex, startIndex + reportsPerPage);
  }, [allReports, currentPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    navigate(`/reporter/my-reports?tab=${tab}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <PhoneFrame>
        <div className="myreports-page">Loading reports...</div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="myreports-page">
        <div className="myreports-topbar">
          <button
            className="myreports-back-btn"
            onClick={() => navigate("/reporter")}
            aria-label="Go back"
          >
            ←
          </button>

          <ReporterMenu />
        </div>

        <div className="reports-tabs">
          <button
            className={`tab-btn ${activeTab === "mine" ? "active" : ""}`}
            onClick={() => handleTabChange("mine")}
          >
            Reported by you
          </button>

          <button
            className={`tab-btn ${activeTab === "others" ? "active" : ""}`}
            onClick={() => handleTabChange("others")}
          >
            Reported by others
          </button>
        </div>

        <div className="reports-list">
          {currentReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-card-top">
                <div className="report-type">
                  <span className="report-type-icon">{report.icon}</span>
                  <span className="report-type-text">{report.type}</span>
                </div>

                <span className="report-date">Reported: {report.date}</span>
              </div>

              <p className="report-description">{report.description}</p>

              <div className="report-meta-row">
                <span className="report-location">📍 {report.location}</span>
                <span className="report-id">Incident Id: {report.id}</span>
              </div>

              <div className="report-status-row">
                <span
                  className={`status-badge ${
                    report.status === "Completed"
                      ? "completed"
                      : "in-progress"
                  }`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          ))}

          {currentReports.length === 0 && (
            <div className="report-card empty-state">
              <p className="report-description">No reports found.</p>
            </div>
          )}
        </div>

        <div className="reports-pagination">
          <button
            className="page-arrow"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            {"<"}
          </button>

          <button className="page-number active">{currentPage}</button>

          <button
            className="page-arrow"
            onClick={handleNextPage}
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
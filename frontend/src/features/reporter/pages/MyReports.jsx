import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./MyReports.css";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import ReporterMenu from "../components/ReporterMenu";
import { useSearchParams } from "react-router-dom";

const myReportsData = [
  {
    id: "#10003",
    type: "Medical Emergency",
    icon: "🚨",
    date: "13/02/2026",
    description:
      "A person has collapsed near the entrance of TRM and is not responding. A small crowd has gathered, and we need medical assistance urgently.",
    location: "TRM, Thika Road",
    status: "In Progress",
  },
  {
    id: "#50003",
    type: "Fire & Rescue",
    icon: "🔥",
    date: "09/02/2026",
    description:
      "There is a fire in a residential building in Eastleigh, Nairobi. Smoke is coming from the upper floors, and several people are standing outside.",
    location: "Eastleigh, Nairobi",
    status: "Completed",
  },
  {
    id: "#20003",
    type: "Crime & Safety",
    icon: "🛡️",
    date: "26/01/2026",
    description:
      "A shop in Eldoret town center has just been robbed. The suspect ran away a few minutes ago, and the owner is shaken.",
    location: "Eldoret town center, Eldoret",
    status: "In Progress",
  },
  {
    id: "#31004",
    type: "Road & Transport",
    icon: "🚗",
    date: "20/01/2026",
    description:
      "A matatu and a private car have collided near the roundabout, causing traffic congestion.",
    location: "Thika Superhighway",
    status: "Completed",
  },
  {
    id: "#45001",
    type: "Public Safety & Welfare",
    icon: "👥",
    date: "18/01/2026",
    description:
      "A child appears lost at the market area and several people are trying to help.",
    location: "Gikomba Market",
    status: "In Progress",
  },
  {
    id: "#60021",
    type: "Natural Disaster",
    icon: "🌊",
    date: "12/01/2026",
    description:
      "Flood waters are rising quickly in the lower residential area and families are evacuating.",
    location: "Budalang’i",
    status: "In Progress",
  },
];

const otherReportsData = [
  {
    id: "#34001",
    type: "Road & Transport",
    icon: "🚗",
    date: "12/02/2026",
    description:
      "Two vehicles have collided near the roundabout and traffic is building up quickly.",
    location: "Muthaiga roundabout, Nairobi",
    status: "In Progress",
  },
  {
    id: "#34002",
    type: "Public Safety & Welfare",
    icon: "👥",
    date: "10/02/2026",
    description:
      "There is a large unattended crowd gathering near the bus stage and people seem distressed.",
    location: "Kencom stage, Nairobi",
    status: "Completed",
  },
  {
    id: "#34003",
    type: "Crime & Safety",
    icon: "🛡️",
    date: "09/02/2026",
    description:
      "A suspicious group has been reported near a closed shop late at night.",
    location: "Ngara, Nairobi",
    status: "In Progress",
  },
  {
    id: "#34004",
    type: "Medical Emergency",
    icon: "🚨",
    date: "05/02/2026",
    description:
      "An elderly man collapsed at a bus stop and nearby people called for assistance.",
    location: "Khoja, Nairobi",
    status: "Completed",
  },
];

export default function MyReports() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "mine";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [currentPage, setCurrentPage] = useState(1);

  const reportsPerPage = 3;

  const allReports = activeTab === "mine" ? myReportsData : otherReportsData;

  const totalPages = Math.ceil(allReports.length / reportsPerPage);

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
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
          >
            {">"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
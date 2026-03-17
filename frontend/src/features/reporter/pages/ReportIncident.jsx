import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReportIncident.css";
import { useNavigate } from "react-router-dom";
import ReporterMenu from "../components/ReporterMenu";

const categories = [
  { id: "medical", icon: "🚨", label: "Medical Emergency" },
  { id: "crime", icon: "🛡️", label: "Crime & Safety" },
  { id: "disaster", icon: "🌊", label: "Natural Disaster" },
  { id: "road", icon: "🚗", label: "Road & Transport" },
  { id: "fire", icon: "🔥", label: "Fire & Rescue" },
  { id: "public", icon: "👥", label: "Public Safety & Welfare" },
  { id: "other", icon: "📝", label: "Other" },
];

export default function ReportIncident() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="report-incident-page">
        <div className="report-incident-topbar">
          <button
            className="back-btn"
            onClick={() => navigate("/reporter")}
            aria-label="Go back"
          >
            ←
          </button>

          <ReporterMenu />
        </div>

        <h1 className="report-incident-title">
          What kind of emergency are
          <br />
          you experiencing?
        </h1>

        <div className="incident-category-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className="incident-category-card"
              onClick={() =>
                navigate(`/reporter/report/details?type=${category.id}`)
              }
            >
              <span className="incident-category-icon">{category.icon}</span>
              <span className="incident-category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}
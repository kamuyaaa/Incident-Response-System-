import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ResponderReportIncident.css";
import { useNavigate } from "react-router-dom";
import ResponderMenu from "../components/ResponderMenu";

const categories = [
  { id: "medical", icon: "🚨", label: "Medical Emergency" },
  { id: "crime", icon: "🛡️", label: "Crime & Safety" },
  { id: "disaster", icon: "🌊", label: "Natural Disaster" },
  { id: "road", icon: "🚗", label: "Road & Transport" },
  { id: "fire", icon: "🔥", label: "Fire & Rescue" },
  { id: "public", icon: "👥", label: "Public Safety & Welfare" },
  { id: "other", icon: "📝", label: "Other" },
];

export default function ResponderReportIncident() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="report-incident-page">
        <div className="report-incident-topbar">
          <button
            className="back-btn"
            onClick={() => navigate("/responder")}
            aria-label="Go back"
          >
            ←
          </button>

          <ResponderMenu />
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
                navigate(`/responder/report/details?type=${category.id}`)
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
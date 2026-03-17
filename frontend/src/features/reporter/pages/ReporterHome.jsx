import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReporterHome.css";
import { useNavigate } from "react-router-dom";
import ReporterMenu from "../components/ReporterMenu";

export default function ReporterHome() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="reporter-home">
        <ReporterMenu />

        <h1 className="reporter-title">
          Need an emergency
          <br />
          service?
        </h1>

        <div className="location-card">
          <div className="location-left">
            <div className="location-icon">📍</div>
            <div className="location-text">
              <h3>Current Location</h3>
              <p>Westlands, Nairobi</p>
            </div>
          </div>

          <button className="change-location-btn">
            Change
          </button>
        </div>

        <div
          className="report-button"
          onClick={() => navigate("/reporter/report")}
        >
          REPORT
          <br />
          INCIDENT
        </div>

        <p className="or-text">OR</p>

        <button
          className="call-btn"
          onClick={() => {
            window.location.href = "tel:999";
          }}
        >
          📞 EMERGENCY CALL
        </button>

        <div className="quick-report">
          <h2 className="quick-title">Quick Report</h2>

          <div className="quick-grid">
            <div
              className="quick-card assault"
              onClick={() => navigate("/reporter/report?type=assault")}
            >
              <div className="quick-icon">👊</div>
              <p>ASSAULT</p>
            </div>

            <div
              className="quick-card theft"
              onClick={() => navigate("/reporter/report?type=theft")}
            >
              <div className="quick-icon">👜</div>
              <p>THEFT</p>
            </div>

            <div
              className="quick-card accident"
              onClick={() => navigate("/reporter/report?type=accident")}
            >
              <div className="quick-icon">🚗</div>
              <p>ACCIDENT</p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
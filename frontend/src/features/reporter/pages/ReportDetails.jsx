import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReportDetails.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ReporterMenu from "../components/ReporterMenu";

export default function ReportDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showConfirm, setShowConfirm] = useState(false);

  const type = searchParams.get("type") || "general";

  const handleFinalSubmit = () => {
    setShowConfirm(false);
    alert("Report submitted successfully");
    navigate("/reporter/my-reports");
  };

  return (
    <PhoneFrame>
      <div className="report-details-page">
        <ReporterMenu />

        <div className="report-details-card">
          <div className="report-details-header">
            <h1>Send Report</h1>
            <button
              className="close-btn"
              onClick={() => navigate("/reporter/report")}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="report-type-tag">
            Type: <span>{type}</span>
          </p>

          <form
            className="report-details-form"
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
          >
            <label>Description</label>
            <textarea
              placeholder="Describe what happened..."
              rows="5"
              required
            />

            <label>Any casualties? If yes, how many?</label>
            <input type="text" placeholder="Yes, 1 person" />

            <label>Location</label>
            <input type="text" placeholder="TRM, Thika Road" required />

            <label>
              Upload Pictures / Videos <span>(optional)</span>
            </label>
            <div className="upload-box">
              <input type="file" accept="image/*,video/*" />
            </div>

            <button type="submit" className="submit-report-btn">
              SUBMIT REPORT
            </button>
          </form>
        </div>

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <div className="confirm-icon">!</div>

              <p className="confirm-text">
                Are you sure you want to
                <br />
                submit this report?
              </p>

              <button
                className="confirm-yes-btn"
                onClick={handleFinalSubmit}
              >
                YES
              </button>

              <button
                className="confirm-cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./ReportDetails.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import ReporterMenu from "../components/ReporterMenu";
import { useAuth } from "../../../shared/hooks/useAuth";
import reporterService from "../services/reporterService";

export default function ReportDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    description: "",
    casualties: "",
    location: "",
  });

  const type = searchParams.get("type") || "general";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      await reporterService.createIncident({
        reporterId: user.id,
        type,
        description: form.description,
        location: form.location,
      });

      setShowConfirm(false);
      alert("Report submitted successfully");
      navigate("/reporter/my-reports");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
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
              name="description"
              placeholder="Describe what happened..."
              rows="5"
              value={form.description}
              onChange={handleChange}
              required
            />

            <label>Any casualties? If yes, how many?</label>
            <input
              name="casualties"
              type="text"
              placeholder="Yes, 1 person"
              value={form.casualties}
              onChange={handleChange}
            />

            <label>Location</label>
            <input
              name="location"
              type="text"
              placeholder="TRM, Thika Road"
              value={form.location}
              onChange={handleChange}
              required
            />

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
                disabled={submitting}
              >
                {submitting ? "SUBMITTING..." : "YES"}
              </button>

              <button
                className="confirm-cancel-btn"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
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
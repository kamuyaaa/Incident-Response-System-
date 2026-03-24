import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      <div className="landing">
        <img src={logo} alt="logo" className="landing-logo" />

        <h1 className="landing-title">Welcome to SafeReport</h1>

        <p className="landing-text">
          Report emergencies, safety hazards, and incidents in real time.
        </p>

        <p className="landing-text">
          Help authorities respond faster and keep our communities safe.
        </p>

        <button className="start-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>

        <button
          className="guest-link"
          type="button"
          onClick={() => navigate("/reporter/report")}
        >
          Continue as a Guest
        </button>
      </div>
    </PhoneFrame>
  );
}
import { Link } from "react-router-dom";
import "./reportersregistration.css";

function ReporterRegistration() {
  return (
    <div className="registration-container">

      <h2 className="title">Register Now</h2>

        <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          required
        />
      </div>

      <div className="form-group">
        <label>E-mail</label>
        <input
          type="email"
          placeholder="Enter email"
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="options">
        <label className="remember">
          <input type="checkbox" className="custom-checkbox"/>
           Remember me
        </label>
      </div>

      <button className="sign-up-btn" onClick={() => window.location.href = "/report-incident"}>
        SIGN UP
      </button>

      <p className="login">
        Already have an account? <Link to="/login">Login here</Link>
      </p>

    </div>
  );
}

export default ReporterRegistration;
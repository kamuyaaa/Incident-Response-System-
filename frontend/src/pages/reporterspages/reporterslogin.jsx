import { Link } from "react-router-dom";
import "./reporterslogin.css";

function ReporterLogin() {
  return (
    <div className="login-container">

      <h2 className="title">Welcome Back</h2>

      <div className="form-group">
        <label>E-mail</label>
        <input
          type="email"
          placeholder="Enter email"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
        />
      </div>

      <div className="options">
        <label className="remember">
          <input type="checkbox" className="custom-checkbox"/>
           Remember me
        </label>

        <p className="forgot">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>

      <button className="login-btn" onClick={() => window.location.href = "/report-incident"}>
        LOGIN
      </button>

      <p className="register">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

    </div>
  );
}

export default ReporterLogin;
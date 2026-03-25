import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./reporterslogin.css";

function ReporterLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No account found. Please register first.");
      return;
    }

    if (email === storedUser.email && password === storedUser.password) {
      
      navigate("/report-incident");

    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <form className="login-container" onSubmit={handleSubmit}>

      <h2 className="title">Welcome Back</h2>

      <div className="form-group">
        <label>E-mail</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

      <button className="login-btn" type="submit">
        LOGIN
      </button>

      <p className="register">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

    </form>
  );
}

export default ReporterLogin;
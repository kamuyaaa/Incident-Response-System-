import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // for now, just redirect after fields are filled
    navigate("/reporter");
  };

  return (
    <PhoneFrame>
      <div className="login-page">
        <div className="login-card">
          <img src={logo} alt="SafeReport logo" className="login-logo" />

          <h1 className="login-title">Welcome Back</h1>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="***********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <p
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            </div>

            <button className="login-btn" type="submit">
              LOGIN
            </button>
          </form>

          <p className="register-text">
            Don’t have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
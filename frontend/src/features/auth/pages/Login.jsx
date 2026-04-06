import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./Login.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../shared/hooks/useAuth";
import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "reporter",
    remember: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const demo = location.state?.demoLogin;
    if (
      demo &&
      typeof demo.email === "string" &&
      typeof demo.password === "string" &&
      typeof demo.role === "string"
    ) {
      setForm((prev) => ({
        ...prev,
        email: demo.email,
        password: demo.password,
        role: demo.role,
      }));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await authService.login({
        email: form.email,
        password: form.password,
      });

      if (response.user.role !== form.role) {
        throw new Error(`This account is registered as ${response.user.role}, not ${form.role}`);
      }

      login(response.user, response.token);
      navigate(`/${response.user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="login-page">
        <div className="login-card">
          <img src={logo} alt="SafeReport logo" className="login-logo" />

          <h1 className="login-title">Welcome Back</h1>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="reporter">Reporter</option>
                <option value="responder">Responder</option>
                <option value="admin">Admin</option>
              </select>
            </div>

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

              <Link className="forgot-password" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button className="login-btn" type="submit" disabled={submitting}>
              {submitting ? "LOGGING IN..." : "LOGIN"}
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
import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import logo from "../../../assets/logo.png";
import authService from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "reporter",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await authService.register(form);

      login(response.user, "");
      navigate(`/${response.user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="register-page">
        <div className="register-card">
          <img src={logo} alt="SafeReport logo" className="register-logo" />

          <h1 className="register-title">Create Account</h1>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="fullname">Fullname</label>
              <input
                id="fullname"
                type="text"
                placeholder="John Doe"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
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

            <div className="register-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="text"
                placeholder="+254 700 000 000"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
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

            <div className="register-field">
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

            <button className="register-btn" type="submit" disabled={submitting}>
              {submitting ? "REGISTERING..." : "REGISTER"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import PhoneFrame from "../../../shared/components/PhoneFrame";
import authService from "../services/authService";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.forgotPassword({
        email: form.email,
        phone: form.phone,
        newPassword: form.newPassword,
      });
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="forgot-page">
        <div className="forgot-card">
          <h1>Reset Password</h1>
          <p>Use your account email and phone number to set a new password.</p>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <form onSubmit={handleSubmit}>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              id="phone"
              type="text"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              id="newPassword"
              type="password"
              placeholder="New password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>

          <p className="back-to-login">
            Remembered your password? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
import PhoneFrame from "../../../shared/components/PhoneFrame";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import logo from "../../../assets/logo.png";

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

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      id: "1",
      name: form.fullname,
      email: form.email,
      phone: form.phone,
      role: form.role,
    });

    navigate(`/${form.role}`);
  };

  return (
    <PhoneFrame>
      <div className="register-page">
        <div className="register-card">
          <img src={logo} alt="SafeReport logo" className="register-logo" />

          <h1 className="register-title">Create Account</h1>

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

            <button className="register-btn" type="submit">
              REGISTER
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

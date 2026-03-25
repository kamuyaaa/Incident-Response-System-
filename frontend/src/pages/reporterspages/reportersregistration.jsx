import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./reportersregistration.css";

function ReporterRegistration() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: fullName,
      email: email,
      phoneNumber: phoneNumber,
      password: password
    };

    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/report-incident");
  };

  return (
    <form className="registration-container" onSubmit={handleSubmit}>

      <h2 className="title">Register Now</h2>

        <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

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
        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
      </div>

      <button className="sign-up-btn" type="submit">
        SIGN UP
      </button>

      <p className="login">
        Already have an account? <Link to="/login">Login here</Link>
      </p>

    </form>
  );
}

export default ReporterRegistration;
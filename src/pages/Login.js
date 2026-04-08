import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="phone-container">
      <div className="login-card"> {/* Using your login-card class from CSS */}
        <h1>Login</h1>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button className="primary-btn">Login</button>
        <p onClick={() => navigate('/')} style={{cursor: 'pointer', marginTop: '10px'}}>
          Back to Welcome
        </p>
      </div>
    </div>
  );
}

export default Login;
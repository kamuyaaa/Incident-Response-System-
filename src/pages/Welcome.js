import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="phone-container">
      <div className="content">
        <h1>Welcome to SafeReport</h1>
        <p>Report emergencies, safety hazards and incidents.</p>
        <p>Help authorities respond faster and keep communities safe.</p>
        {/* Added className="primary-btn" to link to your CSS */}
        <button className="primary-btn" onClick={() => navigate('/login')}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Welcome;
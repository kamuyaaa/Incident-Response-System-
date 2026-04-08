import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // This line links your CSS styles to the entire app
import Welcome from './pages/Welcome';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Your original routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
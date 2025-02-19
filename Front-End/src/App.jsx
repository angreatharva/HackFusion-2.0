import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import CreatePoll from "./components/CreatePoll"; // Admin Component
import VotePoll from "./components/VotePoll"; // Student Component
import PollsList from "./components/PollsList";
import Register from "./pages/Register";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    if (token) {
      setRole(localStorage.getItem("role")); // Set role from localStorage when token exists
    }
  }, [token]);

  // Wait for role to be set before rendering Routes
  if (!role) {
    return <div>Loading...</div>; // Or return a loading spinner until the role is fetched
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />

        {/* Admin only routes */}
        <Route
          path="/create-poll"
          element={role === "admin" ? <CreatePoll token={token} /> : <Home />}
        />
        {/* Student only routes */}
        <Route
          path="/vote-poll"
          element={role === "student" ? <VotePoll token={token} /> : <Home />}
        />
        <Route path="/pollsList" element={<PollsList token={token} />} />
        <Route path="/applicationFrom" element={<ApplicationForm token={token} />} />
        <Route path="/applicationList" element={<ApplicationList token={token} />} />

        
      </Routes>
    </Router>
  );
}

export default App;

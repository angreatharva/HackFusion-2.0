import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import CreatePoll from "./components/CreatePoll";
import VotePoll from "./components/VotePoll";
import PollsList from "./components/PollsList";
import Register from "./pages/Register";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import StudentDashboard from "./components/StudentDashboard";
import AdminPanel from "./components/AdminPanel";
import CheatingRecordForm from "./components/CheatingRecordForm";
import CheatingList from "./components/CheatingRecordList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />

        {/* These routes now render their components directly */}
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/vote-poll" element={<VotePoll />} />
        <Route path="/pollsList" element={<PollsList />} />
        <Route path="/applicationForm" element={<ApplicationForm />} />
        <Route path="/applicationList" element={<ApplicationList />} />
        <Route path="/facilityBooking" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/cheatingAdmin" element={<CheatingRecordForm />} />
        <Route path="/cheatingList" element={<CheatingList />} />
      </Routes>
    </Router>
  );
}

export default App;

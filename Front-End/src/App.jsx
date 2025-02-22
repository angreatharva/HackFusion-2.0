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
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import StudentDashboard from "./components/StudentDashboard";
import FacilityApproval from "./components/FacilityApproval";
import CheatingRecordForm from "./components/CheatingRecordForm";
import CheatingList from "./components/CheatingRecordList";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintsList from "./components/ComplaintsList";
import HealthReport from "./components/healthReport";
import BudgetPage from "./components/BudgetPage";
import ExpensePage from "./components/ExpensePage";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentAppointmentForm from "./components/StudentAppointmentForm";
import DoctorDashboard from "./components/DoctorDashboard";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    if (token) {
      setRole(localStorage.getItem("role")); // Set role from localStorage when token exists
    }
  }, [token]);

  // // Wait for role to be set before rendering Routes
  // if (!role) {
  //   return <div>Loading...</div>; // Or return a loading spinner until the role is fetched
  // }

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
        <Route
          path="/applicationForm"
          element={<ApplicationForm token={token} />}
        />
        <Route
          path="/applicationList"
          element={<ApplicationList token={token} />}
        />

        <Route path="/facilityBooking" element={<StudentDashboard />} />
        <Route path="/facilityApproval" element={<FacilityApproval />} />

        <Route path="/cheatingAdmin" element={<CheatingRecordForm />} />
        <Route path="/cheatingList" element={<CheatingList />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/expense/:budgetId" element={<ExpensePage />} />

        <Route
          path="/complaintForm"
          element={
            <ComplaintForm
              onSubmitSuccess={(data) =>
                console.log("Complaint submitted:", data)
              }
            />
          }
        />
        <Route
          path="/complaintList"
          element={<ComplaintsList userRole="user" />}
        />

        <Route path="/healthReport" element={<HealthReport />} />
        <Route
          path="/studentAppointmentForm"
          element={<StudentAppointmentForm />}
        />
        <Route path="/doctorDashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

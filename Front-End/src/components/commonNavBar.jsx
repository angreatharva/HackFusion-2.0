import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">NOVA</h1>
      </div>

      <div className="navbar-right">
        {/* Admin Options */}
        {userInfo.role === "admin" && (
          <>
            <button
              className="navbar-button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/create-poll")}
            >
              Create Poll
            </button>
          </>
        )}

        {/* Common Options for non-invigilator and non-doctor roles */}
        {userInfo.role !== "invigilator" && userInfo.role !== "doctor" && (
          <>
            <button
              className="navbar-button"
              onClick={() => navigate("/pollsList")}
            >
              Go to Voting
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/applicationList")}
            >
              Applications List
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/budget")}
            >
              Budget
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/facilityBooking")}
            >
              Facility Booking
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/complaintList")}
            >
              Complaint List
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/cheatingList")}
            >
              Cheating List
            </button>
          </>
        )}

        {/* Student-Specific Options */}
        {userInfo.role === "student" && (
          <>
            <button
              className="navbar-button"
              onClick={() => navigate("/applicationForm")}
            >
              Applications Form
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/complaintForm")}
            >
              Complaint Form
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/studentAppointmentForm")}
            >
              Student Appointment Form
            </button>
          </>
        )}

        {/* Doctor-Specific Options */}
        {userInfo.role === "doctor" && (
          <>
            <button
              className="navbar-button"
              onClick={() => navigate("/healthReport")}
            >
              Health Report
            </button>
            <button
              className="navbar-button"
              onClick={() => navigate("/doctorDashboard")}
            >
              Doctor Dashboard
            </button>
          </>
        )}

        {/* Invigilator-Specific Option */}
        {userInfo.role === "invigilator" && (
          <button
            className="navbar-button"
            onClick={() => navigate("/cheatingAdmin")}
          >
            Cheating Admin
          </button>
        )}

        {/* Admin-Specific Facility Approval */}
        {userInfo.role === "admin" && (
          <button
            className="navbar-button"
            onClick={() => navigate("/facilityApproval")}
          >
            Facility Approval
          </button>
        )}

        {/* Logout Button */}
        <button className="navbar-button logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background-color: #222;
          color: white;
        }

        .navbar-brand {
        color: #f1f1f1;
          font-size: 1.8em;
          font-weight: bold;
        }

        .navbar-right {
          display: flex;
          gap: 10px;
        }

        .navbar-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .navbar-button:hover {
          background-color: #45a049;
        }

        .navbar-button.logout {
          background-color: #f44336;
        }

        .navbar-button.logout:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

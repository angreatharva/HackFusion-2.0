import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic, e.g., remove user data from localStorage or context
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* You can add a logo or app name here */}
        <h1 className="navbar-brand">CMS</h1>
      </div>

      <div className="navbar-right">
        {userInfo.role === "doctor" && (
          <button
            className="navbar-button"
            onClick={() => {
              navigate("/healthReport");
            }}
          >
            Health Report
          </button>
        )}

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/complaintForm");
          }}
        >
          Complaint Form
        </button>

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/complaintList");
          }}
        >
          Complaint List
        </button>

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/budget");
          }}
        >
          Budget
        </button>
        {userInfo.role === "admin" && (
          <button
            className="navbar-button"
            onClick={() => {
              navigate("/facilityApproval");
            }}
          >
            Facility Approval
          </button>
        )}

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/cheatingList");
          }}
        >
          Cheating List
        </button>

        {userInfo.role === "admin" && (
          <button
            className="navbar-button"
            onClick={() => {
              navigate("/cheatingAdmin");
            }}
          >
            Cheating Admin
          </button>
        )}

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/facilityBooking");
          }}
        >
          Facility Booking
        </button>

        <button
          className="navbar-button"
          onClick={() => {
            navigate("/applicationList");
          }}
        >
          Applications List
        </button>

        {userInfo.role === "student" && (
          <button
            className="navbar-button"
            onClick={() => {
              navigate("/applicationForm");
            }}
          >
            Applications Form
          </button>
        )}

        {/* Conditional rendering for the buttons */}
        {userInfo.role === "student" && (
          <button
            className="navbar-button"
            onClick={() => {
              navigate("/pollsList");
            }}
          >
            Go to Voting
          </button>
        )}

        {userInfo.role === "admin" && (
          <>
            <button
              className="navbar-button"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
            <button
              className="navbar-button"
              onClick={() => {
                navigate("/create-poll");
              }}
            >
              Create Poll
            </button>
            <button
              className="navbar-button"
              onClick={() => {
                navigate("/pollsList");
              }}
            >
              Go to Voting
            </button>
          </>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <style>{`
  .navbar {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    background-color: #333 !important;
    padding: 8px !important;
    width: 100% !important;
  }

  .navbar-left {
    color: white !important;
  }

  .navbar-brand {
    font-size: 1.5em !important;
    color: white !important;
    font-weight: bold !important;
  }

  .navbar-right {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important; /* Adds spacing between buttons */
  }

  .navbar-button, .logout-button {
    display: inline-block !important;
    padding: 8px 16px !important;
    border: none !important;
    background-color: #4caf50 !important;
    color: white !important;
    border-radius: 5px !important;
    cursor: pointer !important;
    transition: background-color 0.3s ease !important;
    white-space: nowrap !important; /* Ensures the button doesn't wrap text */
  }

  .navbar-button:hover {
    background-color: #45a049 !important;
  }

  .logout-button {
    background-color: #f44336 !important;
  }

  .logout-button:hover {
    background-color: #d32f2f !important;
  }
`}</style>
    </nav>
  );
};

export default Navbar;

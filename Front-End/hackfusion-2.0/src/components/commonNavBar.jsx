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
        {/* Budget button - always visible */}
        <button
          className="navbar-button"
          onClick={() => {
            navigate("/budget");
          }}
        >
          Budget
        </button>

        {/* Check-Up button - always visible */}
        <button
          className="navbar-button"
          onClick={() => {
            navigate("/check-up");
          }}
        >
          Check-Up
        </button>

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
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #333;
          padding: 8px;
          width: 100%;
        }

        .navbar-left {
          color: white;
        }

        .navbar-brand {
          font-size: 1.5em;
          color: white;
          font-weight: bold;
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        .navbar-button {
          margin-left: 10px;
          padding: 8px 16px;
          border: none;
          background-color: #4caf50;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .navbar-button:hover {
          background-color: #45a049;
        }

        .logout-button {
         margin-left: 10px;
          padding: 8px 16px;
          border: none;
          color: white;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          background-color: #f44336;
          margin-left: 20px;
        }

        .logout-button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

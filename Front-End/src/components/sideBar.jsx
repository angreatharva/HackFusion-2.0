import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({ userInfo }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <button className="menu-button" onClick={toggleDrawer}>
        <FaBars />
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleDrawer}>
          <FaTimes />
        </button>

        <h1 className="sidebar-brand">NOVA</h1>

        <div className="sidebar-links">
          {/* {userInfo.role === "doctor" && (
            <button
              className="nav-button"
              onClick={() => navigate("/healthReport")}
            >
              Health Report
            </button>
          )} */}
          {userInfo.role === "admin" && (
            <>
              <button
                className="nav-button"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
              <button
                className="nav-button"
                onClick={() => navigate("/create-poll")}
              >
                Create Poll
              </button>
            </>
          )}
          {userInfo.role !== "invigilator" &&
            userInfo.role !== "doctor" &&
            userInfo.role !== "board_member" && (
              <button
                className="nav-button"
                onClick={() => navigate("/pollsList")}
              >
                Go to Voting
              </button>
            )}
          {userInfo.role !== "invigilator" && userInfo.role !== "doctor" && (
            <button
              className="nav-button"
              onClick={() => navigate("/applicationList")}
            >
              Applications List
            </button>
          )}
          {userInfo.role === "student" && (
            <button
              className="nav-button"
              onClick={() => navigate("/applicationForm")}
            >
              Applications Form
            </button>
          )}
          {userInfo.role !== "invigilator" && userInfo.role !== "doctor" && (
            <button className="nav-button" onClick={() => navigate("/budget")}>
              Budget
            </button>
          )}
          {userInfo.role !== "invigilator" &&
            userInfo.role !== "doctor" &&
            userInfo.role !== "board_member" && (
              <button
                className="nav-button"
                onClick={() => navigate("/facilityBooking")}
              >
                Facility Booking
              </button>
            )}
          {/* {userInfo.role === "admin" && (
            <button
              className="navbar-button"
              onClick={() => navigate("/facilityApproval")}
            >
              Facility Approval
            </button>
          )} */}
          {userInfo.role === "invigilator" && (
            <>
              <button
                className="navbar-button"
                onClick={() => navigate("/cheatingAdmin")}
              >
                Cheating Admin
              </button>
            </>
          )}
          {userInfo.role !== "doctor" && userInfo.role !== "board_member" && (
            <>
              <button
                className="navbar-button"
                onClick={() => navigate("/cheatingList")}
              >
                Cheating List
              </button>
            </>
          )}

          {userInfo.role === "student" && (
            <button
              className="nav-button"
              onClick={() => navigate("/complaintForm")}
            >
              Complaint Form
            </button>
          )}
          {userInfo.role !== "invigilator" && userInfo.role !== "doctor" && (
            <button
              className="nav-button"
              onClick={() => navigate("/complaintList")}
            >
              Complaint List
            </button>
          )}
          {userInfo.role === "student" && (
            <button
              className="nav-button"
              onClick={() => navigate("/studentAppointmentForm")}
            >
              Student Appointment Form
            </button>
          )}
          {userInfo.role === "doctor" && (
            <button
              className="nav-button"
              onClick={() => navigate("/doctorDashboard")}
            >
              Doctor Dashboard
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <style>{`
        /* Sidebar toggle button */
        .menu-button {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 1001;
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        /* Sidebar layout */
        .sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          height: 100%;
          width: 280px;
          background-color: #222;
          color: white;
          padding: 20px 15px;
          display: flex;
          flex-direction: column;
          transition: left 0.3s ease;
          z-index: 1000;
        }

        .sidebar.open {
          left: 0;
        }

        .close-button {
          background: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          align-self: flex-end;
        }

        .sidebar-brand {
          font-size: 2em;
          color: #FFFFFF;
          font-weight: bold;
          margin: 10px 0;
          text-align: center;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .nav-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 0; /* Adjusted padding for better alignment */
  border-radius: 5px;
  width: 100%;
  text-align: left;
  padding-left: 10px; /* Added left padding for spacing */
  cursor: pointer;
  transition: background-color 0.3s;
}

        .nav-button:hover {
          background-color: #45a049;
        }

        .logout-button {
          background-color: #f44336;
          margin-top: 20px;
        }

        .logout-button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </>
  );
};

export default Sidebar;

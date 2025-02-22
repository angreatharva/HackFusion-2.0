import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const Home = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the unique tab identifier
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    // If token does not exist, navigate to login page
    if (!token) {
      navigate("/");
    } else {
      // Set the user info (name, role) into the state
      setUserInfo({ name, role });
    }
  }, [navigate]);

  const handleLogout = () => {
    // Get the current tab identifier
    const tabId = sessionStorage.getItem("tabId");

    // Remove auth details only for the current tab
    localStorage.removeItem(`authToken_${tabId}`);
    localStorage.removeItem(`name_${tabId}`);
    localStorage.removeItem(`role_${tabId}`);

    // Clear the tab identifier from sessionStorage
    sessionStorage.removeItem("tabId");

    navigate("/");
  };

  return (
    <div className="home-container">
      <Navbar userInfo={userInfo} />
      <Sidebar userInfo={userInfo} />

      <div className="content">
        <h2>Welcome, {userInfo.name}!</h2>
        <p>Your role: {userInfo.role}</p>
      </div>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background-color: #f5f5f5;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        p {
          font-size: 1.25rem;
          margin-bottom: 20px;
        }

        .voting-button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          margin: 10px;
        }

        .voting-button:hover {
          background-color: #45a049;
        }

        @media (max-width: 600px) {
          .home-container {
            padding: 15px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .voting-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <nav className="navbar">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("authToken");
            navigate("/");
          }}
        >
          Logout
        </button>
      </nav>
      <div className="content">
        <h2>Welcome to Home Page</h2>
      </div>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
        }

        .navbar {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .logout-button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .logout-button:hover {
          background-color: #45a049;
        }

        .content {
          margin-top: 80px; /* To ensure content doesn't overlap with the navbar */
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .home-container {
            padding: 15px;
          }

          h2 {
            font-size: 1.5rem;
          }

          .logout-button {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { getPolls } from "../api/poll";
import Navbar from "../components/commonNavBar";
import { useNavigate } from "react-router-dom";

const calculatePercentage = (votes, totalVotes) => {
  return totalVotes ? (votes / totalVotes) * 100 : 0;
};

const POLLING_INTERVAL = 5000; // 5 seconds

const PollsList = ({ token }) => {
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
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showConfirmation, setShowConfirmation] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [debugMode, setDebugMode] = useState(false);

  const fetchPolls = async () => {
    try {
      const data = await getPolls(token);
      setPolls(data);
      setLastUpdated(new Date());
      if (debugMode) {
        console.log("Polls fetched at:", new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    const intervalId = setInterval(fetchPolls, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [token]);

  const handleOptionClick = (pollId, option) => {
    setErrorMessage((prevState) => ({ ...prevState, [pollId]: null }));
    setSelectedOptions((prevState) => ({
      ...prevState,
      [pollId]: option,
    }));
    setShowConfirmation((prevState) => ({
      ...prevState,
      [pollId]: true,
    }));
  };

  const handleConfirmation = async (pollId, isConfirmed) => {
    setShowConfirmation((prevState) => ({
      ...prevState,
      [pollId]: false,
    }));

    if (isConfirmed) {
      const currentPoll = polls.find((poll) => poll._id === pollId);

      if (!currentPoll) {
        setErrorMessage((prevState) => ({
          ...prevState,
          [pollId]: "Poll not found",
        }));
        return;
      }

      const selectedOption = selectedOptions[pollId];
      const optionIndex = currentPoll.options.findIndex(
        (option) => option.option === selectedOption.option
      );

      if (optionIndex === -1) {
        setErrorMessage((prevState) => ({
          ...prevState,
          [pollId]: "Selected option not found",
        }));
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/polls/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pollId: pollId,
            optionIndex: optionIndex,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          fetchPolls(); // Immediate fetch after successful vote
          setErrorMessage((prevState) => ({ ...prevState, [pollId]: null }));
        } else {
          setErrorMessage((prevState) => ({
            ...prevState,
            [pollId]: data.message,
          }));
        }
      } catch (error) {
        setErrorMessage((prevState) => ({
          ...prevState,
          [pollId]: "Error submitting vote. Please try again.",
        }));
      }
    }

    setSelectedOptions((prevState) => ({
      ...prevState,
      [pollId]: null,
    }));
  };

  if (loading) {
    return <p>Loading polls...</p>;
  }

  return (
    <div className="polls-container">
      <Navbar userInfo={userInfo} />

      {/* <div className="debug-controls">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="debug-toggle"
        >
          {debugMode ? "Hide Debug Info" : "Show Debug Info"}
        </button>
        {debugMode && (
          <div className="debug-info">
            <p>
              Last Updated:{" "}
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "Never"}
            </p>
            <p>Poll Count: {polls.length}</p>
            <p>Update Interval: {POLLING_INTERVAL / 1000}s</p>
            <button onClick={fetchPolls} className="debug-refresh">
              Manual Refresh
            </button>
          </div>
        )}
      </div> */}

      <h2>All Polls</h2>
      <div className="polls-grid">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (acc, option) => acc + option.votes,
            0
          );

          return (
            <div className="poll-card" key={poll._id}>
              <h3 className="poll-question">{poll.question}</h3>

              {errorMessage[poll._id] && (
                <div className="error-message">{errorMessage[poll._id]}</div>
              )}

              <ul className="poll-options">
                {poll.options.map((option) => {
                  const percentage = calculatePercentage(
                    option.votes,
                    totalVotes
                  );

                  return (
                    <li
                      key={option._id}
                      className="option-item"
                      onClick={() => handleOptionClick(poll._id, option)}
                    >
                      <div
                        className="option-bar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                      <span className="option-text">
                        {option.option} - <strong>{option.votes} Votes</strong>
                      </span>
                    </li>
                  );
                })}
              </ul>

              {showConfirmation[poll._id] && selectedOptions[poll._id] && (
                <div className="confirmation-container">
                  <p>
                    <strong>You selected: </strong>
                    <span>{selectedOptions[poll._id].option}</span>
                  </p>
                  <p>
                    Is this your final choice?
                    <button onClick={() => handleConfirmation(poll._id, true)}>
                      Yes
                    </button>
                    <button onClick={() => handleConfirmation(poll._id, false)}>
                      No
                    </button>
                  </p>
                </div>
              )}

              <p className="poll-author">
                Created by: {poll.createdBy.name} on{" "}
                {new Date(poll.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        .polls-container {
          // max-width: 90%;
          margin: 20px auto;
          padding: 20px;
        }

        .debug-controls {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 1000;
          background: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .debug-toggle {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .debug-info {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .debug-info p {
          margin: 5px 0;
          font-size: 0.9em;
        }

        .debug-refresh {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 5px;
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-size: 0.9em;
          border: 1px solid #ffcdd2;
        }

        .polls-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .poll-card {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .poll-card:hover {
          transform: scale(1.05);
        }

        .poll-question {
          color: #444;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .poll-options {
          list-style: none;
          padding-left: 0;
          margin-bottom: 10px;
        }

        .option-item {
          position: relative;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
          font-weight: 500;
          height: 50px;
          display: flex;
          align-items: center;
          color: #333;
          background-color: #f1f1f1;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .option-item:hover {
          background-color: #e0e0e0;
        }

        .option-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 5px;
          background-color: #4caf50;
          transition: width 0.5s ease-in-out;
        }

        .option-text {
          position: relative;
          z-index: 1;
          padding-left: 10px;
          width: 100%;
        }

        .poll-author {
          color: #777;
          font-size: 0.85em;
        }

        .confirmation-container {
          margin-top: 10px;
          padding: 10px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .confirmation-container p {
          margin: 5px 0;
          font-size: 1em;
          line-height: 1.5;
        }

        .confirmation-container button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
          transition: background-color 0.3s ease;
        }

        .confirmation-container button:hover {
          background-color: #45a049;
        }

        .confirmation-container button:last-child {
          background-color: #f44336;
        }

        .confirmation-container button:last-child:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default PollsList;

import React, { useEffect, useState } from "react";
import Navbar from "../components/commonNavBar";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../utils/encryption";
import { Bar } from "react-chartjs-2";
import "animate.css";
import Sidebar from "../components/sideBar";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const POLLING_INTERVAL = 5000;
const VOTE_API = "http://localhost:8000/api/polls/vote";
const POLLS_API = "http://localhost:8000/api/polls/allPolls";

const PollResultChart = ({ poll }) => {
  const labels = poll.options.map((option) => option.option);
  const dataValues = poll.options.map((option) => option.votes);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Votes",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div
      style={{
        height: "300px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      }}
      className="mt-3 animate__animated animate__fadeInUp"
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

const PollsList = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "", gender: "" });
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votedPolls, setVotedPolls] = useState({});
  const [showConfirmation, setShowConfirmation] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState({});
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedToken = localStorage.getItem(`authToken_${tabId}`);
    const encryptedName = localStorage.getItem(`name_${tabId}`);
    const encryptedRole = localStorage.getItem(`role_${tabId}`);
    const encryptedGender = localStorage.getItem(`gender_${tabId}`);

    if (!storedToken) {
      navigate("/");
    } else {
      const name = decryptData(encryptedName);
      const role = decryptData(encryptedRole);
      const gender = decryptData(encryptedGender);
      setUserInfo({ name, role, gender });
      setToken(storedToken);
    }
  }, [navigate]);

  const fetchPolls = async () => {
    if (!token) return;

    try {
      const response = await fetch(POLLS_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch polls");

      const data = await response.json();
      setPolls(data);

      const voted = {};
      data.forEach((poll) => {
        if (
          poll.votedOptionIndex !== null &&
          poll.votedOptionIndex !== undefined
        ) {
          voted[poll._id] = poll.votedOptionIndex;
        }
      });
      setVotedPolls(voted);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPolls();
      const intervalId = setInterval(fetchPolls, POLLING_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  const handleOptionClick = (pollId, optionIndex) => {
    const poll = polls.find((p) => p._id === pollId);

    if (!poll.isActive) {
      setErrorMessage((prev) => ({
        ...prev,
        [pollId]: "❌ This poll has expired. Voting is closed.",
      }));
      return;
    }

    if (votedPolls[pollId] !== undefined) {
      setErrorMessage((prev) => ({
        ...prev,
        [pollId]: "❌ You have already voted for this poll.",
      }));
      return;
    }

    setErrorMessage((prev) => ({ ...prev, [pollId]: null }));
    setSuccessMessage((prev) => ({ ...prev, [pollId]: null }));
    setSelectedOptions((prev) => ({
      ...prev,
      [pollId]: optionIndex,
    }));
    setShowConfirmation((prev) => ({
      ...prev,
      [pollId]: true,
    }));
  };

  const handleConfirmation = async (pollId, isConfirmed) => {
    setShowConfirmation((prev) => ({ ...prev, [pollId]: false }));

    if (isConfirmed) {
      setIsVoting(true);
      try {
        const response = await fetch(VOTE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pollId: pollId,
            optionIndex: selectedOptions[pollId],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to submit vote");
        }

        setVotedPolls((prev) => ({
          ...prev,
          [pollId]: data.votedOptionIndex,
        }));

        setSuccessMessage((prev) => ({
          ...prev,
          [pollId]: "✅ Vote submitted successfully!",
        }));

        await fetchPolls();
        setTimeout(fetchPolls, 300);
      } catch (error) {
        setErrorMessage((prev) => ({
          ...prev,
          [pollId]: error.message || "Error submitting vote. Please try again.",
        }));
        setVotedPolls((prev) => {
          const newState = { ...prev };
          delete newState[pollId];
          return newState;
        });
      } finally {
        setIsVoting(false);
      }
    }

    setSelectedOptions((prev) => ({ ...prev, [pollId]: null }));
  };

  const CountdownTimer = ({ expiresAt, isActive }) => {
    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = new Date(expiresAt) - now;

        if (timeDiff <= 0) {
          clearInterval(interval);
          setRemainingTime("Poll has ended!");
        } else {
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          setRemainingTime(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [expiresAt]);

    return (
      <div className="mb-3">
        <strong>⏳ Time remaining:</strong> {remainingTime}
        {!isActive && <span className="text-danger"> (Expired)</span>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <Sidebar userInfo={userInfo} />

      <div className="row g-4">
        {polls.map((poll) => {
          const isPollExpired = !poll.isActive;
          const userVotedOptionIndex = votedPolls[poll._id];
          const userVotedOption =
            userVotedOptionIndex !== undefined
              ? poll.options[userVotedOptionIndex]?.option
              : null;

          return (
            <div key={poll._id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-lg border-0 rounded-3 hover-scale animate__animated animate__fadeInUp"
                style={{
                  background: "#f7f8fc",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <div className="card-body p-4">
                  <h3 className="card-title h5 mb-3 text-primary">
                    {poll.question}
                  </h3>

                  <div className="list-group">
                    {poll.options.map((option, index) => (
                      <button
                        key={index}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-pill mb-2"
                        style={{
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleOptionClick(poll._id, index)}
                        disabled={
                          isPollExpired || votedPolls[poll._id] !== undefined
                        }
                      >
                        {option.option}
                        {/* Show vote count only if the poll is expired */}
                        {isPollExpired && (
                          <span className="badge bg-primary rounded-pill">
                            {option.votes} votes
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {errorMessage[poll._id] && (
                    <div className="text-danger mt-2">
                      {errorMessage[poll._id]}
                    </div>
                  )}

                  {successMessage[poll._id] && (
                    <div className="text-success mt-2">
                      {successMessage[poll._id]}
                    </div>
                  )}

                  {showConfirmation[poll._id] && (
                    <div className="mt-3">
                      <p>Are you sure you want to vote for this option?</p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleConfirmation(poll._id, false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => handleConfirmation(poll._id, true)}
                          disabled={isVoting}
                        >
                          {isVoting ? "Voting..." : "Confirm Vote"}
                        </button>
                      </div>
                    </div>
                  )}

                  <CountdownTimer
                    expiresAt={poll.expiresAt}
                    isActive={poll.isActive}
                  />
                </div>

                {/* Render PollResultChart and user's voted option only if the poll is expired */}
                {isPollExpired && (
                  <>
                    <PollResultChart poll={poll} />
                    {userVotedOption && (
                      <div className="text-center mt-3 p-3 bg-light border-top">
                        <strong>Your Vote:</strong> {userVotedOption}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollsList;

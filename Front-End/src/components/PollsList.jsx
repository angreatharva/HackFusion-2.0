import React, { useEffect, useState } from "react";
import Navbar from "../components/commonNavBar";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../utils/encryption"; // Ensure this path matches your project structure

const POLLING_INTERVAL = 5000;
const VOTE_API = "http://localhost:8000/api/polls/vote";
const POLLS_API = "http://localhost:8000/api/polls/allPolls";
const POLL_STATS_API = "http://localhost:8000/api/polls";

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
  const [pollStats, setPollStats] = useState({});

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const storedToken = localStorage.getItem(`authToken_${tabId}`);
    const encryptedName = localStorage.getItem(`name_${tabId}`);
    const encryptedRole = localStorage.getItem(`role_${tabId}`);
    const encryptedGender = localStorage.getItem(`gender_${tabId}`);

    if (!storedToken) {
      navigate("/");
    } else {
      // Decrypt stored user data
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

      // Fetch stats for expired polls
      data.forEach((poll) => {
        if (!poll.isActive && !pollStats[poll._id]) {
          fetchPollStats(poll._id);
        }
      });

      // Track voted polls
      const voted = {};
      data.forEach((poll) => {
        if (poll.votedOptionIndex !== undefined) {
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

  const fetchPollStats = async (pollId) => {
    try {
      const response = await fetch(`${POLL_STATS_API}/${pollId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPollStats((prev) => ({ ...prev, [pollId]: data }));
    } catch (error) {
      console.error("Error fetching stats:", error);
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
    setShowConfirmation((prev) => ({
      ...prev,
      [pollId]: false,
    }));

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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit vote");
        }

        setSuccessMessage((prev) => ({
          ...prev,
          [pollId]: "✅ Vote submitted successfully!",
        }));
        setVotedPolls((prev) => ({
          ...prev,
          [pollId]: selectedOptions[pollId],
        }));
      } catch (error) {
        setErrorMessage((prev) => ({
          ...prev,
          [pollId]: error.message || "Error submitting vote. Please try again.",
        }));
      } finally {
        setIsVoting(false);
      }
    }

    setSelectedOptions((prev) => ({
      ...prev,
      [pollId]: null,
    }));
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

  const GenderStats = ({ stats }) => (
    <div className="mt-4">
      <h5 className="mb-3">📊 Voting Statistics</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-header">Male Voters</div>
            <div className="card-body">
              <p className="card-text">
                Voted: {stats.voted.male}
                <br />
                Didn't Vote: {stats.nonVoters.male}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-header">Female Voters</div>
            <div className="card-body">
              <p className="card-text">
                Voted: {stats.voted.female}
                <br />
                Didn't Vote: {stats.nonVoters.female}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-header">Other Voters</div>
            <div className="card-body">
              <p className="card-text">
                Voted: {stats.voted.other}
                <br />
                Didn't Vote: {stats.nonVoters.other}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-muted small">
        Total Eligible Voters: {stats.eligible.total} | Total Votes Cast:{" "}
        {stats.voted.total}
      </div>
    </div>
  );

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
      <Navbar userInfo={userInfo} />

      <div className="row g-4">
        {polls.map((poll) => {
          const isPollExpired = !poll.isActive;

          return (
            <div className="col-md-6" key={poll._id}>
              <div className="card h-100 shadow-sm hover-scale">
                <div className="card-body">
                  <h3 className="card-title h5 mb-3">📊 {poll.question}</h3>

                  {errorMessage[poll._id] && (
                    <div className="alert alert-danger d-flex align-items-center">
                      <span className="me-2">⚠️</span>
                      {errorMessage[poll._id]}
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={() =>
                          setErrorMessage((prev) => ({
                            ...prev,
                            [poll._id]: null,
                          }))
                        }
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  {successMessage[poll._id] && (
                    <div className="alert alert-success d-flex align-items-center">
                      <span className="me-2">🎉</span>
                      {successMessage[poll._id]}
                      <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={() =>
                          setSuccessMessage((prev) => ({
                            ...prev,
                            [poll._id]: null,
                          }))
                        }
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  <CountdownTimer
                    expiresAt={poll.expiresAt}
                    isActive={poll.isActive}
                  />

                  <ul className="list-unstyled mb-3">
                    {poll.options.map((option, index) => (
                      <li
                        key={option._id}
                        className={`mb-3 ${
                          votedPolls[poll._id] !== undefined || isPollExpired
                            ? "pe-none opacity-50"
                            : "cursor-pointer"
                        } ${
                          selectedOptions[poll._id] === index ||
                          votedPolls[poll._id] === index
                            ? "bg-success text-white"
                            : "bg-light"
                        } p-3 rounded position-relative`}
                        onClick={() => handleOptionClick(poll._id, index)}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <span className="me-2">🗳️</span>
                            {option.option}
                            {votedPolls[poll._id] === index && (
                              <span className="badge bg-primary ms-2">
                                ✔ Voted
                              </span>
                            )}
                          </div>
                          {isPollExpired && (
                            <span className="badge bg-secondary">
                              Votes: {option.votes}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {showConfirmation[poll._id] &&
                    selectedOptions[poll._id] !== null && (
                      <div className="alert alert-info">
                        <p className="mb-2">
                          <strong>✨ You selected: </strong>
                          {poll.options[selectedOptions[poll._id]].option}
                        </p>
                        <p className="mb-0">
                          Is this your final choice?
                          <button
                            className="btn btn-success btn-sm ms-2"
                            onClick={() => handleConfirmation(poll._id, true)}
                            disabled={isVoting || isPollExpired}
                          >
                            {isVoting ? "⏳ Submitting..." : "✅ Yes"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => handleConfirmation(poll._id, false)}
                            disabled={isVoting || isPollExpired}
                          >
                            ❌ No
                          </button>
                        </p>
                      </div>
                    )}

                  {pollStats[poll._id] && isPollExpired && (
                    <GenderStats stats={pollStats[poll._id]} />
                  )}

                  <p className="card-text text-muted small">
                    👤 Created by: {poll.createdBy.name} on{" "}
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollsList;

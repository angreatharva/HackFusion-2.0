import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState(30);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setUserInfo({ name, role });
    }
  }, [navigate]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.some((option) => option.trim() === "")) {
      setMessage("⚠️ Please fill out the question and all options.");
      return;
    }

    if (duration <= 0) {
      setMessage("⚠️ Poll duration must be a positive number.");
      return;
    }

    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/polls/create",
        {
          question,
          options: options.map((option) => ({ option })),
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`✅ ${response.data.message}`);
      setQuestion("");
      setOptions(["", ""]);
      setDuration(30);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "❌ Failed to create poll. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Sidebar userInfo={userInfo} />

      <div className="container mt-4">
        <h1 className="text-center mb-4">Create a New Poll ✨</h1>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label htmlFor="question" className="form-label">
              📝 Poll Question:
            </label>
            <input
              type="text"
              id="question"
              className="form-control"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your poll question"
              required
            />
          </div>

          {options.map((option, index) => (
            <div className="mb-3 d-flex align-items-center" key={index}>
              <input
                type="text"
                className="form-control me-2"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeOption(index)}
                >
                  ❌ Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary mb-3"
            onClick={addOption}
          >
            ➕ Add Option
          </button>

          <div className="mb-3">
            <label htmlFor="duration" className="form-label">
              ⏳ Poll Duration (minutes):
            </label>
            <input
              type="number"
              id="duration"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "⏳ Creating..." : "🚀 Create Poll"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;

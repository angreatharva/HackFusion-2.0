// src/components/CreatePoll.jsx
import { useState, useEffect } from "react";
import { createPoll } from "../api/poll";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to create a poll");
      navigate("/");
      return;
    }

    // Validate inputs
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      alert("Please enter at least two options");
      return;
    }

    try {
      const pollData = {
        question: question.trim(),
        options: validOptions.map((opt) => ({ option: opt.trim() })),
      };

      await createPoll(pollData);
      alert("Poll created successfully!");
      navigate("/polls");
    } catch (error) {
      alert(error.message || "Failed to create poll. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="create-poll-container">
      <h2>Create New Poll</h2>
      <form onSubmit={handleCreatePoll} className="poll-form">
        <div className="form-group">
          <label htmlFor="question">Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="remove-option"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="add-option"
          >
            Add Option
          </button>
        </div>

        <button type="submit" className="submit-button">
          Create Poll
        </button>
      </form>

      <style>{`
        .create-poll-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .poll-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .option-input {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .add-option {
          background: #4CAF50;
          color: white;
          margin-top: 10px;
        }

        .remove-option {
          background: #f44336;
          color: white;
        }

        .submit-button {
          background: #2196F3;
          color: white;
          padding: 12px;
          font-size: 18px;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default CreatePoll;

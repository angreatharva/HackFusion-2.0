import { useState } from "react";
import { createPoll } from "../api/poll";

const CreatePoll = () => {
  // Retrieve tabId and token (along with name and role if needed) from localStorage
  const tabId = sessionStorage.getItem("tabId");
  const token = localStorage.getItem(`authToken_${tabId}`);
  const name = localStorage.getItem(`name_${tabId}`);
  const role = localStorage.getItem(`role_${tabId}`);
  console.log("Tokeen:" + token);
  console.log("namee:" + name);
  console.log("rolee:" + role);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleCreatePoll = async () => {
    const pollData = {
      question,
      options: options.map((option) => ({ option })),
    };

    const result = await createPoll(pollData, token);
    if (result) {
      alert("Poll created successfully");
      setQuestion("");
      setOptions(["", ""]);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    } else {
      alert("At least two options are required.");
    }
  };

  return (
    <div className="poll-container">
      <h2>Create Poll</h2>

      <div className="form-group">
        <label htmlFor="question">Question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter poll question"
        />
      </div>

      <div className="form-group">
        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index} className="option-group">
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
            />
            <button
              type="button"
              className="remove-button"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 2}
            >
              &#x2716;
            </button>
          </div>
        ))}
        <button type="button" className="add-button" onClick={handleAddOption}>
          + Add Option
        </button>
      </div>

      <button className="create-button" onClick={handleCreatePoll}>
        Create Poll
      </button>

      <style>{`
        .poll-container {
          width: 80%;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        h2 {
          text-align: center;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .option-group {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .option-group input[type="text"] {
          flex: 1;
          margin-right: 10px;
        }

        .add-button,
        .remove-button,
        .create-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }

        .add-button {
          background: #4CAF50;
          color: white;
          margin-top: 10px;
        }

        .add-button:hover {
          background: #45a049;
        }

        .remove-button {
          background: #f44336;
          color: white;
        }

        .remove-button:hover {
          background: #e53935;
        }

        .create-button {
          width: 100%;
          background: #2196F3;
          color: white;
          margin-top: 20px;
        }

        .create-button:hover {
          background: #1976D2;
        }
      `}</style>
    </div>
  );
};

export default CreatePoll;

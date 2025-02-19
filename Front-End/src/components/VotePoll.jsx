// VotePoll.jsx

import { useState, useEffect } from "react";
import { getPolls, vote } from "../api/poll";

const VotePoll = ({ token }) => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      const result = await getPolls();
      setPolls(result);
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const result = await vote(pollId, optionIndex, token);
      if (result) {
        alert("Vote successful");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert(
        error?.response?.data?.message ||
          "There was an issue with your vote. Please try again."
      );
    }
  };

  return (
    <div>
      <h2>Vote on Polls</h2>
      {polls.map((poll) => (
        <div key={poll._id}>
          <h3>{poll.question}</h3>
          {poll.options.map((option, index) => (
            <button key={index} onClick={() => handleVote(poll._id, index)}>
              {option.option}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VotePoll;

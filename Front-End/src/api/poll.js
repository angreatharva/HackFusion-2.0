// api/poll.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Get base URL from environment variable

// Fetch all polls
export const getPolls = async () => {
  try {
    const response = await axios.get(`${API_URL}/polls/allPolls`);
    return response.data;
  } catch (error) {
    console.error("Error fetching polls:", error);
    throw new Error("Failed to fetch polls.");
  }
};

// Voting function
export const vote = async (pollId, optionIndex, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/polls/vote`,
      { pollId, optionIndex },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting:", error);
    throw new Error(error?.response?.data?.message || "Failed to vote.");
  }
};

// Create poll function
export const createPoll = async (pollData, token) => {
  try {
    const response = await axios.post(`${API_URL}/polls/create`, pollData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw new Error("Failed to create poll.");
  }
};

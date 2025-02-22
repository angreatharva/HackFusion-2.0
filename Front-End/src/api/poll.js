// src/api/poll.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get the current token
const getToken = () => {
  const tabId = sessionStorage.getItem("tabId");
  return localStorage.getItem(`authToken_${tabId}`);
};

// Fetch all polls
export const getPolls = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/polls/allPolls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching polls:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthorized access. Please login again.");
    }
    throw new Error("Failed to fetch polls.");
  }
};

// Voting function
export const vote = async (pollId, optionIndex) => {
  try {
    const token = getToken();
    const response = await axios.post(
      `${API_URL}/polls/vote`,
      { pollId, optionIndex },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthorized access. Please login again.");
    }
    throw new Error(error?.response?.data?.message || "Failed to vote.");
  }
};

// Create poll function
export const createPoll = async (pollData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/polls/create`, pollData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating poll:", error);
    if (error.response?.status === 401) {
      throw new Error("Unauthorized access. Please login again.");
    }
    throw new Error("Failed to create poll.");
  }
};

// Add axios interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const tabId = sessionStorage.getItem("tabId");
      localStorage.removeItem(`authToken_${tabId}`);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

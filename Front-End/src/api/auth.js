import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_AUTH;

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error(
      "Forgot password error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to send reset email."
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, {
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Reset password error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to reset password."
    );
  }
};

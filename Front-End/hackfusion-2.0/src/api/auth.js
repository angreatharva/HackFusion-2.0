import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_AUTH;

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};

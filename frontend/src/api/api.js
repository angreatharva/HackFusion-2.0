import axios from "axios";

// ✅ Backend URL from `.env` or Default to Localhost
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// ✅ Axios Instance for Reusability & Auto Headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Supports authentication & cookies
});

// ✅ Generalized API Request Handler with Improved Error Handling
const handleRequest = async (method, url, data = null) => {
  try {
    const response = await axiosInstance({ method, url, data });
    return response.data;
  } catch (error) {
    console.error(
      `❌ [API Error] ${method.toUpperCase()} ${url}:`,
      error.response?.status || "No Status",
      error.response?.data || error.message
    );

    if (error.response?.status === 400) {
      console.warn("⚠️ Bad Request: Check request payload & API format.");
    } else if (error.response?.status === 404) {
      console.warn("⚠️ Resource Not Found: Check the endpoint or ID.");
    } else if (error.response?.status === 500) {
      console.warn("⚠️ Server Error: The backend may be down.");
    }

    throw error;
  }
};

// ✅ Fetch all applications
export const fetchApplications = () => handleRequest("get", "/api/applications");

// ✅ Create a new application
export const createApplication = (applicationData) =>
  handleRequest("post", "/api/applications", applicationData);

// ✅ Delete an application
export const deleteApplication = (id) => handleRequest("delete", `/api/applications/${id}`);

// ✅ Update an application
export const updateApplication = (id, updatedData) =>
  handleRequest("put", `/api/applications/${id}`, updatedData);

// ✅ Approve, Reject, or Update Status (Fixed)
export const updateApplicationStatus = async (id, status) => {
  try {
    console.log("🔹 Sending status update:", { id, status });

    const response = await handleRequest("patch", `/api/applications/${id}/status`, { status });

    console.log("✅ API Response:", response);
    return response;
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    throw error;
  }
};

// ✅ Alias to Fix Import Issue
export const approveApplication = updateApplicationStatus;

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// ✅ Fetch applications (Sorted by priority)
export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/applications`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching applications:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Approve an application
export const approveApplication = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/applications/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("❌ Error approving application:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Reject an application
export const rejectApplication = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/applications/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error("❌ Error rejecting application:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Manually escalate priority (Admin Feature)
export const escalatePriority = async () => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/applications/escalate`);
    return response.data;
  } catch (error) {
    console.error("❌ Error escalating priority:", error.response?.data || error.message);
    throw error;
  }
};

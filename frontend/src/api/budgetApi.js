import axios from "axios";

// ✅ Backend API Base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// ✅ Fetch all budget entries (with sorting, filtering, and searching)
export const fetchBudgets = async ({ sortBy, type, searchQuery } = {}) => {
  try {
    const params = new URLSearchParams();
    if (sortBy) params.append("sortBy", sortBy);
    if (type) params.append("type", type);
    if (searchQuery) params.append("search", searchQuery);

    const response = await axios.get(`${API_BASE_URL}/api/budget`, { params });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching budgets:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch budget data");
  }
};

// ✅ Add new budget entry (For Admin)
export const addBudgetEntry = async (budgetData) => {
  try {
    // Validate required fields before sending request
    if (!budgetData.source || !budgetData.amount || !budgetData.type) {
      throw new Error("All fields (source, amount, type) are required.");
    }

    const response = await axios.post(`${API_BASE_URL}/api/budget`, budgetData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Budget Entry Added:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding budget entry:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add budget entry");
  }
};

// ✅ Upload expense proof (File upload for a specific budget)
export const uploadExpenseProof = async (formData, budgetId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/upload-expense-proof/${budgetId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensures correct file upload format
      },
    });

    console.log("✅ Expense proof uploaded:", response.data);
    return response.data; // Return response data after successful upload
  } catch (error) {
    console.error("❌ Error uploading expense proof:", error.response?.data || error.message);
    // Improved error handling: return a more descriptive error message
    throw new Error(error.response?.data?.message || "Failed to upload expense proof");
  }
};

import { useState } from "react";
import axios from "axios";

const ApplicationForm = ({ fetchApplications }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Event",
    description: "",
  });

  // Hardcoded Token (For Now)
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdiNDMxYTBmNGRkYzVjOGU5MTQwOGI4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTczOTk0ODgwMSwiZXhwIjoxNzQwMDM1MjAxfQ.7vowjcvS9TgpxbIRvvaM5CxbxyVrJVj1ALUZ0f6CYcU";

  // Uncomment below to use token from localStorage
  /*
  const tabId = sessionStorage.getItem("tabId") || Date.now();
  sessionStorage.setItem("tabId", tabId);

  const token = localStorage.getItem(`authToken_${tabId}`) || "";
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/applications", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchApplications();
      setFormData({ name: "", type: "Event", description: "" });
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Submit Application
        </h2>

        {/* Name Input */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Application Type */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">
            Application Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            <option value="Event">Event</option>
            <option value="Budget">Budget</option>
            <option value="Sponsorship">Sponsorship</option>
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-600 font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Enter a brief description..."
            value={formData.description}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32 transition-all"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;

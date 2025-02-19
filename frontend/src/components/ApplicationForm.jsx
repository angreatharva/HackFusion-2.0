import { useState } from "react";
import { createApplication } from "../api/api"; // ✅ Corrected Import Path

function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createApplication(formData);
      alert("Application created successfully!");
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded">
      <input
        type="text"
        name="name"
        placeholder="Application Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      <button type="submit" className="bg-blue-500 p-2 rounded">
        Create Application
      </button>
    </form>
  );
}

export default ApplicationForm;

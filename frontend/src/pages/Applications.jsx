import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // ✅ Import WebSocket client
import {
  fetchApplications,
  deleteApplication,
  updateApplication,
  createApplication,
  approveApplication,
} from "../api/api";

const socket = io("http://localhost:8000"); // ✅ Connect to WebSocket server

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newApplication, setNewApplication] = useState({ title: "", description: "" });

  // ✅ Fetch applications on mount & listen for real-time updates
  useEffect(() => {
    loadApplications();

    // ✅ Listen for WebSocket updates
    socket.on("applicationsUpdated", () => {
      console.log("🔄 Real-time update received!");
      loadApplications(); // ✅ Reload applications on update
    });

    return () => {
      socket.off("applicationsUpdated"); // ✅ Cleanup on unmount
    };
  }, []);

  // ✅ Load applications from the backend
  const loadApplications = async () => {
    try {
      setError(null);
      const data = await fetchApplications();
      if (Array.isArray(data)) {
        // ✅ Sort applications by priority (Highest First)
        const sortedData = data.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        setApplications(sortedData);
      } else {
        setApplications([]); // Ensure valid state
        console.warn("Unexpected response format:", data);
      }
    } catch (error) {
      setError("Failed to load applications. Please try again later.");
      console.error("❌ Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create a new application
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newApplication.title || !newApplication.description) {
      alert("Title and description are required!");
      return;
    }

    try {
      await createApplication(newApplication); // Make sure it sends JSON correctly
      setNewApplication({ title: "", description: "" }); // ✅ Clear form
    } catch (error) {
      console.error("❌ Failed to create application:", error);
    }
  };

  // ✅ Delete an application
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      // ✅ Call the delete function here with the correct ID
      const response = await deleteApplication(id);
      if (response && response.data) {
        console.log("✅ Application deleted:", response.data);
        loadApplications(); // ✅ Reload applications after delete
      }
    } catch (error) {
      console.error("❌ Error deleting application:", error);
    }
  };

  // ✅ Approve or Reject an application
  const handleApproval = async (id, isApproved) => {
    try {
      const payload = { status: isApproved };
      await approveApplication(id, payload); // Make sure it sends JSON correctly
    } catch (error) {
      console.error("❌ Error updating approval status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-400">Applications</h1>

      {/* ✅ Application Form */}
      <form onSubmit={handleCreate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={newApplication.title}
          onChange={(e) => setNewApplication({ ...newApplication, title: e.target.value })}
          className="p-2 border rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={newApplication.description}
          onChange={(e) =>
            setNewApplication({ ...newApplication, description: e.target.value })
          }
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Application
        </button>
      </form>

      {/* ✅ Display Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Display Applications */}
      {loading ? (
        <p>Loading...</p>
      ) : applications.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="p-4 border rounded">
              <h3 className="font-bold">{app.title}</h3>
              <p>{app.description}</p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    app.status ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {app.status ? "Approved" : "Rejected"}
                </span>
              </p>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleApproval(app._id, true)}
                  className={`p-2 rounded ${
                    app.status ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
                  }`}
                  disabled={app.status}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(app._id, false)}
                  className={`p-2 rounded ${
                    !app.status ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 text-white"
                  }`}
                  disabled={!app.status}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No applications found.</p>
      )}
    </div>
  );
}

export default Applications;

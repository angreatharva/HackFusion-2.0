import { useEffect, useState } from "react";
import axios from "axios";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);

  const tabId = sessionStorage.getItem("tabId") || Date.now();
  sessionStorage.setItem("tabId", tabId);
  const token = localStorage.getItem(`authToken_${tabId}`);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications(); // Initial call

    const intervalId = setInterval(() => {
      fetchApplications();
    }, 2000); // Fetch applications every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8000/api/applications/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchApplications(); // Refresh list after updating status
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 md:px-10">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Application List
      </h2>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-xl rounded-lg p-6 border border-gray-200 transition-transform hover:scale-[1.02] hover:shadow-2xl"
            >
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {app.name} - <span className="text-blue-600">{app.type}</span>
              </h3>
              <p className="text-gray-600 mb-3">{app.description}</p>

              <p className="font-medium">
                Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold 
                  ${
                    app.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : app.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>

              {app.status === "Pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleApproval(app._id, "Approved")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(app._id, "Rejected")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No applications found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const Home = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
    } else {
      setUserInfo({ name, role });
    }
  }, [navigate]);

  const handleLogout = () => {
    const tabId = sessionStorage.getItem("tabId");

    localStorage.removeItem(`authToken_${tabId}`);
    localStorage.removeItem(`name_${tabId}`);
    localStorage.removeItem(`role_${tabId}`);
    sessionStorage.removeItem("tabId");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar userInfo={userInfo} />

      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome, {userInfo.name}!</h2>
          <p className="text-lg text-gray-600 mt-2">Your role: <span className="font-medium text-blue-600">{userInfo.role}</span></p>

          <button 
            onClick={handleLogout}
            className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
  
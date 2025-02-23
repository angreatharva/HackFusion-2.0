import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import anime from "animejs";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/commonNavBar";
import Sidebar from "../components/sideBar";

const BudgetPage = () => {
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the unique tab identifier
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const name = localStorage.getItem(`name_${tabId}`);
    const role = localStorage.getItem(`role_${tabId}`);

    // If token does not exist, navigate to login page
    if (!token) {
      navigate("/");
    } else {
      // Set the user info (name, role) into the state
      setUserInfo({ name, role });
    }
  }, [navigate]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [applications, setApplications] = useState([]);
  const chartRefs = useRef({});
  const chartInstances = useRef({});

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const userRole = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
      return;
    }

    setRole(userRole);

    const fetchData = async () => {
      try {
        const budgetsResponse = await axios.get(
          "http://localhost:8000/api/budgets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const applicationsResponse = await axios.get(
          "http://localhost:8000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedBudgets = budgetsResponse.data;
        const updatedApplications = applicationsResponse.data;

        setBudgets(updatedBudgets);

        // Filter out applications that already have a budget
        const filteredApplications = updatedApplications.filter(
          (app) =>
            !updatedBudgets.some((budget) => budget.applicationId === app._id)
        );

        setApplications(filteredApplications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const renderChart = (budget) => {
    const canvas = chartRefs.current[budget._id];
    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (chartInstances.current[budget._id]) {
        chartInstances.current[budget._id].destroy();
      }

      chartInstances.current[budget._id] = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Spent", "Remaining"],
          datasets: [
            {
              data: [budget.spentAmount, budget.remainingAmount],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  };

  useEffect(() => {
    budgets.forEach((budget) => renderChart(budget));
  }, [budgets]);

  const handleCreateBudget = async (applicationId) => {
    try {
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);
      const application = applications.find((app) => app._id === applicationId);

      if (!application) return;

      await axios.post(
        "http://localhost:8000/api/budgets",
        {
          applicationId,
          name: application.eventName,
          category:
            application.type === "Event Organization"
              ? "Event"
              : application.type === "Budget Request"
              ? "Department"
              : "Sponsorship",
          allocatedAmount: application.requestedBudget,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated budgets after creating a new budget
      const updatedBudgets = await axios.get(
        "http://localhost:8000/api/budgets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBudgets(updatedBudgets.data);

      // Ensure application is removed permanently
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app._id !== applicationId)
      );
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Failed to create budget. Please try again.");
    }
  };

  const animateCards = () => {
    anime({
      targets: ".budget-card",
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutExpo",
    });
  };

  useEffect(() => {
    if (!loading) animateCards();
  }, [loading]);

  return (
    <div className="container py-5">
      <Sidebar userInfo={userInfo} />

      <h1 className="text-center mb-5 display-4 fw-bold text-primary">
        📊 Budget Management
      </h1>

      {role === "admin" && (
        <div className="d-flex justify-content-end mb-4">
          <Link to="/applicationList" className="btn btn-primary">
            View Applications
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {budgets.map((budget) => (
            <div key={budget._id} className="col-md-6 col-lg-4">
              <div className="budget-card card shadow-sm border-0 rounded-4">
                <div className="card-body">
                  <h5 className="card-title text-dark">{budget.name}</h5>
                  <p className="card-subtitle text-muted mb-3">
                    📂 {budget.category}
                  </p>

                  <div className="chart-container" style={{ height: "250px" }}>
                    <canvas
                      ref={(el) => (chartRefs.current[budget._id] = el)}
                    ></canvas>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <p className="text-muted mb-1">Allocated</p>
                      <h6 className="fw-bold">₹{budget.allocatedAmount}</h6>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Spent</p>
                      <h6 className="fw-bold text-danger">
                        ₹{budget.spentAmount}
                      </h6>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Remaining</p>
                      <h6 className="fw-bold text-success">
                        ₹{budget.remainingAmount}
                      </h6>
                    </div>
                  </div>

                  <Link
                    to={`/expense/${budget._id}`}
                    className="btn btn-outline-primary w-100 mt-3 rounded-3"
                  >
                    Add Expense
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {role === "admin" && applications.length > 0 && (
        <div className="mt-5 p-4 bg-light rounded-3 shadow">
          <h2 className="h4 mb-3">Approved Applications</h2>
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-3 mb-2 bg-white rounded-3 d-flex justify-content-between align-items-center shadow-sm"
            >
              <div>
                <h5>{app.eventName}</h5>
                <p className="text-muted mb-0">
                  Requested: ₹{app.requestedBudget} | Type: {app.type}
                </p>
              </div>
              <button
                onClick={() => handleCreateBudget(app._id)}
                className="btn btn-success rounded-3"
              >
                Create Budget
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;

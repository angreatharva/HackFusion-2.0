import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const userRole = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
      return;
    }

    setRole(userRole);

    // Fetch both budgets and applications
    const fetchData = async () => {
      try {
        const [budgetsResponse, applicationsResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/budgets", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:8000/api/applications", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setBudgets(budgetsResponse.data);
        setApplications(applicationsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleCreateBudget = async (applicationId) => {
    try {
      const tabId = sessionStorage.getItem("tabId");
      const token = localStorage.getItem(`authToken_${tabId}`);

      const application = applications.find(app => app._id === applicationId);
      
      await axios.post("http://localhost:8000/api/budgets", {
        applicationId,
        name: application.eventName,
        category: application.type === "Event Organization" ? "Event" : 
                 application.type === "Budget Request" ? "Department" : "Sponsorship",
        allocatedAmount: application.requestedBudget
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh budgets after creation
      const response = await axios.get("http://localhost:8000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Failed to create budget. Please try again.");
    }
  };

  const calculateProgress = (spent, total) => {
    return Math.min((spent / total) * 100, 100);
  };

  return (
    <div className="budget-container">
      <style>
        {`
          .budget-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .budget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .budget-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
          }

          .budget-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            transition: transform 0.3s ease;
          }

          .budget-card:hover {
            transform: translateY(-4px);
          }

          .approved-applications {
            margin-top: 30px;
            background: #f3f4f6;
            padding: 20px;
            border-radius: 12px;
          }

          .application-card {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .create-budget-btn {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .create-budget-btn:hover {
            background: #059669;
          }

          .expense-link {
            background: #3b82f6;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            transition: background-color 0.3s;
          }

          .expense-link:hover {
            background: #2563eb;
          }
        `}
      </style>

      <div className="budget-header">
        <h1 className="text-2xl font-bold">📊 Budget Management</h1>
        {role === "admin" && (
          <Link to="/applicationList" className="expense-link">
            View Applications
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          <div className="budget-grid">
            {budgets.map((budget) => (
              <div key={budget._id} className="budget-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{budget.name}</h3>
                    <p className="text-gray-600">📂 {budget.category}</p>
                  </div>
                  <Link 
                    to={`/expense/${budget._id}`}
                    className="expense-link"
                  >
                    Add Expense
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Utilization</span>
                    <span>{calculateProgress(budget.spentAmount, budget.allocatedAmount).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{
                        width: `${calculateProgress(budget.spentAmount, budget.allocatedAmount)}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Allocated</p>
                    <p className="font-bold">₹{budget.allocatedAmount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Spent</p>
                    <p className="font-bold">₹{budget.spentAmount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">Remaining</p>
                    <p className="font-bold">₹{budget.remainingAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {role === "admin" && (
            <div className="approved-applications">
              <h2 className="text-xl font-bold mb-4">Approved Applications Pending Budget Creation</h2>
              {applications
                .filter(app => 
                  app.status === "Approved" && 
                  !budgets.some(budget => budget.linkedApplication === app._id)
                )
                .map(app => (
                  <div key={app._id} className="application-card">
                    <div>
                      <h3 className="font-bold">{app.eventName}</h3>
                      <p className="text-gray-600">
                        Requested: ₹{app.requestedBudget} | Type: {app.type}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateBudget(app._id)}
                      className="create-budget-btn"
                    >
                      Create Budget
                    </button>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetPage;
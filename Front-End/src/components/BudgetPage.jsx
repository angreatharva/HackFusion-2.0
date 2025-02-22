import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
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

    // Fetch budgets with proper auth header
    axios
      .get("http://localhost:8000/api/budgets", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setBudgets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
        setLoading(false);
      });
  }, [navigate]);

  const calculateProgress = (spent, total) => {
    const percentage = (spent / total) * 100;
    return Math.min(percentage, 100);
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

          .budget-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
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
            transition: transform 0.3s, box-shadow 0.3s;
          }

          .budget-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          }

          .budget-title-container {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 10px;
          }

          .budget-name {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
          }

          .budget-category {
            font-size: 14px;
            color: #6b7280;
          }

          .expense-button {
            background-color: #10b981;
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s;
            text-decoration: none;
          }

          .expense-button:hover {
            background-color: #059669;
          }

          .progress-bar-container {
            background: #e5e7eb;
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
          }

          .progress-bar {
            background: #3b82f6;
            height: 8px;
            transition: width 0.3s;
          }

          .budget-stats {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
          }

          .stat-box {
            text-align: center;
          }

          .stat-label {
            font-size: 12px;
            color: #6b7280;
          }

          .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
          }
        `}
      </style>

      <div className="budget-header">
        <h1 className="budget-title">📊 Budget Overview</h1>
        {role === "admin" && (
          <Link to="/applicationList" className="expense-button">
            Manage Applications
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading budgets...</div>
      ) : (
        <div className="budget-grid">
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <div key={budget._id} className="budget-card">
                <div className="budget-title-container">
                  <div>
                    <h3 className="budget-name">{budget.name}</h3>
                    <p className="budget-category">📂 {budget.category}</p>
                  </div>
                  <Link to={`/expense/${budget._id}`} className="expense-button">
                    Submit Expense
                  </Link>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span>{calculateProgress(budget.spentAmount, budget.allocatedAmount).toFixed(1)}%</span>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${calculateProgress(budget.spentAmount, budget.allocatedAmount)}%` }}
                    ></div>
                  </div>

                  <div className="budget-stats">
                    <div className="stat-box">
                      <p className="stat-label">💰 Allocated</p>
                      <p className="stat-value">₹{budget.allocatedAmount}</p>
                    </div>
                    <div className="stat-box">
                      <p className="stat-label">📉 Spent</p>
                      <p className="stat-value">₹{budget.spentAmount}</p>
                    </div>
                    <div className="stat-box">
                      <p className="stat-label">📌 Remaining</p>
                      <p className="stat-value">₹{budget.remainingAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No budgets available.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;

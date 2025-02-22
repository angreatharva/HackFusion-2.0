import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import anime from "animejs";

const ExpensePage = () => {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    proof: "",
  });
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
        const [budgetRes, expensesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/budgets/${budgetId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8000/api/expenses?budgetId=${budgetId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setBudget(budgetRes.data);
        setExpenses(expensesRes.data.expenses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      }
    };

    fetchData();
  }, [budgetId, navigate]);

  useEffect(() => {
    if (budget && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Spent", "Remaining"],
          datasets: [
            {
              data: [
                budget.allocatedAmount - budget.remainingAmount,
                budget.remainingAmount,
              ],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }
  }, [budget]);

  useEffect(() => {
    anime({
      targets: ".expense-card",
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeOutExpo",
    });
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, proof: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const userName = localStorage.getItem(`name_${tabId}`);

    try {
      if (Number(formData.amount) > budget.remainingAmount) {
        alert("Amount exceeds remaining budget!");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/expenses",
        { ...formData, budgetId },
        { headers: { Authorization: `Bearer ${token}`, "user-name": userName } }
      );

      alert("Expense submitted successfully!");
      setFormData({ amount: "", description: "", proof: "" });

      const response = await axios.get(
        `http://localhost:8000/api/expenses?budgetId=${budgetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Failed to submit expense. Please try again.");
    }
  };

  return (
    <div className="expense-page">
      <style>
        {`
          .expense-page {
            padding: 40px;
            background-color: #f4f6f9;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .card {
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 700px;
            margin-bottom: 20px;
          }

          .chart-container {
            max-width: 400px;
            margin: auto;
            padding: 20px;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .input, .file-input {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
          }

          .submit-btn {
            padding: 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
          }

          .submit-btn:hover {
            background-color: #0056b3;
          }

          .expense-list {
            margin-top: 20px;
            width: 100%;
          }

          .expense-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            opacity: 0;
          }

          .expense-card strong {
            color: #007bff;
          }
        `}
      </style>

      {budget && (
        <div className="card">
          <h1>💸 {budget.name} - Expense Tracking</h1>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
          <p>📊 Total Budget: ₹{budget.allocatedAmount}</p>
          <p>✅ Remaining Budget: ₹{budget.remainingAmount}</p>
        </div>
      )}

      <div className="card">
        <h2>📥 Submit New Expense</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount (₹)"
            className="input"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="input"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            required
          />
          <button type="submit" className="submit-btn">
            Submit Expense
          </button>
        </form>
      </div>

      <div className="expense-list">
        {expenses.map((expense) => (
          <div key={expense._id} className="expense-card">
            <div>
              <strong>₹{expense.amount}</strong>
              <p>{expense.description}</p>
            </div>
            <span>{expense.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpensePage;

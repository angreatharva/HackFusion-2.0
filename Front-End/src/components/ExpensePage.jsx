import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    const tabId = sessionStorage.getItem("tabId");
    const token = localStorage.getItem(`authToken_${tabId}`);
    const userRole = localStorage.getItem(`role_${tabId}`);

    if (!token) {
      navigate("/");
      return;
    }

    setRole(userRole);

    axios
      .get(`http://localhost:8000/api/budgets/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBudget(response.data);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
        navigate("/");
      });

    axios
      .get(`http://localhost:8000/api/expenses?budgetId=${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setExpenses(response.data.expenses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      });
  }, [budgetId, navigate]);

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
        {
          ...formData,
          budgetId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "user-name": userName,
          },
        }
      );

      alert("Expense submitted successfully!");
      setFormData({ amount: "", description: "", proof: "" });

      const response = await axios.get(`http://localhost:8000/api/expenses?budgetId=${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("Failed to submit expense. Please try again.");
    }
  };

  return (
    <div className="expense-container">
      <style>
        {`
          .expense-container {
            padding: 20px;
            min-height: 100vh;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .budget-info-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            text-align: center;
            margin-bottom: 20px;
          }

          .title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }

          .budget-details {
            display: flex;
            justify-content: space-around;
            font-size: 0.9rem;
            font-weight: 500;
            color: #555;
          }

          .form-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            text-align: center;
          }

          .sub-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
          }

          .expense-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .input-field {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9rem;
          }

          .file-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9rem;
            cursor: pointer;
          }

          .submit-btn {
            background-color: #007bff;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: 0.3s;
          }

          .submit-btn:hover {
            background-color: #0056b3;
          }

          .expense-list {
            margin-top: 20px;
            width: 100%;
            max-width: 600px;
          }

          .expense-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
          }

          .expense-item strong {
            color: #007bff;
          }
        `}
      </style>

      {budget && (
        <div className="budget-info-box">
          <h1 className="title">💰 {budget.name} - Expense Management</h1>
          <div className="budget-details">
            <span>📌 Category: {budget.category}</span>
            <span>💵 Remaining: ₹{budget.remainingAmount}</span>
            <span>🏦 Total Budget: ₹{budget.allocatedAmount}</span>
          </div>
        </div>
      )}

      <div className="form-box">
        <h2 className="sub-title">📤 Submit New Expense</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="💰 Amount (₹)"
            className="input-field"
            max={budget?.remainingAmount}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="📝 Description"
            className="input-field"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            required
          />
          <button type="submit" className="submit-btn">✅ Submit Expense</button>
        </form>
      </div>

    
    </div>
  );
};

export default ExpensePage;

// ExpensePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [selectedBudget, setSelectedBudget] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [proofImage, setProofImage] = useState(null);

  // Hardcoded token
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdiNDMxYTBmNGRkYzVjOGU5MTQwOGI4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTczOTk0ODgwMSwiZXhwIjoxNzQwMDM1MjAxfQ.7vowjcvS9TgpxbIRvvaM5CxbxyVrJVj1ALUZ0f6CYcU";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [budgetsResponse, expensesResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/budget", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/expenses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Ensuring budget data is correct
        console.log("Fetched budgets:", budgetsResponse.data);

        // Filter only valid budgets
        const validBudgets = budgetsResponse.data.filter(
          (budget) => budget.remainingAmount !== undefined
        );

        setBudgets(validBudgets);
        setExpenses(expensesResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle image upload (convert to base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 500;
          canvas.height = (img.height / img.width) * 500;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setProofImage(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBudget || !title || !amount || !description) {
      console.error("Missing required fields:", {
        selectedBudget,
        title,
        amount,
        description,
      });
      return alert("All fields are required!");
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error("Invalid amount:", amount);
      return alert("Expense amount must be a valid number!");
    }

    // Find the selected budget
    const budget = budgets.find((b) => b._id === selectedBudget);
    if (!budget) {
      console.error("Budget not found:", selectedBudget);
      return alert("Selected budget is invalid.");
    }

    if (numericAmount > budget.remainingAmount) {
      console.error(
        `Expense amount exceeds remaining budget: Requested ₹${numericAmount}, Available ₹${budget.remainingAmount}`
      );
      return alert(
        `Insufficient budget! Remaining amount: ₹${budget.remainingAmount}`
      );
    }

    try {
      const expenseData = {
        budgetId: selectedBudget,
        title,
        amount: numericAmount,
        description,
        proofImage,
      };

      await axios.post("http://localhost:8000/api/expenses", expenseData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Reset form and refresh expenses
      setSelectedBudget("");
      setTitle("");
      setAmount("");
      setDescription("");
      setProofImage(null);

      // Refresh expenses list
      const response = await axios.get("http://localhost:8000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data);
    } catch (err) {
      setError("Failed to add expense");
      console.error("Expense Submission Error:", err);
    }
  };

  return (
    <div className="text-gray-800 text-lg">
      <h2 className="text-2xl font-bold mb-4">Expense Tracking</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Expense Form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add New Expense</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Budget</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Budget</option>
              {budgets.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.title} (Remaining: ₹{budget.remainingAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Proof Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {proofImage && (
              <img
                src={proofImage}
                alt="Preview"
                className="mt-2 max-w-xs rounded"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpensePage;

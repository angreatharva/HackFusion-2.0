import { useEffect, useState } from "react";
import axios from "axios";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded token for now
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdiNDMxYTBmNGRkYzVjOGU5MTQwOGI4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTczOTk0ODgwMSwiZXhwIjoxNzQwMDM1MjAxfQ.7vowjcvS9TgpxbIRvvaM5CxbxyVrJVj1ALUZ0f6CYcU";

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/budget", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBudgets(response.data);
      } catch (err) {
        setError("Failed to fetch budgets");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Calculate total sponsorships and expenses
  const totalSponsorship = budgets
    .filter((item) => item.type === "sponsorship")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = budgets
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const remainingBalance = totalSponsorship - totalExpenses;

  return (
    <div className="text-gray-800 text-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Budget Tracking</h2>

      {loading && <p>Loading budgets...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow-md rounded-lg p-4">
        {budgets.length > 0 ? (
          <>
            {/* Summary Section */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Summary</h3>
              <p className="text-green-600 font-bold">Total Sponsorship: ₹{totalSponsorship}</p>
              <p className="text-red-600 font-bold">Total Expenses: ₹{totalExpenses}</p>
              <p className="text-blue-600 font-bold">Remaining Balance: ₹{remainingBalance}</p>
            </div>

            {/* Detailed Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Source</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget._id} className="text-center">
                    <td className="border p-2">{budget.source}</td>
                    <td
                      className={`border p-2 ${
                        budget.type === "sponsorship" ? "text-green-600" : "text-red-600"
                      } font-semibold`}
                    >
                      {budget.type}
                    </td>
                    <td className="border p-2">₹{budget.amount}</td>
                    <td className="border p-2">
                      {new Date(budget.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No budget data available.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;

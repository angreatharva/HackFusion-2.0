import { useState, useEffect } from "react";
import { fetchBudgets, addBudgetEntry, uploadExpenseProof } from "../api/budgetApi"; // Make sure to add the uploadExpenseProof API call

const BudgetTracker = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newEntry, setNewEntry] = useState({ source: "", amount: "", type: "" });
  const [expenseProof, setExpenseProof] = useState(null);  // State for expense proof file

  // ✅ Fetch Budget Data
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const data = await fetchBudgets({ sortBy, type: filterType, searchQuery });
        setBudgetData(data);
      } catch (err) {
        setError("Failed to load budget data.");
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [sortBy, filterType, searchQuery]);

  // ✅ Handle New Entry Submission
  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      await addBudgetEntry(newEntry);
      setNewEntry({ source: "", amount: "", type: "" });
      setBudgetData(await fetchBudgets()); // Refresh Data
    } catch (error) {
      setError("Failed to add new entry.");
    }
  };

  // ✅ Handle Expense Proof Upload
  const handleExpenseProofUpload = async (e, budgetId) => {
    const formData = new FormData();
    formData.append("proof", expenseProof);

    try {
      await uploadExpenseProof(formData, budgetId); // Assuming this API will save the proof against the budget entry
      alert("Proof uploaded successfully!");
      setExpenseProof(null); // Clear the file input after successful upload
    } catch (error) {
      alert("Failed to upload expense proof.");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-400">📊 Budget & Sponsorship Tracker</h2>

      {/* ✅ Sorting, Filtering & Search */}
      <div className="flex space-x-4 my-4">
        <select className="p-2 bg-gray-700" onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="amount">Amount</option>
          <option value="date">Date</option>
        </select>
        <select className="p-2 bg-gray-700" onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Filter By Type</option>
          <option value="sponsorship">Sponsorship</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="text"
          placeholder="Search by Source"
          className="p-2 bg-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ✅ Budget Table */}
      {loading && <p>Loading budget data...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <table className="w-full mt-4 border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-500 px-4 py-2">Source</th>
            <th className="border border-gray-500 px-4 py-2">Amount (₹)</th>
            <th className="border border-gray-500 px-4 py-2">Type</th>
            <th className="border border-gray-500 px-4 py-2">Date</th>
            <th className="border border-gray-500 px-4 py-2">Expense Proof</th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((entry) => (
            <tr key={entry._id} className="hover:bg-gray-700">
              <td className="border border-gray-500 px-4 py-2">{entry.source}</td>
              <td className="border border-gray-500 px-4 py-2">₹{entry.amount.toLocaleString()}</td>
              <td className="border border-gray-500 px-4 py-2">{entry.type}</td>
              <td className="border border-gray-500 px-4 py-2">{new Date(entry.date).toLocaleDateString()}</td>
              <td className="border border-gray-500 px-4 py-2">
                {entry.type === "expense" && (
                  <div>
                    <input
                      type="file"
                      onChange={(e) => setExpenseProof(e.target.files[0])}
                      className="p-2 bg-gray-700"
                    />
                    <button
                      onClick={(e) => handleExpenseProofUpload(e, entry._id)}
                      className="mt-2 p-2 bg-green-500 text-white"
                    >
                      Upload Proof
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ New Budget Entry Form (For Admins) */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-xl font-bold text-green-400">➕ Add New Budget Entry</h3>
        <form onSubmit={handleAddEntry} className="space-y-3">
          <input
            type="text"
            placeholder="Source"
            className="p-2 w-full bg-gray-600"
            value={newEntry.source}
            onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            className="p-2 w-full bg-gray-600"
            value={newEntry.amount}
            onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
            required
          />
          <select
            className="p-2 w-full bg-gray-600"
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
            required
          >
            <option value="">Select Type</option>
            <option value="sponsorship">Sponsorship</option>
            <option value="expense">Expense</option>
          </select>
          <button type="submit" className="p-2 bg-green-500 w-full text-white font-bold">
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetTracker;

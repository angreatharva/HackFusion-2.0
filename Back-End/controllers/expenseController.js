const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const createExpense = async (req, res) => {
  try {
    const { budgetId, title, amount, description, proofImage } = req.body;

    // Validate required fields
    if (!budgetId || !title || !amount || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid expense amount" });
    }

    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Ensure remainingAmount is properly initialized
    if (budget.remainingAmount == null || isNaN(budget.remainingAmount)) {
      console.error("Invalid remainingAmount detected in Budget:", budget);
      return res.status(500).json({ error: "Invalid remainingAmount in Budget" });
    }
    

    if (numericAmount > budget.remainingAmount) {
      return res.status(400).json({ error: "Expense amount exceeds remaining budget" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const expense = new Expense({
      budgetId,
      title,
      amount: numericAmount,
      description,
      proofImage, // Consider using Cloudinary instead of storing base64
      submittedBy: req.user.id,
    });

    await expense.save();

    // Update budget remaining amount safely
    budget.remainingAmount = Math.max(0, budget.remainingAmount - numericAmount);
    await budget.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error("Expense Creation Error:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("budgetId", "title remainingAmount");
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
};

const approveExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    expense.approved = true;
    await expense.save();

    res.status(200).json({ message: "Expense approved successfully" });
  } catch (error) {
    console.error("Approve Expense Error:", error); // Debug log
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createExpense, getExpenses, approveExpense };

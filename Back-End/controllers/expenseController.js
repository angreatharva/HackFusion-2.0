const Expense = require("../models/expenseModel");
const Budget = require("../models/budgetModel");
const jwt = require("jsonwebtoken");

// Token verification function
const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid");
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      token: token,
      name: req.headers['user-name'] || 'Unknown User',
      role: req.headers['user-role'] || 'user'
    };
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null;
  }
};

// Submit an Expense and Update Budget Immediately
exports.submitExpense = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const { budgetId, amount, description, proof } = req.body;

    if (!budgetId || !amount || !description || !proof) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate budget existence
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found." });
    }

    // Check if budget has sufficient balance
    if (amount > budget.remainingAmount) {
      return res.status(400).json({ error: "Insufficient budget balance." });
    }

    // Deduct from budget immediately
    budget.spentAmount += Number(amount);
    budget.remainingAmount -= Number(amount);
    await budget.save();

    // Create new expense
    const newExpense = new Expense({
      budget: budgetId,
      submittedBy: user.name,
      amount: Number(amount),
      description,
      proof,
      status: "Approved" // No need for approval anymore
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense submitted successfully and budget updated!",
      expense: newExpense,
      budget
    });
  } catch (error) {
    console.error("Error submitting expense:", error.message);
    res.status(500).json({ error: "Error submitting expense." });
  }
};

// Get all Expenses
exports.getExpenses = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const query = user.role === 'admin' ? {} : { submittedBy: user.name };

    const expenses = await Expense.find(query)
      .populate('budget', 'name category')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      expenses
    });
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).json({ error: "Failed to fetch expenses." });
  }
};

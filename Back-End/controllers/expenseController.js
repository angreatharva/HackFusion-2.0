// expenseController.js
const Expense = require("../models/expenseModel");
const Budget = require("../models/budgetModel");
const jwt = require("jsonwebtoken");

// Updated token verification to match local storage structure
const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header missing or invalid");
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Since we know the structure from localStorage, we'll create a user object
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

// Submit an Expense
exports.submitExpense = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    const { budgetId, amount, description, proof } = req.body;
    
    // Validate required fields
    if (!budgetId || !amount || !description || !proof) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate budget exists
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found." });
    }

    // Create new expense using the name from headers
    const newExpense = new Expense({
      budget: budgetId,
      submittedBy: user.name,
      amount: Number(amount),
      description,
      proof,
      status: "Pending"
    });

    await newExpense.save();
    
    res.status(201).json({
      success: true,
      message: "Expense submitted successfully!",
      expense: newExpense
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

    // If role is admin, get all expenses, otherwise get only user's expenses
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

// Update Expense Status
exports.updateExpenseStatus = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required." });
    }

    const { status } = req.body;
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    expense.status = status;
    
    if (status === "Approved") {
      const budget = await Budget.findById(expense.budget);
      if (!budget) {
        return res.status(404).json({ error: "Associated budget not found." });
      }

      if (expense.amount > budget.remainingAmount) {
        return res.status(400).json({ error: "Insufficient budget balance." });
      }

      budget.spentAmount += expense.amount;
      budget.remainingAmount -= expense.amount;
      await budget.save();
    }

    await expense.save();

    res.status(200).json({
      success: true,
      message: `Expense ${status.toLowerCase()} successfully!`,
      expense
    });
  } catch (error) {
    console.error("Error updating expense status:", error.message);
    res.status(500).json({ error: "Failed to update expense status." });
  }
};
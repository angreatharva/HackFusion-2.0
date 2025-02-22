const Budget = require("../models/budgetModel");
const Application = require("../models/applicationModel");
const jwt = require("jsonwebtoken");

// 📌 Middleware to verify token
const verifyToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    return jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 📌 Create Budget (Admin Only)
const createBudget = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { applicationId, name, category, allocatedAmount } = req.body;
    if (!applicationId || !name || !category || !allocatedAmount) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const application = await Application.findById(applicationId);
    if (!application || application.status !== "Approved") {
      return res.status(400).json({ error: "Invalid or unapproved application." });
    }

    // 🚨 Check if a budget already exists for this application
    const existingBudget = await Budget.findOne({ linkedApplication: applicationId });
    if (existingBudget) {
      return res.status(400).json({ error: "A budget has already been created for this application." });
    }

    const newBudget = new Budget({
      name,
      category,
      allocatedAmount,
      spentAmount: 0,
      remainingAmount: allocatedAmount,
      linkedApplication: applicationId,
    });

    await newBudget.save();
    res.status(201).json({ message: "Budget created successfully!", budget: newBudget });
  } catch (error) {
    console.error("Error creating budget:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// 📌 Get all budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("linkedApplication", "eventName type");
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch budgets." });
  }
};

// 📌 Get a single budget by ID
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Update Budget (After Expense Approval)
const updateBudget = async (req, res) => {
  try {
    const user = verifyToken(req);
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { amount } = req.body;
    const { id } = req.params; // Budget ID from URL

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required." });
    }

    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ error: "Budget not found." });

    if (amount > budget.remainingAmount) {
      return res.status(400).json({ error: "Insufficient budget." });
    }

    budget.spentAmount += amount;
    budget.remainingAmount -= amount;
    await budget.save();

    res.status(200).json({ message: "Budget updated successfully!", budget });
  } catch (error) {
    res.status(500).json({ error: "Error updating budget." });
  }
};

// ✅ **Single `module.exports` statement**
module.exports = { createBudget, getBudgets, getBudgetById, updateBudget };

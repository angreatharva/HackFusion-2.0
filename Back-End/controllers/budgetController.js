// controllers/budgetController.js
const Budget = require("../models/Budget");
const { notifyClients } = require("../utils/socketService");

const createBudget = async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      createdBy: req.user.id,
      remainingAmount: req.body.totalAmount
    });
    await budget.save();
    notifyClients();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBudget, getBudgets };
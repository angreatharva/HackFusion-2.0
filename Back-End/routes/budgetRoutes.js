const express = require("express");
const { createBudget, getBudgets, updateBudget,getBudgetById } = require("../controllers/budgetController");
const { auth, checkAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, checkAdmin, createBudget); // Create budget (Admin)
router.get("/", auth, getBudgets); // Get all budgets
router.get("/:id", auth, getBudgetById); // 🔥 NEW: Get budget by ID
router.put("/:id", auth, checkAdmin, updateBudget); // Update budget (After expense approval)

module.exports = router;

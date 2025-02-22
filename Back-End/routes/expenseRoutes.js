const express = require("express");
const router = express.Router();
const {
  submitExpense,
  getExpenses
} = require("../controllers/expenseController");

// Expense Routes
router.post("/", submitExpense);
router.get("/", getExpenses);

module.exports = router;

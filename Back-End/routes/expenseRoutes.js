// expenseRoutes.js
const express = require("express");
const router = express.Router();
const {
  submitExpense,
  getExpenses,
  updateExpenseStatus
} = require("../controllers/expenseController");

// Routes without auth middleware since we're handling auth in the controller
router.post("/", submitExpense);
router.get("/", getExpenses);
router.put("/:id/status", updateExpenseStatus);

module.exports = router;
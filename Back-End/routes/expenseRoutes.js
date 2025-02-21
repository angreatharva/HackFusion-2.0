const express = require("express");
const router = express.Router();
const { auth, checkAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { 
  createExpense, 
  getExpenses, 
  approveExpense 
} = require("../controllers/expenseController");

// Ensure all controllers are properly imported
if (!createExpense || !getExpenses || !approveExpense) {
  throw new Error("Controller functions are not properly imported");
}

/**
 * @route   POST /api/expense
 * @desc    Create an expense with file upload support (Receipts max 5)
 * @access  Protected (Requires Authentication)
 */
router.post("/", auth, upload.array("receipts", 5), createExpense);

/**
 * @route   GET /api/expense
 * @desc    Get all expenses
 * @access  Protected (Requires Authentication)
 */
router.get("/", auth, getExpenses);

/**
 * @route   PUT /api/expense/:id/approve
 * @desc    Approve an expense (Admin only)
 * @access  Protected (Requires Authentication & Admin Role)
 */
router.put("/:id/approve", auth, checkAdmin, approveExpense);

module.exports = router;

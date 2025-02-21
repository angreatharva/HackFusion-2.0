// routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const { auth, checkAdmin } = require("../middleware/authMiddleware");
const { createBudget, getBudgets } = require("../controllers/budgetController");

router.post("/", auth, checkAdmin, createBudget);
router.get("/", auth, getBudgets);

module.exports = router;
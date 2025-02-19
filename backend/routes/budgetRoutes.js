const express = require("express");
const Budget = require("../models/Budget"); // Ensure model is correctly imported
const multer = require("multer"); // Import multer for handling file uploads
const path = require("path");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify where to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique file names
  },
});

const upload = multer({ storage: storage });

// ✅ Fetch all budgets (with sorting, filtering, searching)
router.get("/", async (req, res) => {
  try {
    const { sortBy, type, search } = req.query;
    let query = {};

    // Filtering by type (income/expense)
    if (type) query.type = type;

    // Searching by source name
    if (search) query.source = new RegExp(search, "i");

    // Sorting (default: latest first)
    const sortOption = sortBy === "amount" ? { amount: -1 } : { createdAt: -1 };

    const budgets = await Budget.find(query).sort(sortOption);
    res.status(200).json(budgets);
  } catch (error) {
    console.error("❌ Error fetching budgets:", error);
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
});

// ✅ Add a new budget entry (Admin only)
router.post("/", async (req, res) => {
  try {
    const { source, amount, type } = req.body;

    if (!source || !amount || !type) {
      return res.status(400).json({ message: "All fields (source, amount, type) are required" });
    }

    const newBudget = new Budget({ source, amount, type });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error("❌ Error adding budget entry:", error);
    res.status(500).json({ message: "Failed to add budget entry" });
  }
});

// ✅ Upload Expense Proof (New route)
router.post("/upload-expense-proof/:budgetId", upload.single("expenseProof"), async (req, res) => {
  try {
    const { budgetId } = req.params; // Get the budget ID from the URL
    const { description } = req.body; // Get the description from the body

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log the file and description for debugging
    console.log("Uploaded file:", req.file);
    console.log("Description:", description);

    // Find the budget by ID
    const budget = await Budget.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Add the proof to the budget
    const proofData = {
      filePath: req.file.path,
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`, // Public URL for file
      description: description || "No description", // Use the provided description or a default value
    };

    // Push the proof data to the budget's proofs array
    budget.proofs.push(proofData);
    await budget.save();

    // Send success response
    res.status(200).json({ message: "Expense proof uploaded successfully", proof: proofData });
  } catch (error) {
    console.error("❌ Error uploading expense proof:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

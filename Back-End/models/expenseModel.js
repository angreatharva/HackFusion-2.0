// models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  budgetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Budget', 
    required: true 
  },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  proofImage: { type: String }, // Store base64 image string
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);
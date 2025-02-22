// expenseModel.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true
  },
  submittedBy: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  proof: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdatedAt timestamp on every update
expenseSchema.pre('save', function(next) {
  this.lastUpdatedAt = new Date();
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
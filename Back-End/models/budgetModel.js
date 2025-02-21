const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['event', 'department', 'mess'], 
    required: true 
  },
  totalAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true, default: function () { return this.totalAmount; } },

  department: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Budget", budgetSchema);

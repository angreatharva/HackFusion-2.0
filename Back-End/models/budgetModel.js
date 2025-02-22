const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  category: { 
    type: String, 
    required: true, 
    enum: ["Event", "Department", "Mess", "Sponsorship"] 
  },
  allocatedAmount: { type: Number, required: true },
  spentAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  linkedApplication: { type: mongoose.Schema.Types.ObjectId, ref: "Application" }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Budget", budgetSchema);

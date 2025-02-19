const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  source: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  type: { type: String, required: true, enum: ["sponsorship", "expense"] },
  date: { type: Date, default: Date.now },
  
  // Adding the proofs field to store expense proof details
  proofs: [{
    filePath: { type: String, required: true },   // Path where the file is stored
    fileName: { type: String, required: true },   // Original file name
    fileUrl: { type: String, required: true },    // URL to access the file
    description: { type: String, default: "No description" } // Optional description of the expense proof
  }]
});

module.exports = mongoose.model("Budget", BudgetSchema);

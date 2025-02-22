const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Event Organization", "Budget Request", "Sponsorship"],
  },
  eventName: { type: String, required: true },
  requestedBudget: { type: Number, required: true },
  justification: { type: String, required: true },
  supportingDoc: { type: String, default: "" }, // Base64 image or empty
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"],
  },
  priority: { type: Number, default: 1 }, // Auto-increases if not reviewed in time
  submittedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;

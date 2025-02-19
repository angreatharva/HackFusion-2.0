const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // ✅ Status tracking
  escalated: { type: Boolean, default: false }, // ✅ Escalation flag
  priority: { type: Number, default: 1 }, // ✅ Priority (starts at 1, increases over time)
});

module.exports = mongoose.model("Application", ApplicationSchema);

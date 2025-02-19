const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Event", "Budget", "Sponsorship"], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  priority: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

applicationSchema.pre("save", function (next) {
  if (this.status === "Pending") {
    const hoursPassed = Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
    this.priority = hoursPassed;
  }
  next();
});

module.exports = mongoose.model("Application", applicationSchema);
// models/complaintModel.js
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  anonymous: { type: Boolean, required: true },
  name: {
    type: String,
    required: function () {
      return !this.anonymous;
    },
  },
  role: {
    type: String,
    required: function () {
      return !this.anonymous;
    },
  },
  approval_count: { type: Number, default: 0 },
  votedBy: [{ name: String, role: String }], // Add this to track votes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", complaintSchema);

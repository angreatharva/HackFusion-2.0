//models/pollModel.js
const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      option: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  votes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      optionIndex: Number,
      gender: String,
    },
  ],
  targetRole: {
    type: String,
    enum: ["student", "doctor", "coordinator", "board_member", "all"],
    default: "all",
  },
});

module.exports = mongoose.model("Poll", pollSchema);

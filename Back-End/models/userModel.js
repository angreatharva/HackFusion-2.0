const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@spit\.ac\.in$/i, "Please use a valid institute email address."],
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    default: "student",
  },
  votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }], // Track polls the user has voted on
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("User", userSchema);

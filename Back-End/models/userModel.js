const mongoose = require("mongoose");

// Define sub-schema for student details
const studentDetailsSchema = new mongoose.Schema(
  {
    rollNumber: { type: String },
    class: { type: String },
    section: { type: String },
    parentEmail: { type: String },
    parentPhone: { type: String },
    currentStatus: {
      type: String,
      enum: ["on_campus", "off_campus", "sick"],
      default: "on_campus",
    },
  },
  { _id: false }
);

// Define sub-schema for doctor details
const doctorDetailsSchema = new mongoose.Schema(
  {
    specialization: { type: String },
    licenseNumber: { type: String },
    department: { type: String },
  },
  { _id: false }
);

// Define sub-schema for coordinator details
const coordinatorDetailsSchema = new mongoose.Schema(
  {
    department: { type: String },
    assignedClasses: [String],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /.+@spit\.ac\.in$/i,
        "Please use a valid institute email address.",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    // Add the role field with validations
    role: {
      type: String,
      required: true,
      enum: ["admin", "student", "doctor", "coordinator", "board_member"],
    },
    votedPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Role-specific fields using sub-schemas:
    studentDetails: {
      type: studentDetailsSchema,
      required: function () {
        return this.role === "student";
      },
    },
    doctorDetails: {
      type: doctorDetailsSchema,
      required: function () {
        return this.role === "doctor";
      },
    },
    coordinatorDetails: {
      type: coordinatorDetailsSchema,
      required: function () {
        return this.role === "coordinator";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

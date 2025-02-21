const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Use the institute email validation from your original model.
    match: [/.+@spit\.ac\.in$/i, "Please use a valid institute email address."],
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    // Updated enum to include doctor and coordinator, along with admin.
    type: String,
    enum: ["student", "doctor", "coordinator", "admin"],
    default: "student",
    required: true
  },
  // Fields for password reset (existing fields)
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Role-specific fields:
  
  // For students: Additional details such as roll number, class, section,
  // parent's email and phone, and current status.
  studentDetails: {
    type: {
      rollNumber: String,
      class: String,
      section: String,
      parentEmail: String,
      parentPhone: String,
      currentStatus: {
        type: String,
        enum: ['on_campus', 'off_campus', 'sick'],
        default: 'on_campus'
      }
    },
    required: function () {
      return this.role === "student";
    }
  },
  // For doctors: Store details such as specialization, license number, and department.
  doctorDetails: {
    type: {
      specialization: String,
      licenseNumber: String,
      department: String
    },
    required: function () {
      return this.role === "doctor";
    }
  },
  // For coordinators: Store department and assigned classes.
  coordinatorDetails: {
    type: {
      department: String,
      assignedClasses: [String]
    },
    required: function () {
      return this.role === "coordinator";
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

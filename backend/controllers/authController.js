const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Register API
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Validate email domain (in case client bypasses front-end validation)
    if (!email.toLowerCase().endsWith("@spit.ac.in")) {
      return res
        .status(400)
        .json({ message: "Only institute emails are allowed." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (default role is student if not provided)
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Login API
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate email domain
    if (!email.toLowerCase().endsWith("@spit.ac.in")) {
      return res
        .status(400)
        .json({ message: "Only institute emails are allowed." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const getUsers = async (req, res) => {
  try {
    // Find all users and exclude the password field
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
// Reset Password API (Requires authentication)
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate reset token (basic version)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token to store in DB for security
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    // Token expires in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // For a basic implementation, simply return the reset token in the response.
    // In production, you would send this token via email.
    res.json({
      message: "Reset token generated. Use this token to reset your password.",
      resetToken,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Reset Password: Validates token and updates password
const resetPassword = async (req, res) => {
  // The token is provided in the URL parameter
  const resetToken = req.params.token;
  // Hash the received token to compare with the stored hash
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  try {
    // Find user by token and ensure token has not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  forgotPassword,
  resetPassword,
};

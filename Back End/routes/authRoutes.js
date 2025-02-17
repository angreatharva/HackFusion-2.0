const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getUsers);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

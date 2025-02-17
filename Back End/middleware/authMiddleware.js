const jwt = require("jsonwebtoken");

// Middleware to check for a valid JWT token
const auth = (req, res, next) => {
  // Expect token in the format "Bearer <token>"
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  // roles param can be a single role string (e.g., 'admin') or an array of roles.
  if (typeof roles === "string") {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};

module.exports = { auth, authorize };

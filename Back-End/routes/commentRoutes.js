// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController"); // Ensure correct path

router.post("/analyze", commentController.analyze);

module.exports = router;

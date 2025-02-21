// backend/routes/healthLeaveRoutes.js
const express = require('express');
const router = express.Router();
const { reportSick, reportLeave } = require('../controllers/healthLeaveController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Protect these routes

// Route: POST /api/healthleave/report-sick
router.post('/report-sick', verifyToken, reportSick);

// Route: POST /api/healthleave/report-leave
router.post('/report-leave', verifyToken, reportLeave);

module.exports = router;

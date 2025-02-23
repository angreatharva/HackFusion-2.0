// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAppointments,
  updateAppointment
} = require('../controllers/appointmentController');

// Ensure the controller functions are correctly imported and defined
router.post('/', auth, authorize(['student']), createAppointment);
router.get('/', auth, authorize(['doctor']), getAppointments);
router.put('/:id', auth, authorize(['doctor']), updateAppointment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAppointments,
  updateAppointment
} = require('../controllers/appointmentController');

router.post('/', auth, authorize(['student']), createAppointment);
router.get('/', auth, authorize(['doctor']), getAppointments);
router.put('/:id', auth, authorize(['doctor']), updateAppointment);

module.exports = router;

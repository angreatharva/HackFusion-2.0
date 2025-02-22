const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  prescription: {
    type: String
  },
  bedRest: {
    required: Boolean,
    days: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
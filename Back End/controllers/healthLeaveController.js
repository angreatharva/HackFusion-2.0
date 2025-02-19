// backend/controllers/healthLeaveController.js
const NotificationController = require('./notificationController');
const User = require('../models/userModel');

/**
 * reportSick - When a student is reported sick, send an email to the class coordinator.
 * Expected input: { studentId }
 */
exports.reportSick = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Student ID is required' });

    // Fetch student info from DB
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Assume student document has a "coordinatorId" field
    const coordinator = await User.findById(student.coordinatorId);
    if (!coordinator || !coordinator.email) {
      return res.status(404).json({ error: 'Class coordinator not found' });
    }

    // Compose email details
    const subject = 'Student Reported Sick';
    const text = `Dear ${coordinator.name},\n\nStudent ${student.name} has been reported sick by the college doctor. Please follow up as necessary.\n\nRegards,\nCollege Admin`;

    // Send email to class coordinator
    await NotificationController.sendEmailNotification(coordinator.email, subject, text);

    res.json({ message: 'Sick report processed. Notification sent to coordinator.' });
  } catch (error) {
    console.error('Error in reportSick:', error);
    res.status(500).json({ error: 'Server error while reporting sick.' });
  }
};

/**
 * reportLeave - When a student leaves campus, send an email to the parent's email.
 * Expected input: { studentId }
 */
exports.reportLeave = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) return res.status(400).json({ error: 'Student ID is required' });

    // Fetch student info from DB
    const student = await User.findById(studentId);
    if (!student || !student.parentEmail) {
      return res.status(404).json({ error: 'Student or parent email not found' });
    }

    const subject = 'Student Has Left Campus';
    const text = `Dear Parent,\n\nThis is an automated alert that your child, ${student.name}, has left the campus. Please contact the college for further details if necessary.\n\nRegards,\nCollege Admin`;

    // Send email to parent's email
    await NotificationController.sendEmailNotification(student.parentEmail, subject, text);

    res.json({ message: 'Leave report processed. Notification sent to parent.' });
  } catch (error) {
    console.error('Error in reportLeave:', error);
    res.status(500).json({ error: 'Server error while reporting leave.' });
  }
};

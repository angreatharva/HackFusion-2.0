// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

console.log("Loading appointment controller...");

exports.createAppointment = async (req, res) => {
  try {
    const { rollNo, description, isEmergency } = req.body;

    const student = await User.findOne({
      'studentDetails.rollNumber': rollNo,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const appointment = await Appointment.create({
      rollNo,
      description,
      isEmergency
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'pending' })
      .sort({ isEmergency: -1, createdAt: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { prescription, bedRest, status } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const student = await User.findOne({
      'studentDetails.rollNumber': appointment.rollNo,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    appointment.prescription = prescription;
    appointment.bedRest = bedRest;
    appointment.status = status;
    await appointment.save();

    // Send email notifications
    const bedRestText = bedRest.required
      ? `\nBed rest has been prescribed for ${bedRest.days} days.`
      : '';

    await sendEmail({
      to: student.email,
      subject: 'Appointment Approved',
      text: `Dear ${student.name},\n\nYour appointment has been approved by the doctor.
            \nPrescription: ${prescription}${bedRestText}\n\nBest regards,\nCollege Medical Team`
    });

    await sendEmail({
      to: student.studentDetails.parentEmail,
      subject: 'Medical Update for Your Child',
      text: `Dear Parent,\n\nYour child ${student.name} visited the college doctor today.
            \nPrescription: ${prescription}${bedRestText}\n\nBest regards,\nCollege Medical Team`
    });

    const coordinator = await User.findOne({
      role: 'coordinator',
      'coordinatorDetails.assignedClasses': student.studentDetails.class
    });

    if (coordinator) {
      await sendEmail({
        to: coordinator.email,
        subject: 'Student Medical Update',
        text: `Dear Coordinator,\n\nStudent ${student.name} (Roll No: ${student.studentDetails.rollNumber})
              visited the doctor today.${bedRestText}\n\nBest regards,\nCollege Medical Team`
      });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

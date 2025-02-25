const Appointment = require('../models/Appointment');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// Student creates appointment
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

// Doctor gets appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ status: 'pending' })
      .sort({ isEmergency: -1, createdAt: 1 }); // Sort by emergency first, then creation time
    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Doctor updates appointment with prescription and bed rest
exports.updateAppointment = async (req, res) => {
  try {
    const { prescription, bedRest } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const student = await User.findOne({
      'studentDetails.rollNumber': appointment.rollNo,
      role: 'student'
    }).populate('coordinatorDetails');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    appointment.prescription = prescription;
    appointment.bedRest = bedRest;
    appointment.status = 'completed';
    await appointment.save();

    // Send email notifications
    const bedRestText = bedRest.required 
      ? `\nBed rest has been prescribed for ${bedRest.days} days.`
      : '';

    await sendEmail({
      to: student.studentDetails.parentEmail,
      subject: 'Medical Update for Your Child',
      text: `Dear Parent,\n\nYour child ${student.name} visited the college doctor today. 
            \nPrescription: ${prescription}${bedRestText}\n\nBest regards,\nCollege Medical Team`
    });

    // Find and notify coordinator
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

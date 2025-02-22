import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [bedRest, setBedRest] = useState({ required: false, days: 0 });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const tabId = sessionStorage.getItem('tabId');
      const token = localStorage.getItem(`authToken_${tabId}`);
      
      const response = await axios.get('http://localhost:8000/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleSubmit = async (appointmentId) => {
    try {
      const tabId = sessionStorage.getItem('tabId');
      const token = localStorage.getItem(`authToken_${tabId}`);
      
      await axios.put(`http://localhost:8000/api/appointments/${appointmentId}`, {
        prescription,
        bedRest
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      alert('Appointment updated successfully');
      fetchAppointments();
      setSelectedAppointment(null);
      setPrescription('');
      setBedRest({ required: false, days: 0 });
    } catch (error) {
      alert('Failed to update appointment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Doctor Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments List */}
        <div className="border rounded p-4">
          <h3 className="text-xl font-semibold mb-4">Pending Appointments</h3>
          {appointments.map(appointment => (
            <div 
              key={appointment._id}
              className={`p-4 mb-2 rounded cursor-pointer ${
                appointment.isEmergency ? 'bg-red-100' : 'bg-gray-100'
              }`}
              onClick={() => setSelectedAppointment(appointment)}
            >
              <p><strong>Roll No:</strong> {appointment.rollNo}</p>
              <p><strong>Description:</strong> {appointment.description}</p>
              {appointment.isEmergency && (
                <span className="text-red-600 font-bold">EMERGENCY</span>
              )}
            </div>
          ))}
        </div>

        {/* Prescription Form */}
        {selectedAppointment && (
          <div className="border rounded p-4">
            <h3 className="text-xl font-semibold mb-4">Prescription</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Prescription:</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bedRest.required}
                    onChange={(e) => setBedRest({...bedRest, required: e.target.checked})}
                    className="mr-2"
                  />
                  Bed Rest Required
                </label>
              </div>

              {bedRest.required && (
                <div>
                  <label className="block mb-2">Number of Days:</label>
                  <input
                    type="number"
                    value={bedRest.days}
                    onChange={(e) => setBedRest({...bedRest, days: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
              )}

              <button 
                onClick={() => handleSubmit(selectedAppointment._id)}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
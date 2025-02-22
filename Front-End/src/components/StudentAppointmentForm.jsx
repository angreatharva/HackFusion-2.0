import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentAppointmentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rollNo: '',
    description: '',
    isEmergency: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tabId = sessionStorage.getItem('tabId');
      const token = localStorage.getItem(`authToken_${tabId}`);
      
      await axios.post('http://localhost:8000/api/appointments', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert('Appointment requested successfully');
      navigate('/home');
    } catch (error) {
      alert('Failed to request appointment');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Request Doctor Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Roll Number:</label>
          <input
            type="text"
            value={formData.rollNo}
            onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Description of Issue:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isEmergency}
              onChange={(e) => setFormData({...formData, isEmergency: e.target.checked})}
              className="mr-2"
            />
            Emergency Case
          </label>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default StudentAppointmentForm;

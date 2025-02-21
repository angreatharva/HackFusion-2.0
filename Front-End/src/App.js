// mern-frontend/src/App.js
import React from 'react';
import ComplaintForm from './components/complaints/ComplaintForm';
import ComplaintsList from './components/complaints/ComplaintsList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Complaints Test</h1>
      <ComplaintForm onSubmitSuccess={(data) => console.log('Complaint submitted:', data)} />
      <ComplaintsList userRole="user" />
    </div>
  );
}

export default App;

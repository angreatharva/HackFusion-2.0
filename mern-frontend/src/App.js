// mern-frontend/src/App.js
import React from 'react';
import ReportSick from './components/ReportSick';
import ReportLeave from './components/ReportLeave';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Automated Health & Leave Notifications
      </h1>
      <ReportSick />
      <ReportLeave />
    </div>
  );
}

export default App;

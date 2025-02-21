// mern-frontend/src/components/ui/alert.js
import React from 'react';

export const Alert = ({ children, variant, className = '' }) => {
  const bgClass = variant === 'destructive' ? 'bg-red-100' : 'bg-green-100';
  return <div className={`p-4 rounded-md ${bgClass} ${className}`}>{children}</div>;
};

export const AlertDescription = ({ children, className = '' }) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};

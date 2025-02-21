// mern-frontend/src/components/ui/badge.js
import React from 'react';

export const Badge = ({ children, className = '' }) => {
  return <span className={`inline-block px-2 py-1 text-xs rounded ${className}`}>{children}</span>;
};

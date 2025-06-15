import React from 'react';
import { Navigate } from 'react-router-dom';

const LaboratoryHome = () => {
  return <Navigate to="/laboratory/dashboard" replace />;
};

export default LaboratoryHome; 
import React from 'react';
import { Navigate } from 'react-router-dom';

const HospitalHome = () => {
  return <Navigate to="/hospital/dashboard" replace />;
};

export default HospitalHome; 
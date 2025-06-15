import React from 'react';
import { Navigate } from 'react-router-dom';

const PharmacyHome = () => {
  return <Navigate to="/pharmacy/dashboard" replace />;
};

export default PharmacyHome; 
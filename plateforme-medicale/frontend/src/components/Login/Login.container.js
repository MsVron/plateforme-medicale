import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginView from './Login.view';
import ForgotPasswordDialog from './ForgotPasswordDialog';

const LoginContainer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        nom_utilisateur: username,
        mot_de_passe: password
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log('Login successful:', response.data);

      // Navigate based on user role
      if (['super_admin', 'admin'].includes(response.data.user.role)) {
        console.log('Navigating to /admin');
        navigate('/admin', { replace: true });
      } else if (response.data.user.role === 'medecin') {
        console.log('Navigating to /medecin');
        navigate('/medecin', { replace: true });
      } else if (response.data.user.role === 'patient') {
        console.log('Navigating to /patient');
        navigate('/patient', { replace: true });
      } else if (response.data.user.role === 'institution') {
        console.log('Navigating to /institution');
        navigate('/institution', { replace: true });
      } else if (response.data.user.role === 'hospital') {
        console.log('Navigating to /hospital');
        navigate('/hospital', { replace: true });
      } else if (response.data.user.role === 'pharmacy') {
        console.log('Navigating to /pharmacy');
        navigate('/pharmacy', { replace: true });
      } else if (response.data.user.role === 'laboratory') {
        console.log('Navigating to /laboratory');
        navigate('/laboratory', { replace: true });
      } else {
        console.log('Unknown role, no navigation');
        setError('Rôle utilisateur non reconnu');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      setError(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  return (
    <>
      <LoginView
        username={username}
        password={password}
        error={error}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
      />
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onClose={handleCloseForgotPassword}
      />
    </>
  );
};

export default LoginContainer;
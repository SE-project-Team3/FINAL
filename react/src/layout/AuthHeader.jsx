import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_w.png';

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="auth-header">
      <img src={logo} className="logo-image"
      onClick={() => navigate('/home')}/>
    </header>
  );
};

export default AuthHeader;
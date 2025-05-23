import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.css';

const MainHeader = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (name) setUsername(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username'); 
    setUsername('');
    navigate('/');
  };
  
  return (
    <div className="header-outer">
      <div className="header-inner">
      <header className="main-header">
        <div className="header-left-section">
          <img src={logo} alt="logo" className="logo-image" onClick={() => navigate('/home')} />
          <nav className="nav-menu">
            <a href="/home">예약</a>
            <a href="/info">레스토랑 정보</a>
          </nav>
        </div>
        <div className="header-right-section">
          {username ? (
            <div className="user-dropdown">
              <span onClick={() => setMenuOpen(!menuOpen)} className="username-button">
                안녕하세요, {username} 님! ▾
              </span>
              {menuOpen && (
                <div className="dropdown-menu">
                  <div onClick={() => navigate('/my-reservations')}>예약 확인</div>
                  <div onClick={handleLogout}>로그아웃</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="header-btn" onClick={() => navigate('/')}>로그인</button>
              <button className="header-btn signup" onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      </header>
    </div>
    </div>
  );
  
};

export default MainHeader;

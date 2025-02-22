import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import logo1 from '../assets/logo.png';

function Navbar() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem('username') || '');
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div className="navbar">
      <Link to="/landingPage">
      <div className="logo1"><img src={logo1}/></div>
      </Link>
      <div className="nav-links">
        <button onClick={() => handleNavigation('rent')}>RENT</button>
        <button onClick={() => handleNavigation('borrow')}>BORROW</button>
        <button onClick={() => handleNavigation('cart')}>Cart</button>
        
        <div className="user-dropdown">
          <button onClick={() => handleNavigation('user')} className="user-btn">User</button>
          {username && <div className="user-tooltip">{username}</div>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

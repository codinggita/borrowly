import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div className="navbar">
      <Link to="/landingPage">
      <div className="logo1"><img src='./src/assets/logo.png'/></div>
      </Link>
      <div className="nav-links">
        <button onClick={() => handleNavigation('rent')}>RENT</button>
        <button onClick={() => handleNavigation('borrow')}>BORROW</button>
        <button onClick={() => handleNavigation('cart')}>Cart</button>
        <button onClick={() => handleNavigation('user')}>User</button>
      </div>
    </div>
  );
}

export default Navbar;

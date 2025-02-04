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
        <button onClick={() => handleNavigation('rent')}>Rent</button>
        <button onClick={() => handleNavigation('borrow')}>Borrow</button>
        <button onClick={() => handleNavigation('cart')}>Cart</button>
      </div>
    </div>
  );
}

export default Navbar;

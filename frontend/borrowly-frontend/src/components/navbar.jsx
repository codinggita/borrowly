import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import logo1 from '../assets/logo.png';

function Navbar() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
      setCartCount(cartItems.length);
      setWishlistCount(wishlistItems.length);
    };

    updateCounts();

    const handleStorageChange = () => updateCounts();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div className="navbar">
      <Link to="/landingPage">
        <div className="logo1"><img src={logo1} /></div>
      </Link>
      <div className="nav-links">
        <button onClick={() => handleNavigation('rent')}>RENT</button>
        <button onClick={() => handleNavigation('borrow')}>BORROW</button>
        <button onClick={() => handleNavigation('wishlist')}>
          Wishlist ({wishlistCount})
        </button>
        <button onClick={() => handleNavigation('cart')}>
          Cart ({cartCount})
        </button>

        <div className="user-dropdown">
          <button onClick={() => handleNavigation('user')} className="user-btn">User</button>
          {username && <div className="user-tooltip">{username}</div>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

// import React, { useState } from 'react';
// import './navbar.css';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         <div className="logo">
//           <h1>BORROWLY</h1>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="nav-links">
//           <a href="#" className="nav-item">RENT</a>
//           <a href="#" className="nav-item">BORROW</a>
//         </div>

//         {/* Desktop Icons */}
//         <div className="nav-icons">
//           <button className="icon-btn">
//             <i className="fas fa-search"></i>
//           </button>
//           <button className="icon-btn">
//             <i className="fas fa-shopping-cart"></i>
//           </button>
//           <button className="icon-btn">
//             <i className="fas fa-user"></i>
//           </button>
//         </div>

//         {/* Mobile menu button */}
//         <button className="mobile-menu-btn" onClick={toggleMenu}>
//           <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
//         </button>
//       </div>

//       {/* Mobile menu */}
//       <div className={`mobile-menu ${isOpen ? 'show' : ''}`}>
//         <a href="#" className="mobile-nav-item">RENT</a>
//         <a href="#" className="mobile-nav-item">BORROW</a>
//         <div className="mobile-icons">
//           <button className="mobile-icon-btn">
//             <i className="fas fa-search"></i>
//           </button>
//           <button className="mobile-icon-btn">
//             <i className="fas fa-shopping-cart"></i>
//           </button>
//           <button className="mobile-icon-btn">
//             <i className="fas fa-user"></i>
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


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
      <div className="logo"><img src='./src/assets/logo.png'/></div>
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

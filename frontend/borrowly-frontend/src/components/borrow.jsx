import React from 'react';
import Navbar from './navbar.jsx';
import './borrow.css';
import borrow_0 from '../assets/borrow_0.png';
import borrow_1 from '../assets/borrow_1.png';

function Borrow() {
  return (
    <div>
      <Navbar />
      <div className='borrow_images'>
        <img className='b_img1' src={borrow_0} alt="Borrow Option 1" />
      </div>
      <div className='borrow_images'>
        <img className='b_img2' src={borrow_1} alt="Borrow Option 2" />
      </div>
    </div>
  );
}

export default Borrow;

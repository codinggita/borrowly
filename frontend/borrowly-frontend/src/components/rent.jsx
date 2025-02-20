import React, { useState } from 'react';
import Navbar from './navbar.jsx';
import Form from './form.jsx';
import Footer from './footer.jsx';
import './rent.css';
import rent_0 from '../assets/rent_0.png';
import rent_1 from '../assets/rent_1.png';
import rent_2 from '../assets/rent_2.png';

const Rent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <Navbar />

      <div className='images'>
        <img className='img1' src={rent_0} alt="Rent Option 1" />
      </div>
      <div className='images'>
        <img className='img2' src={rent_1} alt="Rent Option 2" />
      </div>
      <div className='images'>
        <img className='img3' src={rent_2} alt="Rent Option 3" />
      </div>

      <button className="rent-button" onClick={() => setIsFormOpen(true)}>CLICK HERE TO RENT</button>

      <Form isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />

      <Footer />
    </div>
  );
};

export default Rent;

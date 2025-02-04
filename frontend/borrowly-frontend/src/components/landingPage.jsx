import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import './LandingPage.css';

function LandingPage() {
  const [topRented, setTopRented] = useState([]);

  useEffect(() => {
    fetch('https://borrowly.onrender.com/mixture')
      .then((response) => response.json())
      .then((data) => {
        setTopRented(data.slice(0, 6)); // Only take first 6 items
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div>
      <Navbar />
      <div className="landing-page">
        <h1>Top Rented This Month</h1>
        <div className="items-container">
          {topRented.map((item, index) => (
            <div key={index} className="item-card">
              <img src={item.images[0]} alt={item.prodName} />
              <h2>{item.prodName}</h2>
              <p>{item.description}</p>
              <p><strong>Price:</strong> {item.price}</p>
              <p><strong>Gender:</strong> {item.gender}</p>
              <p><strong>Size:</strong> {item.size}</p>
              <button onClick={() => handleNavigation('borrow')}>Borrow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

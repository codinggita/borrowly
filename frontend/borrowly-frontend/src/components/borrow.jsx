import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import './borrow.css';

function Borrow() {
  const [clothes, setClothes] = useState([]);
  const [footwears, setFootwears] = useState([]);
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    // Fetch data for clothes
    fetch('https://borrowly.onrender.com/clothes')
      .then((response) => response.json())
      .then((data) => setClothes(data))
      .catch((error) => console.error('Error fetching clothes:', error));

    // Fetch data for footwears
    fetch('https://borrowly.onrender.com/footwears')
      .then((response) => response.json())
      .then((data) => setFootwears(data))
      .catch((error) => console.error('Error fetching footwears:', error));

    // Fetch data for accessories
    fetch('https://borrowly.onrender.com/accessories')
      .then((response) => response.json())
      .then((data) => setAccessories(data))
      .catch((error) => console.error('Error fetching accessories:', error));
  }, []);

  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  const renderItems = (items) => {
    return items.map((item, index) => (
      <div key={index} className="item-card">
        <img src={item.images[0]} alt={item.prodName} />
        <h2>{item.prodName}</h2>
        <p>{item.description}</p>
        <p><strong>Price:</strong> {item.price}</p>
        <p><strong>Gender:</strong> {item.gender}</p>
        <p><strong>Size:</strong> {item.size}</p>
        <button onClick={() => handleNavigation('borrow')}>Borrow</button>
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="landing-page">
        <h1>BORROW PAGE</h1>
        <div className="section">
          <h2>Clothes</h2>
          <div className="items-container">
            {renderItems(clothes)}
          </div>
        </div>

        <div className="section">
          <h2>Footwears</h2>
          <div className="items-container">
            {renderItems(footwears)}
          </div>
        </div>

        <div className="section">
          <h2>Accessories</h2>
          <div className="items-container">
            {renderItems(accessories)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Borrow;

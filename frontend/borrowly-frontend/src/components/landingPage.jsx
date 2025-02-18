import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';
import './landingPage.css';
import landing1 from '../assets/landing1.png';
import landing2 from '../assets/landing2.png';
import landing3 from '../assets/landing3.png';
import landing4 from '../assets/landing4.png';

function LandingPage() {
  const [topRented, setTopRented] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [landing1, landing2, landing3, landing4];

  useEffect(() => {
    fetch('https://borrowly.onrender.com/mixture')
      .then((response) => response.json())
      .then((data) => {
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setTopRented(shuffledData.slice(0, 6));
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div>
      <Navbar />

      <div className="carousel">
        <img src={images[currentIndex]} alt="Slideshow" className="carousel-image" />
      </div>

      <div className="dress-filter">
        <h1>BROWSE DRESS BY STYLE</h1>
      </div>

      <div className="landing-page">
        <h1><u>TOP RENTED THIS MONTH</u></h1>
        <div className="items-container">
          {topRented.map((item, index) => (
            <div key={index} className="item-card">

              <div className='prod_img_main'>
                <img src={item.images[0]} alt={item.prodName} />
                <div className='prod_img'>
                  <img src={item.images[1]} alt={item.prodName} />
                  <img src={item.images[2]} alt={item.prodName} />
                </div>
              </div>

              <div className='item-name'>{item.prodName}</div>
              <div className="brand-name">{item.brand}</div>
              <div className="price-container">
                <span className="price">{item.price}</span>
              </div>

              <div className='buttons'>
                <button className="wishlist-button">Wishlist</button>
                <button className="add-to-bag-button" onClick={() => handleNavigation('cart')}>Add to Cart</button>
              </div>

            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;

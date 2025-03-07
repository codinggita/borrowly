import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';
import './landingPage.css';
import landing1 from '../assets/landing1.png';
import landing2 from '../assets/landing2.png';
import landing3 from '../assets/landing3.png';
import landing4 from '../assets/landing4.png';
import ProductCard from './productCard.jsx';

function LandingPage() {
  const [topRented, setTopRented] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  const images = [landing1, landing2, landing3, landing4];

  useEffect(() => {
    fetch('https://borrowly-backend.onrender.com/mixture')
      .then((response) => response.json())
      .then((data) => {
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setTopRented(shuffledData.slice(0, 8));
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false); // Ensure loading is set to false even if there's an error
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // const handleNavigation = (page) => {
  //   window.location.href = /${page};
  // };

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
        {loading ? (
          <div className="loader"></div> // Show loader while loading
        ) : (
          <div className="items-container">
            {topRented.map((item, index) => (
              <ProductCard
                key={index}
                id={item._id}
                name={item.prodName}
                brand={item.brand}
                price={item.price}
                rating={item.rating || 4.5}
                reviews={item.reviews || 100}
                image={item.images[0]}
                product={item}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;
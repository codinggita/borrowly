import React from 'react';
import Navbar from './navbar.jsx';
import Footer from './footer.jsx';
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

      <a href="#explore" className="explore-link">Explore Feed →</a>

      <div className="container">  
      <div className="categories-section">
        <h1>CATEGORIES</h1>
        <p className="subtitle">Browse through our dreamy catalog and enrobe your wishes</p>

        <section className="category">
          <h2>CLOTHES</h2>
          <div className="category-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&q=80" alt="Women's clothing" />
              <button className="category-btn">FOR HER</button>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80" alt="Men's clothing" />
              <button className="category-btn">FOR HIM</button>
            </div>
          </div>
        </section>

        <section className="category">
          <h2>ACCESSORIES</h2>
          <div className="category-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Women's accessories" />
              <button className="category-btn">FOR HER</button>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80" alt="Men's accessories" />
              <button className="category-btn">FOR HIM</button>
            </div>
          </div>
        </section>

        <section className="category">
          <h2>SHOES</h2>
          <div className="category-grid">
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80" alt="Women's shoes" />
              <button className="category-btn">FOR HER</button>
            </div>
            <div className="category-card">
              <img src="https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&q=80" alt="Men's shoes" />
              <button className="category-btn">FOR HIM</button>
            </div>
          </div>
        </section>
      </div>
    </div>

    <Footer/>
    </div>
  );
}

export default Borrow;

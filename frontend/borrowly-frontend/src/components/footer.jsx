import React from 'react';
import './footer.css';
import payment1 from '../assets/payment1.png';
import payment2 from '../assets/payment2.png';
import payment3 from '../assets/payment3.png';
import payment4 from '../assets/payment4.png';
import payment5 from '../assets/payment5.png';
import social from '../assets/social_media.png'; 


const Footer = () => {
  return (
    <div className="footer">

     <div className='footer-part1'>
     <div className='footer-content1'>
        <div className="footer-section1">
          <p>We have clothes that suits your style and which you're proud to wear. From women to men.</p>
          <div className="social-icons">
            <img src={social} alt="social media" />
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Works</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Help</h3>
          <ul>
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Delivery Details</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>FAQ</h3>
          <ul>
            <li><a href="#">Account</a></li>
            <li><a href="#">Manage Deliveries</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Payments</a></li>
          </ul>
        </div>
      </div>
     </div>

      <div className="footer-bottom">
        <div></div>
        <div className="payment-icons">
          <img src={payment1} alt="VISA"/>
          <img src={payment2} alt="MasterCard"/>
          <img src={payment3} alt="PayPal"/>
          <img src={payment4} alt="ApplePay"/>
          <img src={payment5} alt="GPay"/>

        </div>
      </div>
    </div>
  );
};

export default Footer;
import React from "react";
import { useNavigate } from "react-router-dom";
import "./firstpage.css";
import logo from '../assets/logo.png';
import pic1 from '../assets/pic1.png';
import pic2 from '../assets/pic2.png';
import pic3 from '../assets/pic3.png';
import pic4 from '../assets/pic4.png';

const firstpage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <div className="hero" >
      <div className="logo"><img src={logo} alt="logo" /></div>
      <div className="image-container">
        <img src={pic1}alt="Fashion" />
        <img src={pic2} alt="Shoes" />
        <img src={pic3} alt="Men's Wear" />
        <img src={pic4} alt="Outfits" />
      </div>
      <button className="get-started-btn" onClick={handleGetStartedClick}>GET STARTED</button>
    </div>
  );
};

export default firstpage;

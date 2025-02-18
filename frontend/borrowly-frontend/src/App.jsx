import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import Firstpage from "./components/firstpage";
import LoginPage from "./components/loginPage"; 
import Signup from "./components/signup";
import LandingPage from "./components/landingPage";
import Rent from "./components/rent";
import Borrow from "./components/borrow";
import Footer from "./components/footer";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </Router>
  );
};

export default App;

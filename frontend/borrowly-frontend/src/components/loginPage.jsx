import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../components/loginPage.css';
import login from '../assets/login.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://borrowly-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Store username in localStorage
      localStorage.setItem('username', formData.username);
      localStorage.setItem('token', data.token);  // Store token if using JWT

      // Dispatch an event to notify other components
      window.dispatchEvent(new Event("storage"));

      navigate('/landingPage');
    } else {
        alert('Login failed. Please check your credentials or register first.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        
        
        <div className="login-form-container">
          <h1>WELCOME !</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
            </div>

           
            <div className="form-group1">
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="line1"></div>

          <div className="social-media">Google & Facebook option</div>

          <div className="signup-link">
            <p>Not a member yet? <Link to="/signup">Signup</Link></p>
          </div>
        </div>

        <div className="login-image">
          <img src={login} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default Login;

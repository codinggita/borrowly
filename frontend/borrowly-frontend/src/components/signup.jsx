import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/signup.css';
import signup from '../assets/signup.png';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    setError('');

    fetch('https://borrowly.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        emailOrPhone: formData.emailOrPhone,
        password: formData.password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Signup successful!');
          navigate('/landingPage');
        } else {
          setError(data.message || 'Signup failed');
        }
      })
      .catch((error) => {
        setError(error.message || 'Signup failed. Please try again.');
        console.error('Signup error:', error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left side - Form */}
        <div className="login-form-container">
          <h1>CREATE ACCOUNT</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
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

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Email or Phone"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  <span>Sign Up</span>
                </>
              )}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Already have an account?{' '}
              <Link to="/login">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="login-image">
          <img src={signup} alt="Signup"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;

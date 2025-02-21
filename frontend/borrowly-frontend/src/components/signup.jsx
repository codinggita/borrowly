import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
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
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
    
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && value !== formData.password) {
        setPasswordError('Passwords do not match!');
      } else if (name === 'password' && formData.confirmPassword && formData.confirmPassword !== value) {
        setPasswordError('Passwords do not match!');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match!');
      return;
    }

    setLoading(true);
    setError('');
    setPasswordError('');

    fetch('https://borrowly-backend.onrender.com/register', {
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
          if (window.confirm('Registered successfully! Click OK to continue.')) {
            navigate('/landingPage');
          }
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

        {/* Right side - Image */}
        <div className="signup-image">
          <img src={signup} alt="Signup"/>
        </div>

        {/* Left side - Form */}
        <div className="login-form-container">
          <h1>REGISTER !</h1>
          
          {error && <div className="error-message">{error}</div>}
          
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
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  placeholder="Email or Phone"
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

            <div className="form-group1">
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>

            {/* Password mismatch error message */}
            {passwordError && <div className="password-error">{passwordError}</div>}

            <button
              type="submit"
              disabled={loading || passwordError}
              className="login-button"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className='social-media'>Google & Facebook option</div>
          </form>

          <div className="line1"></div>

          <div className="signup-link">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

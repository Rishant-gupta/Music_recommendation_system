import React, { useState } from "react";
import './Login.css';
import loginImage from './login-image.png';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

function Login({ onLogin }) { 
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const setValues = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      alert("All fields are mandatory!");
      return;
    }

    setIsLoading(true);
    try {
     
      const response = await api.post('/api/auth/login', {
        email: input.email,
        password: input.password,
      });

      if (response.data && response.data.token) {
        alert("Login successful!");
  
        onLogin(response.data.token);
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Invalid email or password";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={loginImage} alt="Listen to music" />
        <div className="login-image-text">
          <h1>Listen to the top music <br /> <span>FOR FREE</span></h1>
        </div>
      </div>

      <div className="login-right">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={setValues} value={input.email} />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              onChange={setValues}
              value={input.password}
              required
            />
            <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <label className="dont-exist">
          Don't have an Account?
          <span className="signup" onClick={() => navigate('/signup')}> SignUp</span>
        </label>
      </div>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import './SignUp.css';
import loginImage from './login-image.png';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

function SignUp({ onSignUpSuccess }) {
  const navigate = useNavigate();
  
  const [input, setInput] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const setValues = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!showOtpInput) {
     
      if (input.password !== input.confirmPassword) {
        alert("Passwords do not match!");
        setIsLoading(false);
        return;
      }
      try {
        await api.post('/api/auth/signup', {
          username: input.username,
          email: input.email,
          password: input.password,
        });
        
        alert(`OTP sent to ${input.email}! Please check your inbox OR spam Folder.`);
        setShowOtpInput(true);
        
      } catch (error) {
        console.error("Signup error:", error);
        alert(error.response?.data?.message || "Signup failed. Please try again.");
      }
    } else {
     
      try {
        const response = await api.post('/api/auth/verify-otp', {
          email: input.email,
       
          otp: otp.toString(), 
        });

        if (response.data && response.data.token) {
          alert("Account verified successfully!");
          onSignUpSuccess(response.data.token);
        } else {
          alert("Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        
        // This is the error you are seeing
        if (error.message === "Network Error") {
            alert("Network Error: Could not connect to the server. This is likely a CORS error on the backend. Please ask the backend team to redeploy.");
        } else {
            alert(error.response?.data?.message || "Invalid or expired OTP.");
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={loginImage} alt="Listen to music" />
        <div className="signup-image-text">
          <h1>Listen to the top music <br /> <span>FOR FREE</span></h1>
        </div>
      </div>

      <div className="signup-right">
        <h2 className="signup-title">{showOtpInput ? "Verify Your Email" : "Sign Up"}</h2>
        
        {showOtpInput && (
          <p className="dontexist" style={{ marginTop: 0, marginBottom: '1rem' }}>
            Enter the 6-digit OTP sent to <strong>{input.email}</strong>
          </p>
        )}

        <form className="signup-form" onSubmit={handleFormSubmit}>
          {!showOtpInput ? (
            <>
              <label>Username</label>
              <input type="text" name="username" onChange={setValues} value={input.username} required />

              <label>Email</label>
              <input type="email" name="email" onChange={setValues} value={input.email} required />
              
              <label>Password</label>
              <div className="confirm-password-box">
                <input type={showPassword ? "text" : "password"} name="password" onChange={setValues} value={input.password} required />
                <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
              </div>
              
              <label>Confirm Password</label>
              <div className="confirm-password-box">
                <input type={showPassword ? "text" : "password"} name="confirmPassword" onChange={setValues} value={input.confirmPassword} required />
                <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</span>
              </div>
            </>
          ) : (
            <>
              <label>Email (read-only)</label>
              <input type="email" name="email" value={input.email} readOnly disabled />

              <label>OTP</label>
              <input 
                type="text" 
                name="otp" 
                placeholder="Enter 6-digit OTP"
                onChange={(e) => setOtp(e.target.value)} 
                value={otp} 
                required 
              />
            </>
          )}
          
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading 
              ? (showOtpInput ? "Verifying..." : "Signing up...")
              : (showOtpInput ? "Verify OTP" : "Sign Up")
            }
          </button>
        </form>

        <label className="dontexist">
          Already have an Account?
          <span className="login" onClick={() => navigate('/login')}> Login</span>
        </label>
      </div>
    </div>
  );
}

export default SignUp;
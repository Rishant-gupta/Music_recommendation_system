import React, { useEffect, useState } from "react";
import './SignUp.css';
import loginImage from './login-image.png';
import Login from "./Login";

function SignUp() {

  const entries = {firstName:"", lastName:"", email:"", password:""};
  const [input, setInput] = useState(entries);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isOff, setIsOff] = useState(false);

  const setValues = (e)=>{
    setInput({...input, [e.target.name]:e.target.value})
  }

  const handleSignUp = (e) => {
    alert("OTP Sent Successfully")
    e.preventDefault();
    setStep(2);
  };

  useEffect(() => {
    let interval;

    if (timer>0) {
      interval = setInterval(() => {
        setTimer((current) => current-1);
      }, 1000);
    }
    else {
      setIsOff(true);
    }
  })

  const optResend = () => {
    setOtp("");
    setTimer(30);
    setIsOff(false);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === "123456") {
      alert("OTP Verified! Account created.");
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  const callLogin = (e)=>{
      e.preventDefault();
      return(
        <>
        <Login />
        </>
      )
    }


  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={loginImage} alt="Listen to music" />
        <div className="signup-image-text">
          <h1>Listen to the top music <br /> <span>FOR FREE</span></h1>
        </div>
      </div>

      <div className="signup-right">

        <h2 className="signup-title">Sign Up</h2>

        {step==1 && (<form className="signup-form" onSubmit={handleSignUp}>
          <div className="name-fields">
            <div>
              <label>First Name</label>
              <input type="text" placeholder="First Name" name="firstName" onChange={setValues} value={input.firstName} />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" placeholder="Last Name" name="lastName" onChange={setValues} value={input.lastName} />
            </div>
          </div>

          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={setValues} value={input.email} required />

          <label>Password</label>
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password" onChange={setValues} value={input.password} required
            />
            <span className="switch-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
          <label className="dont-exist">Already have an Account <p className="login" onClick={callLogin}>{"Login"}</p></label>
        </form>)}

  

        {step === 2 && (
          <form className="signup-form" onSubmit={handleVerifyOtp}>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="otp-timer">{timer>0? (<p>Resend OTP in <b>{timer}</b></p>) : (<button onClick={optResend}>Resend</button>)}</div>
            <button type="submit" className="signup-btn">Verify OTP</button>
          </form>
        )}

      </div>
    </div>
  );
}

export default SignUp;
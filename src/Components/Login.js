import React, { useState } from "react";
import './Login.css';
import { FaMusic } from "react-icons/fa";
import loginImage from './login-image.png';
import SignUp from "./SignUp";

function Login() {

  const entries = {email:"", password:""};
  const [input, setInput] = useState(entries);
  const [showPassword, setShowPassword] = useState(false);
  const [flag, setFlag] = useState(false)

  const callSignUp = (e)=>{
    e.preventDefault();
    return(
      <>
      <SignUp />
      </>
    )
  }

  const setValues = (e)=>{
    setInput({...input, [e.target.name]:e.target.value})
  }

  function handleLogin(e){
    e.preventDefault();
    if(!input.email || !input.password){
      alert("All Fields are Mandatory !!")
    }
    else{
      setFlag(true)
    }
  }

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
          <input type="email" name="email" placeholder="Enter your email" onChange={setValues} value={input.email}/>

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

          <button type="submit" className="login-btn">Login</button>
        </form>
        <label className="dont-exist">Don't Have an Account ? <p className="signup" onClick={callSignUp}>{"SignUp"}</p></label>
      </div>
    </div>  
  );
}

export default Login;
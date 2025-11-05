import React, { useState } from "react";
import "./login.css";
import { assets } from "../../assets/assets.js";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  return (
    <div className="login-container">
      <img src={assets.logo} alt="" />
      <div className="login-form-container">
        <h2>{state}</h2>
        <form className="login-form">
          {state === "Sign Up" && (
            <div className="login-form-input-container">
              <img src={assets.person_icon} alt="person icon" />
              <input type="text" placeholder="Username" />
            </div>
          )}
          <div className="login-form-input-container">
            <img src={assets.mail_icon} alt="mail icon" />
            <input type="email" placeholder="Email" />
          </div>
          <div className="login-form-input-container">
            <img src={assets.lock_icon} alt="lock icon" />
            <input type="password" placeholder="Password" />
          </div>
          <button type="submit">{state}</button>
        </form>
        <p className="login-form-toggle">
          {state === "Sign Up"
            ? "Already have an account? "
            : "Don't have an account? " }
          <span
            onClick={() =>
              setState(state === "Sign Up" ? "Log In" : "Sign Up")
            }
          >
            {state === "Sign Up" ? "Log In" : "Sign Up"}
          </span>
          
        </p>
      </div>
    </div>
  );
};

export default Login;

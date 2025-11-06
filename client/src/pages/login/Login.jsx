import React, { use, useState } from "react";
import "./login.css";
import { assets } from "../../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-container">
      <img src={assets.logo} alt="" onClick={()=>navigate('/')}/>
      <div className="login-form-container">
        <h2>{state}</h2>
        <p>
          {" "}
          {state === "Sign Up"
            ? "Create an new account"
            : "Login to your account"}
        </p>
        <form className="login-form">
          {state === "Sign Up" && (
            <div className="login-form-input-container">
              <img src={assets.person_icon} alt="person icon" />
              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}
          <div className="login-form-input-container">
            <img src={assets.mail_icon} alt="mail icon" />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="login-form-input-container">
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <p className="forgotpassword" onClick={()=>navigate('/reset-password')}>Forgot password?</p>
          <button type="submit">{state}</button>
        </form>
        <p className="login-form-toggle">
          {state === "Sign Up"
            ? "Already have an account? "
            : "Don't have an account? "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Log In" : "Sign Up")}
          >
            {state === "Sign Up" ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useRef, useContext } from "react";
import "./ResetPassword.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../../context/app.context";

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [loading,setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((val, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = val;
      }
    });
  };

  const onSubmitEmail = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await axios.post(`${backendUrl}/api/v1/users/send-reset-password-otp`,{email});
      if(data.success){
        setIsEmailSent(true)
        toast.success(data.message);
        console.log(data.message)
      }
      else {
        toast.error(data.message);
        console.log(data.message)
      }
      
    } catch (error) {
      toast.error(error.message);
      console.log(data.message)
    }
    finally{
      setLoading(false);
    }

  }

  const onSubmitOtp = async(e)=>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e=>e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);

  }

  const onSubmitNewPassword = async(e)=>{
    e.preventDefault();
    try {
      const {data} = await axios.post(`${backendUrl}/api/v1/users/reset-password`, {email,otp,newPassword});
      if(data.success){
        toast.success(data.message);
        navigate('/');
      }
      else toast.error(data.message)
      
    } catch (error) {
      toast.error(data.message)
    }
    finally{

    }
  }

  return (
    <div className="main-container">
      <img src={assets.logo} alt="" onClick={() => navigate("/")} />

      {/* email form */}
      {!isEmailSent && (
        <form className="email-form" onSubmit={onSubmitEmail}>
          <h1>Reset password</h1>
          <p>Please enter your registered email id</p>
          <div className="email-input">
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              placeholder="joe@gmail.com"
              className="email-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="email-btn btn">{loading ? "Sending..." : "Send OTP"}</button>
        </form>
      )}

      {/* otp form */}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className="otp-form">
          <h1>Reset Paswword Otp</h1>
          <p>Enter the 6-digit code sent to your email id.</p>
          <div className="otp-input" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="otp-btn btn">Submit</button>
        </form>
      )}

      {/*enter new password  */}

      {isOtpSubmitted && isEmailSent && (
        <form className="email-form" onSubmit={onSubmitNewPassword}>
          <h1>New password</h1>
          <p>Enter the new password below</p>
          <div className="email-input">
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              placeholder="password"
              className="email-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="password-btn btn">Submit</button>
        </form>
      )}
    </div>
  );
};

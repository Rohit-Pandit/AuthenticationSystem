import React, { useContext, useRef } from "react";
import { assets } from "../../assets/assets";
import "./EmailVerify.css";
import axios from "axios";
import AppContext from "../../context/app.context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, user, getUserData } = useContext(AppContext);

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

  const onSubmitHandler = async (e) => {
    
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      console.log("📩 Sending OTP verification request with:", otp);
      const { data } = await axios.post(
        `${backendUrl}/api/v1/users/verify-otp`,
        { otp },
        {withCredentials:true}
      );

      console.log("🟢 Response from backend:", data);

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else toast.error(data.message || "Verification failed");
    } catch (error) {
      console.error("❌ Error during verify OTP request:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="email-container">
      <img src={assets.logo} alt="" onClick={() => navigate("/")} />

      <div className="email-form-container">
        <form onSubmit={onSubmitHandler} className="email-form">
          <h1>Email verify Otp</h1>
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
          <button>Verify Email</button>
        </form>
      </div>
    </div>
  );
};
export default EmailVerify;

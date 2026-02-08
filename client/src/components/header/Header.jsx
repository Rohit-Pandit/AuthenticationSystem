import React, { useContext } from "react";
import { assets } from "../../assets/assets.js";
import "./Header.css";
import AppContext from "../../context/app.context.js";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <div className="header-container">
      <img src={assets.header_img} alt="header" className="robo" />
      <h1>
        Hey {user ? user.name : `Developer`}!
        <img src={assets.hand_wave} alt="hand wave" className="hand-wave" />
      </h1>
      <h2>Welcome to our Expense Tracker</h2>
      <p>
        Let’s get you up and running with smarter expense tracking in no time.
      </p>
      <button
        onClick={() => {
          if (isLoggedIn) {
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
        }}
      >
        {isLoggedIn ? "Go to Dashboard" : "login / Signup"}
      </button>
    </div>
  );
};

export default Header;

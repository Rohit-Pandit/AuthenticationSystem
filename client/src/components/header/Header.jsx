import React from 'react';
import {assets} from '../../assets/assets.js';
import './Header.css';

const Header = () => {
  return (
    <div className='header-container'>
        <img src={assets.header_img} alt="header" />
        <h1>
            Hey Developer
            <img src={assets.hand_wave} alt="hand wave" className='hand-wave'/>
        </h1>
        <h2>Welcome to our app</h2>
        <p>Lets start with a quick product tour and we will have you up and running in no time</p>
        <button>Get Started</button>
    </div>
  )
}

export default Header
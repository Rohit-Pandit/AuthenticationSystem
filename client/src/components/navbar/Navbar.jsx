import React from 'react';
import './Navbar.css';
import {assets} from '../../assets/assets.js';
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className='navbar-container'>
        <img src={assets.logo} alt="logo" />
        <button 
        className='navbar-container-btn'
        onClick={() => navigate('/login')}
        >
          Login
        </button>
    </div>
  )
}

export default Navbar
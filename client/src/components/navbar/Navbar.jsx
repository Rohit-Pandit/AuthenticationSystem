import React,{useContext} from 'react';
import './Navbar.css';
import {assets} from '../../assets/assets.js';
import {useNavigate} from 'react-router-dom';
import AppContext from '../../context/app.context.js';
import axios from 'axios';
import { toast } from 'react-toastify';


const Navbar = () => {
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedIn,user,setUser,} = useContext(AppContext);

  const sendVerificationOtp = async()=>{
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(`${backendUrl}/api/v1/users/send-otp`,{}, { withCredentials: true });

      if(data.success){
        navigate('/email-verify');
        toast.success(data.success)
      }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  const logout = async()=>{
    try {
      axios.defaults.withCredentials=true;
      const {data} = await axios.post(`${backendUrl}/api/v1/users/logout`);
      data.success && setIsLoggedIn(false);
      data.success && setUser('');
      navigate('/');
    } catch (error) {
      toast.error(error);
      
    }

  }

  return (
    <div className='navbar-container'>
        <img src={assets.logo} alt="logo" />
        {
           user?
               <div className='userLogo'>
                  {user.name[0].toUpperCase()}
                  <div className='dropdown'>
                    <ul>
                      {!user?.isVerified && <li onClick={sendVerificationOtp}>Verify email</li>}                      
                      <li onClick={logout}>Logout</li>
                    </ul>
                  </div>

                </div>
               :
              <button 
              className='navbar-container-btn'
              onClick={() => navigate('/login')}
              >
                Login
              </button>
        }
        
    </div>
  )
}

export default Navbar
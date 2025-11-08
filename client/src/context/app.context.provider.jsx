import axios from "axios";
import AppContext from "./app.context.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppContextProvider = ({ children }) => {

  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const getAuthState = async()=>{
    try {
      const {data} = await axios.get(
        `${backendUrl}/api/v1/users/is-authenticated`,
        { withCredentials: true }
      );
      console.log("Auth state",data);
      if(data.success){
        setIsLoggedIn(true);
        getUserData();
      }
      else{
        setIsLoggedIn(false);
      }
    } catch (error) {
       console.error("Auth check failed:", error.response?.data || error.message);
       setIsLoggedIn(false);
    }
  }

  const getUserData = async()=>{
    try {
      const {data}  = await axios.get(
        `${backendUrl}/api/v1/profile/data`,
        {withCredentials: true}
      );
      console.log(`user data:`,data);
      data.success ? setUser(data.userData) : toast.error(data.message);
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(()=>{
    getAuthState();
  },[])

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    getUserData
  };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;
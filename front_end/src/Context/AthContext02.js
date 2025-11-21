import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8000/auth/google"; 
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:8000/logout', { withCredentials: true });
      setUser(null); 
      localStorage.removeItem('accessToken'); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('accessToken'); 

        if (token) {
          localStorage.setItem('accessToken', token); 

  
          const response = await axios.get('http://localhost:8000/login/success', {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
            withCredentials: true,
          });

          if (response.data.user) {
            setUser(response.data.user); 
          }
        } else {
          console.log("No access token in URL");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); 

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

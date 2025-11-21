import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles
import Cookies from 'js-cookie';
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(JSON.parse(localStorage.getItem('isauth')) ||false);

    const [loading, setloading] = useState(false)
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [isloading, setisLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        const tokenFromCookie = Cookies.get("authToken");
  
        if (tokenFromCookie) {
          localStorage.setItem("authToken", tokenFromCookie);
          localStorage.setItem("isauth", true);
          setIsAuthenticated(true);
        } else {
          const token = localStorage.getItem("authToken");
          if (token) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
  
        
      setTimeout(() => {
        setisLoading(false);
      }, 3000);
      };
  
      checkAuth();
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);


    const login = (token) => {
        setIsAuthenticated(true)
        localStorage.setItem('authToken', token);
        localStorage.setItem('isauth', true);
       
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
          }
        
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
          }
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, fullname }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to sign up')
              
            }


            await handleLogin(e);
            setUsername("");
            setPassword("");
            setEmail("");
            setFullname("");
            navigate("/main");

        } catch (error) {
            console.error("ERROR:", error.message);
            setError(error.message);
            toast.error(`Error: ${error.message}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault(); 
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
          }
        
     
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
          }
        try {
            setloading(true)
            const response = await fetch('http://localhost:8000/api/v1/users/login', {
                method: 'POST',
                credentials: 'include',  // 'include' sends cookies with cross-site requests
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            Cookies.remove('authToken');
            const data = await response.json();
            console.log("data", data);
            const token = data.data.accessToken;
            login(token);
            setEmail("");
            setPassword("");
            setloading(false);
            navigate("/main");
            
            toast.success(`Welcome, ${data.data.userCreated.username}!`, {
                duration: 4000,         
                position: "top-center",

            });

        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.message);
            setloading(false);

            toast.error("Oops,Something went wrong", {
                duration: 4000,         
                position: "top-right",
            })
        }
    };

    

    const loginWithGoogle = () => {
        window.open("http://localhost:8000/auth/google", "_self");
    };

    const logout = () => {

        localStorage.removeItem("authToken");
        localStorage.removeItem("isauth");
        Cookies.remove("authToken");

        setIsAuthenticated(false);
        setEmail("");
        setPassword("");
        setUsername("");
        setFullname("");
        navigate("/login");
    
        toast.success("Successfully logged out!", {
            duration: 3000,
            position: "top-center",
        });
    };
    

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            handleSignup,
            setIsAuthenticated,
            setEmail,
            setUsername,
            setPassword,
            fullname,
            email,
            password,
            username,
            setFullname,
            handleLogin,
            error,
            loading,isloading,
            setloading,
            loginWithGoogle,logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

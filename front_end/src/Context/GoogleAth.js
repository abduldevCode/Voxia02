import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext02 = createContext();

export const AuthProvider02 = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const loginWithGoogle = async () => {
        window.open("http://localhost:8000/auth/google", "_self");
    };

    const logout = async () => {
        await axios.get('http://localhost:8000/logout', '_self', { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext02.Provider value={{ user, setUser, loginWithGoogle, logout }}>
            {children}
        </AuthContext02.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext02);
};

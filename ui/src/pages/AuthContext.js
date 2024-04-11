// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Retrieve isLoggedIn value from localStorage on component mount
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);

  const toggleLogin = () => {
    const newIsLoggedIn = !isLoggedIn;
    setIsLoggedIn(newIsLoggedIn);
    // Store isLoggedIn value in localStorage
    localStorage.setItem('isLoggedIn', JSON.stringify(newIsLoggedIn));
  };

  const toggleLogout = () => {
    setIsLoggedIn(false);
    // Store isLoggedIn value in localStorage
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin, toggleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
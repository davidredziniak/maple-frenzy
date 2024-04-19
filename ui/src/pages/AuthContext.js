// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username,setUsername] = useState('');

  useEffect(() => {
    // Retrieve isLoggedIn value from localStorage on component mount
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
    if (storedUsername !== null) {
      setUsername(storedUsername);
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

  const changeUser = (usrname) => {
    setUsername(usrname);
    localStorage.setItem('username', usrname);
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, username, toggleLogin, toggleLogout, changeUser }}>
      {children}
    </AuthContext.Provider>
  );
};
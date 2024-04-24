// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tradeCount,setTradeCount] = useState('');
  const [reputation,setReputation] = useState('');
  const [createdAt,setCreatedAt] = useState('');
  const [lastLoggedIn,setLastLoggedIn] = useState('');

  useEffect(() => {
    // Retrieve isLoggedIn value from localStorage on component mount
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
    if (storedUsername !== null) {
      setUsername(storedUsername);
    }
    // If theefresh token, try to get access token
  }, []);

  const toggleLogin = () => {
    const newIsLoggedIn = !isLoggedIn;
    setIsLoggedIn(newIsLoggedIn);
    // Store isLoggedIn value in localStorage
    localStorage.setItem("isLoggedIn", JSON.stringify(newIsLoggedIn));
  };

  const toggleLogout = () => {
    setIsLoggedIn(false);
    // Store isLoggedIn value in localStorage
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
  };

  const updateUserId = (id) => {
    setUserId(id);
    localStorage.setItem("userId", id);
  };

  const updateUsername = (usrname) => {
    setUsername(usrname);
    localStorage.setItem("username", usrname);
  };

  const updateAccessToken = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  const updateRefreshToken = (token) => {
    setRefreshToken(token);
    localStorage.setItem("refreshToken", token);
  };

  const updateTradeCount = (newTradeCount) => {
    setTradeCount(newTradeCount);
    localStorage.setItem("tradeCount", newTradeCount);
  };

  const updateReputation = (newReputation) => {
    setReputation(newReputation);
    localStorage.setItem("reputation", newReputation);
  };

  const updateCreatedAt = (newCreatedAt) => {
    setCreatedAt(newCreatedAt);
    localStorage.setItem("createdAt", newCreatedAt);
  };

  const updateLLI = (newLastLoggedIn) => {
    setLastLoggedIn(newLastLoggedIn);
    localStorage.setItem("lastLoggedIn", newLastLoggedIn);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        userId,
        accessToken,
        refreshToken,
        tradeCount,
        reputation,
        createdAt,
        lastLoggedIn,
        toggleLogin,
        toggleLogout,
        updateUsername,
        updateUserId,
        updateAccessToken,
        updateRefreshToken,
        updateTradeCount,
        updateReputation,
        updateCreatedAt,
        updateLLI
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

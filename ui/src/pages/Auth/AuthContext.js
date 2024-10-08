// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [tradeCount, setTradeCount] = useState("");
  const [reputation, setReputation] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [lastLoggedIn, setLastLoggedIn] = useState("");
  const [inGameName, setInGameName] = useState("");

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedTradeCount = localStorage.getItem("tradeCount");
    const storedReputation = localStorage.getItem("reputation");
    const storedCreatedAt = localStorage.getItem("createdAt");
    const storedLastLoggedIn = localStorage.getItem("lastLoggedIn");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (storedIsLoggedIn !== null) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }

    if (storedUsername !== null) {
      setUsername(storedUsername);
    }
    
    if (accessToken !== ""){
      setAccessToken(accessToken);
    }

    if (refreshToken !== ""){
      setRefreshToken(refreshToken);
    }

    if (userId !== ""){
      setUserId(userId);
    }

    // Set other values if they exist in localStorage
    if (storedTradeCount !== null) {
      setTradeCount(storedTradeCount);
    }

    if (storedReputation !== null) {
      setReputation(storedReputation);
    }

    if (storedCreatedAt !== null) {
      setCreatedAt(storedCreatedAt);
    }

    if (storedLastLoggedIn !== null) {
      setLastLoggedIn(storedLastLoggedIn);
    }
    // If there is a refresh token, try to get access token
  },[accessToken, refreshToken, userId, username, isLoggedIn]);

  const handleLogout = () => {
    toggleLogout();
    updateUsername("");
    updateUserId("");
    updateAccessToken("");
    updateRefreshToken("");
    updateTradeCount("");
    updateReputation("");
    updateCreatedAt("");
    updateLLI("");
    updateInGameName("");
  };

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

  const updateInGameName = (newInGameName) => {
    setInGameName(newInGameName);
    localStorage.setItem("inGameName", newInGameName);
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
        inGameName,
        toggleLogin,
        toggleLogout,
        updateUsername,
        updateUserId,
        updateAccessToken,
        updateRefreshToken,
        updateTradeCount,
        updateReputation,
        updateCreatedAt,
        updateInGameName,
        updateLLI,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

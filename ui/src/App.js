import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Landing from './pages/Landing.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import Dashboard from './pages/Dashboard.js';
import CreateTrade from './pages/CreateTrade.js';
import JoinFrenzy from './pages/JoinFrenzy.js';
import FrenzyWaiting from './pages/WaitingPage.js';
import {useContext, useEffect, useState} from 'react'
import FindFrenzy from './pages/FindFrenzy.js';
import { BrowserRouter as Router, HashRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, AuthContext } from './pages/AuthContext.js';

function App() {
  return (
    <HashRouter>
    <ChakraProvider>
      <AuthProvider>
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/Register' element={<Register/>} />
            <Route exact path='/Login' element={<Login/>} />
            <Route exact path='/Profile' element={<Profile/>} />
            <Route path='/Dashboard/:tradeId' element={<Dashboard/>} />
            <Route exact path='/Frenzy' element={<FindFrenzy />}/>
            <Route exact path='/JoinFrenzy' element={<JoinFrenzy />}/>
            <Route exact path='/Waiting' element={<FrenzyWaiting />}/>
            <Route exact path='/CreateFrenzy' element={<CreateTrade />}/>
          </Routes>
      </AuthProvider>
    </ChakraProvider>
    </HashRouter>

  );
}

export default App;

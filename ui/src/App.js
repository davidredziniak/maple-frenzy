import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Landing from './pages/Landing.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import Redirect from './pages/Redirect.js';
import Dashboard from './pages/Dashboard.js';
import {useState} from 'react'
import FindFrenzy from './pages/FindFrenzy.js';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './pages/AuthContext.js';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/Register' element={<Register/>} />
            <Route path='/Login' element={<Login/>} />
            <Route path='/Profile' element={<Profile/>} />
            <Route path='/Dashboard' element={<Dashboard/>} />
            <Route path='/Frenzy' element={<FindFrenzy />}/>
            <Route path='/Redirect' element={<Redirect />}/>
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;

import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Landing from './pages/Landing.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import Redirect from './pages/Redirect.js';
import {useState} from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const testF = () => {
    setIsLoggedIn(true);
  }
  const getF = () => {
    console.log(isLoggedIn)
    //return isLoggedIn;
  }
  return (
    <ChakraProvider>
      <Router>
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/Register' element={<Register/>} />
            <Route path='/Login' element={<Login/>} />
            <Route path='/Profile' element={<Profile/>} />
            <Route path='/Redirect' element={<Redirect testF={testF} getF={getF}/>}/>
          </Routes>
      </Router>

    </ChakraProvider>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Landing from './pages/Landing.js';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <ChakraProvider>
      <Router>
          <Routes>
            <Route path='/' element={<Landing/>} />
            <Route path='/Register' element={<Register/>} />
            <Route path='/Register' element={<Login/>} />
          </Routes>
      </Router>

    </ChakraProvider>
  );
}

export default App;

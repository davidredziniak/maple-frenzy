import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <ChakraProvider>
      <Router>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/Register' element={<Register/>} />
          </Routes>
      </Router>

    </ChakraProvider>
  );
}

export default App;

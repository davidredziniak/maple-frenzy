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
            <Route path='./Login.js' component={Login} />
            <Route path='./Register.js' component={Register} />
          </Routes>
      </Router>
      <Login/>
    </ChakraProvider>
  );
}

export default App;

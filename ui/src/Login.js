import {stackLeft, stackRight, loginBox, loginText, signInButton } from './config'
import {
  ChakraProvider,
  Stack,
  Image,
  Flex,
  Text,
  Heading,
  Input,
  Button,
  Box
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
  } from '@chakra-ui/react'
import maplefrenzylogo from './maplefrenzylogo.svg'
import {useState} from 'react'
import {Link} from 'react-router-dom'
async function registerUser(username, password) {
  return fetch('POST/api/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body:{ username, password },
  })
    .then(response => response.json())
}


const Backdrop = () =>{
    return(
      <Flex color="white" h="100vh">
        <Stack {...stackLeft}>
          <Heading pt="25vh">Maple Frenzy</Heading>
          <Image src={maplefrenzylogo} />
        </Stack>
        <Stack {...stackRight} />
        <RegisterForm/>
      </Flex>
    )
  }

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { username: username, password: password },
      });
  
      if (response.ok) {
        alert('Signup successful!');
        // Reset form fields
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } 
      else {
        let error;
        try {
          error = await response.json();
        } catch (jsonError) {
          error = { message: jsonError };
        }
        alert(`Signup failed: ${error.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <FormControl>
      <div>
        <FormLabel htmlFor="username">Username:</FormLabel>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel htmlFor="password">Password:</FormLabel>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button mt='30px' {...signInButton} type="submit" onClick={handleSubmit}>Sign In</Button>
    </FormControl>
  );
};
  

const RegisterForm = () => {
    return(
      <Stack {...loginBox}>
        <Text {...loginText}>User Login</Text>
        <RegistrationForm/>
        <Box><Text pt='50px' >Don't Have an account? Register <Link to='/registration'>Here!</Link></Text></Box>
      </Stack>
    )
  }

const Login = () => {
    return (
      <>
        <ChakraProvider>
          <Backdrop>
            <RegisterForm/>
          </Backdrop>
        </ChakraProvider>
      </>
    )
  }
  
export default Login
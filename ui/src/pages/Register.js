import {stackLeft, stackRight, loginBox, loginText, signInButton } from '../config'
import {
  ChakraProvider,
  Stack,
  Image,
  Flex,
  Text,
  Heading,
  Input,
  Button,
  Box,
  Spacer
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
  } from '@chakra-ui/react'
import login from '../img/login.png'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const Backdrop = () =>{
    return(
      <Flex color="#353935" h="100vh">
        <Stack {...stackLeft}>
        <Heading pt="5vh"><Link to='/'>Register Now!</Link></Heading>
        <Link to='/'><Image src={login} /></Link>
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
      const response = await fetch('https://maple-frenzy.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
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
        <FormLabel color="white" htmlFor="username">Username:</FormLabel>
        <Input bg='white'
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt="20px" color="white" htmlFor="password">Password:</FormLabel>
        <Input bg='white'
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt="20px" color="white" htmlFor="confirm-password">Confirm Password:</FormLabel>
        <Input bg='white'
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button mt='30px' bg="#93d7bf" color="#353935" {...signInButton} type="submit" onClick={handleSubmit}>Sign Up</Button>
    </FormControl>
  );
};
  

const RegisterForm = () => {
    return(
      <Stack {...loginBox}>
        <Text color="white" {...loginText}>User Registration</Text>
        <RegistrationForm/>
        <Flex mt='20px' >
          <Box color ='gray' mr='5px'><Text color="white">Already Registered?</Text></Box>
          <Box pr='370px'color='blue'><Link to='/login'><Text color="#93d7bf"> Login Here!</Text></Link></Box>
        </Flex>
      </Stack>
    )
  }

const Register = () => {
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
  
export default Register

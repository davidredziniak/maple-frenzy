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
      <Flex color="#353935" h="20vh">
        <Stack {...stackLeft}>
        <Heading pt="5vh"><Link to='/'>Welcome Back!</Link></Heading>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://maple-frenzy.onrender.com/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      });
  
      if (response.ok) {
        alert('Signin successful!');
        // Reset form fields
        setUsername('');
        setPassword('');
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
      <Button mt='30px' bg="#93d7bf" color="#353935" {...signInButton} type="submit" onClick={handleSubmit}>Sign In</Button>
    </FormControl>
  );
};
  

const RegisterForm = () => {
    return(
      <Stack {...loginBox}>
        <Text color="white" {...loginText}>User Login</Text>
        <RegistrationForm/>
        <Flex mt='20px'>
          <Box color ='gray' mr='5px'><Text color="white" >Dont have an Account?</Text></Box>
          <Box pr='329px'><Link to='/Register'><Text color="#93d7bf"> Register Here!</Text></Link></Box>
        </Flex>
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
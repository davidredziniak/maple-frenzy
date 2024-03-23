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

async function registerUser(username, password) {
  return fetch('https://maple-frenzy.onrender.com/api/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: { username: (username), password: (password) }
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
    const [errors, setErrors] = useState({});
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const errors = {};

      if (Object.keys(errors).length === 0) {
        // Submit form data
        console.log('Form submitted!', { username, password });
        registerUser(username, password)
/*
          .then(data => {
            console.log('Registration successful:', data);
            // Handle successful registration response
          })
          .catch(error => {
            console.error('Registration failed:', error);
            // Handle registration error
          });
*/
      } else {
        console.log('errors');
        setErrors(errors);
      }
    };
  
    return (
      <FormControl>
        <div>
          <FormLabel htmlFor="username">Username:</FormLabel>
          <Input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div>
          <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
           {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <Button mt='20px' {...signInButton} type="submit" onClick={handleSubmit}>Register</Button>
      </FormControl>
    );
  };
  

const RegisterForm = () => {
    return(
      <Stack {...loginBox}>
        <Text {...loginText}>User Registration</Text>
        <RegistrationForm/>
        <Box><Text>Already registered? Login Here!</Text></Box>
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
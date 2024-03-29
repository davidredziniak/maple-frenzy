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
  Box
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
  } from '@chakra-ui/react'
import maplefrenzylogo from '../maplefrenzylogo.svg'
import {useState} from 'react'
import {Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

const Backdrop = () =>{
    return(
      <Flex color="white" h="100vh">
        <Stack {...stackLeft}>
        <Heading pt="25vh"><Link to='/'>Maple Frenzy</Link></Heading>
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

  const errNotification = () => toast.error("There was an error signing in.");
  const sucNotification = () => toast("Succesfully signed in!");
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://maple-frenzy.onrender.com/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password}),
      })
      .then( response => {
      if (response.ok) {
        //const navigate = useNavigate();
        alert('Signin successful!');
        sucNotification();
        // Reset form fields
        setUsername('');
        setPassword('');
      } 
      else {
        let error;
        try {
          error = response.json();
        } catch (jsonError) {
          error = { message: jsonError };
        }
        alert(`Signup failed: ${error.message}`);
      }
    })
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
      errNotification();
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
        <Box color ='gray'><Text >Dont have an Account?  </Text></Box>
        <Box pr='329px'color='blue'><Link to='/Register'><Text>Register Here!</Text></Link></Box>
        
      </Stack>
    )
  }

const Login = () => {
    return (
      <>
        <ChakraProvider>
          <Toaster 
            position="top-center"
            reverseOrder={false}
          />
          <Backdrop>
            <RegisterForm/>
          </Backdrop>
        </ChakraProvider>
      </>
    )
  }
  
export default Login
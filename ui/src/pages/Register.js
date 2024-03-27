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
import maplefrenzylogo from '../maplefrenzylogo.svg'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'

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
  const [confirmPassword, setConfirmPassword] = useState('');

  const errNotification = () => toast.error("There was an error signing up.");
  const sucNotification = () => toast("Succesfully signed up!");
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    try {
      const api = axios.create({headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://maple-frenzy-site.onrender.com/', 'access-control-allow-headers' : 'x-access-token, Origin, Content-Type, Accept' }});
      const data = {'username': username, 'password': password};
      // const response = await axios.create('https://maple-frenzy.onrender.com/api/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: {
      //     "username": username,
      //     "password": password
      //   },
      // });
      await api.post('https://maple-frenzy.onrender.com/api/signup', data)
      .then(response => console.log(response));
    //   if (response.ok) {
    //     alert('Signup successful!');
    //     // Reset form fields
    //     setUsername('');
    //     setPassword('');
    //     setConfirmPassword('');
    //   } 
    //   else {
    //     let error;
    //     try {
    //       error = await response.json();
    //     } catch (jsonError) {
    //       error = { message: jsonError };
    //     }
    //     alert(`Signup failed: ${error.message}`);
    //   }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
      errNotification();
    }
  }

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
      <div>
        <FormLabel htmlFor="confirm-password">Confirm Password:</FormLabel>
        <Input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button mt='30px' {...signInButton} type="submit" onClick={handleSubmit}>Sign Up</Button>
    </FormControl>
  );
};
  

const RegisterForm = () => {
    return(
      <Stack {...loginBox}>
        <Text {...loginText}>User Registration</Text>
        <RegistrationForm/>    
        <Box color ='gray'><Text >Already have an Account?  </Text></Box>
        <Box pr='329px'color='blue'><Link to='/Login'><Text>Login Here!</Text></Link></Box>
      </Stack>
    )
  }

const Register = () => {
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
  
export default Register

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
import login from '../img/login.png'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

const dummyResponse = {
  ok: true,
  status: 200,
  json: {
    accessToken: '93144b288eb1fdccbe46d6fc0f241a51766ecd3d',
    message: 'Successfully signed up.',
  }
};
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
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const errNotification = () => toast.error("There was an error signing up.");
  const sucNotification = () => toast("Succesfully signed up!");

  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate('/Login');
  };
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
        body: JSON.stringify({ email,username, password}),
      })
      //const response = Promise.resolve(dummyResponse)
      .then(response => {
      if (response.ok) {
        alert('Signup successful! \n Please verify your email address!');
        sucNotification();
        // Reset form fields
        setUsername('');
        setPassword('');
        setEmail('');
        setConfirmPassword('');
        navigateLogin();
      } 
      else {
        let error;
        try {
          error =  response.json();
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
        <FormLabel color="white" htmlFor="email">Email:</FormLabel>
        <Input bg='white'
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt = "20px" color="white" htmlFor="username">Username:</FormLabel>
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
        <Box mt='20px' color ='white'><Text >Already have an Account?  </Text></Box>
        <Box pr='329px'color='blue'><Link to='/Login'><Text color="#93d7bf">Login Here!</Text></Link></Box>
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
  //   try {
  //     const api = axios.create({headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://maple-frenzy-site.onrender.com/', 'access-control-allow-headers' : 'x-access-token, Origin, Content-Type, Accept' }});
  //     const data = {'username': username, 'password': password};
  //     // const response = await axios.create('https://maple-frenzy.onrender.com/api/signup', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: {
  //     //     "username": username,
  //     //     "password": password
  //     //   },
  //     // });
  //     await api.post('https://maple-frenzy.onrender.com/api/signup', data)
  //     .then(response => console.log(response));
  //   //   if (response.ok) {
  //   //     alert('Signup successful!');
  //   //     // Reset form fields
  //   //     setUsername('');
  //   //     setPassword('');
  //   //     setConfirmPassword('');
  //   //   } 
  //   //   else {
  //   //     let error;
  //   //     try {
  //   //       error = await response.json();
  //   //     } catch (jsonError) {
  //   //       error = { message: jsonError };
  //   //     }
  //   //     alert(`Signup failed: ${error.message}`);
  //   //   }
  //   } catch (error) {
  //     alert(`An error occurred: ${error.message}`);
  //     errNotification();
  //   }
  // }
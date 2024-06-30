import {
  stackLeft,
  stackRight,
  loginBox,
  loginText,
  signInButton,
} from "../../config";
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
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import login from "../../img/login.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Backdrop = () => {
  return (
    <Flex color="#353935" h="100vh">
      <Stack {...stackLeft}>
        <Heading pt="5vh">
          <Link to="/">Register Now!</Link>
        </Heading>
        <Link to="/">
          <Image src={login} />
        </Link>
      </Stack>
      <Stack {...stackRight} />
      <RegisterForm />
    </Flex>
  );
};

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      errNotification("Passwords do not match!");
      return;
    }

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const response = await fetch(
      "http://localhost:3001/api/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      sucNotification(
        "Signup successful! A verification link was sent to your email."
      );
      // Reset form fields
      setUsername("");
      setPassword("");
      setEmail("");
      setConfirmPassword("");
      await delay(1000);
      navigateLogin();
    } else {
      errNotification(data.message);
    }
  };

  return (
    <FormControl>
      <div>
        <FormLabel color="white" htmlFor="email">
          Email:
        </FormLabel>
        <Input
          bg="white"
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt="20px" color="white" htmlFor="username">
          Username:
        </FormLabel>
        <Input
          bg="white"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt="20px" color="white" htmlFor="password">
          Password:
        </FormLabel>
        <Input
          bg="white"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <FormLabel mt="20px" color="white" htmlFor="confirm-password">
          Confirm Password:
        </FormLabel>
        <Input
          bg="white"
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button
        mt="30px"
        bg="#93d7bf"
        color="#353935"
        {...signInButton}
        type="submit"
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </FormControl>
  );
};

const RegisterForm = () => {
  return (
    <Stack {...loginBox}>
      <Text color="white" {...loginText}>
        User Registration
      </Text>
      <RegistrationForm />
      <Box mt="20px" color="white">
        <Text>Already have an Account? </Text>
      </Box>
      <Box pr="329px" color="blue">
        <Link to="/login">
          <Text color="#93d7bf">Login Here!</Text>
        </Link>
      </Box>
    </Stack>
  );
};

const Register = () => {
  return (
    <>
      <ChakraProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Backdrop>
          <RegisterForm />
        </Backdrop>
      </ChakraProvider>
    </>
  );
};

export default Register;

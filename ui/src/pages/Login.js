import {
  stackLeft,
  stackRight,
  loginBox,
  loginText,
  signInButton,
} from "../config";
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
import login from "../img/login.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Backdrop = () => {
  return (
    <Flex color="#353935" h="20vh">
      <Stack {...stackLeft}>
        <Heading pt="5vh">
          <Link to="/">Welcome Back!</Link>
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  const navigate = useNavigate();
  const navigateRedirect = () => {
    navigate("/");
  };

  const {
    toggleLogin,
    updateUsername,
    updateUserId,
    updateAccessToken,
    updateRefreshToken,
  } = useContext(AuthContext);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://maple-frenzy.onrender.com/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.status === 200) {
      sucNotification("Sign in successful. Redirecting...");
      // Reset form fields
      setUsername("");
      setPassword("");
      toggleLogin();
      updateUsername(username);
      updateUserId(data.userId);
      updateAccessToken(data.accessToken);
      updateRefreshToken(data.refreshToken);
      await delay(1000);
      navigateRedirect();
    } else {
      errNotification(data.message);
    }
  };

  return (
    <FormControl>
      <div>
        <FormLabel color="white" htmlFor="username">
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
      <Button
        mt="30px"
        bg="#93d7bf"
        color="#353935"
        {...signInButton}
        type="submit"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </FormControl>
  );
};

const RegisterForm = () => {
  return (
    <Stack {...loginBox}>
      <Text color="white" {...loginText}>
        User Login
      </Text>
      <RegistrationForm />
      <Box mt="20px" color="white">
        <Text>Dont have an Account? </Text>
      </Box>
      <Box pr="329px" color="blue">
        <Link to="/Register">
          <Text color="#93d7bf">Register Here!</Text>
        </Link>
      </Box>
    </Stack>
  );
};

const Login = () => {
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

export default Login;
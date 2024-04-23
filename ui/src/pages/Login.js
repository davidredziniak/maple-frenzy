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
import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

//dummy json
const dummyResponse = {
  ok: true,
  status: 200,
  json: {
    accessToken: "93144b288eb1fdccbe46d6fc0f241a51766ecd3d",
    message: "Successfully signed in.",
  },
};

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

  const errNotification = () => toast.error("There was an error signing in.");
  const sucNotification = () => toast("Succesfully signed in!");

  const navigate = useNavigate();
  const navigateRedirect = () => {
    navigate("/Redirect");
  };

  const { changeUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://maple-frenzy.com/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    if(response.status === 200){
      alert("Signin successful!\nRedirecting to Home page");
      sucNotification();
      // Reset form fields
      setUsername("");
      setPassword("");
      navigateRedirect();
      changeUser(username);
    }
    else{
      alert(data.message);
      errNotification();
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

import {
  stackLeft,
  stackRight,
  loginBox,
  loginText,
  signInButton,
} from "../config";
import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Link,
  Stack,
  FormControl,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "./AuthContext";

const JoinFrenzyBox = () => {
  const { accessToken, userId, updateInGameName } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleJoin = async (e) => {
    e.preventDefault();

    const response = await fetch("https://maple-frenzy.onrender.com/api/trade/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
      body: JSON.stringify({
        tradeId: location.state.id,
        duration: JSON.parse(location.state.duration),
        gameName: location.state.buyerGameName,
        channel: JSON.parse(location.state.channel),
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      sucNotification(data.message);
      await delay(1000);
      navigate("/Waiting", { state: {...location.state, position: data.queuePos}});
      // Reset form fields
    } else {
      errNotification(data.error);
    }
  };

  const handleGoBack = async (e) => {
    navigate("/Frenzy");
  };

  return (
    <Box flex="1" w="30%" bg="black.100" py={30} ml={500} rounded="md">
      <Stack>
        <Text pl=".5vw" fontFamily="verdana" fontSize="30px">
          Join Frenzy
        </Text>
        <Box
          pl=".5vw"
          w="60%"
          p={10}
          boxShadow="base"
          bg="#353935"
          rounded="md"
        >
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Seller {location.state.seller} is available to join!
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Price: {location.state.price}
          </Text>
          <Button
            mt="30px"
            bg="#93d7bf"
            color="#353935"
            {...signInButton}
            type="submit"
            onClick={handleGoBack}
          >
            Go Back
          </Button>
          <Button
            mt="30px"
            bg="#93d7bf"
            color="#353935"
            {...signInButton}
            type="submit"
            onClick={handleJoin}
          >
            Join
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

const JoinFrenzy = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Box>
      <Navbar />
      <Box bg="#F8EEDE" pb={100}>
        <Toaster position="top-center" reverseOrder={false} />
        {isLoggedIn && (
          <Flex h="100vh">
            <JoinFrenzyBox />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default JoinFrenzy;

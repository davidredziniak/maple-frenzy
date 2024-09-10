import { apiURL, defaultButton } from "../../config";
import React, { useContext } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Stack,
  Center,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "../Auth/AuthContext";

const JoinFrenzyBox = () => {
  const { accessToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const getLocalTime = (time) => {
    var date = new Date(time).toLocaleString();
    return date.toString();
  };

  const getHoursFromNow = (time) => {
    var now = new Date();
    var tradeTime = new Date(time);
    var diffMs = tradeTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    var diffHours = Math.floor(diffMins / 60);
    return diffHours;
  };

  const getMinutesFromNow = (time) => {
    var now = new Date();
    var tradeTime = new Date(time);
    var diffMs = tradeTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    diffMins = diffMins - Math.floor(diffMins / 60) * 60;
    return diffMins;
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    const response = await fetch(apiURL + "/trade/join", {
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
      navigate("/view/" + location.state.id);
    } else {
      errNotification(data.error);
    }
  };
  
  return (
    <Box flex="1" py="5vh" ml="70vh" rounded="md">
      <Stack>
        <Box
          pl=".5vw"
          w="40%"
          p={10}
          boxShadow="base"
          bg="#353935"
          rounded="md"
        >
          <Center>
            <Text
              as={"b"}
              fontSize="45px"
              textShadow="1px 2px #000000"
              color="white"
            >
              Join Frenzy
            </Text>
          </Center>
          <Stack spacing={4}>
            <Text color="white" mt=".5vh" fontFamily="verdana" fontSize="xl">
              {location.state.seller} is available to join!
            </Text>

            <Box>
              <Text fontSize="md" color="white" fontFamily="verdana">
                <strong>Start Time:</strong>{" "}
                {getLocalTime(location.state.start)} (
                {getHoursFromNow(location.state.start)} hour(s){" "}
                {getMinutesFromNow(location.state.start)} min(s) from now)
              </Text>
              <Text fontSize="md" mt=".5vh" color="white" fontFamily="verdana">
                <strong>End Time:</strong> {getLocalTime(location.state.end)} (
                {getHoursFromNow(location.state.end)} hour(s){" "}
                {getMinutesFromNow(location.state.end)} min(s) from now)
              </Text>
            </Box>

            <Badge colorScheme="green" fontSize="lg">
              Price: {location.state.price} Meso
            </Badge>
          </Stack>
          <Flex minWidth="max-content" alignItems="center" gap="2">
            <Button
              mt="30px"
              {...defaultButton}
              type="submit"
              onClick={() => navigate("/find")}
            >
              Go Back
            </Button>
            <Spacer />
            <Button
              mt="30px"
              {...defaultButton}
              type="submit"
              onClick={handleJoin}
            >
              Join
            </Button>
          </Flex>
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
      <Toaster position="top-center" reverseOrder={false} />
      {isLoggedIn ? (
        <Flex h="100vh" bg="#F8EEDE">
          <JoinFrenzyBox />
        </Flex>
      ) : (
        <Flex h="100vh" bg="#F8EEDE">
          <Text>You must be logged in to view this page.</Text>
        </Flex>
      )}
    </Box>
  );
};

export default JoinFrenzy;

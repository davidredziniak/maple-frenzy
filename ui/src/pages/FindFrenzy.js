import { signInButton } from "../config";
import React, { useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "./AuthContext";

const FrenzyBox = () => {
  const [inGameUsername, setInGameUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [duration, setDuration] = useState("");

  const { accessToken, userId, updateInGameName } = useContext(AuthContext);

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const setDurationValue = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setDuration(value);
  };

  const setChannelValue = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setChannel(value);
  };

  const navigate = useNavigate();
  const navigateRedirect = (sellerName, tradeId, price, start, end) => {
    navigate("/JoinFrenzy", {
      state: {
        seller: sellerName,
        id: tradeId,
        price: price,
        start: start,
        end: end,
        buyerGameName: inGameUsername,
        duration,
        channel,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(inGameUsername == ""){
      errNotification("You must enter your in game username.");
      return;
    }

    if(channel == ""){
      errNotification("You must enter a channel number.");
      return;
    }

    if(duration == ""){
      errNotification("You must enter a time of duration in hours.");
      return;
    }
    const response = await fetch(
      "https://maple-frenzy.onrender.com/api/trade/searchmarket",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ channel, duration }),
      }
    );
    const data = await response.json();
    if (response.status === 200) {
      sucNotification(data.message);
      await delay(1000);
      updateInGameName(inGameUsername);
      navigateRedirect(
        data.seller.username,
        data.trade.id,
        data.trade.price,
        data.trade.timeStart,
        data.trade.timeEnd
      );
    } else {
      errNotification(data.message);
    }
  };

  return (
    <Box flex="1" w="30%" bg="black.100" py={30} ml={500} rounded="md">
      <Stack>
        <Text pl=".5vw" fontFamily="verdana" fontSize="30px">
          Find Frenzy
        </Text>
        <Box
          pl=".5vw"
          w="60%"
          p={10}
          boxShadow="base"
          bg="#353935"
          rounded="md"
        >
          <FormControl>
            <div>
              <FormLabel color="white" htmlFor="inGameUsername">
                In Game Username:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="inGameUsername"
                value={inGameUsername}
                onChange={(e) => setInGameUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="channel">
                Channel:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="channel"
                value={channel}
                onChange={setChannelValue}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="duration">
                Duration:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="duration"
                value={duration}
                onChange={setDurationValue}
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
              Search
            </Button>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
};

const FindFrenzy = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Box>
      <Navbar />
      <Box bg="#F8EEDE" pb={100}>
        <Toaster position="top-center" reverseOrder={false} />
        {isLoggedIn && (
          <Flex h="100vh">
            <FrenzyBox />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default FindFrenzy;

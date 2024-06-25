import { signInButton } from "../../config";
import React, { useState, useContext } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Stack,
  FormControl,
  Input,
  FormLabel,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../Auth/AuthContext";
import Footer from "../Footer";

const FrenzyBox = () => {
  const [inGameUsername, setInGameUsername] = useState("");
  const [channel, setChannel] = useState("");
  const [duration, setDuration] = useState("");

  const {
    accessToken,
    refreshToken,
    updateAccessToken,
    updateRefreshToken,
    userId,
    handleLogout,
    updateInGameName,
  } = useContext(AuthContext);

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
    navigate("/join", {
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

  async function trySearch() {
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
    return { data, response };
  }

  async function tryRefreshToken() {
    const response = await fetch("https://maple-frenzy.onrender.com/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: parseInt(userId), refreshToken }),
    });
    const data = await response.json();
    return { data, response };
  }

  const handleSuccess = async (data) => {
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
  };

  const handleFailure = async () => {
    errNotification("You have been signed out... Please sign in again.");
    await delay(1000);
    handleLogout();
    navigate("/login");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (inGameUsername === "") {
      errNotification("You must enter your in game username.");
      return;
    }

    if (channel === "") {
      errNotification("You must enter a channel number.");
      return;
    }

    if (duration === "") {
      errNotification("You must enter a time of duration in hours.");
      return;
    }

    const fetchData = await trySearch();
    // Successful fetch
    if (fetchData.data) {
      if (!fetchData.response.status) {
        errNotification("Server had an unexpected response.");
      } else {
        const responseStatus = fetchData.response.status;
        const data = fetchData.data;

        // Successful
        if (responseStatus === 200) {
          handleSuccess(data);
        } else if (responseStatus === 403) {
          if (data.error === "Access token was denied.") {
            // Try API refresh if token exists
            if (refreshToken != "" && userId != "") {
              const refreshData = await tryRefreshToken();
              if (refreshData.data) {
                const refreshResponseStatus = refreshData.response.status;
                const refreshResponse = refreshData.data;
                if (refreshResponseStatus === 200) {
                  // Update access and refresh tokens
                  updateAccessToken(refreshResponse.accessToken);
                  updateRefreshToken(refreshResponse.refreshToken);
                  errNotification("Please try again. Refreshed Tokens.");
                  // Try fetch again
                } else {
                  // Refresh token is invalid so logout
                  handleFailure();
                }
              }
            } else {
              handleFailure();
            }
          } else {
            handleFailure();
          }
        } else {
          errNotification(data.message);
        }
      }
    } else {
      errNotification("An error occured connecting to the server.");
    }
  }

  return (
    <Box flex="1" py="5vh" ml="50vh" rounded="md">
      <Stack>
        <Box w="60%" p={10} boxShadow="base" bg="#353935" rounded="md">
          <Center>
            <Text
              as={"b"}
              fontSize="45px"
              textShadow="1px 2px #000000"
              color="white"
            >
              Find Frenzy
            </Text>
          </Center>
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
              onClick={(e) => {
                handleSubmit(e);
              }}
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
  return (
    <Box>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Flex h="100vh" bg="#F8EEDE">
        <FrenzyBox />
      </Flex>
      <Footer />
    </Box>
  );
};

export default FindFrenzy;

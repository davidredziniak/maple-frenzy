import {
  stackLeft,
  stackRight,
  loginBox,
  loginText,
  signInButton,
} from "../config";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "./AuthContext";

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

const CreateTradeBox = () => {
  const [inGameName, setInGameName] = useState("");
  const [price, setPrice] = useState(0);
  const [timeStart, setTimeStart] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [endTimeInput, setEndTimeInput] = useState(1);
  const [channelsInput, setChannelsInput] = useState("");
  const [buyerLimit, setBuyerLimit] = useState(0);
  const { accessToken, refreshToken, updateAccessToken, updateRefreshToken } =
    useContext(AuthContext);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  const navigate = useNavigate();
  const navigateRedirect = (tradeId) => {
    navigate("/dashboard/" + tradeId, {
      state: {
        accessToken: accessToken,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://maple-frenzy.onrender.com/api/trade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
        body: JSON.stringify({
          inGameName,
          price,
          timeStart,
          timeEnd,
          channels: channelsInput.split(",").map((str) => parseInt(str)),
          buyerLimit,
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        sucNotification(data.message);
        await delay(1000);
        navigateRedirect(data.id);
        // Reset form fields
      } else {
        errNotification(data.error);
      }
    };
  
    if (timeStart && timeEnd) {
      fetchData();
    }
  }, [timeStart, timeEnd]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const startDate = new Date(startTimeInput);
    const currentDate = new Date();
  
    if (currentDate >= startDate) {
      errNotification("You cannot choose dates earlier than the date it currently is");
      return;
    } else {
      const startTimeIso = startDate.toISOString();
      setTimeStart(startTimeIso);
  
      const endDate = new Date(startDate.getTime() + endTimeInput * 60 * 60 * 1000);
      const endTimeIso = endDate.toISOString();
      setTimeEnd(endTimeIso);
    }
  };

  return (
    <Box flex="1" w="70%" bg="black.100" py={30} ml={500} rounded="md">
      <Stack>
        <Text pl=".5vw" fontFamily="verdana" fontSize="30px">
          Create Trade
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
              <FormLabel color="white" htmlFor="inGameName">
                In Game Name:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="inGameName"
                value={inGameName}
                onChange={(e) => setInGameName(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="price">
                Price:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="startTimeInput">
                Start Time:
              </FormLabel>
              <Input
                bg="white"
                type="datetime-local"
                id="startTimeInput"
                value={startTimeInput}
                onChange={(e) => setStartTimeInput(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="endTimeInput">
                Desired Duration In Hours:
              </FormLabel>
              <NumberInput
                isDisabled={!startTimeInput}
                min={1}
                bg="white"
                id="endTimeInput"
                value={endTimeInput}
                onChange={(e) => setEndTimeInput(e)}
                required
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="channelsInput">
                Channels:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                size="lg"
                id="channelsInput"
                value={channelsInput}
                onChange={(e) => setChannelsInput(e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel mt="20px" color="white" htmlFor="buyerLimit">
                Buyer Limit:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="buyerLimit"
                value={buyerLimit}
                onChange={(e) => setBuyerLimit(parseInt(e.target.value) || 0)}
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
              Create Trade
            </Button>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
};

const CreateTrade = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Box bg="#F8EEDE">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <CreateTradeBox />
    </Box>
  );
};

export default CreateTrade;

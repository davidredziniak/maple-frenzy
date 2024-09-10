import { apiURL, signInButton } from "../../config";
import React, { useState, useContext } from "react";
import {
  Center,
  Text,
  Box,
  Button,
  Stack,
  Input,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "../Auth/AuthContext";

import Footer from "../Footer";

const CreateTradeBox = () => {
  const [inGameName, setInGameName] = useState("");
  const [price, setPrice] = useState(0);
  const [timeStart, setTimeStart] = useState("");
  const [startTimeInput, setStartTimeInput] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [endTimeInput, setEndTimeInput] = useState(1);
  const [channelsInput, setChannelsInput] = useState("");
  const [buyerLimit, setBuyerLimit] = useState(0);
  const { accessToken } = useContext(AuthContext);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);

  // Redirect after a trade is successfully created
  const navigate = useNavigate();
  const navigateRedirect = (tradeId) => {
    navigate("/dashboard/" + tradeId, {
      state: {
        accessToken: accessToken,
      },
    });
  };

  const handleChannelChange = (inputValue) => {
    const newValue = inputValue.replace(/[^0-9,]/, "");
    setChannelsInput(newValue);
    // rest
  };

  async function tryCreateTrade() {
    const response = await fetch(apiURL + "/trade/create", {
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
    } else {
      errNotification(data.error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if startTime is empty
    if (startTimeInput === "") {
      errNotification("You must choose a start date and time.");
      return;
    }

    const startDate = new Date(startTimeInput);
    const currentDate = new Date();

    // Verify the start and end dates are valid
    if (currentDate >= startDate) {
      errNotification("You cannot choose dates earlier than the current date.");
      return;
    } else {
      const startTimeIso = startDate.toISOString();
      setTimeStart(startTimeIso);

      const endDate = new Date(
        startDate.getTime() + endTimeInput * 60 * 60 * 1000
      );
      const endTimeIso = endDate.toISOString();
      setTimeEnd(endTimeIso);
    }

    // Verify buyer limit is valid
    if (buyerLimit === 0) {
      errNotification("Your buyer limit has to be greater than 0.");
      return;
    }

    // Verify price is valid
    if (price === 0) {
      errNotification("Your price for the frenzy has to be greater than 0.");
      return;
    }

    // Verify channels string is valid
    if (!/^\d+(,\d+)*$/.test(channelsInput)) {
      errNotification("The channels are not valid. Ex. 3,4,10,15");
      return;
    }

    if (timeStart && timeEnd) tryCreateTrade();
  };

  return (
    <Box flex="1" bg="black.100" py="5vh" ml="50vh" rounded="md">
      <Stack>
        <Box w="60%" p={10} boxShadow="base" bg="#353935" rounded="md">
          <Center>
            <Text
              textShadow="1px 2px #000000"
              color="white"
              fontSize="45px"
              as={"b"}
            >
              Create Trade
            </Text>
          </Center>
          <form onSubmit={handleSubmit}>
            <div>
              <FormLabel color="white" htmlFor="inGameName">
                In Game Username:
              </FormLabel>
              <Input
                bg="white"
                type="text"
                id="inGameName"
                placeholder="Your in game username, so buyers can find you"
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
                placeholder="Comma seperated channel list, ex: 1,3,4,10"
                value={channelsInput}
                onChange={(e) => handleChannelChange(e.target.value)}
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
            <Flex minWidth="max-content" alignItems="center" gap="2">
              <Spacer />
              <Button
                mt="30px"
                bg="#93d7bf"
                w="12vh"
                color="#353935"
                {...signInButton}
                type="submit"
              >
                Create
              </Button>
            </Flex>
          </form>
        </Box>
      </Stack>
    </Box>
  );
};

const CreateTrade = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Box>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {isLoggedIn ? (
        <Flex h="100vh" bg="#F8EEDE">
          <CreateTradeBox />
        </Flex>
      ) : (
        <Flex h="100vh" bg="#F8EEDE">
          <Text>You must be logged in to view this page.</Text>
        </Flex>
      )}
      <Footer />
    </Box>
  );
};

export default CreateTrade;

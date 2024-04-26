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
  } from "@chakra-ui/react";
  import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
  import Navbar from "./Navbar";
  import toast, { Toaster } from "react-hot-toast";
  
  import { AuthContext } from "./AuthContext";
  
  import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
  
  const CreateTradeBox = () => {
    const [price, setPrice] = useState(0);
    const [timeStart, setTimeStart] = useState('');
    const [startTimeInput, setStartTimeInput] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [endTimeInput, setEndTimeInput] = useState('');
    const [channelsInput, setChannelsInput] = useState('');
    const [buyerLimit, setBuyerLimit] = useState(0);
    const [minuteFlag,setMinuteFlag] = useState(false);
  
    const {
      accessToken,
      refreshToken,
      updateAccessToken,
      updateRefreshToken,
    } = useContext(AuthContext);
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const errNotification = (message) => toast.error(message);
    const sucNotification = (message) => toast.success(message);
  
    const navigate = useNavigate();
    const navigateRedirect = (tradeId) => {
      navigate("/Dashboard/" + tradeId, {
        state: {
          accessToken: accessToken,
        },
      });
    };

    const handleStartTimeChange = (event) => {
      const time = event.target.value;
      console.log(time);
      setStartTimeInput(time);
      if(time.length>=16) setMinuteFlag(true);
      if(minuteFlag){
          setMinuteFlag(false)
          const currentDate = new Date();
          const newDate = new Date(time);

          if(currentDate >= newDate){
              errNotification('You cannot choose dates earlier than the date it currently is');
          }
          else{
              const isoDateTimeString = new Date(time).toISOString();
              setTimeStart(isoDateTimeString);
          }
      }
    };

    const handleEndTimeChange = (event) => {
        const time = event.target.value;
        console.log(time);
        setEndTimeInput(time);
        if(time.length>=16) setMinuteFlag(true);
        if(minuteFlag) {
        setMinuteFlag(false);
        const selectedStartDate = new Date(startTimeInput);
        const selectedEndDate = new Date(time)

        if(selectedStartDate >= selectedEndDate){
            errNotification('You cannot choose dates earlier than the start date');
        }
        else{
            const isoDateString = new Date(time).toISOString();
            setTimeEnd(isoDateString);
        }}
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      //setChannels(channelsInput.split(',').map(str => parseInt(str)));
      const response = await fetch("https://maple-frenzy.onrender.com/api/trade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
        body: JSON.stringify({ price, timeStart, timeEnd, channels: channelsInput.split(',').map(str => parseInt(str)), buyerLimit }),
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
                <FormLabel color="white" htmlFor="price">
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
                  onChange={handleStartTimeChange}
                  required
                />
              </div>
              <div>
                <FormLabel mt="20px" color="white" htmlFor="endTimeInput">
                  End Time:
                </FormLabel>
                <Input
                  bg="white"
                  type="datetime-local" 
                  id="endTimeInput"
                  value={endTimeInput}
                  onChange={handleEndTimeChange}
                  required
                />
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
    const {isLoggedIn} = useContext(AuthContext);
    return (
        <Box>
            <Navbar />
            <Toaster position="top-center" reverseOrder={false} />
            <CreateTradeBox />   
        </Box>
    );
  };
  
  export default CreateTrade;
  
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
  import { Link as RouterLink } from "react-router-dom";
  import Navbar from "./Navbar";
  import toast, { Toaster } from "react-hot-toast";
  
  import { AuthContext } from "./AuthContext";
  
  import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
  
  const CreateTradeBox = () => {
    const [price, setPrice] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [isoStartTime, setIsoStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isoEndTime, setIsoEndTime] = useState('');
    const [channels, setChannels] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]);
    const [buyerLimit, setBuyerLimit] = useState(0);
  
    const { accessToken, userId } = useContext(AuthContext);
  
    const errNotification = (message) => toast.error(message);
    const sucNotification = (message) => toast.success(message);
  
    const handleStartTimeChange = (event) => {
        const time = event.target.value;
        setStartTime(time);

        const currentDate = new Date();
        const newDate = new Date(time);
        if(currentDate >= newDate){
            errNotification('You cannot choose dates earlier than the date it currently is');
            const currentDateTimeString = currentDate.toISOString().slice(0, 16);
            event.target.value = currentDateTimeString;
            setStartTime(currentDateTimeString);
            setIsoStartTime(currentDate.toISOString());
        }
        else{
            const isoDateTimeString = new Date(time).toISOString();
            setIsoStartTime(isoDateTimeString);
        }
    };

    const handleEndTimeChange = (event) => {
        const time = event.target.value;
        setEndTime(time)

        const selectedStartDate = new Date(startTime);
        const selectedEndDate = new Date(time)

        if(selectedStartDate >= selectedEndDate){
            errNotification('You cannot choose dates earlier than the start date');
            selectedStartDate.setMinutes(selectedStartDate.getMinutes()+10);
            const dateString = selectedStartDate.toISOString().slice(0,16);
            event.target.value = dateString;
            setEndTime(time);
        }
        else{
            const isoDateString = new Date(time).toISOString();
            setIsoEndTime(isoDateString);
        }
      };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const response = await fetch("https://maple-frenzy.onrender.com/api/trade/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({ price, isoStartTime, isoEndTime, channels, buyerLimit }),
      });
      const data = await response.json();
      if (response.status === 200) {
        sucNotification(data.message);
        // Reset form fields
      } else {
        errNotification(data.message);
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
                <p>price: {price}</p>
              </div>
              <div>
                <FormLabel mt="20px" color="white" htmlFor="startTime">
                  Start Time:
                </FormLabel>
                <Input
                  bg="white"
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  required
                />
                <p>Selected date and time: {startTime}</p>
                <p>Selected date and time in iso: {isoStartTime}</p>
              </div>
              <div>
                <FormLabel mt="20px" color="white" htmlFor="endTime">
                  End Time:
                </FormLabel>
                <Input
                  bg="white"
                  type="datetime-local" 
                  id="endTime"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  required
                />
                <p>Selected date and time: {endTime}</p>
                <p>Selected date and time in iso: {isoEndTime}</p>
              </div>
              <div>
                <FormLabel mt="20px" color="white" htmlFor="channels">
                  Channels:
                </FormLabel>
                <Input
                  bg="white"
                  type="text" 
                  size="lg"
                  id="channels"
                  value={channels}
                  onChange={(e) => setChannels(e.target.value)}
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
  
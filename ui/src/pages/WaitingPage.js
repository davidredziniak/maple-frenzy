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
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "./AuthContext";

import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

function WaitingPage(props) {
  const { isLoggedIn, username } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  let { tradeId } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [channel, setChannel] = useState("");
  const [position, setPosition] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [inGameName, setInGameName] = useState("");
  const [price, setPrice] = useState("");
  
  const { accessToken, refreshToken, updateAccessToken, updateRefreshToken } =
    useContext(AuthContext);

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
    var diffMs = (tradeTime - now);
    var diffMins = Math.round((diffMs) / 60000); // minutes
    var diffHours = Math.floor(diffMins/60);
    return diffHours;
  }

  const getMinutesFromNow = (time) => {
    var now = new Date();
    var tradeTime = new Date(time);
    var diffMs = (tradeTime - now);
    var diffMins = Math.round((diffMs) / 60000); // minutes
    diffMins = diffMins - Math.floor(diffMins/60)*60;
    return diffMins;
  }


  function configureState(data) {
    console.log(data);
    if(!data.error){
      setIsAuth(true);
      setSellerName(data.seller);
      setPrice(data.price);
      setTimeStart(data.timeStart);
      setTimeEnd(data.timeEnd);
      setChannel(data.channel);
      setPosition(data.pos);
      setInGameName(data.inGameName);
      setInProgress(data.inProgress);
    }
  }

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0){
      getTradeSlot(tradeId).then((data) => configureState(data));
    }
  }, [accessToken]);

  const getTradeSlot = (tradeId) => {
    return fetch("https://maple-frenzy.onrender.com/api/trade/viewslot/" + tradeId, {
      method: "GET",
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };


  const handleLeave = async (e) => {
    e.preventDefault();

    const response = await fetch("https://maple-frenzy.onrender.com/api/trade/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
      body: JSON.stringify({ tradeId: tradeId }),
    });
    const data = await response.json();
    if (response.status === 200) {
      sucNotification(data.message);
      await delay(1000);
      navigate("/find");
      // Reset form fields
    } else {
      errNotification(data.error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box bg="#F8EEDE" pb={100}>
        <Toaster position="top-center" reverseOrder={false} />
        {isLoggedIn && isAuth ? (
          <Flex h="100vh">
            <WaitingBox handleLeave={handleLeave} channel={channel} inProgress={inProgress} buyerName={inGameName} seller={sellerName} price={price} startTime={getLocalTime(timeStart)} startHours={getHoursFromNow(timeStart)} startMin={getMinutesFromNow(timeStart)} endTime={getLocalTime(timeEnd)} endHours={getHoursFromNow(timeEnd)} endMin={getMinutesFromNow(timeEnd)} pos={position} />
          </Flex>
        ) : <Text>You are not authorized to view this trade.</Text>}
      </Box>
    </Box>
  );
}

const WaitingBox = (props) => {
  return (
    <Box flex="1" w="30%" bg="black.100" py={30} ml={500} rounded="md">
      <Stack>
        <Text pl=".5vw" fontFamily="verdana" fontSize="30px">
          Hey {props.buyerName}. {props.inProgress ? <Text>{props.seller} has started!</Text> : <Text>{props.seller} is still getting ready..</Text>}
        </Text>
        <Box
          pl=".5vw"
          w="60%"
          p={10}
          boxShadow="base"
          bg="#353935"
          rounded="md"
        >
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="20px">
            You are position <b>{props.pos}</b> in queue.
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            In Game Name: {props.buyerName}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Channel: {props.channel}
          </Text>
          <br/>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Seller's username: {props.seller}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Price: {props.price}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            {!props.inProgress ? <Text>Start Time: {props.startTime} ({props.startHours} hour(s) {props.startMin} min(s) from now)</Text> : ''}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            End Time: {props.endTime} ({props.endHours} hour(s) {props.endMin} min(s) from now)
          </Text>

          <Button
            mt="30px"
            bg="#93d7bf"
            color="#353935"
            {...signInButton}
            type="submit"
            onClick={props.handleLeave}
          >
            Leave Frenzy
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default WaitingPage;

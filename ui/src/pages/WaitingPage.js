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
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  let { tradeId } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
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
    var date = new Date(time);
    return date.toString();
  };

  function configureState(data) {
    console.log(data);
    if(!data.error){
      setIsAuth(true);
      setSellerName(data.seller);
      setPrice(data.price);
      setTimeStart(data.timeStart);
      setTimeEnd(data.timeEnd);
      setPosition(data.pos);
      setInGameName(data.inGameName);
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
            <WaitingBox handleLeave={handleLeave} buyerName={inGameName} seller={sellerName} price={price} startTime={getLocalTime(timeStart)} endTime={getLocalTime(timeEnd)} pos={position} />
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
          Waiting Room
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
          <br/>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Seller's in game name: {props.seller}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Price: {props.price}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Start Time: {props.startTime}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            End Time: {props.endTime}
          </Text>
          <Text pl=".5vw" color="white" fontFamily="verdana" fontSize="15px">
            Your in game name: {props.buyerName}
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

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Spinner,
  Input,
  Text,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import CastCountdown from "./CastCountdown";
import { CopyIcon } from "@chakra-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Footer from "./Footer";
import { AuthContext } from "./AuthContext";
import { useLocation, useParams } from "react-router-dom";
import DurationCountdown from "./DurationCountdown";

function Dashboard(props) {
  let { tradeId } = useParams();

  const location = useLocation();

  const { accessToken, refreshToken, updateAccessToken, updateRefreshToken } =
    useContext(AuthContext);

  const [buyers, setBuyers] = useState([]);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [price, setPrice] = useState("");
  const [isCasting, setIsCasting] = useState(false);
  const [showReloadIcon, setShowReloadIcon] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const [formData, setFormData] = useState({
    price: "",
    timeStart: "",
    timeEnd: "",
    channels: "",
    buyerLimit: "",
  });

  const getLocalTime = (time) => {
    var date = new Date(time);
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

  const checkIfTimePassed = (minutes) => {
    if (minutes < 0){
      return true;
    }
    return false;
  }


  function configureState(data) {
    if (!data.error) {
      setIsAuth(true);
      setTimeStart(data.timeStart);
      setTimeEnd(data.timeEnd);
      setBuyers(data.slots);
      setPrice(data.price);
    }
  }

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
      getTradeSlots(tradeId).then((data) => configureState(data));
    }
  }, [accessToken, price]);

  const getTradeSlots = (tradeId) => {
    return fetch(
      "https://maple-frenzy.onrender.com/api/trade/data/" + tradeId + "?slots",
      {
        method: "GET",
        headers: {
          "x-access-token": accessToken,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCastedButtonClick = () => {
    setIsCasting(!isCasting);
    setShowReloadIcon(true);
    setTimeout(() => {
      setShowReloadIcon(false);
    }, 1000);
  };

  return (
    <Box>
      <Navbar />
      {accessToken && isAuth ? (
        <Box bg="#F8EEDE" p={4}>
          <Box h="80vh">
            <Box textAlign="center" mb={4}>
              <Box fontSize="3xl" fontWeight="bold" color="#353935" mb={2}>
                Seller Dashboard
              </Box>
              <Box p={4}>Start Time: {checkIfTimePassed(getMinutesFromNow(timeStart)) ? <Text>NOW</Text> : <Text>{getHoursFromNow(timeStart)} hour(s) {getMinutesFromNow(timeStart)} min</Text>}</Box>
              <Box p={4}>End Time: {checkIfTimePassed(getMinutesFromNow(timeEnd)) ? <Text>FINISHED</Text> : <Text>{getHoursFromNow(timeEnd)} hour(s) {getMinutesFromNow(timeEnd)} min</Text>}</Box>
              <Box p={4}>Price: {price}</Box>
            </Box>
            <Flex justify="center" mb={4}>
              <Button colorScheme="teal" bg="#353935">
                Delete Frenzy
              </Button>
            </Flex>
            <Box
              maxW="50%"
              mx="auto"
              mb="50px"
              borderWidth="1px"
              borderColor="#93d7bf"
              borderRadius="md"
              overflow="hidden"
            >
              <Table variant="simple">
                <Thead bg="#353935">
                  <Tr>
                    <Th color="white">In Game Name</Th>
                    <Th color="white">Channel</Th>
                    <Th color="white">Duration (hours)</Th>
                    <Th color="white">Recast Timer</Th>
                  </Tr>
                </Thead>
                <Tbody bg="#353935">
                  {buyers.map((buyer) => (
                    <Tr>
                      <Td>
                        <Flex alignItems="center">
                          {showReloadIcon && (
                            <Spinner color="teal" mr="10px" size="sm" />
                          )}
                          <CopyToClipboard text="Player 1">
                            <Button
                              colorScheme="teal"
                              size="sm"
                              leftIcon={<CopyIcon />}
                              aria-label="Copy to clipboard"
                              onClick={() => navigator.clipboard.writeText(buyer.inGameName)}
                            />
                          </CopyToClipboard>
                          <span style={{ marginLeft: "10px", color: "white" }}>
                            {buyer.inGameName}
                          </span>
                        </Flex>
                      </Td>
                      <Td color="white">{buyer.channel}</Td>
                      <DurationCountdown duration={buyer.duration * 3600} />
                      <CastCountdown />
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      ) : (
        <Text>You are not authorized to view this trade.</Text>
      )}
      <Footer />
    </Box>
  );
}

export default Dashboard;

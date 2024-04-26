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
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import CastCountdown from "./CastCountdown";
import { CopyIcon } from "@chakra-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Footer from "./Footer";
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";
import DurationCountdown from "./DurationCountdown";

function Dashboard(props) {
  const location = useLocation();

  const { accessToken, refreshToken, updateAccessToken, updateRefreshToken } =
    useContext(AuthContext);

  const [tradeId, setTradeId] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [price, setPrice] = useState("");
  const [isCasting, setIsCasting] = useState(false);
  const [showReloadIcon, setShowReloadIcon] = useState(false);

  const [formData, setFormData] = useState({
    price: "",
    timeStart: "",
    timeEnd: "",
    channels: "",
    buyerLimit: "",
  });

  function configureState(data) {
    setTradeId(data.id);
    setTimeStart(data.timeStart);
    setTimeEnd(data.timeEnd);
    setBuyers(data.slots);
    setPrice(data.price);
    console.log(buyers);
  }


  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0)
      getTradeSlots(location.state.id).then((data) => configureState(data));
  }, [accessToken, price]);

  const getTradeSlots = (tradeId) => {
    return fetch("https://maple-frenzy.onrender.com/api/trade/data/" + tradeId + "?slots", {
      method: "GET",
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
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
      {accessToken ? (
        <Box bg="#F8EEDE" p={4}>
          <Box h="80vh">
            <Box textAlign="center" mb={4}>
              <Box fontSize="3xl" fontWeight="bold" color="#353935" mb={2}>
                Seller Dashboard
              </Box>
              <Box mt={8} p={4}></Box>
            </Box>
            <Flex justify="center" mb={4}>
              <Button mr={2} colorScheme="teal" bg="#93d7bf">
                Start Service
              </Button>
              <Button
                mr={2}
                variant="outline"
                colorScheme="teal"
                borderColor="#93d7bf"
                color="#93d7bf"
                onClick={handleCastedButtonClick}
              >
                Casted
              </Button>
              <Button colorScheme="teal" bg="#353935">
                Stop Service
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
                            />
                          </CopyToClipboard>
                          <span style={{ marginLeft: "10px", color: "white" }}>
                            {buyer.inGameName}
                          </span>
                        </Flex>
                      </Td>
                      <Td color="white">{buyer.channel}</Td>
                      <DurationCountdown duration={buyer.duration*3600} />
                      <CastCountdown />
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Footer />
    </Box>
  );
}

export default Dashboard;

import React, { useState, useEffect, useContext } from "react";
import { apiURL } from "../../config";
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
  Text,
} from "@chakra-ui/react";
import Navbar from "../Navbar";
import CastCountdown from "./CastCountdown";
import { CopyIcon } from "@chakra-ui/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Footer from "../Footer";
import { AuthContext } from "../Auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import DurationCountdown from "./DurationCountdown";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  let { tradeId } = useParams();

  const navigate = useNavigate();
  const errNotification = (message) => toast.error(message);
  const sucNotification = (message) => toast.success(message);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const { accessToken } = useContext(AuthContext);

  const [inProgress, setInProgress] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [price, setPrice] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const getLocalTime = (time) => {
    var date = new Date(time).toLocaleString();
    return date.toString();
  };

  const getHoursFromNow = (time) => {
    var now = new Date();
    var tradeTime = new Date(time);
    var diffMs = tradeTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    var diffHours = Math.floor(diffMins / 60);
    return diffHours;
  };

  const getMinutesFromNow = (time) => {
    var now = new Date();
    var tradeTime = new Date(time);
    var diffMs = tradeTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    diffMins = diffMins - Math.floor(diffMins / 60) * 60;
    return diffMins;
  };

  const checkIfTimePassed = (minutes) => {
    if (minutes < 0) return true;
    return false;
  };

  const handleDeleteTrade = async () => {
    const response = await fetch(apiURL + "/trade/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
      body: JSON.stringify({
        tradeId: tradeId,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      sucNotification(data.message);
      await delay(1000);
      navigate("/trades");
    } else {
      errNotification(data.error);
    }
  };

  function configureState(data) {
    if (!data.error) {
      setIsAuth(true);
      setTimeStart(data.timeStart);
      setTimeEnd(data.timeEnd);
      setBuyers(data.slots);
      setPrice(data.price);
      setInProgress(data.inProgress);
    }
  }

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
      const getTradeSlots = (tradeId) => {
        return fetch(apiURL + "/trade/data/" + tradeId + "?slots", {
          method: "GET",
          headers: {
            "x-access-token": accessToken,
            "Content-Type": "application/json",
          },
        }).then((response) => response.json());
      };

      getTradeSlots(tradeId).then((data) => configureState(data));
    }
  }, [accessToken, tradeId, price]);



  return (
    <Box>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {accessToken && isAuth ? (
        <Flex h="100vh" bg="#F8EEDE">
          <Box flex="1" py="5vh" w="80vh" h="80vh">
            <Box textAlign="center" mb={4}>
              <Box fontSize="3xl" fontWeight="bold" color="#353935" mb={2}>
                Seller Dashboard
              </Box>
              <Box p={4}>
                {inProgress ? (
                  <Text>Trade is in progress.</Text>
                ) : (
                  <div>
                    <Text>
                      Start Time: {getLocalTime(timeStart)} (
                      {getHoursFromNow(timeStart)} hour(s){" "}
                      {getMinutesFromNow(timeStart)} min)
                    </Text>
                  </div>
                )}
              </Box>
              <Box p={4}>
                {checkIfTimePassed(getMinutesFromNow(timeEnd)) ||
                checkIfTimePassed(getHoursFromNow(timeEnd)) ? (
                  <Text>FINISHED</Text>
                ) : (
                  <Text>
                    End Time: {getLocalTime(timeEnd)} (
                    {getHoursFromNow(timeEnd)} hour(s){" "}
                    {getMinutesFromNow(timeEnd)} min)
                  </Text>
                )}
              </Box>
              <Box p={4}>Price: {price}</Box>
            </Box>
            <Flex justify="center" mb={4}>
              {!inProgress ? (
                <Button
                  onClick={() => handleDeleteTrade()}
                  colorScheme="teal"
                  bg="#353935"
                >
                  Delete Frenzy
                </Button>
              ) : (
                ""
              )}
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
                          <CopyToClipboard text="Player 1">
                            <Button
                              colorScheme="teal"
                              size="sm"
                              leftIcon={<CopyIcon />}
                              aria-label="Copy to clipboard"
                              onClick={() =>
                                navigator.clipboard.writeText(buyer.inGameName)
                              }
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
        </Flex>
      ) : (
        <Flex h="100vh" bg="#F8EEDE">
          <Box flex="1" py="5vh" w="80vh" h="80vh">
            <Text>You are not authorized to view this trade.</Text>
          </Box>
        </Flex>
      )}
      <Footer />
    </Box>
  );
}

export default Dashboard;

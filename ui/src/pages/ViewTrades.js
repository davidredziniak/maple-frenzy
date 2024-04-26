import {
  Text,
  Box,
  Button,
  Flex,
  Card,
  CardHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  CardBody,
  CardFooter,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import logo from "../maplefrenzylogo.svg";

function ViewTrades(props) {
  const { isLoggedIn, accessToken, username } = useContext(AuthContext);
  const navigate = useNavigate();
  const [joinedTrades, setJoinedTrades] = useState([]);
  const [createdTrades, setCreatedTrades] = useState([]);

  function configureState(data) {
    if (!data.error) {
      setJoinedTrades(data.joined);
      setCreatedTrades(data.created);
    }
  }

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
      getUserTrades().then((data) => configureState(data));
    }
  }, [accessToken]);

  function navigateToTrade(id){
    navigate('/view/' + id);
  }
  
  function navigateToDash(id){
    navigate('/dashboard/' + id);
  }

  const getUserTrades = () => {
    return fetch("https://maple-frenzy.onrender.com/api/usertrades", {
      method: "GET",
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  return (
    <Box>
      {/* Navigation Bar */}
      <Navbar />

      {/* Content Section */}
      <Flex h="100vh" textColor="white">
        <TradeBox navBuyer={navigateToTrade} navSeller={navigateToDash} joined={joinedTrades} created={createdTrades} username={username}/>
      </Flex>
    </Box>
  );
}

const TradeBox = (props) => {
  return (
    <Box
      pt="14vh"
      flex="1"
      bg="white"
      rounded="md"
      boxShadow="base"
      color={"black"}
    >
      <Center>
        <Stack>
          <Center>
            <Text fontSize="40px">{props.username}</Text>
          </Center>
          <Card>
            <Center>
              <Flex pt="5vh">
                <Text fontSize="20px">Trade Navigator</Text>
                <Spacer pl=".5vw" />
                <InfoOutlineIcon boxSize={5} />
              </Flex>
            </Center>
            <CardBody>
            <Text>Joined Trades</Text>{ props.joined.length >= 1 ? <Table variant="simple">
                <Thead bg="#353935">
                  <Tr>
                    <Th color="white">Trade ID</Th>
                    <Th color="white"></Th>
                  </Tr>
                </Thead>
                <Tbody bg="#353935">
                  {props.joined.map((trade) => (
                    <Tr>
                      <Td>
                        <Flex alignItems="center">
                          <span style={{ marginLeft: "10px", color: "white" }}>
                            {trade}
                          </span>
                        </Flex>
                      </Td>
                      <Td color="white"><Button onClick={() => props.navBuyer(trade)}>Go</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table> : '------'}
              <Text>Created Trades</Text>
                  { props.created.length >= 1 ? <Table variant="simple">
                <Thead bg="#353935">
                  <Tr>
                    <Th color="white">Trade ID</Th>
                    <Th color="white"></Th>
                  </Tr>
                </Thead>
                <Tbody bg="#353935">
                  {props.created.map((trade) => (
                    <Tr>
                      <Td>
                        <Flex alignItems="center">
                          <span style={{ marginLeft: "10px", color: "white" }}>
                            {trade}
                          </span>
                        </Flex>
                      </Td>
                      <Td color="white"><Button onClick={() => props.navSeller(trade)}>Go</Button></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table> : '------'}
            </CardBody>
          </Card>
        </Stack>
      </Center>
    </Box>
  );
};

export default ViewTrades;

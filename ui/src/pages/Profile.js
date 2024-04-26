import {
  Text,
  Box,
  Button,
  Flex,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import logo from "../maplefrenzylogo.svg";
import Footer from "./Footer";

function Profile(props) {
  const { accessToken, refreshToken, userId } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [reputation, setReputation] = useState("");
  const [tradeCount, setTradeCount] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [lastLoggedIn, setLastLoggedIn] = useState("");

  const getLocalTime = (time) => {
    var date = new Date(time).toLocaleString();
    return date.toString();
  };

  function configureState(data) {
    if (!data.error) {
      setUsername(data.username);
      setReputation(data.reputation);
      setTradeCount(data.tradeCount);
      setCreatedAt(getLocalTime(data.createdAt));
      setLastLoggedIn(getLocalTime(data.lastLoggedIn));
    }
  }

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
      getUserInfo(userId).then((data) => configureState(data));
    }
  }, [accessToken, userId]);

  const getUserInfo = async (userId) => {
    return fetch("https://maple-frenzy.onrender.com/api/user/" + userId, {
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
        <ProfileBox
          size="250px"
          username={username}
          reputation={reputation}
          tradeCount={tradeCount}
          createdAt={createdAt}
          lastLoggedIn={lastLoggedIn}
        />
      </Flex>
      <Footer />
    </Box>
  );
}

const ProfileBox = (props) => {
  return (
    <Box
      pt="14vh"
      flex="1"
      bg="#F8EEDE"
      rounded="md"
      boxShadow="base"
      color={"black"}
    >
      <Center>
        <Stack>
          <Center>
            <Text fontSize="40px">{props.username}</Text>
          </Center>
          <Card bg="#353935" color={"white"}>
            <Center>
              <Flex pt="5vh">
                <Text fontSize="20px">User Information</Text>
                <Spacer pl=".5vw" />
                <InfoOutlineIcon boxSize={5} />
              </Flex>
            </Center>
            <CardBody>
              <Flex>
                <Text>Trade Count:</Text>
                <Spacer />
                <Text>{props.tradeCount}</Text>
              </Flex>
              <Flex>
                <Text>Reputation:</Text>
                <Spacer />
                <Text>{props.reputation}</Text>
              </Flex>
              <Flex>
                <Text>Created At:</Text>
                <Spacer />
                <Text>{props.createdAt}</Text>
              </Flex>
              <Flex>
                <Text>Last Login:</Text>
                <Spacer />
                <Text>{props.lastLoggedIn}</Text>
              </Flex>
            </CardBody>
          </Card>
        </Stack>
      </Center>
    </Box>
  );
};

export default Profile;
// let tradeCount='0';
// let reputation='0';
// let createdAt='2024-04-24T00:22:47.112Z';
// let lastLoggedIn='2024-04-24T00:24:40.177Z';

import {
  Text,
  Box,
  Flex,
  VStack,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";
import Navbar from "../Navbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import Footer from "../Footer";

function Profile() {
  const { accessToken, userId } = useContext(AuthContext);

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
    <Navbar />
    <Flex h="100vh" bg="#F8EEDE">
    <ProfileBox
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
    <Box flex="1" py="5vh" rounded="md">
      <Stack>
        <Center>
          <Box w="40%" p={10} boxShadow="base" bg="#353935" rounded="md">
            <VStack
              bg="#353935"
              color={"white"}
              w="100%"
              align={"stretch"}
              spacing={10}
            >
              <Center>
                <Flex>
                  <Text
                    textShadow="1px 2px #000000"
                    color="white"
                    fontSize="45px"
                    as={"b"}
                  >
                    User Information
                  </Text>
                  <InfoOutlineIcon boxSize={10} ml="1vw" mt="1vh" />
                </Flex>
              </Center>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Username:</Text>
                <Spacer />
                <Text>{props.username}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Trade Count:</Text>
                <Spacer />
                <Text>{props.tradeCount}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Reputation:</Text>
                <Spacer />
                <Text>{props.reputation}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Created At:</Text>
                <Spacer />
                <Text>{props.createdAt}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Last Login:</Text>
                <Spacer />
                <Text>{props.lastLoggedIn}</Text>
              </Flex>
            </VStack>
          </Box>
        </Center>
      </Stack>
    </Box>
  );
};

export default Profile;

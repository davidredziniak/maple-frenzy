import { Text, Box, Button, Flex, Card, CardHeader, CardBody, CardFooter, Spacer, Center, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./Navbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import logo from "../maplefrenzylogo.svg";

const ProfileBox = () => {
  
  
  const { username, tradeCount, reputation, createdAt, lastLoggedIn } = useContext(AuthContext);
  // const { username } = useContext(AuthContext);
  // let tradeCount='0';
  // let reputation='0';
  // let createdAt='2024-04-24T00:22:47.112Z'; 
  // let lastLoggedIn='2024-04-24T00:24:40.177Z';
  return (
    <Box pt="10vh" flex="1" bg="white" rounded="md" boxShadow="base" color={"black"}>
      <Center>
      <Stack>
        <Center>
          <Text fontSize="40px">
            {username}
          </Text>
        </Center>
        <Card>
        <Center>
            <Flex pt="5vh">
              <Text fontSize="20px">
                User Information
              </Text>
              <Spacer pl=".5vw"/>
              <InfoOutlineIcon boxSize={5}/>
            </Flex>
        </Center>
          <CardBody>
            <Flex>
              <Text >
                Trade Count:
              </Text>
              <Spacer />
              <Text >
                {tradeCount}
              </Text>
            </Flex>
            <Flex>
              <Text>
                Reputation:
              </Text>
              <Spacer />
              <Text >
                {reputation}
              </Text>
            </Flex>
            <Flex>
              <Text>
                Created At:
              </Text>
              <Spacer />
              <Text >
                {createdAt}
              </Text>
            </Flex>
            <Flex>
            <Text>
              Last Log In:
            </Text>
            <Spacer />
            <Text >
              {lastLoggedIn}
            </Text>
          </Flex>
          </CardBody>
        </Card>
        </Stack>
      </Center>
      
    </Box>
  );
};

const Profile = () => {
  const { accessToken, userId, updateCreatedAt, updateLLI, updateReputation, updateTradeCount } = useContext(AuthContext);
  const getData = async() => {
    const response = await fetch(`https://maple-frenzy.onrender.com/api/user/${userId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "x-access-token": `${accessToken}`
    },
    });
    const data = await response.json();
    if (response.status === 200) {
    updateTradeCount(data.tradeCount);
    updateReputation(data.reputation);
    updateCreatedAt(new Date(data.createdAt).toUTCString());
    updateLLI(new Date(data.lastLoggedIn).toUTCString());
    }
  }
  useEffect(() => {
    getData();
  }, []); 
  return (
    <Box >
      {/* Navigation Bar */}
      <Navbar />

      {/* Content Section */}
      <Flex h="100vh"  textColor="white">
        
        <ProfileBox size="250px"/>
      </Flex>
    </Box>
  );
};

export default Profile;
  // let tradeCount='0';
  // let reputation='0';
  // let createdAt='2024-04-24T00:22:47.112Z'; 
  // let lastLoggedIn='2024-04-24T00:24:40.177Z';

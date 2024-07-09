import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../Navbar";
import ProfileBox from "./ProfileBox";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/AuthContext";
import Footer from "../Footer";
import { apiURL } from "../../config";

export default function Profile() {
  const { accessToken, userId } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [reputation, setReputation] = useState("");
  const [tradeCount, setTradeCount] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [lastLoggedIn, setLastLoggedIn] = useState("");

  // Get local time string
  const getLocalTime = (time) => {
    var date = new Date(time).toLocaleString();
    return date.toString();
  };

  // Fetch user info from the API
  const getUserInfo = async (userId) => {
    return fetch(apiURL + "/user/" + userId, {
      method: "GET",
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

  function configureState(data) {
    if (!data.error) {
      setUsername(data.username);
      setReputation(data.reputation);
      setTradeCount(data.tradeCount);
      setCreatedAt(getLocalTime(data.createdAt));
      setLastLoggedIn(getLocalTime(data.lastLoggedIn));
    }
  };

  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
      getUserInfo(userId).then((data) => configureState(data));
    }
  }, [accessToken, userId]);

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
};
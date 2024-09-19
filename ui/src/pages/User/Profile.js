import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../Navbar";
import ProfileBox from "./ProfileBox";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/AuthContext";
import Footer from "../Footer";
import { apiURL } from "../../config";
import { Toaster } from "react-hot-toast";

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
  
  useEffect(() => {
    if (accessToken !== null && accessToken.length !== 0) {
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

      const configureState = (data) => {
        if (!data.error) {
          setUsername(data.username);
          setReputation(data.reputation);
          setTradeCount(data.tradeCount);
          setCreatedAt(getLocalTime(data.createdAt));
          setLastLoggedIn(getLocalTime(data.lastLoggedIn));
        }
      };

      getUserInfo(userId).then((data) => configureState(data));
    }
  }, [accessToken, userId]);

  return (
    <Box>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
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

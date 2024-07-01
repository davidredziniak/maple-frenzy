import {
  Box,
  Flex,
} from "@chakra-ui/react";
import UserTradesList from "./UserTradesList";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/AuthContext";
import Footer from "../Footer";

export default function UserTrades() {
  const navigate = useNavigate();
  const { accessToken, username } = useContext(AuthContext);
  const [joinedTrades, setJoinedTrades] = useState([]);
  const [createdTrades, setCreatedTrades] = useState([]);

  // Given a trade ID, navigate to the trade (buyer dashboard)
  function navigateToTrade(id) {
    navigate("/view/" + id);
  }

  // Given a trade ID, navigate to the trade (seller dashboard)
  function navigateToDash(id) {
    navigate("/dashboard/" + id);
  }

  const getUserTrades = () => {
    return fetch("http://localhost:3001/api/usertrades", {
      method: "GET",
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
  };

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

  return (
    <Box>
      <Navbar />
      <Flex h="100vh">
        <UserTradesList
          navBuyer={navigateToTrade}
          navSeller={navigateToDash}
          joined={joinedTrades}
          created={createdTrades}
          username={username}
        />
      </Flex>
      <Footer />
    </Box>
  );
};
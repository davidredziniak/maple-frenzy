import React from "react";
import {
  Flex,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth/AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("/login");
  };
  const navigateProfile = () => {
    navigate("/profile");
  };
  const navigateFrenzy = () => {
    navigate("/find");
  };
  const navigateSell = () => {
    navigate("/create");
  };
  const navigateTrades = () => {
    navigate("/trades");
  };

  const { isLoggedIn, toggleLogout, username } = useContext(AuthContext);
  return (
    <Flex
      position="sticky"
      top="0"
      zIndex="999" // Adjust the z-index as needed
      justify="flex-end"
      alignItems="center"
      p={5}
      bg="#353935"
      color="white"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.7)"
    >
      <Link as={RouterLink} to="/" mr={6} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Home
      </Link>
      <Link as={RouterLink} to="/#about" mr={6} onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
        About Us
      </Link>
      <Link as={RouterLink} to="/#contact" mr={6} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
        Contact
      </Link>
      {isLoggedIn ? (
        <Menu>
          <MenuButton as={Button} bg="#93d7bf">
            {username}
          </MenuButton>
          <MenuList color="black">
            <MenuItem onClick={navigateFrenzy}>Find</MenuItem>
            <MenuItem onClick={navigateSell}>Create</MenuItem>
            <MenuItem onClick={navigateTrades}>View Trades</MenuItem>
            <MenuItem onClick={navigateProfile}>Profile</MenuItem>
            <MenuItem onClick={toggleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Link as={RouterLink} to="/login">
          <Button
            bg="#93d7bf"
            color="#353935"
            size="md"
            onClick={navigateLogin}
          >
            Login
          </Button>
        </Link>
      )}
    </Flex>
  );
};

export default Navbar;

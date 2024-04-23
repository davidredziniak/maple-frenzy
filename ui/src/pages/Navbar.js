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
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("/Login");
  };
  const navigateProfile = () => {
    navigate("/Profile");
  };
  const navigateFrenzy = () => {
    navigate("/Frenzy");
  };
  const navigateSell = () => {
    navigate("/Dashboard");
  };

  const { isLoggedIn, toggleLogout, username, userId, accessToken, refreshToken } = useContext(AuthContext);
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
      <Link as={RouterLink} to="/" mr={6}>
        Home
      </Link>
      <Link as={RouterLink} to="/about" mr={6}>
        About Us
      </Link>
      <Link as={RouterLink} to="/contact" mr={6}>
        Contact
      </Link>
      {isLoggedIn ? (
        <Menu>
          <MenuButton as={Button} bg="#93d7bf">
            {username}
          </MenuButton>
          <MenuList color="black">
            <MenuItem onClick={navigateFrenzy}>Find Frenzy</MenuItem>
            <MenuItem onClick={navigateSell}>Sell Frenzy</MenuItem>
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

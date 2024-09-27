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
  const { isLoggedIn, handleLogout, username } = useContext(AuthContext);
  
  // Clear auth context of any values, then navigate to login
  function logout(){
    handleLogout();
    navigate("/login");
  }

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
      <Link
        as={RouterLink}
        to="/"
        mr={6}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Home
      </Link>
      <Link as={RouterLink} to="/#about" mr={6}>
        About Us
      </Link>
      <Link as={RouterLink} to="/#contact" mr={6}>
        Contact
      </Link>
      {isLoggedIn ? (
        <Menu>
          <MenuButton as={Button} bg="#93d7bf">
            {username}
          </MenuButton>
          <MenuList color="black">
            <MenuItem onClick={() => navigate("/find")}>Find</MenuItem>
            <MenuItem onClick={() => navigate("/create")}>Create</MenuItem>
            <MenuItem onClick={() => navigate("/trades")}>View Trades</MenuItem>
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Link as={RouterLink} to="/login">
          <Button
            bg="#93d7bf"
            color="#353935"
            size="md"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Link>
      )}
    </Flex>
  );
};

export default Navbar;

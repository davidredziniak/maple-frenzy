import { Text, Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Hero from '../img/hero.png';

const Landing = ({isLoggedIn}) => {
  console.log("In landing page");
  console.log(isLoggedIn);
  return (
    <Box>
      {/* Navigation bar */}
      <Flex justify="flex-end" alignItems="center" p={5} bg="#353935" color="white">
          <Link as={RouterLink} to="/" mr={6}>Home</Link>
          <Link as={RouterLink} to="/about" mr={6}>About Us</Link>
          <Link as={RouterLink} to="/contact" mr={6}>Contact</Link>
          <Link as={RouterLink} to="/login" mr={4}>
            <Button bg="#93d7bf" color="#353935" size="md" onClick={() => console.log("Login clicked")}>Login</Button>
          </Link>
      </Flex>

        {/* Hero Section */}
        <Box bg="#F8EEDE" pb={100}>
          <img src={Hero} alt="Hero"/>
          <Box ml={8} mr={8} mt={8} p={8} bg="#353935" borderRadius="20" w="50%">
            <Text bg="#353935" fontSize={32} textShadow="1px 2px #000000" color="white" pt={4} pl={4}>With our platform, get right to business.</Text>
            <Link as={RouterLink} to="/register" mr={4}>
                <Button bg="#93d7bf" color="#353935" size="lg" mt={4} ml={8} mb={4} onClick={() => console.log("Get Started clicked")}>Get Started</Button>
            </Link>
          </Box>
        </Box>
    </Box>
  );
}

export default Landing;

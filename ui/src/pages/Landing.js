import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Hero from '../img/hero.png';

const Landing = () => {
  return (
    <Box>
      {/* Navigation bar */}
      <Flex justify="space-between" alignItems="center" p={4} bg="blue.500" color="white">
        <Box>
          <Link as={RouterLink} to="/">Home</Link>
          <Link as={RouterLink} to="/about">About Us</Link>
          <Link as={RouterLink} to="/contact">Contact</Link>
          <Link as={RouterLink} to="/login">Login</Link>
        </Box>
      </Flex>

      {/* Hero section */}
      <Box bg="gray.200" p={8}>
        {/* Add your hero image here */}
        <Box textAlign="center">
          <img src={Hero} alt="Hero Image" />
          <h1>Welcome to Maple Frenzy</h1>
          <p>You know why you're here. Waste no time, get to business.</p>
          <Button colorScheme="blue" size="lg" mt={4} onClick={() => console.log("Get Started clicked")}>Get Started</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;

import { Text, Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Hero from '../img/hero.png';

const Landing = () => {
  return (
    <Box bg="#f8eede">
      {/* Navigation bar */}
      <Flex justify="flex-end" alignItems="center" p={5} bg="#353935" color="white">
        <Box>
          <Link as={RouterLink} to="/" mr={4}>Home</Link>
          <Link as={RouterLink} to="/about" mr={4}>About Us</Link>
          <Link as={RouterLink} to="/contact" mr={4}>Contact</Link>
          <Link as={RouterLink} to="/login" mr={4}>Login</Link>
        </Box>
      </Flex>

        {/* Hero Section */}
        <Box>
          <img src={Hero} alt="Hero"/>
          <Box ml={8} mr={8} mt={8} bg="#353935" borderRadius="20" w="50%">
            <Text fontSize={32} textShadow="1px 2px #000000" color="white" pt={4} pl={4}>You know why you're here. Waste no time, get to business.</Text>
            <Button bg="#78A1BB" color="#353935" size="lg" mt={4} ml={8} mb={4} onClick={() => console.log("Get Started clicked")}>Get Started</Button>
          </Box>
        </Box>
    </Box>
  );
}

export default Landing;

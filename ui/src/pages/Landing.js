import { Text, Box, Button, Flex, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Hero from '../img/hero.png';
import Laves from '../img/landing-leaves.png';
import Navbar from './Navbar';
import Footer from './Footer';

const Landing = () => {
  return (
    <Box>
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Hero Section */}
      <Box id="hero" bg="#F8EEDE" pb={100}>
        <img src={Hero} alt="Hero" />
        <Box ml={8} mr={8} mt={8} p={8} bg="#353935" borderRadius="20" w="40%">
          <Text bg="#353935" fontSize={32} textShadow="1px 2px #000000" color="white" pt={4} pl={4}>With our platform, get right to business.</Text>
          <Link as={RouterLink} to="/register" mr={4}>
            <Button bg="#93d7bf" color="#353935" size="lg" mt={4} ml={8} mb={4} onClick={() => console.log("Get Started clicked")}>Get Started</Button>
          </Link>
        </Box>
      </Box>

      {/* About Us Section */}
      <Flex id="about" bg="#9999cc" justify="flex-end" pt={20} pb={100} borderBottom="4px solid #353935" borderTop="4px solid #353935">
        <Box ml={8} mr={8} mt={8} p={8} bg="#353935" borderRadius="20" w="50%" border="1px solid">
          <img src={Leaves} alt="Leaves!" />
          <Text bg="#353935" fontSize={32} textShadow="1px 2px #000000" color="white" pt={4} pl={4} textAlign="center">About Us</Text>
          <Text bg="#353935" fontSize={18} color="white" pt={2} pl={4} textAlign="center">
          We're a small group of seniors with a passion for both games and web development, fueled by a desire to give back to the MapleStory community. With the combined experience in various fields, including software engineering, design, and project management, we've come together to create a platform that not only serves the needs of players and sellers but also fosters a sense of community within the MapleStory ecosystem.
            <br></br><br></br>
            Our journey began with a shared love for the nostalgic charm of MapleStory and a vision to enhance the gaming experience for fellow enthusiasts. Through dedication, creativity, and collaboration, we aim to provide innovative solutions that cater to the diverse needs of MapleStory players and contribute to the growth and vibrancy of the community.
            <br></br><br></br>
            Consider this project a token of our apprecication!
          </Text>
        </Box>
      </Flex>

      {/* Contact Section */}
      <Flex id="contact" bg="#DCDCDC" justify="center" align="center" pt={20} pb={100} borderBottom="4px solid #353935">
        <Box ml={8} mr={8} mt={8} p={8} bg="#353935" borderRadius="20" w="50%" border="1px solid">
          <Text bg="#353935" fontSize={32} textShadow="1px 2px #000000" color="white" pt={4} pl={4} textAlign="center">Contact</Text>
          <Text bg="#353935" fontSize={18} color="white" pt={2} pl={4} textAlign="center">This project is heavily WIP, and as such is subject to change...often. For inquiries, please contact us at <span style={{ color: '#93d7bf' }}><Link href="mailto:maple.frenzy.mod@gmail.com">maple.frenzy.mod@gmail.com</Link></span>.</Text>
        </Box>
      </Flex>
      {/* Footer Section */}
      <Footer />
    </Box>
  );
}

export default Landing;

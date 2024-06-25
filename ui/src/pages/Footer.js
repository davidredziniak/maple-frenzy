import { Box, Text, Flex, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="#353935" style={{position: 'absolute', bottom: 0, width: '100%'}} p={8} >
      <Flex justify="space-between" alignItems="center">
        <Text color="white" fontSize="md">&copy; 2024 Maple Frenzy</Text>
        <Flex>
          <Link color="white" mr={4} href="#">Terms of Service</Link>
          <Link color="white" href="#">Privacy Policy</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;

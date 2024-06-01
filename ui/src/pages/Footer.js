import { Box, Text, Flex, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="#353935" p={8} color="white">
      <Flex justify="space-between" alignItems="center">
        <Text fontSize="md">&copy; 2024 Maple Frenzy</Text>
        <Flex>
          <Link mr={4} href="#">Terms of Service</Link>
          <Link href="#">Privacy Policy</Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;

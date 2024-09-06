import { Text, Box, Container, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <Box 
      bg="#F8EEDE" 
      minHeight="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
    >
      <Container 
        bg="white" 
        p={6} 
        borderRadius="md" 
        boxShadow="md" 
        textAlign="center"
      >
        <Heading as="h1" size="4xl" mb={4}>
          404
        </Heading>
        <Text fontSize="lg" mb={6}>
          Oops! The page you're looking for doesn't exist.
        </Text>
        <Link as={RouterLink} to="/" color="blue.500" fontSize="md">
          Go Back to Homepage
        </Link>
      </Container>
    </Box>
    );
  };

export default PageNotFound;
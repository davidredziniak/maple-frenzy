import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Spinner,
  Input,
} from '@chakra-ui/react';
import Navbar from "./Navbar";
import { CopyIcon } from '@chakra-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Footer from './Footer';
import { AuthContext } from "./AuthContext";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const { accessToken } = useContext(AuthContext);
  const [isCasting, setIsCasting] = useState(false);
  const [showReloadIcon, setShowReloadIcon] = useState(false);
  const [formData, setFormData] = useState({
    price: '',
    timeStart: '',
    timeEnd: '',
    channels: '',
    buyerLimit: '',
  });

  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Prepare the request body
    const requestBody = {
      ...formData,
    };

    try {
      const response = await fetch('https://maple-frenzy.onrender.com/api/trade/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken, // Replace with actual access token
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle success
        console.log('Trade created successfully!');
      } else {
        // Handle error
        console.error('Failed to create trade');
      }
    } catch (error) {
      console.error('Error creating trade:', error);
    }
  };

  const handleCastedButtonClick = () => {
    setIsCasting(!isCasting);
    setShowReloadIcon(true);
    setTimeout(() => {
      setShowReloadIcon(false);
    }, 1000);
  };

  return (
    <Box>
      <Navbar />
      <Box bg="#F8EEDE" p={4}>
        <Box>
          <Box textAlign="center" mb={4}>
            <Box fontSize="3xl" fontWeight="bold" color="#353935" mb={2}>
              Seller Dashboard
            </Box>
            <Box mt={8} p={4}>
        <Box bg="#353935" mx="auto" mb="50px" borderWidth="1px" borderColor="#93d7bf" borderRadius="md" p={10}>
          <Box fontSize="xl" color="white" mb={2}>
            Create Trade
          </Box>
          <Flex mb={4}>
            <Box mr={4}>
              <Input bg="white"
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Box>
            <Box mr={4}>
              <Input bg="white"
                placeholder="Start Time"
                name="timeStart"
                value={formData.timeStart}
                onChange={handleChange}
              />
            </Box>
            <Box mr={4}>
              <Input bg="white"
                placeholder="End Time"
                name="timeEnd"
                value={formData.timeEnd}
                onChange={handleChange}
              />
            </Box>
            <Box mr={4}>
              <Input bg="white"
                placeholder="Channels"
                name="channels"
                value={formData.channels}
                onChange={handleChange}
              />
            </Box>
            <Box mr={4}>
              <Input bg="white"
                placeholder="Buyer Limit"
                name="buyerLimit"
                value={formData.buyerLimit}
                onChange={handleChange}
              />
            </Box>
          </Flex>
          <Button
            colorScheme="teal"
            bg="#93d7bf"
            onClick={handleSubmit}
          >
            Create Trade
          </Button>
        </Box>
      </Box>
          </Box>
          <Flex justify="center" mb={4}>
            <Button mr={2} colorScheme="teal" bg="#93d7bf">
              Start Service
            </Button>
            <Button
              mr={2}
              variant="outline"
              colorScheme="teal"
              borderColor="#93d7bf"
              color="#93d7bf"
              onClick={handleCastedButtonClick}
            >
              Casted
            </Button>
            <Button colorScheme="teal" bg="#353935">
              Stop Service
            </Button>
          </Flex>
          <Box maxW="50%" mx="auto" mb="50px" borderWidth="1px" borderColor="#93d7bf" borderRadius="md" overflow="hidden">
            <Table variant="simple">
              <Thead bg="#353935">
                <Tr>
                  <Th color="white">Name (IGN)</Th>
                  <Th color="white">Channel</Th>
                  <Th color="white">Duration (hours)</Th>
                  <Th color="white">Recast Timer</Th>
                </Tr>
              </Thead>
              <Tbody bg="#353935">
                <Tr>
                  <Td>
                    <Flex alignItems="center">
                      {showReloadIcon && <Spinner color="teal" mr="10px" size="sm" />}
                      <CopyToClipboard text="Player 1">
                        <Button colorScheme="teal" size="sm" leftIcon={<CopyIcon />} aria-label="Copy to clipboard" />
                      </CopyToClipboard>
                      <span style={{ marginLeft: '10px', color: 'white' }}>Player 1</span>
                    </Flex>
                  </Td>
                  <Td color="white">Channel 1</Td>
                  <Td color="white">2 hours</Td>
                  <Td color="white">Ready</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex alignItems="center">
                      {showReloadIcon && <Spinner color="teal" mr="10px" size="sm" />}
                      <CopyToClipboard text="Player 2">
                        <Button colorScheme="teal" size="sm" leftIcon={<CopyIcon />} aria-label="Copy to clipboard" />
                      </CopyToClipboard>
                      <span style={{ marginLeft: '10px', color: 'white' }}>Player 2</span>
                    </Flex>
                  </Td>
                  <Td color="white">Channel 2</Td>
                  <Td color="white">1.5 hours</Td>
                  <Td color="white">Ready</Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex alignItems="center">
                      {showReloadIcon && <Spinner color="teal" mr="10px" size="sm" />}
                      <CopyToClipboard text="Player 3">
                        <Button colorScheme="teal" size="sm" leftIcon={<CopyIcon />} aria-label="Copy to clipboard" />
                      </CopyToClipboard>
                      <span style={{ marginLeft: '10px', color: 'white' }}>Player 3</span>
                    </Flex>
                  </Td>
                  <Td color="white">Channel 3</Td>
                  <Td color="white">3 hours</Td>
                  <Td color="white">Ready</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Dashboard;

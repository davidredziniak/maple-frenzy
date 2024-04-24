import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import Navbar from "./Navbar";
import { CopyIcon } from '@chakra-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Dashboard = () => {
  const [isCasting, setIsCasting] = useState(false);
  const [showReloadIcon, setShowReloadIcon] = useState(false);

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
    </Box>
  );
};

export default Dashboard;

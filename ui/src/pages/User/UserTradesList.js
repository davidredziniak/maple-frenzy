import {
  Text,
  Box,
  Button,
  Flex,
  Card,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  CardBody,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export default function UserTradesList(props) {
  const getHoursFromNow = (startTime) => {
    var now = new Date();
    var tradeStartTime = new Date(startTime);
    var diffMs = tradeStartTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    var diffHours = Math.floor(diffMins / 60);
    return diffHours;
  };

  const getMinutesFromNow = (startTime) => {
    var now = new Date();
    var tradeStartTime = new Date(startTime);
    var diffMs = tradeStartTime - now;
    var diffMins = Math.round(diffMs / 60000); // minutes
    diffMins = diffMins - Math.floor(diffMins / 60) * 60;
    return diffMins;
  };

  const checkIfStarted = (minutes) => {
    return (minutes < 0);
  };

  return (
    <Box flex="1" bg="#F8EEDE" rounded="md" boxShadow="base">
      <Box flex="1" py="5vh">
        <Center>
          <Stack>
            <Card p={5} bg="#353935" color={"white"}>
              <Center>
                <Flex pt="5vh">
                  <Text fontSize="20px">Trade Navigator</Text>
                  <Spacer pl=".5vw" />
                  <InfoOutlineIcon boxSize={5} />
                </Flex>
              </Center>
              <CardBody>
                <Text>Joined Trades</Text>
                {props.joined.length >= 1 ? (
                  <Table variant="simple">
                    <Thead bg="#353935">
                      <Tr>
                        <Th color="white">ID</Th>
                        <Th color="white">In Game Name</Th>
                        <Th color="white">Channel</Th>
                        <Th color="white">Start Time</Th>
                        <Th color="white">Duration</Th>
                        <Th color="white">In Progress</Th>
                        <Th color="white"></Th>
                      </Tr>
                    </Thead>
                    <Tbody bg="#353935">
                      {props.joined.map((trade) => (
                        <Tr>
                          <Td>
                            <Flex alignItems="center">
                              <span
                                style={{ marginLeft: "10px", color: "white" }}
                              >
                                {trade.id}
                              </span>
                            </Flex>
                          </Td>
                          <Td color="white">{trade.gameName}</Td>
                          <Td color="white">{trade.channel}</Td>
                          {checkIfStarted(
                            getHoursFromNow(trade.timeStart) ||
                              checkIfStarted(getMinutesFromNow(trade.timeStart))
                          ) ? (
                            <Td color="white">NOW</Td>
                          ) : (
                            <Td color="white">
                              {getHoursFromNow(trade.timeStart)} hour(s){" "}
                              {getMinutesFromNow(trade.timeStart)} min
                            </Td>
                          )}
                          <Td color="white">{trade.duration} hour(s)</Td>
                          <Td color="white">
                            {trade.inProgress ? "Yes" : "No"}
                          </Td>

                          <Td color="white">
                            <Button onClick={() => props.navBuyer(trade.id)}>
                              View
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  "------"
                )}
                <br />
                <Text>Created Trades</Text>
                {props.created.length >= 1 ? (
                  <Table variant="simple">
                    <Thead bg="#353935">
                      <Tr>
                        <Th color="white">ID</Th>
                        <Th color="white">Start Time</Th>
                        <Th color="white">Duration</Th>
                        <Th color="white">Queue</Th>
                        <Th color="white">Limit</Th>
                        <Th color="white">In Progress</Th>
                        <Th color="white"></Th>
                      </Tr>
                    </Thead>
                    <Tbody bg="#353935">
                      {props.created.map((trade) => (
                        <Tr>
                          <Td>
                            <Flex alignItems="center">
                              <span
                                style={{ marginLeft: "10px", color: "white" }}
                              >
                                {trade.id}
                              </span>
                            </Flex>
                          </Td>
                          {checkIfStarted(
                            getMinutesFromNow(trade.timeStart) ||
                              checkIfStarted(getHoursFromNow(trade.timeStart))
                          ) ? (
                            <Td color="white">NOW</Td>
                          ) : (
                            <Td color="white">
                              {getHoursFromNow(trade.timeStart)} hour(s){" "}
                              {getMinutesFromNow(trade.timeStart)} min
                            </Td>
                          )}
                          <Td color="white">{trade.duration} hour(s)</Td>
                          <Td color="white">{trade.current}</Td>
                          <Td color="white">{trade.limit}</Td>
                          <Td color="white">
                            {trade.inProgress ? "Yes" : "No"}
                          </Td>
                          <Td color="white">
                            <Button onClick={() => props.navSeller(trade.id)}>
                              Go
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  "------"
                )}
              </CardBody>
            </Card>
          </Stack>
        </Center>
      </Box>
    </Box>
  );
};

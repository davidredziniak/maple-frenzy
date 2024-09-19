import {
  Text,
  Box,
  Flex,
  VStack,
  Spacer,
  Center,
  Stack,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import PasswordPopup from "./PasswordPopup";

export default function ProfileBox(props) {
  return (
    <Box flex="1" py="5vh" rounded="md">
      <Stack>
        <Center>
          <Box w="40%" p={10} boxShadow="base" bg="#353935" rounded="md">
            <VStack
              bg="#353935"
              color={"white"}
              w="100%"
              align={"stretch"}
              spacing={10}
            >
              <Center>
                <Flex>
                  <Text
                    textShadow="1px 2px #000000"
                    color="white"
                    fontSize="45px"
                    as={"b"}
                  >
                    User Information
                  </Text>
                  <InfoOutlineIcon boxSize={10} ml="1vw" mt="1vh" />
                </Flex>
              </Center>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Username:</Text>
                <Spacer />
                <Text>{props.username}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Password:</Text>
                <Spacer />
                <PasswordPopup />
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Trade Count:</Text>
                <Spacer />
                <Text>{props.tradeCount}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Reputation:</Text>
                <Spacer />
                <Text>{props.reputation}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Created At:</Text>
                <Spacer />
                <Text>{props.createdAt}</Text>
              </Flex>
              <Flex
                textShadow="1px 2px #000000"
                color="white"
                fontSize="18px"
                as={"b"}
              >
                <Text>Last Login:</Text>
                <Spacer />
                <Text>{props.lastLoggedIn}</Text>
              </Flex>
            </VStack>
          </Box>
        </Center>
      </Stack>
    </Box>
  );
};
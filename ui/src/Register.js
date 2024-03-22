import {stackLeft, stackRight, loginBox, loginText,gButtBox,gButtContent, signInButton } from './config'
import {
  ChakraProvider,
  Stack,
  Image,
  Flex,
  Text,
  Heading,
  Link,
  Input,
  Button,
  Center,
  Box,
} from '@chakra-ui/react'

const Backdrop = () =>{
    return(
      <Flex color="white" h="100vh">
        <Stack {...stackLeft}>
          <Heading pt="25vh">Crush It</Heading>
          <Image src="img/pending.png" />
        </Stack>
        <Stack {...stackRight} />
        <LoginForm/>
      </Flex>
    )
  }
  
const LoginForm = () => {
    return(
      <Stack {...loginBox}>
        <Text {...loginText}>Log in</Text>
      </Stack>
    )
  }

const Register = () => {
    return (
      <>
        <ChakraProvider>
          <Backdrop>
            <LoginForm/>
          </Backdrop>
        </ChakraProvider>
      </>
    )
  }
  
export default Register
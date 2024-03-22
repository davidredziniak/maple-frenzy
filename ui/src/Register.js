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
import maplefrenzylogo from '/home/sdk6/cs491/maple-frenzy/ui/src/maplefrenzylogo.svg'
const Backdrop = () =>{
    return(
      <Flex color="white" h="100vh">
        <Stack {...stackLeft}>
          <Heading pt="25vh">Maple Frenzy</Heading>
          <Image src={maplefrenzylogo} />
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
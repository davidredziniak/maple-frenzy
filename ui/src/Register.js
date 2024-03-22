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
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
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
        <Text {...loginText}>Register</Text>
        <FormControl>
            <FormLabel pt="20px">Email address</FormLabel>
            <Input pr="20px" type='email' />
            <FormLabel pt="30px">Password</FormLabel>
            <Input type='password' />
            <FormLabel pt="30px">Confirm Password</FormLabel>
            <Input type='password' />
        </FormControl>
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
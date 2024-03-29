import { Text, Box, Button, Flex, Link, Stack,Center } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ProfileBox = () => {
    return(
        <Box flex='1' bg='black.100' rounded='md'>
            <Stack>
                <Text pl='.5vw' fontFamily='verdana' fontSize='40px'>Profile</Text>
                <Box h='20vh' pl='.5vw' boxShadow='base' rounded='md'> 
                    <Text fontFamily='verdana'>User Info</Text></Box>
                
                <Box h='20vh' pl='.5vw'boxShadow='base' rounded='md'><Text fontFamily='verdana'>Change Password</Text></Box>
            </Stack>
        </Box>
    )
}

const StuffBox = () => {
    return(
    <Box w='15vw' bg='teal.50' rounded='md'>
        <Text textAlign='center' fontFamily='verdana'>Stuff</Text>
    </Box>
    )
}
const Profile = () => {
    return(
        <>
            <Flex h="100vh"> 
                <StuffBox />
                <ProfileBox />
            </Flex>
        </>
    )
}

export default Profile
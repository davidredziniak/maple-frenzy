import { Text, Box, Button, Flex, Link, Stack,Center } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const ProfileBox = () => {
    return(
        <Box flex='1' bg='gray.100' rounded='md'>
            <Stack>
                <Box h='20vh' pl='.5vw' boxShadow='base' rounded='md'>
                    <Text>Profile</Text>
                    <Box pl='.5vw'><Text>User Info</Text></Box>
                </Box>
                <Box h='20vh' pl='.5vw'boxShadow='base' rounded='md'><Text>Change Password</Text></Box>
            </Stack>
        </Box>
    )
}

const StuffBox = () => {
    return(
    <Box w='15vw' bg='teal.50' rounded='md'>
        <Text textAlign='center'>Stuff</Text>
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
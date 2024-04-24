import React, { useContext,useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { withDelay } from '@chakra-ui/react';


const Redirect = () => {

    const { accessToken, userId, updateCreatedAt, updateLLI, updateReputation, updateTradeCount } = useContext(AuthContext);
    const getData = async() => {
        const response = await fetch(`https://maple-frenzy.onrender.com/api/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": `${accessToken}`
        },
        });
        const data = await response.json();
        if (response.status === 200) {
        updateTradeCount(data.tradeCount);
        updateReputation(data.reputation);
        updateCreatedAt(data.createdAt);
        updateLLI(data.lastLoggedIn);
        }
        await withDelay(1000);
    }
  

  useEffect(() => {
    getData();
  }, []); 
    return (
        <div>Redirecting..</div>
    );
};

export default Redirect;
import React, { useContext,useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const dummyResponse = {
    ok: true,
    status: 200,
    json: {
        id: 3,
        username: "maplefrenzy_admin",
        tradeCount: 0,
        reputation: 0,
        createdAt: "2024-03-21T16:17:21.768Z",
        lastLoggedIn: "2024-03-21T16:17:21.768Z"
    }
  };

const Redirect = () => {
    const { isLoggedIn, toggleLogin, changeUser,username } = useContext(AuthContext);
    // useEffect(() => {
    //     //todo: create api call for user
    //     const response = Promise.resolve(dummyResponse);
    //     response.then(data => {
    //       const { json } = data;
    //       const { username } = json;
    //       changeUser(username);
    //       //console.log(username);
    //     });
    //   }, []);
    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/');
    };

    
      // Call toggleLogin on component mount
    useEffect(() => {
        toggleLogin();
    }, [toggleLogin]);

    
    useEffect(() => {
        
        navigateHome();
    }, [isLoggedIn,username]); 

    return (<div>Redirect page</div>);
};

export default Redirect;
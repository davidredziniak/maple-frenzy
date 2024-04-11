import React, { useContext,useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';


const Redirect = () => {
    const { isLoggedIn, toggleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/');
    };
    //console.log("before togglelogin",isLoggedIn)
      // Call toggleLogin on component mount
    useEffect(() => {
        toggleLogin();
    }, [toggleLogin]);

    
    useEffect(() => {
        console.log("After state update");
        console.log(isLoggedIn);
        navigateHome();
    }, [isLoggedIn]); 
    // useEffect(() => {
    //     console.log("3rd");
    //     getF();
    // }, []);
    return (<div>Redirect page</div>);
};

export default Redirect;
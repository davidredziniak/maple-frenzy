import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Redirect = ({ isLoggedIn,testF, getF }) => {
    const navigate = useNavigate();
    const navigateHome = () => {
      navigate('/');
    };
    useEffect(() => {
        getF();
        testF();
    }, []);
    
    useEffect(() => {
        console.log("After state update");
        getF();
        navigateHome();
    }, [isLoggedIn]); 
    // useEffect(() => {
    //     console.log("3rd");
    //     getF();
    // }, []);
    return (<div>Redirect page</div>);
};

export default Redirect;
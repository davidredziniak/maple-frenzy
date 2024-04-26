import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Td,
  Text,
  Button,
} from "@chakra-ui/react";

function CastCountdown(props) {
  const [seconds, setSeconds] = useState(600);
  const [isReady, setIsReady] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const interval = useRef(null);
  const [casts, setCasts] = useState(0);
  
  useEffect(() => {
    if (seconds === 0) {
      setIsReady(true);
      stopCounter();
    }
  }, [seconds]);

  const startCounter = () => {
    setCasts((prevState) => prevState + 1);
    setIsReady(false);
    interval.current = setInterval(() => {
      setSeconds((prevState) => prevState - 1);
    }, 1000);
  };

  const stopCounter = () => {
    clearInterval(interval.current);
    setSeconds(600);
    //
  };

  return (
      <Td color="white">{isReady ? <Text>Ready</Text> : <Text>{seconds}</Text>} { isReady ? <Button onClick={() => startCounter() }>Recast</Button> : '' }<Text>{casts} casts</Text></Td>
  );
}

export default CastCountdown;

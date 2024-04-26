import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Td,
  Text,
  Button,
} from "@chakra-ui/react";

function CastCountdown(props) {
  const [seconds, setSeconds] = useState(600);
  const [isReady, setIsReady] = useState(true);
  const interval = useRef(null);

  useEffect(() => {
    if (seconds === 0) {
      setIsReady(true);
      stopCounter();
    }
  }, [seconds]);

  const startCounter = () => {
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
      <Td color="white">{isReady ? <Text>Ready</Text> : <Text>{seconds}</Text>} <Button onClick={() => startCounter()}>Recast</Button></Td>
  );
}

export default CastCountdown;

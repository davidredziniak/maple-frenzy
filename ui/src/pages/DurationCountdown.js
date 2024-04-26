import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Td,
  Text,
  Button,
} from "@chakra-ui/react";

function DurationCountdown(props) {
  const [seconds, setSeconds] = useState(parseInt(props.duration));
  const [isRunning, setisRunning] = useState(false);
  const interval = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (seconds === 0) {
      setIsFinished(true);
      stopCounter();
    }
  }, [seconds]);

  const startCounter = () => {
    setisRunning(true);
    interval.current = setInterval(() => {
      setSeconds((prevState) => prevState - 1);
    }, 1000);
  };

  const stopCounter = () => {
    clearInterval(interval.current);
  };

  return (
      <Td color="white">{isFinished ? <Text>DONE!</Text> : <Text>{parseFloat(seconds/3600).toFixed(2)} hour(s)</Text>} {!isRunning ? <Button onClick={() => startCounter()}>Begin</Button> : ''}</Td>
  );
}

export default DurationCountdown;

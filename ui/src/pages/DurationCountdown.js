import React, { useState, useRef, useEffect, useContext } from "react";
import { Td, Text, Button, Stack } from "@chakra-ui/react";

function DurationCountdown(props) {
  const [seconds, setSeconds] = useState(parseInt(props.duration));
  const [isRunning, setisRunning] = useState(false);
  const interval = useRef(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (seconds === 0) {
      setIsFinished(true);
      stopCounter();
    }
  }, [seconds]);

  const startCounter = () => {
    setisRunning(true);
    interval.current = setInterval(() => {
      setTimeElapsed((prevState) => prevState + 1);
      setSeconds((prevState) => prevState - 1);
    }, 1000);
  };

  const stopCounter = () => {
    setIsFinished(true);
    clearInterval(interval.current);
  };

  return (
    <Td color="white">
      {isFinished ? (
        <Stack>
          <Text>
            Finished!<br />
            Elapsed: {parseFloat(timeElapsed / 3600).toFixed(2)} hour(s)
          </Text>
        </Stack>
      ) : (
        <Stack>
          <Text>
            Remaining: {parseFloat(seconds / 3600).toFixed(2)} hour(s)
          </Text>
        </Stack>
      )}{" "}
      {!isRunning ? (
        <Button onClick={() => startCounter()}>Begin</Button>
      ) : <p>{ !isFinished ? <Button onClick={() => stopCounter()}>Stop</Button> : ''}</p>}
    </Td>
  );
}

export default DurationCountdown;

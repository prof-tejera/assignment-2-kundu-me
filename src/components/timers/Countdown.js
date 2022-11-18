import { useState, useEffect, useRef, useContext } from 'react';

import DisplayTime from "../generic/DisplayTime";
import Button from "../generic/Button";
import Numbers from "../generic/Numbers";
import Controls from "../generic/Controls";

import { TimerContext } from "../../AppContext";

const Countdown = ({controls, index}) => {
  const [countdown, setCountdown] = useState(0);

  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(false);

  const [pauseButtonValue, setPauseButtonValue] = useState('Pause');

  const [countdownValue, setCountdownValue] = useState(0);

  useEffect(() => {
    if (!stop && !pause && countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1);
    } else if (stop) {
      setCountdown(0);
    }
	}, [countdown, start, pause, stop]);

  const { appControl, appTimerAction, appTimerIndex } = useContext(TimerContext);
  useEffect(() => {
    if (appTimerAction === 'Reset') {
      handleCountdownClick({
        target: {
          value: appTimerAction
        }
      });
    } else if (appTimerIndex === index) {
      handleCountdownClick({
        target: {
          value: appTimerAction
        }
      });
    }
	}, [appTimerAction, appTimerIndex]);

  useEffect(() => {
    if (countdown === 1) {
      appControl('Next');
    }
	}, [countdown]);

  const handleCountdownClick = (event) => {
    let value = event.target.value;
    if (value === 'Reset') {
      setCountdownValue(0);
      setCountdown(0);
      setStart(false);
      setStop(true);
      setPauseButtonValue('Pause');
    } else if (value === 'Start') {
      setCountdown(countdownValue);
      setStart(true);
      setStop(false);
      setPauseButtonValue('Pause');
    } else if (value === 'Stop') {
      setStop(true);
      setPauseButtonValue('Pause');
    }  else if (value === 'Pause') {
      setPause(true);
      setPauseButtonValue('Resume');
    }  else if (value === 'Resume') {
      setPause(false);
      setPauseButtonValue('Pause');
    } else {
      // Error
    }
  };

  const handleNumberClick = (event) => {
    setCountdownValue((countdownValue * 10) + Number(event.target.value));
  };

  return (
    <div>
      <div>
        <DisplayTime milliseconds={countdown} uservalue={countdownValue}></DisplayTime>
      </div>
      <div style={{ display: "flex"}}>
        <Numbers onClick={handleNumberClick} />
      </div>
      <div style={{ display: "flex"}}>
        {controls === false ? null : <Controls onClick={handleCountdownClick} valueStart="Start" valuePause={pauseButtonValue} valueStop="Stop" valueReset="Reset"/>}
      </div>
    </div>
  );
};

export default Countdown;

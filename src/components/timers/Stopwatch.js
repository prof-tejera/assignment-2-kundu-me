import { useState, useEffect, useRef, useContext } from 'react';

import DisplayTime from "../generic/DisplayTime";
import Button from "../generic/Button";
import Numbers from "../generic/Numbers";
import Controls from "../generic/Controls";

import { TimerContext } from "../../AppContext";

const Stopwatch = ({controls, index}) => {
  const [stopwatch, setStopwatch] = useState(0);
  const [countup, setCountup] = useState(0);

  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(false);

  const [pauseButtonValue, setPauseButtonValue] = useState('Pause');

  const [stopwatchValue, setStopwatchValue] = useState(0);

  useEffect(() => {
    if (!stop && !pause && countup <  stopwatch) {
      setTimeout(() => {
        setCountup(countup + 1);
      }, 1);
    } else if (stop) {
      setCountup(0);
    }
	}, [countup, stopwatch, start, pause, stop]);


  const { appControl, appTimerAction, appTimerIndex } = useContext(TimerContext);
  useEffect(() => {
    if (appTimerAction === 'Reset') {
      handleStopwatchClick({
        target: {
          value: appTimerAction
        }
      });
    } else if (appTimerIndex === index) {
      handleStopwatchClick({
        target: {
          value: appTimerAction
        }
      });
    }
	}, [appTimerAction, appTimerIndex]);

  useEffect(() => {
    if (countup === stopwatch - 1) {
      appControl('Next');
    }
	}, [countup]);

  const handleStopwatchClick = (event) => {
    let value = event.target.value;
    if (value === 'Reset') {
      setStopwatchValue(0);
      setCountup(0);
      setStopwatch(0);
      setStart(false);
      setStop(true);
      setPauseButtonValue('Pause');
    } else if (value === 'Start') {
      setCountup(0);
      setStopwatch(stopwatchValue);
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
    setStopwatchValue((stopwatchValue * 10) + Number(event.target.value));
  };

  return (
    <div>
      <div>
        <DisplayTime milliseconds={countup} uservalue={stopwatchValue}></DisplayTime>
      </div>
      <div style={{ display: "flex"}}>
        <Numbers onClick={handleNumberClick} />
      </div>
      <div style={{ display: "flex"}}>
        {controls === false ? null : <Controls onClick={handleStopwatchClick} valueStart="Start" valuePause={pauseButtonValue} valueStop="Stop" valueReset="Reset"/>}
      </div>
    </div>
  );
};

export default Stopwatch;

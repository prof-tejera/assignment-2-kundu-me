import { useState, useEffect, useRef, useContext } from 'react';

import DisplayTime from "../generic/DisplayTime";
import DisplayRound from "../generic/DisplayRound";
import Button from "../generic/Button";
import Numbers from "../generic/Numbers";
import Controls from "../generic/Controls";

import { TimerContext } from "../../AppContext";

const Tabata = ({controls, index}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRound, setTotalRound] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [totalcountdown, setTotalCountdown] = useState(0);
  const [restdown, setRestdown] = useState(0);
  const [totalrestdown, setTotalRestdown] = useState(0);

  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(false);

  const [pauseButtonValue, setPauseButtonValue] = useState('Pause');

  const [inputType, setInputType] = useState('');
  const [inputTypeClassName, setInputTypeClassName] = useState({
    Countdown: 'btn btn-info',
    Restdown: 'btn btn-info',
    Round: 'btn btn-info'
  });
  const [countdownValue, setCountdownValue] = useState(0);
  const [restdownValue, setRestdownValue] = useState(0);
  const [roundValue, setRoundValue] = useState(0);

  useEffect(() => {
    if (!stop && !pause) {
      if (countdown > 0) {
        setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1);
      } else if (restdown > 0) {
        setTimeout(() => {
          setRestdown(restdown - 1);
        }, 1);
      } else if (countdown === 0 && restdown === 0 && currentRound < totalRound) {
        setCurrentRound(currentRound + 1);
        setCountdown(totalcountdown);
        setRestdown(totalrestdown);
      }
    } else if (stop) {
      setCountdown(0);
      setRestdown(0);
      setCurrentRound(0);
    }
	}, [countdown, restdown, start, pause, stop]);

  const { appControl, appTimerAction, appTimerIndex } = useContext(TimerContext);
  useEffect(() => {
    if (appTimerAction === 'Reset') {
      handleTabataClick({
        target: {
          value: appTimerAction
        }
      });
    } else if (appTimerIndex === index) {
      handleTabataClick({
        target: {
          value: appTimerAction
        }
      });
    }
	}, [appTimerAction, appTimerIndex]);

  useEffect(() => {
    if (countdown === 1 && restdown === 1 && currentRound === totalRound) {
      appControl('Next');
    }
	}, [countdown, restdown, currentRound]);

  const handleTabataClick = (event) => {
    let value = event.target.value;
    if (value === 'Reset') {
      setInputType('');
      setCountdownValue(0);
      setRestdownValue(0);
      setRoundValue(0);
      setCountdown(0);
      setTotalCountdown(0);
      setRestdown(0);
      setTotalRestdown(0);
      setCurrentRound(0);
      setTotalRound(0);
      setStart(false);
      setStop(true);
      setPauseButtonValue('Pause');
    } else if (value === 'Start') {
      setCountdown(0);
      setTotalCountdown(countdownValue);
      setRestdown(0);
      setTotalRestdown(restdownValue);
      setCurrentRound(0);
      setTotalRound(roundValue);
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
    if (inputType === 'Round') {
      setRoundValue(Number(event.target.value));
    } else if (inputType === 'Countdown') {
      setCountdownValue((countdownValue * 10) + Number(event.target.value));
    } else {
      setRestdownValue((restdownValue * 10) + Number(event.target.value));
    }
  };

  const handleInputTypeClick = (event) => {
    setInputType(event.target.value);
    let objInputTypeClassName = {
      Countdown: 'btn btn-info',
      Restdown: 'btn btn-info',
      Round: 'btn btn-info'
    }
    objInputTypeClassName[event.target.value] = "btn btn-primary";
    setInputTypeClassName(objInputTypeClassName);
  };

  return (
    <div>
      <div>
        <DisplayTime milliseconds={countdown} uservalue={countdownValue}></DisplayTime>
        <DisplayTime milliseconds={restdown} uservalue={restdownValue}></DisplayTime>
        <DisplayRound round={currentRound} total={totalRound} uservalue={roundValue}></DisplayRound>
      </div>
      <div style={{ display: "flex"}}>
        <Button displayName="Countdown" value="Countdown" className={inputTypeClassName.Countdown} onClick={handleInputTypeClick} />
        <Button displayName="Restdown" value="Restdown" className={inputTypeClassName.Restdown} onClick={handleInputTypeClick} />
        <Button displayName="Round" value="Round" className={inputTypeClassName.Round} onClick={handleInputTypeClick} />
      </div>
      <div style={{ display: "flex"}}>
        <Numbers onClick={handleNumberClick} />
      </div>
      <div style={{ display: "flex"}}>
        { controls === false ? null : <Controls onClick={handleTabataClick} valueStart="Start" valuePause={pauseButtonValue} valueStop="Stop" valueReset="Reset"/> }
      </div>
    </div>
  );
};

export default Tabata;

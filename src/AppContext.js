import React from "react";
import { useState, useEffect, createContext } from 'react';

import Stopwatch from "./components/timers/Stopwatch";
import Countdown from "./components/timers/Countdown";
import XY from "./components/timers/XY";
import Tabata from "./components/timers/Tabata";

export const TimerContext = createContext({});

export const AppContext = ({children}) => {
  const [timers, setTimers] = useState([]);

  const [timersChanged, setTimersChanged] = useState(0);

  const [appTimerAction, setAppTimerAction] = useState('');
  const [appTimerIndex, setAppTimerIndex] = useState(-1);

  useEffect(() => {
  }, [timersChanged]);

  const getNextValidIndex = (index) => {
    for (let i = index + 1; i < timers.length; i++) {
      if (timers[i].valid) {
        return i;
      }
    }
    return false;
  };

  const appControl = (value) => {
    if (value === 'Reset') {
      setAppTimerAction(value);
    } else if (value === 'Start') {
      setAppTimerAction(value);
      const appTimerNextIndex = getNextValidIndex(appTimerIndex);
      if (appTimerNextIndex === false) {
        setAppTimerIndex(0);
      } else {
        setAppTimerIndex(appTimerNextIndex);
      }
    } else if (value === 'Stop') {
      setAppTimerAction(value);
    }  else if (value === 'Pause') {
      setAppTimerAction(value);
    }  else if (value === 'Resume') {
      setAppTimerAction(value);
    }  else if (value === 'Next') {
      setAppTimerAction('Start');
      const appTimerNextIndex = getNextValidIndex(appTimerIndex);
      if (appTimerNextIndex === false) {
        setAppTimerIndex(-1);
      } else {
        setAppTimerIndex(appTimerNextIndex);
      }
    } else if (value === 'Fast') {
      setAppTimerAction('Stop');
      setTimeout(() => {
        setAppTimerAction('Start');
        const appTimerNextIndex = getNextValidIndex(appTimerIndex);
        if (appTimerNextIndex === false) {
          setAppTimerIndex(-1);
        } else {
          setAppTimerIndex(appTimerNextIndex);
        }
      }, 500);
    } else {
      // Error
    }
  };

  const addTimer = (title) => {
    let queue = timers;
    const index = queue.length;
    const componentTimer = {
      "Stopwatch": <Stopwatch controls={true} index={index} />,
      "Countdown": <Countdown controls={true} index={index} />,
      "XY": <XY controls={true} index={index} />,
      "Tabata": <Tabata controls={true} index={index} />
    };

    queue.push({
      title: title,
      data: null,
      component: componentTimer[title],
      valid: true,
      index: index
    });
    setTimers(queue);
    setTimersChanged(timersChanged + 1);
  };

  const updateTimer = (index, data) => {
    let queue = timers;
    queue[index].valid = true;
    queue[index].data = data;
    setTimers(queue);
    setTimersChanged(timersChanged + 1);
  };

  const deleteTimer = (index) => {
    let queue = timers;
    queue[index].valid = false;
    queue[index].data = null;
    setTimers(queue);
    setTimersChanged(timersChanged + 1);
  };

  return (
      <TimerContext.Provider
        value={{
          timers,
          addTimer,
          updateTimer,
          deleteTimer,
          appControl,
          appTimerAction,
          appTimerIndex
        }}
      >
      {children}
      </TimerContext.Provider>
    )
};

export default AppContext;

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { addToSequence } from './AppEventSlice';

const baseWsURL = 'ws://localhost:8000';

export default function AppEventHandler(props) {
  const [ws, setWs] = useState(null);
  const timer = useRef(0);
  const eventState = useSelector((state) => state.AppEvent);
  const dispatch = useDispatch();

  useEffect(() => {

    if (timer.current) {
      clearInterval(timer.current);
      timer.current = 0;
    }

    timer.current = setInterval(() => {
      // connect if needed:
      if (ws === null || (ws && ws.readyState === 3)) {
        const newWs = new WebSocket(baseWsURL + '/event/event_ws')
        
        newWs.onopen = () => {
          console.log("appEventWs opened");
        };
  
        newWs.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          console.log("appEventWs:", msg);
          if (msg.type === 'app' && msg.iter === 'reload') {
            window.location.reload(false);
          } else {
            dispatch(addToSequence(msg));
          }
        };
  
        newWs.onclose = (event) => {
          console.log("appEventWs closed:", event);
        };
        
        newWs.onerror = (event) => {
          console.log("appEventWs error: ", event);
        };

        setWs(newWs);
      }
    }, 1000);

    return () => { 
      clearInterval(timer.current);
      if (ws) ws.close();
    }
  }, [dispatch, eventState, ws]);

  return (
    <React.Fragment/>
  );
}

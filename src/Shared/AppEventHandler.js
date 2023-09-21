import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux'
import { addToSequence } from './AppEventSlice';

export default function AppEventHandler(props) {
  const { baseURL } = props;
  const baseWsURL = baseURL.replace('http', 'ws');
  const [ws, setWs] = useState(null);
  const timer = useRef(0);
  const isMounted = useRef(false);
  const dispatch = useDispatch();

  const connect = useCallback(() => {    
    if (isMounted.current) {
      // connect if needed:
      if (ws === null || (ws && ws.readyState === 3)) {
        console.log("appEventWs opening");
        const newWs = new WebSocket(baseWsURL + '/event/event_ws');
        
        newWs.onopen = () => {
          console.log("appEventWs opened");
        };
  
        newWs.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          // console.log("appEventWs:", msg);
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
    }
  }, [dispatch, baseWsURL, ws]);

  useEffect(() => {
    isMounted.current = true;
    timer.current = setInterval(connect, 1000);
    return () => {
      isMounted.current = false;
      clearInterval(timer.current);
      timer.current = 0;
      if (ws)
        ws.close();
    }
  }, [connect, ws]);

  return (
    <React.Fragment/>
  );
}

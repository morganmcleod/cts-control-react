import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { appendRfPowerGraph } from './RFSlice';
import Plot from "react-plotly.js";
import axios from "axios";

export default function RFPowerGraph(props) {
  const {onComplete} = props;
  const rfPowerGraph = useSelector((state) => state.RF.rfPowerGraph);
  const updatedTimer = useRef(0);
  const updated = useRef(new Date());  
  const dispatch = useDispatch();

  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const baseURL = axios.defaults.baseURL.replace('http', 'ws');
  const URL = '/rfsource/auto_rf/power_ws';
  const { 
    readyState: ready,
    lastMessage: message 
  } = useWebSocket(baseURL + URL, options);

  useEffect(() => {
    // websocket handler for live time series
    if (ready === ReadyState.OPEN) {
      if (message !== null) {
        try {
          const data = JSON.parse(message.data);
          updated.current = new Date();
          dispatch(appendRfPowerGraph(data));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [ready, message, dispatch]);

  useEffect(() => {
    if (updatedTimer.current)
      return;
    updatedTimer.current = setInterval(() => {
      // close if no update for 3 seconds:
      const now = new Date();
      if (now - updated.current > 3000) {        
        clearInterval(updatedTimer.current);
        updatedTimer.current = 0;
        onComplete();
      }
    }, 500);
  }, [onComplete, updated]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'rfPower',
        x: rfPowerGraph.x,
        y: rfPowerGraph.y,
        type: 'scatter',
        mode: 'lines',
        showscale: false,
      }]}
      layout = {{
        autosize: true,
        height: 170,
        width: 200,
        xaxis: {
          title: 'iteration'
        },
        yaxis: {
          title: 'RF Power [dB]',
          range: [-50, 20],
          nticks: 5
        },
        margin: {
          t: 0,
          b: 40,
          l: 40,
          r: 0
        }
      }}
      config = {{
        displayModeBar: false, 
        responsive: true,
        staticPlot: false      
      }}
    />
  );
}


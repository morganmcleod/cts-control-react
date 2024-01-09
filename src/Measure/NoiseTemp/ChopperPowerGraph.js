import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { resetChopperPowerPlot, addChopperPowerRecords } from './NoiseTempSlice';
import Plot from '../../Shared/Plotly';
import axios from "axios";
export default function ChopperPowerGraph(props) {
  const chopperPowerPlot = useSelector((state) => state.NoiseTemp.chopperPowerPlot);
  const chopperPowerInput = useSelector((state) => state.NoiseTemp.chopperPowerInput);
  const dispatch = useDispatch();
  const lastInput = useRef(null);

  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const URL = axios.defaults.baseURL.replace('http', 'ws') + "/noisetemp/chopperpower_ws";
  const { 
    readyState: ready,
    lastMessage: message 
  } = useWebSocket(URL, options);

  useEffect(() => {
    // websocket handler for position message
    if (ready === ReadyState.OPEN) {
      if (message !== null) {
        try {
          const data = JSON.parse(message.data);          
          if (data && data.length > 0 && data[0].input !== lastInput.current) {
            lastInput.current = data[0].input;
            dispatch(resetChopperPowerPlot())
          }
          dispatch(addChopperPowerRecords(data));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [ready, message, dispatch]);

  return (
    <Plot      
      style = {{
        width: "auto"
      }}
      useResizeHandler      
      data = {[{
        name: 'Power [dBm]',
        x: chopperPowerPlot.x,
        y: chopperPowerPlot.power,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y1'
      },{
        name: 'Chopper State',
        x: chopperPowerPlot.x,
        y: chopperPowerPlot.chopperState,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y2'
      }]}
      layout = {{
        title: chopperPowerInput,
        autosize: true,
        height: 300,
        xaxis: {          
        },
        yaxis: {
          title: 'Power [dBm]',          
          nticks: 10
        },
        yaxis2: {
          title: 'State',
          side: 'right',
          overlaying: 'y',
          tick0: 0,
          dtick: 1,
          nticks: 3,
          tickvals: [0, 1, 2],
          ticktext: ['COLD', '', 'HOT'],
          range: [-0.01, 2.1]
        },
        legend: {
          x: 1.1,          
          y: 0.1
        },
        margin: {
          t: 40,
          b: 40,
          l: 60,
          r: 0
        }
      }}
      config = {{
        displayModeBar: false, 
        responsive: true,
        staticPlot: true      
      }}
    />
  );
}


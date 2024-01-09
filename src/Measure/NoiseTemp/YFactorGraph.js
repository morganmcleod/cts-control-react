import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { addYFactorData } from './NoiseTempSlice';
import Plot from '../../Shared/Plotly';
import axios from "axios";

export default function YFactorGraph(props) {
  const yFactorPlot = useSelector((state) => state.NoiseTemp.yFactorPlot);
  const dispatch = useDispatch();

  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const URL = axios.defaults.baseURL.replace('http', 'ws') + "/noisetemp/yfactor_ws";
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
          dispatch(addYFactorData(data));
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
        name: 'Y [dB]',
        x: yFactorPlot.x,
        y: yFactorPlot.y,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y1'
      },{
        name: 'TRx [K]',
        x: yFactorPlot.x,
        y: yFactorPlot.TRx,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y2'
      }]}
      layout = {{
        autosize: true,
        height: 250,
        xaxis: {
          title: 'time [s]'
        },
        yaxis: {
          title: 'Y [dB]',
          range: [0, 4],
          nticks: 10
        },
        yaxis2: {
          title: 'TRx [K]',
          side: 'right',
          overlaying: 'y'
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
        staticPlot: true      
      }}
    />
  );
}


import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { addWarmIFData} from './NoiseTempSlice';
import Plot from '../../Shared/Plotly';
import axios from "axios";

export default function WarmIFGraph(props) {
  const warmIFData = useSelector((state) => state.NoiseTemp.warmIFPlot);
  const dispatch = useDispatch();

  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const URL = axios.defaults.baseURL.replace('http', 'ws') + "/noisetemp/warmif_ws";
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
          dispatch(addWarmIFData(data));
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
        name: 'pHot',
        x: warmIFData.x,
        y: warmIFData.pHot,
        type: 'scatter',
        mode: 'lines',
        showscale: true
      },{
        name: 'pCold',
        x: warmIFData.x,
        y: warmIFData.pCold,
        type: 'scatter',
        mode: 'lines',
        showscale: true
      }]}
      layout = {{
        autosize: true,
        height: 250,
        xaxis: {
          title: 'IF [GHz]',
          range: [4, 12],
          nticks: 5
        },
        yaxis: {
          title: 'Power [dBm]',
          range: [-55, -25],
          nticks: 10
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


import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { resetTimeSeries, addTimeSeries } from './StabilitySlice';
import Plot from '../../Shared/Plotly';
import axios from "axios";

export default function LiveTimeSeries(props) {
  const timeSeries = useSelector((state) => state.Stability.timeSeries);
  const prevTimeSeriesId = useRef(null);
  const dispatch = useDispatch();
  
  const yTitle = (props.mode === 'phase') ? 'degrees phase' : 'detector Volts';

  const options = {
    retryOnError: true, 
    shouldReconnect: (closeEvent) => true,
    ignoreExtensions: true
  };
  const baseURL = axios.defaults.baseURL.replace('http', 'ws');
  const URL = (props.mode === 'phase') ? '/stability/phase/timeseries_ws' : '/stability/amp/timeseries_ws';
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
          if (data.tsId && data.tsId !== prevTimeSeriesId.current) {
            prevTimeSeriesId.current = data.tsId;
            dispatch(resetTimeSeries());            
          }
          dispatch(addTimeSeries(data));
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
        name: yTitle,
        x: timeSeries.timeStamps,
        y: timeSeries.dataSeries,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y1'
      },{
        name: 'ambient',
        x: timeSeries.timeStamps,
        y: timeSeries.temperatures1,
        type: 'scatter',
        mode: 'lines',
        showscale: true,
        yaxis: 'y2'
      }]}
      layout = {{
        title: 'Time series ' + timeSeries.tsId,
        autosize: true,
        height: 350,
        xaxis: {
        },
        yaxis: {
          title: yTitle,
          nticks: 10
        },
        yaxis2: {
          title: 'Kelvin',
          side: 'right',
          overlaying: 'y'
        },
        margin: {
          t: 40,
          b: 40,
          l: 80,
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


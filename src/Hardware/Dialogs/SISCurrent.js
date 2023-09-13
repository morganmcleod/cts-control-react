import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch, useSelector } from 'react-redux';
import { resetPlot, addPoint } from "./XYPlotSlice";
import Plot from "react-plotly.js";

export default function SISCurrent(props) {
  const plot = useSelector((state) => state.XYPlot.plot);
  const dispatch = useDispatch();

  const options = {retryOnError: true, shouldReconnect: (closeEvent) => true};
  const { 
    readyState: actionReady,
    lastMessage: actionMessage 
  } = useWebSocket("ws://localhost:8000/action/action_ws", options);

  useEffect(() => {
    // websocket handler for action message
    if (actionReady === ReadyState.OPEN) {
      if (actionMessage !== null) {
        try {
          const sisCurrent = JSON.parse(actionMessage.data);
          dispatch(addPoint({x: sisCurrent.index, y: sisCurrent.sisCurrent}));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [actionReady, actionMessage, dispatch]);

  // Fetch on first render:
  useEffect(() => {
    dispatch(resetPlot());
  }, [dispatch]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'sisCurrent',
        x: plot.x,
        y: plot.y,
        type: 'scatter',
        mode: 'lines',
        showscale: false,
      }]}
      layout = {{
        autosize: true,
        height: 170,
        width: 170,
        xaxis: {
          title: 'iteration',
          range: [0, 20],
          nticks: 5
        },
        yaxis: {
          title: 'SIS current [uA]',
          range: [0.0, 15.0],
          nticks: 10
        },
        margin: {
          t: 0,
          b: 0,
          l: 0,
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


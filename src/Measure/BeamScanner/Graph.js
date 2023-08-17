import React, { useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch, useSelector } from 'react-redux'
import { setPosition } from "../../Hardware/BeamScanner/MotorControlSlice";
import { resetRasters, addRaster } from "./BeamScannerSlice";
import Plot from "react-plotly.js";

import axios from "axios";


export default function BeamScannerGraph(props) {
  // Redux store interface
  const position = useSelector((state) => state.MotorControl.position);
  const haveRasters = useSelector((state) => state.BeamScanner.rasters);
  const amplitudePlot = useSelector((state) => state.BeamScanner.amplitudePlot);
  const measSpec = useSelector((state) => state.BeamScanner.measurementSpec)
  const dispatch = useDispatch();

  const options = {retryOnError: true, shouldReconnect: (closeEvent) => true};

  const { 
    readyState: posReady,
    lastMessage: posMessage 
  } = useWebSocket("ws://localhost:8000/beamscan/position_ws", options);
    
  const { 
    readyState: rasterReady,
    lastMessage: rasterMessage 
  } = useWebSocket("ws://localhost:8000/beamscan/rasters_ws", options);

  useEffect(() => {
    if (posReady === ReadyState.OPEN) {
      if (posMessage !== null) {
        try {
          const pos = JSON.parse(posMessage.data);
          dispatch(setPosition(pos));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [posReady, posMessage, dispatch]);
   
  useEffect(() => {
    if (rasterReady === ReadyState.OPEN) {
      if (rasterMessage !== null) {
        // The websocket only sends the latest raster
        try {
          const rasters = JSON.parse(rasterMessage.data);
          // If the result is empty or is the first raster, reset our copy:
          if (rasters.startIndex === 0)
            dispatch(resetRasters());
            
          // If we are missing some of the previous ones,
          if (haveRasters.length < rasters.startIndex) {
            // Request raters from index 0:
            axios.get('/beamscan/rasters', { params: { first: 0, last: rasters.startIndex - 1 }})
            .then(res => {
              // Clear our copy:
              dispatch(resetRasters());
              // Add the result of the request:
              for (const raster of res.data.rasters)
                dispatch(addRaster(raster));
              // Add the latest from the websocket:
              for (const raster of rasters.rasters)
                dispatch(addRaster(raster));
            })
            .catch(error => {
              console.log(error);
            });
          } else {
            // We're up to date so just add the new one:
            for (const raster of rasters.rasters)
              dispatch(addRaster(raster));        
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [rasterReady, rasterMessage, dispatch, haveRasters.length]);

  return (
    <Plot 
      style = {{
        width: "auto"        
      }}
      useResizeHandler
      data = {[{
        name: 'position',
        x: [position.x],
        y: [position.y],
        type: 'scatter',
        mode: 'markers',
        marker: {color: 'black', size: 10}
      },{
        name: 'amplitude',
        x: amplitudePlot.x,
        y: amplitudePlot.y,
        z: amplitudePlot.amp,
        type: 'heatmap',
        colorscale: 'Electric',
        showscale: false        
      }]}
      layout = {{
        autosize: true,
        xaxis: {
          title: 'X [mm]',
          range: [measSpec.scanStart.x - 10, measSpec.scanEnd.x + 10],
          nticks: 10
        },
        yaxis: {
          title: 'Y [mm]',
          range: [measSpec.scanStart.y - 10, measSpec.scanEnd.y + 10],
          nticks: 10
        },
        margin: {
          t: 0,
          b: 50,
          l: 50,
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

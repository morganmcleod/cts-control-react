import React, {useEffect} from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch, useSelector } from 'react-redux'
import { setPosition } from "../../Hardware/BeamScanner/MotorControlSlice";
import { resetRasters, addRaster } from "./BeamScannerSlice";
import Plot from "react-plotly.js";

export default function BeamScannerGraph(props) {
  // Redux store interface
  const position = useSelector((state) => state.MotorControl.position);
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
        try {
          const rasters = JSON.parse(rasterMessage.data);
          if (rasters.startIndex === 0)
            dispatch(resetRasters());
          for (const raster of rasters.rasters)
            dispatch(addRaster(raster));
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [rasterReady, rasterMessage, dispatch]);
 
  return (
    <Plot
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
        width: 500, height: 450,
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

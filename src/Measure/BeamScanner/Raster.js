import React from "react";
import { useSelector } from 'react-redux'
import Plot from '../../Shared/Plotly';

export default function RasterGraph(props) {
  const rasterPlot = useSelector((state) => state.BeamScanner.rasterPlot);
  const measSpec = useSelector((state) => state.BeamScanner.measurementSpec)

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'amplitude',
        x: rasterPlot.x,
        y: props.type === "phase" ? rasterPlot.phase : rasterPlot.amp,
        type: 'scatter',
        mode: 'lines',
        showscale: false,
      }]}
      layout = {{
        autosize: true,
        height: 170,
        xaxis: {
          title: 'X [mm]',
          range: [measSpec.scanStart.x, measSpec.scanEnd.x],
          nticks: 10
        },
        yaxis: {
          title: props.type === "phase" ? 'Phase [deg]' : 'Amplitude [dB]',
          range: props.type === "phase" ? [-180, 180] : [-70, 0],
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
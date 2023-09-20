import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetSequence } from '../../Shared/AppEventSlice';
import Plot from "react-plotly.js";

export default function RFPowerGraph(props) {
  const rfPower = useSelector((state) => state.AppEvent.rfPower);
  const dispatch = useDispatch();

  useEffect(() => {
    if (rfPower.complete) {
      dispatch(resetSequence("sisCurrent"))
      props.onComplete();
    }
  }, [rfPower, dispatch, props]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'rfPower',
        x: rfPower.iter,
        y: rfPower.y,
        type: 'scatter',
        mode: 'lines',
        showscale: false,
      }]}
      layout = {{
        autosize: true,
        height: 170,
        width: 200,
        xaxis: {
          title: 'iteration',
          range: [0, 20],
          nticks: 5
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


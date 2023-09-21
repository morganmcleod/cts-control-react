import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetSequence } from '../../Shared/AppEventSlice';
import Plot from '../../Shared/Plotly';

export default function SISCurrentGraph(props) {
  const sisCurrent = useSelector((state) => state.AppEvent.sisCurrent);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sisCurrent.complete) {
      dispatch(resetSequence("sisCurrent"))
      props.onComplete();
    }
  }, [sisCurrent, dispatch, props]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'sisCurrent',
        x: sisCurrent.iter,
        y: sisCurrent.y,
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
          title: 'SIS current [uA]',
          range: [0, 70],
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
        staticPlot: false      
      }}
    />
  );
}


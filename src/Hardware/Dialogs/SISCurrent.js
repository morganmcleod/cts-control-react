import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { startSequence } from '../../Shared/AppEventSlice';
import Plot from "react-plotly.js";

export default function SISCurrent(props) {
  const sisCurrent = useSelector((state) => state.AppEvent.sisCurrent);
  const dispatch = useDispatch();
  const [x, setX] = useState([]);
  const [y, setY] = useState([])

  useEffect(() => {
    let xx = [];
    let yy = [];
    for (var o in sisCurrent) {
      if (o.iter === "complete") {
        dispatch(startSequence("sisCurrent"))
        props.onComplete();
      } else {
        xx.push(Number(o.iter));
        yy.push(Number(o.y));  
      }
    }
    setX(xx);
    setY(yy);
  }, [sisCurrent, dispatch, props]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'sisCurrent',
        x: x,
        y: y,
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
        staticPlot: false      
      }}
    />
  );
}


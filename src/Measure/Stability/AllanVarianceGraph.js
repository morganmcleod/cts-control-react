import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Plot from '../../Shared/Plotly';
import axios from "axios";
import TestTypes from '../../Shared/TestTypes';
import { setStabilityPlot } from "./StabilitySlice";

export default function AllanVarianceGraph(props) {
  const selectedTimeSeries = useSelector((state) => state.Stability.selectedTimeSeries);
  const stabilityPlot = useSelector((state) => state.Stability.stabilityPlot);
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const configId = cartConfig ? cartConfig.id : 0;
  const dispatch = useDispatch();

  let title = "Amplitude Stability";
  let textBox = "";
  if (stabilityPlot) {
    title = TestTypes.getText(stabilityPlot.fkTestType);
    textBox = "Config: " + configId + "<br>Test ID:" + stabilityPlot.fkCartTest + "<br>Time series:" + stabilityPlot.key
  }

  useEffect(() => {
    if (selectedTimeSeries === null) {
      setStabilityPlot(null);      
    } else {
      axios.get('/ampstability/allanvar/{}'.replace('{}', selectedTimeSeries))
      .then(res => {
        dispatch(setStabilityPlot(res.data));
      })
      .catch(error => {
        console.log(error);
      })
    }
  }, [dispatch, selectedTimeSeries]);

  return (
    <Plot      
      style = {{
        width: "auto"
      }}
      useResizeHandler
      data = {[{
        name: 'Allan variance',
        x: stabilityPlot ? stabilityPlot.x : null,
        y: stabilityPlot ? stabilityPlot.y : null,
        error_y: {
          data: stabilityPlot ? stabilityPlot.yError: null,
          type: 'data',
          visible: true
        },
        type: 'scatter',
        mode: 'lines',
        showscale: true,
      },
      {
        name: "spec",
        x: [0.05, 100],
        y: [4e-7, 4e-7],
        type: 'scatter',
        mode: 'lines',        
        showscale: true,
        line: {
          color: 'black'
        }
      },
      {
        name: "spec 300s",
        x: [300],
        y: [3e-6],
        type: 'scatter',
        mode: 'markers',
        showscale: true,
        marker: {
          color: 'black'
        }
      }]}
      layout = {{
        title: { 
          text: title,
          font: { size: 14}
        },
        autosize: true,
        height: 350,
        xaxis: {
          type: 'log',
          range: [-2, 2.7],
          title: 'T [sec]'
        },
        yaxis: {          
          type: 'log',
          range: [-9, -5],
          title: 'σ²(T)'
        },
        margin: {
          t: 40,
          b: 40,
          l: 80,
          r: 30
        },
        annotations: [
          {
            text: textBox,
            align: 'left',
            showarrow: false,
            xref: 'paper',
            yref: 'paper',
            x: 1.3,
            y: 0,
            bordercolor: 'black',
            borderwidth: 1
          }
        ]
      }}
      config = {{
        displayModeBar: false, 
        responsive: true,
        // staticPlot: true      
      }}
    />
  );
}


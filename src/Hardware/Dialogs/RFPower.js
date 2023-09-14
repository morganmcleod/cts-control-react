import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetPlot, addPoint } from "./XYPlotSlice";
import ActionWSContext from "../../Shared/ActionWSContext";
import Plot from "react-plotly.js";

export default function RFPower(props) {
  const plot = useSelector((state) => state.XYPlot.plot);
  const dispatch = useDispatch();
  const [actionWs, ready] = useContext(ActionWSContext);  

  useEffect(() => {
    let oldOnMessage = null;
    if (actionWs) {      
      if (ready) {
        oldOnMessage = actionWs.onmessage;
        actionWs.onmessage = (event) => {
          oldOnMessage(event);
          try {
            const msg = JSON.parse(event.data);
            if (msg.complete) {
              props.onComplete();
              if (oldOnMessage)
                actionWs.onmessage = oldOnMessage;
            } else {
              dispatch(addPoint({x: msg.index, y: msg.power}));              
            }
          } catch(err) {
            console.log(err);
          }
        }
      } else {
        if (oldOnMessage)
          actionWs.onmessage = oldOnMessage;
      }      
    }   
  }, [actionWs, ready, dispatch, props]);
  
  // Fetch on first render:
  useEffect(() => {
    dispatch(resetPlot());
  }, [dispatch, props.pol]);

  return (
    <Plot      
      style = {{
        width: "auto"     
      }}
      useResizeHandler
      data = {[{
        name: 'rfPower',
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
          title: 'RF Power [dB]',
          range: [-30, 10],
          nticks: 4
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


import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetPlot, addPoint } from "./XYPlotSlice";
import ActionWSContext from "../../Shared/ActionWSContext";
import Plot from "react-plotly.js";

export default function SISCurrent(props) {
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
              dispatch(addPoint({x: msg.index, y: msg.sisCurrent}));              
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
        staticPlot: false      
      }}
    />
  );
}


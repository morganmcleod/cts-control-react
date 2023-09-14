import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { resetPlot, addPoint } from "./XYPlotSlice";
import ActionWSContext from "../../Shared/ActionWSContext";
import Plot from "react-plotly.js";

export default function SISCurrent(props) {
  const plot = useSelector((state) => state.XYPlot.plot);
  const dispatch = useDispatch();
  const [actionWs, ready] = useContext(ActionWSContext);  
  const onComplete = props.onComplete;

  useEffect(() => {
    const handleMessage = (event) => {
      try {            
        const msg = JSON.parse(event.data);
        if (msg.complete) {
          onComplete();
        } else {
          console.log("addPoint pol" + props.pol);
          dispatch(addPoint({x: msg.index, y: msg.sisCurrent}));              
        }
      } catch(err) {
        console.log(err);
      }
    }
    if (actionWs && ready) {      
      actionWs.addEventListener("message", handleMessage);          
    }
    return () => {
      actionWs.removeEventListener("message", handleMessage);
    }   
  }, [actionWs, ready, dispatch, onComplete, props.pol]);
  
  // Fetch on first render:
  useEffect(() => {
    console.log("resetPlot pol" + props.pol)
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


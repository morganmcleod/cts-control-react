// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid'
import '../../components.css'

// HTTP and store
import axios from "axios";

export default function SystemStatus(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const lo = useSelector((state) => state.LO);
  const rf = useSelector((state) => state.RF);
  const measDescription = useSelector((state) => state.Measure.description);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
  }, []);

  // Periodic refresh timer
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    timer.current = setInterval(() => { 
      fetch() 
    }, props.interval ?? 5000);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [fetch, props.interval]);

  return(
    <Grid container spacing={0} className="component-data">
      <Grid item xs={1.5} className = "component-title">Measuring:</Grid>
      <Grid item xs={10.5}>{measDescription}</Grid>

      <Grid item xs={1.5} className="component-title">LO:</Grid>
      <Grid item xs={2}>{lo.YTO.loFreqGHz.toFixed(1)} GHz</Grid>
      <Grid item xs={2.5}>
        <Chip 
          label={lo.PLL.isLocked ? "LOCKED" : "UNLOCK"}
          color={lo.PLL.isLocked ? "success" : "error"}
          size="small"
        />
      </Grid>

      <Grid item xs={2} className = "component-title">IF Switch:</Grid>
      <Grid item xs={4}></Grid>
       
      <Grid item xs={1.5} className="component-title">RF:</Grid>
      <Grid item xs={2}>{rf.YTO.loFreqGHz.toFixed(1)} GHz</Grid>
      <Grid item xs={2.5}>
        <Chip 
          label={rf.PLL.isLocked ? "LOCKED" : "UNLOCK"}
          color={rf.PLL.isLocked ? "success" : "error"}
          size="small"
        />
      </Grid>

      <Grid item xs={2} className = "component-title">YIG Filter:</Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
}

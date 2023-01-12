// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from 'react-redux'

// UI components and style
import { Chip, Grid, Typography } from '@mui/material';
import '../../components.css'

export default function SystemStatus(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const lo = useSelector((state) => state.LO);
  const rf = useSelector((state) => state.RF);
  const description = useSelector((state) => state.Measure.description);
  const active = useSelector((state) => state.Measure.active);

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
    <Grid container paddingLeft="8px">
      <Grid item xs={12}>
        <Typography variant="body2" fontWeight="bold">System Status</Typography>
      </Grid>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Measuring:</Typography></Grid>
      <Grid item xs={2.5}>
        <Chip 
          label={active ? "RUNNING" : "STOPPED"}
          color={active ? "success" : "error"}
          size="small"
          style={{
            minWidth: '80%',
            width: '80%',
            minHeight: '80%',
            height: '80%'
          }}
        />
      </Grid>
      <Grid item xs={7}><Typography fontWeight="bold" paddingTop="2px">{description}</Typography></Grid>

      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">LO:</Typography></Grid>
      <Grid item xs={2.5}>
        <Chip 
          label={lo.PLL.isLocked ? "LOCKED" : "UNLOCKED"}
          color={lo.PLL.isLocked ? "success" : "error"}
          size="small"
          style={{
            minWidth: '80%',
            width: '80%',
            minHeight: '80%',
            height: '80%'
          }}
        />
      </Grid>
      <Grid item xs={2.2}><Typography fontWeight="bold" paddingTop="2px">{lo.YTO.loFreqGHz.toFixed(1)} GHz</Typography></Grid>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">IF Switch:</Typography></Grid>
      <Grid item xs={3}></Grid>

      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">RF:</Typography></Grid>
      <Grid item xs={2.5}>
        <Chip 
          label={rf.PLL.isLocked ? "LOCKED" : "UNLOCKED"}
          color={rf.PLL.isLocked ? "success" : "error"}
          size="small"
          style={{
            minWidth: '80%',
            width: '80%',
            minHeight: '80%',
            height: '80%'
          }}
        />
      </Grid>
      <Grid item xs={2.2}><Typography fontWeight="bold" paddingTop="2px">{rf.YTO.loFreqGHz.toFixed(1)} GHz</Typography></Grid>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">YIG Filter:</Typography></Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
}

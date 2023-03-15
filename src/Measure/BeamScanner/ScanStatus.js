// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

// UI components and style
import { Grid, Typography } from '@mui/material';

import localDate from '../../Shared/LocalDate';
import '../../components.css';

// HTTP and store
import axios from "axios";
import { setScanStatus } from './BeamScannerSlice';
import { setMeasureActive, setMeasureDescription } from '../Shared/MeasureSlice';

export default function ScanStatus(props) {
  // Redux store interfaces
  const scanStatus = useSelector((state) => state.BeamScanner.scanStatus);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/beamscan/scan_status')
    .then(res => {
      dispatch(setScanStatus(res.data));
      if (res.data.activeScan !== null && !res.data.measurementComplete) {
        dispatch(setMeasureActive(true));
        dispatch(setMeasureDescription("Beam patterns"));
      } else {
        dispatch(setMeasureActive(false));
        dispatch(setMeasureDescription(null));
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, [dispatch]);

  // Periodic refresh timer
  useEffect(() => {
    let isMounted = true;
  
    // first render load
    fetch();
    
    // periodic load
    const timer = setInterval(() => { 
      if (isMounted)
        fetch();
    }, props.interval ?? 5000);
    
    // return cleanup function
    return () => {
      isMounted = false;
      clearInterval(timer);      
    };
  }, [props.interval, fetch]);

  const timeStamp = scanStatus.timeStamp ? localDate(scanStatus.timeStamp) : "--";
  let amplitude = "--";
  if (scanStatus.amplitude > -300) {
    amplitude = scanStatus.amplitude.toFixed(2) + ' dB'
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="h6">Scan Status</Typography></Grid>
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">CartTest key:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{scanStatus.key}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">BeamPattern key:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{scanStatus.fkBeamPatterns}</Typography></Grid>
      
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Center power:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{amplitude}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Last measured:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{timeStamp}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Scan complete:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{scanStatus.scanComplete ? "Yes" : "No"}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Message:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{scanStatus.message}</Typography></Grid>
    </Grid>
  )
}

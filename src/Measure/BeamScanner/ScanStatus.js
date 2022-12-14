// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setScanStatus } from './BeamScannerSlice';
import { setActive, setDescription } from '../Shared/MeasureSlice';

export default function ScanStatus(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const scanStatus = useSelector((state) => state.BeamScanner.scanStatus);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/beamscan/scan_status')
    .then(res => {
      dispatch(setScanStatus(res.data));
      if (res.data.activeScan !== null && !res.data.measurementComplete) {
        dispatch(setActive(true));
        dispatch(setDescription("Beam patterns"));
      } else {
        dispatch(setActive(false));
        dispatch(setDescription(null));
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, [dispatch]);

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

  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={4} className="component-title">CartTest key:</Grid>
      <Grid item xs={8}>{scanStatus.fkCartTest}</Grid>

      <Grid item xs={4} className="component-title">BeamPattern key:</Grid>
      <Grid item xs={8}>{scanStatus.fkBeamPatterns}</Grid>
      
      <Grid item xs={4} className="component-title">Center power:</Grid>
      <Grid item xs={8}>{scanStatus.amplitude}&nbsp;dB</Grid>

      <Grid item xs={4} className="component-title">Last measured:</Grid>
      <Grid item xs={8}>{scanStatus.timeStamp}</Grid>

      <Grid item xs={4} className="component-title">Scan complete:</Grid>
      <Grid item xs={8}>{scanStatus.scanComplete ? "Yes" : "No"}</Grid>

      <Grid item xs={4} className="component-title">Message:</Grid>
      <Grid item xs={8}>{scanStatus.message}</Grid>
    </Grid>
  )
}

// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setTempSensors } from './TemperaturesSlice'

export default function Temperatures(props) {
    // Redux store interfaces
    const tempSensors = useSelector((state) => state.Temperatures.tempSensors);
    const dispatch = useDispatch();

    // Only fetch data when mounted
    const isMounted = useRef(false);
    const timer = useRef(0);

    // Load data from REST API
    const fetch = useCallback(() => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = 0;
      }
      if (isMounted.current) {
        axios.get(`/tempmonitor/sensors`)
          .then(res => {
            dispatch(setTempSensors(res.data));
            timer.current = setTimeout(() => {fetch()}, props.interval ?? 5000);
          })
          .catch(error => {
            console.log(error);
          })
        }
    }, [dispatch, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  return (
    <Grid container paddingLeft="8px" paddingTop="8px">
      <Grid item xs={12}><Typography variant="subtitle2" fontWeight="bold">Temperature Sensors</Typography></Grid>
      

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[0]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[0].toFixed(2)} K</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[4]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[4].toFixed(2)} K</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[1]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[1].toFixed(2)} K</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[5]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[5].toFixed(2)} K</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[2]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[2].toFixed(2)} K</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[6]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[6].toFixed(2)} K</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[3]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[3].toFixed(2)} K</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">{tempSensors.descriptions[7]}:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{tempSensors.temps[7].toFixed(2)} K</Typography></Grid>
    </Grid>
  );
}

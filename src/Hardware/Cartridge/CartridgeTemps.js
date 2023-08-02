// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setTemperatures } from './CartridgeSlice'

export default function CartridgeTemps(props) {
    // Redux store interfaces
    const temps = useSelector((state) => state.Cartridge.Temperatures);
    const dispatch = useDispatch();

    // Only fetch data when mounted
    const isMounted = useRef(false);

    // Load data from REST API
    const fetch = useCallback(() => {
      if (isMounted.current) {
        axios.get(`/cca/tempsensors`)
          .then(res => {
            dispatch(setTemperatures(res.data));
            setTimeout(() => {fetch()}, props.interval ?? 5000);
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
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">Temperatures</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">mixer pol0:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{temps.temp2.toFixed(2)} K</Typography></Grid>
      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">pol1:</Typography></Grid>
      <Grid item xs={4}><Typography fontWeight="bold" paddingTop="2px">{temps.temp5.toFixed(2)} K</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">4K:</Typography></Grid>
      <Grid item xs={2}><Typography fontWeight="bold" paddingTop="2px">{temps.temp0.toFixed(2)} K</Typography></Grid>
      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">15K:</Typography></Grid>
      <Grid item xs={4}><Typography fontWeight="bold" paddingTop="2px">{temps.temp4.toFixed(2)} K</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">110K:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px">{temps.temp1.toFixed(2)} K</Typography></Grid>
    </Grid>
  );
}

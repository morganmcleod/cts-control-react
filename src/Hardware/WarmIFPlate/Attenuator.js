// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setAttenuation } from './WarmIFPlateSlice';

export default function Attenuator(props) {
    // Redux store interfaces
    const atten = useSelector((state) => state.WarmIFPlate.attenuation);
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
        axios.get(`/warmif/attenuation`)
          .then(res => {
            dispatch(setAttenuation(res.data.value));
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
      <Grid item xs={12}><Typography variant="subtitle2" fontWeight="bold">IF Attenuator</Typography></Grid>
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Attenuation:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold" paddingTop="2px">{atten} dB</Typography></Grid>
    </Grid>
  );
}

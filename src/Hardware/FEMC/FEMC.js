// React and Redux
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import {   
  setFemcVersion,
  setAmbsiVersion,
  setEsnString
 } from './FEMCSlice'

export default function FEMC(props) {
  // Redux store interfaces
  const femcVersion = useSelector((state) => state.FEMC.femcVersion);
  const ambsiVersion = useSelector((state) => state.FEMC.ambsiVersion);
  const esnString = useSelector((state) => state.FEMC.esnString);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(`/femc/femcversion`)
      .then(res => {
        dispatch(setFemcVersion(res.data.message));
      })
      .catch(error => {
        console.log(error);
      })
    axios.get(`/femc/ambsiversion`)
      .then(res => {
        dispatch(setAmbsiVersion(res.data.message));
      })
      .catch(error => {
        console.log(error);
      })
    axios.get(`/femc/esnstring`)
      .then(res => {
        dispatch(setEsnString(res.data.message));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch]);

  // Fetch on first render:
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Grid container paddingLeft="5px" paddingBottom="15px">
      <Grid item xs={6}><Typography variant="body1" fontWeight="bold">ESNS</Typography></Grid>
      <Grid item xs={6}><Typography variant="body1" fontWeight="bold">FEMC Info</Typography></Grid>
      
      <Grid item xs={6}><Typography variant="body1" paddingTop="4px">{esnString}</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body1" paddingTop="4px">FEMC Version: <b>{femcVersion}</b></Typography></Grid>
      <Grid item xs={3}><Typography variant="body1" paddingTop="4px">AMBSI Version: <b>{ambsiVersion}</b></Typography></Grid>
    </Grid>
  );
}
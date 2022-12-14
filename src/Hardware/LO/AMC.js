// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetAMC } from './LOSlice'
import { rfSetAMC } from './RFSlice'

export default function AMC(props) {
  // Periodic refresh timer
  const timer = useRef(null);

  // Redux store interfaces
  const amc = useSelector((state) => props.isRfSource ? state.RF.AMC : state.LO.AMC);
  const dispatch = useDispatch();
  
  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(prefix + '/amc')
      .then(res => {
        dispatch(props.isRfSource? rfSetAMC(res.data) : loSetAMC(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, prefix, props.isRfSource]);

  // Periodic refresh timer
  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    } else {
      // First time: refresh now.
      fetch();
    }
    timer.current = setInterval(() => { 
      fetch();
    }, props.interval ?? 5000);
    // Return the timer cleanup function:
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [props.interval, fetch]);

  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={12} className="component-header">AMC</Grid>
      
      <Grid item xs={3}></Grid>
      <Grid item className="component-title" xs={3}>VD [V]</Grid>
      <Grid item className="component-title" xs={3}>ID [mA]</Grid>
      <Grid item className="component-title" xs={2}>VG [V]</Grid>
      
      <Grid item xs={3} className="component-title">stage A:</Grid>
      <Grid item xs={3}>{amc.VDA}</Grid>
      <Grid item xs={3}>{amc.IDA}</Grid>
      <Grid item xs={3}>{amc.VGA}</Grid>

      <Grid item xs={3} className="component-title">stage B:</Grid>
      <Grid item xs={3}>{amc.VDB}</Grid>
      <Grid item xs={3}>{amc.IDB}</Grid>
      <Grid item xs={3}>{amc.VGB}</Grid>

      <Grid item xs={3} className="component-title">stage E:</Grid>
      <Grid item xs={3}>{amc.VDE}</Grid>
      <Grid item xs={3}>{amc.IDE}</Grid>
      <Grid item xs={3}>{amc.VGE}</Grid>

      <Grid item xs={3}></Grid>
      <Grid item xs={3} className="component-title">counts</Grid>
      <Grid item xs={6} className="component-title">current [mA]</Grid>

      <Grid item xs={3} className="component-title">mult D:</Grid>
      <Grid item xs={3}>{amc.multDCounts}</Grid>
      <Grid item xs={6}>{amc.multDCurrent}</Grid>          

      <Grid item xs={3} className="component-title">5V supply:</Grid>
      <Grid item xs={9}>{amc.supply5V}</Grid>
      
    </Grid>
  );
}

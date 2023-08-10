// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetAMC } from './LOSlice'
import { rfSetAMC } from './RFSlice'

export default function AMC(props) {
  // Redux store interfaces
  const amc = useSelector((state) => props.isRfSource ? state.RF.AMC : state.LO.AMC);
  const dispatch = useDispatch();
  
  // URL prefix
  const prefix = props.isRfSource ? '/rfsource' : '/lo'

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
      axios.get(prefix + '/amc')
        .then(res => {
          dispatch(props.isRfSource? rfSetAMC(res.data) : loSetAMC(res.data));
          timer.current = setTimeout(() => {fetch()}, props.interval ?? 5000);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [dispatch, prefix, props.isRfSource, props.interval]);

  // Fetch on first render:
  useEffect(() => {
    isMounted.current = true;
    fetch();
    return () => { isMounted.current = false; };
  }, [fetch]);

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">AMC</Typography></Grid>
      
      <Grid item xs={3}></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">VD [V]</Typography></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">ID [mA]</Typography></Grid>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">VG [V]</Typography></Grid>
      
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">stage A:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VDA}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.IDA}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VGA}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">stage B:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VDB}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.IDB}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VGB}</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">stage E:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VDE}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.IDE}</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.VGE}</Typography></Grid>

      <Grid item xs={3}></Grid>
      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">counts</Typography></Grid>
      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">current [mA]</Typography></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">mult D:</Typography></Grid>
      <Grid item xs={3}><Typography fontWeight="bold" paddingTop="2px">{amc.multDCounts}</Typography></Grid>
      <Grid item xs={6}><Typography fontWeight="bold" paddingTop="2px">{amc.multDCurrent}</Typography></Grid>          

      <Grid item xs={3}><Typography variant="body2" paddingTop="4px">5V supply:</Typography></Grid>
      <Grid item xs={9}><Typography fontWeight="bold" paddingTop="2px">{amc.supply5V}</Typography></Grid>
      
    </Grid>
  );
}

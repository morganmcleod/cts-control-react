// React and Redux
import React, { useCallback, useEffect } from "react";
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

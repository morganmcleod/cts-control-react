// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Chip, Grid, Typography } from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { loSetPLL } from '../../Hardware/LO/LOSlice'
import { rfSetPLL } from '../../Hardware/LO/RFSlice'
import { setInputSwitch, setYIGFilter} from '../../Hardware/WarmIFPlate/WarmIFPlateSlice'

export default function SystemStatus(props) {
  // Periodic refresh timer
  const timer = useRef(null);
  
  // Redux store interfaces
  const lo = useSelector((state) => state.LO);
  const rf = useSelector((state) => state.RF);
  const description = useSelector((state) => state.Measure.description);
  const active = useSelector((state) => state.Measure.active);
  const inputSwitch = useSelector((state) => state.WarmIFPlate.inputSwitch);
  const yigFilter = useSelector((state) => state.WarmIFPlate.yigFilter);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get('/lo/pll')
    .then(res => {
      dispatch(loSetPLL(res.data));
    })
    .catch(error => {
      console.log(error);
    })

    axios.get('/rfsource/pll')
    .then(res => {
      dispatch(rfSetPLL(res.data));
    })
    .catch(error => {
      console.log(error);
    })
    
    axios.get('/warmif/inputswitch')
      .then(res => {
        dispatch(setInputSwitch(res.data.message));
      })
      .catch(error => {
        console.log(error);
      })
    
      axios.get('/warmif/yigfilter')
      .then(res => {
        dispatch(setYIGFilter(Number(res.data.value)));
      })
      .catch(error => {
        console.log(error);
      })
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

  return(
    <Grid container paddingLeft="8px">
      <Grid item xs={12}>
        <Typography variant="body2" fontWeight="bold">System Status</Typography>
      </Grid>
      
      <Grid item xs={2}><Typography variant="subtitle2" paddingTop="4px">Measuring:</Typography></Grid>
      <Grid item xs={3} align="center">
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

      <Grid item xs={2}><Typography variant="subtitle2" paddingTop="4px">LO:</Typography></Grid>
      <Grid item xs={3} align="center">
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
      <Grid item xs={2.5}><Typography fontWeight="bold" paddingTop="2px">{lo.PLL.loFreqGHz.toFixed(1)} GHz</Typography></Grid>
      <Grid item xs={2}><Typography variant="subtitle2" paddingTop="4px">IF Switch:</Typography></Grid>
      <Grid item xs={2.5}><Typography fontWeight="bold" paddingTop="2px">{inputSwitch}</Typography></Grid>

      <Grid item xs={2}><Typography variant="subtitle2" paddingTop="4px">RF:</Typography></Grid>
      <Grid item xs={3} align="center">
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
      <Grid item xs={2.5}><Typography fontWeight="bold" paddingTop="2px">{rf.PLL.loFreqGHz.toFixed(1)} GHz</Typography></Grid>
      <Grid item xs={2}><Typography variant="subtitle2" paddingTop="4px">YIG Filter:</Typography></Grid>
      <Grid item xs={2.5}><Typography fontWeight="bold" paddingTop="2px">{yigFilter.toFixed(2)} GHz</Typography></Grid>
    </Grid>
  );
}

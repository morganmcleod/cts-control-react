// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Grid,
  Typography,
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setColdLoadState } from './NoiseTempSlice';

export default function ColdLoad(props) {
  // Redux store interfaces
  const coldLoad = useSelector((state) => state.NoiseTemp.coldLoad);
  const dispatch = useDispatch();

  // Only fetch data when mounted
  const isMounted = useRef(false);
  const timer = useRef(0);

  const fetch = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = 0;
    }
    if (isMounted.current) {
      axios.get('/coldload/state')
        .then(res => {
          dispatch(setColdLoadState(res.data));
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
    <Grid container paddingLeft="5px">
      <Grid item xs={12}>
        <Typography variant="body2" fontWeight="bold">Cold Load</Typography>        
      </Grid>      
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Fill Mode:</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography fontWeight="bold">{coldLoad.fillModeText}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Fill State:</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography fontWeight="bold">{coldLoad.fillStateText}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Level:</Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography fontWeight="bold">{coldLoad.level}%</Typography>
      </Grid>
    </Grid> 
  );
}

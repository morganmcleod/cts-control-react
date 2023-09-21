// React and Redux
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Grid,
  Typography
} from '@mui/material';
import '../../components.css'
import localDate from '../../Shared/LocalDate';

// HTTP and store
import axios from "axios";
import { setMeasurementStatus } from './MeasureSlice';

export default function MeasurementStatus(props) {
  // Periodic refresh timer
  const timer = useRef(null);

  // Redux store interfaces
  const measurementStatus = useSelector((state) => state.Measure.measurementStatus);
  const dispatch = useDispatch();

  // Load current test status from REST API
  const fetch = useCallback(() => {
    axios.get('/measure/status')
    .then(res => {
      dispatch(setMeasurementStatus(res.data));
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
    
  const timeStamp = measurementStatus.timeStamp ? localDate(measurementStatus.timeStamp) : "--";

  return (
    <Grid container paddingLeft="8px" paddingTop="8px">
      <Grid item xs={12}>
        <Typography variant="body2" fontWeight="bold">Measurement Status</Typography>        
      </Grid>
      
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">CartTest key:</Typography
      ></Grid>
      <Grid item xs={8}>
        <Typography fontWeight="bold">{measurementStatus.cartTest ? measurementStatus.cartTest.key : 0}</Typography>
      </Grid>
      
      { props.childKeyName &&
        <React.Fragment>
          <Grid item xs={4}><Typography variant="body2" paddingTop="4px">{props.childKeyName}:</Typography></Grid>
          <Grid item xs={8}><Typography fontWeight="bold">{measurementStatus.childKey}</Typography></Grid>
        </React.Fragment>
      }
      
      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Updated:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{timeStamp}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">Step complete:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{measurementStatus.stepComplete ? "Yes" : "No"}</Typography></Grid>

      <Grid item xs={4}><Typography variant="body2" paddingTop="4px">All complete:</Typography></Grid>
      <Grid item xs={8}><Typography fontWeight="bold">{measurementStatus.allComplete ? "Yes" : "No"}</Typography></Grid>

      <Grid item xs={12}><Typography variant="body2" paddingTop="4px">Message:</Typography></Grid>
      <Grid item xs={12}>
        <Typography fontWeight="bold" bgcolor={measurementStatus.error ? "error" : "default"}>{measurementStatus.message}&nbsp;</Typography>
      </Grid>
    </Grid>
  );
}

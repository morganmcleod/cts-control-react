// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material';
import MixerParam from './MixerParam';
import '../components.css';

// HTTP and store
import axios from "axios";
import { setMixerParams } from './CartBiasSlice';
import localDate from "../Shared/LocalDate";

export default function MixerBias(props) {
  // Redux store interfaces
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const mixerParams = useSelector((state) => state.CartBias.mixerParams[props.pol]);
  const configKeys = useSelector((state) => state.CartBias.configKeys[props.pol]);
  const refresh = useSelector((state) => state.CartBias.refresh);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    if (cartConfig && configKeys) {
      axios.get('/database/config/mixer_params/', {params: {keyChip: configKeys.keyChip1}})
        .then(res => {
          dispatch(setMixerParams({pol: props.pol, sis: 1, data: res.data.items}));
        })
        .catch(error => {
          console.log(error);
        });
    }
    if (cartConfig && configKeys) {
      axios.get('/database/config/mixer_params/', {params: {keyChip: configKeys.keyChip2}})
        .then(res => {
          dispatch(setMixerParams({pol: props.pol, sis: 2, data: res.data.items}));
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [dispatch, props.pol, cartConfig, configKeys])

  // if refresh is incremented, "click" the SET and ENABLE buttons
  const lastRefresh = useRef(null);
  useEffect(() => {
    if (refresh !== lastRefresh.current) {
      lastRefresh.current = refresh;
      fetch();
    }
  }, [fetch, refresh]);

  const ts1 = mixerParams.sis1[0] ? localDate(mixerParams.sis1[0].timeStamp) : "--";
    
  const colw = 12/6;  
  return (
    <>
      <Grid container spacing={0} sx={{borderBottom: 1}}>
        <Grid item xs={3}>
          <Typography variant="body2" display="inline"><b>SIS Pol {props.pol}</b></Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" display="inline" color="Highlight">SN:&nbsp;&nbsp;{configKeys ? configKeys.snMixer : '--'}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" display="inline" color="Highlight">chip1:&nbsp;&nbsp;{configKeys ? configKeys.snChip1 : '--'}</Typography>
        </Grid>
        <Grid item xs={3} paddingBottom="8px"/>
        <Grid item xs={3} paddingBottom="8px">
          <Typography variant="body2" display="inline" color="Highlight">ID:&nbsp;&nbsp;{configKeys ? configKeys.keyMixer : '--'}</Typography>
        </Grid>
        <Grid item xs={6} paddingBottom="8px">
          <Typography variant="body2" display="inline" color="Highlight">chip2:&nbsp;&nbsp;{configKeys ? configKeys.snChip2 : '--'}</Typography>
        </Grid>
        <Grid item xs={colw} paddingLeft="3px"><Typography variant="body2">LO</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">VJ1</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">IJ1</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">VJ2</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">IJ2</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">IMAG</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[GHz]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mV]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mV]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
      </Grid>
      <Grid container spacing={0}>
        {mixerParams.sis1.map((item, index) => (
          <React.Fragment key={props.pol + index}>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {1}
              index = {index}
              item = 'FreqLO'
            ></MixerParam>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {1}
              index = {index}
              item = 'VJ'
            ></MixerParam>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {1}
              index = {index}
              item = 'IJ'
            ></MixerParam>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {2}
              index = {index}
              item = 'VJ'
            ></MixerParam>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {2}
              index = {index}
              item = 'IJ'
            ></MixerParam>
            <MixerParam
              xsWidth = {colw}
              pol = {props.pol}
              sis = {1}
              index = {index}
              item = 'IMAG'
            ></MixerParam>
          </React.Fragment>
        ))}
      <Grid item xs={12-colw}>
        <Typography variant="body2" color="Highlight" align="right">
          {ts1}
        </Typography>        
      </Grid>
      <Grid item xs={colw}/>
      </Grid>
    </>
  );
}

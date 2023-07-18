// React and Redux
import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material';
import PreampParam from './PreampParam';
import localDate from "../Shared/LocalDate";
import '../components.css';

// HTTP and store
import axios from "axios";
import { setPreampParams } from './CartBiasSlice';

export default function PreampBias(props) {
  // Redux store interfaces
  const cartConfig = useSelector((state) => state.CartBias.cartConfig);
  const preampParams = useSelector((state) => state.CartBias.preampParams[props.pol]);
  const configKeys = useSelector((state) => state.CartBias.configKeys[props.pol]);
  const keyPreamp = configKeys ? ((props.lna === 2) ? configKeys.keyPreamp2 : configKeys.keyPreamp1) : null;
  const snPreamp =  configKeys ? ((props.lna === 2) ? configKeys.snPreamp2 : configKeys.snPreamp1) : null;
  const refresh = useSelector((state) => state.CartBias.refresh);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    if (cartConfig && keyPreamp) {
      axios.get('/database/config/preamp_params/', {params: {keyPreamp: keyPreamp}})
        .then(res => {
          dispatch(setPreampParams({pol: props.pol, lna: props.lna, data: res.data.items}));
        })
        .catch(error => {
          console.log(error);
        });
    }    
  }, [dispatch, props.pol, props.lna, cartConfig, keyPreamp])

  // if refresh is incremented, "click" the SET and ENABLE buttons
  const lastRefresh = useRef(null);
  useEffect(() => {
    if (refresh !== lastRefresh.current) {
      lastRefresh.current = refresh;
      fetch();
    }
  }, [fetch, refresh]);

  const lna = 'lna' + props.lna;
  const ts1 = preampParams[lna][0] ? localDate(preampParams[lna][0].timeStamp) : "--";
  
  const colw = 12/7;
  return (
    <>
      <Grid container spacing={0} sx={{borderBottom: 1}}>
        <Grid item xs={3}>
          <Typography variant="body2" display="inline"><b>LNA{props.lna} Pol {props.pol}</b></Typography>
        </Grid>
        <Grid item xs={9}/>
        <Grid item xs={4} paddingBottom="8px"/>
        <Grid item xs={4} paddingBottom="8px">
          <Typography variant="body2" display="inline" color="Highlight">ID:&nbsp;&nbsp;{keyPreamp ?? '--'}</Typography>
        </Grid>
        <Grid item xs={4} paddingBottom="8px">
          <Typography variant="body2" display="inline" color="Highlight">SN:&nbsp;&nbsp;{snPreamp ?? '--'}</Typography>
        </Grid>
        <Grid item xs={colw} paddingLeft="3px"><Typography variant="body2">LO</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">VD1</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">VD2</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">VD3</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">ID1</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">ID2</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">ID3</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[GHz]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[V]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[V]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[V]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
        <Grid item xs={colw}><Typography variant="body2">[mA]</Typography></Grid>
      </Grid>
      <Grid container spacing={0}>
        {preampParams[lna].map((item, index) => (
          <React.Fragment key={props.pol + index}>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'FreqLO'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'VD1'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'VD2'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'VD3'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'ID1'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'ID2'
            ></PreampParam>
            <PreampParam
              xsWidth = {colw}
              pol = {props.pol}
              lna = {props.lna}
              index = {index}
              item = 'ID3'
            ></PreampParam>
          </React.Fragment>
        ))}
        <Grid item xs={12 - colw}>
          <Typography variant="body2" color="Highlight" align="right">
            {ts1}
          </Typography>        
        </Grid>
        <Grid item xs={colw}/>
        <Grid item xs={12}>&nbsp;</Grid>
      </Grid>
    </>
  );
}

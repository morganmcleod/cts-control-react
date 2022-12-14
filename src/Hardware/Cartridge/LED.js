// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import EnableButton from '../../Shared/EnableButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setLED } from './CartridgeSlice'

export default function LED(props) {
  // Redux store interfaces
  const leds = useSelector((state) => state.Cartridge.LED);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(`/cca/lna/led`, { params: {pol: props.pol}})
      .then(res => {
        // The LED enable state is returned as 'value'
        dispatch(setLED({pol: props.pol, data: res.data.value}));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.pol]);

  // Load only on first render
  useEffect(() => {
    fetch();
  }, [fetch]);
  
  // ENABLE button handler
  const onClickEnable = (e) => {
    const enable = e.currentTarget.value !== 'true';
    console.log('onClickEnable ' + enable);
    dispatch(setLED({pol: props.pol, data: {enable: enable}}));

    axios.put("/cca/lna/led", {pol: props.pol, enable: enable})
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container className="component-data">
      <Grid item xs={12} className="component-header">LNA LED</Grid>
      <Grid item xs={12}>
        <EnableButton
          enableColor="green"
          enable={leds[props.pol].enable}
          onClick={(e) => onClickEnable(e)}
        ></EnableButton>
      </Grid>
    </Grid>
  );
}

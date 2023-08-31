// React and Redux
import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { Grid, Typography } from '@mui/material'
import EnableButton from '../../Shared/EnableButton';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setHeaterEnable, setHeaterCurrent } from './CartridgeSlice'

export default function Heater(props) {
  // Redux store interfaces
  const heaters = useSelector((state) => state.Cartridge.Heater);
  const dispatch = useDispatch();

  // Load data from REST API
  const fetch = useCallback(() => {
    axios.get(`/cca/sis/heater`, {params: {pol: props.pol}})
      .then(res => {
        // only the heater current is returned as 'value'
        dispatch(setHeaterCurrent({pol: props.pol, data: res.data.value}));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.pol]);

  // Load only on first render
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Handler for ENABLE button
  const onClickEnable = (e) => {
    const enable = e.currentTarget.value !== 'true';
    console.log('onClickEnable ' + enable);
    dispatch(setHeaterEnable({pol: props.pol, data: enable }));
    axios.put("/cca/sis/heater", {value: enable}, {params: {pol: props.pol}})
      .then(res => {
        const result = res.data;
        console.log(result);
        if (result.success) {
          fetch();
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="body1" fontWeight="bold">SIS HEATER</Typography></Grid>
      <Grid item xs={12}>
        <EnableButton
          enableColor="red"
          enable={heaters[props.pol].enable}
          onClick={(e) => onClickEnable(e)}
        ></EnableButton>
      </Grid>
      <Grid item xs={4.5}><Typography variant="body2" paddingTop="4px">current:</Typography></Grid>
      <Grid item xs={7}><Typography fontWeight="bold" paddingTop="2px">{heaters[props.pol].current} mA</Typography></Grid>
    </Grid>
  )
}

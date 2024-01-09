// React and Redux
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Button,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { 
  resetYFactorPlot,
  setYFactorAtten,
  setYFactorYIGFilter,
  setYFactorInput,
  setYFactorStarted
} from './NoiseTempSlice';

import './YFactorControls.css'

import AppController from "../../Shared/AppController";

export default function YFactorControls(props) {
  const yFactorState = useSelector((state) => state.NoiseTemp.yFactorState);
  const commonSettings = useSelector((state) => state.NoiseTemp.commonSettings);
  const dispatch = useDispatch();
  
  const handleClickStart = () => {
    dispatch(setYFactorStarted(true));
    AppController.onMeasurement(true, "Y-factor");
    axios.post("/noisetemp/yfactor/start")
      .then(res => {
        console.log(res.data);
        dispatch(resetYFactorPlot())      
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleClickStop = () => {
    dispatch(setYFactorStarted(false));
    AppController.onMeasurement(false);
    axios.post("/noisetemp/yfactor/stop")
      .then(res => {
        console.log(res.data);        
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleChangeSetting = (e) => {
    const value = e.target.value;

    switch (e.target.name) {
      case "atten":
        dispatch(setYFactorAtten(value));
        if (isNaN(value))
          return false;
        if (value === '')
          return false;
        if (value < 0 || value > 121)
          return false;

        axios.post("/warmif/attenuation", null, {params: {'value': value}})
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          })
        break;

      case "yigfilter":
        dispatch(setYFactorYIGFilter(value));
        if (isNaN(value))
          return false;
        if (value === '')
          return false;
        if (value < 4 || value > 12)
          return false;

        axios.post("/warmif/yigfilter", null, {params: {'value': value}})
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          })
        break;
      case "input":
        dispatch(setYFactorInput(value));
        axios.post("/warmif/inputswitch", null, {params: {'value': value}})
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          })
        break;
      default:
        break;
    }
  }

  return (
    <Grid container>
      <Grid item xs={2.5}>
        <Typography variant="body2" paddingTop="4px">Cold load Teff:</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2" paddingTop="4px" fontWeight="bold">{commonSettings.tColdEff} K</Typography>
      </Grid>
      <Grid item xs={1.5}>
        <Typography variant="body2" paddingTop="4px">Input:</Typography>
      </Grid>
      <Grid item xs={2.5} align="left">
        <Select
          name="input"
          labelId="input-label"
          id="input-select"
          size="small"
          className="smallselect"
          value={yFactorState.input}
          disabled={props.disabled}
          onChange={e => {handleChangeSetting(e)}}
        >
          <MenuItem value={0}>POL0_USB</MenuItem>
          <MenuItem value={1}>POL0_LSB</MenuItem>
          <MenuItem value={2}>POL1_USB</MenuItem>
          <MenuItem value={3}>POL1_LSB</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={3.5} align="center">
        <Button
          variant="contained"
          disabled={props.disabled || yFactorState.started}
          style={{minWidth: "45%"}}
          onClick={e => handleClickStart()}
        >
          Start
        </Button>
      </Grid>
      
      <Grid item xs={2.2}>
        <Typography variant="body2" paddingTop="4px">IF attenuator:</Typography>
      </Grid>
      <Grid item xs={2.3}>
        <OutlinedInput
          name="atten"
          disabled={props.disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: "50%"}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {yFactorState.atten}
        />
        <Typography variant="body2" paddingTop="4px" fontWeight="bold" display="inline">&nbsp;&nbsp;dB</Typography>
      </Grid>
      <Grid item xs={1.5}>
        <Typography variant="body2" paddingTop="4px">YIG filter:</Typography>
      </Grid>
      <Grid item xs={2.5} align="left">
        <OutlinedInput
          name="yigfilter"
          disabled={props.disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: "70%"}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {yFactorState.yigFilter}
        />
        <Typography variant="body2" paddingTop="4px" fontWeight="bold" display="inline">&nbsp;&nbsp;GHz</Typography>
      </Grid>
      <Grid item xs={3.5} align="center">
        <Button
          variant="contained"
          disabled={props.disabled || !yFactorState.started}
          style={{minWidth: "45%"}}
          onClick={e => handleClickStop()}
        >
          Stop
        </Button>
      </Grid>

      <Grid item xs={8.5}/>
      <Grid item xs={3.5} align="center" paddingTop="2px" paddingBottom="10px">
        <Button
          variant="contained"
          disabled={props.disabled}
          style={{minWidth: "45%"}}
          onClick={e => dispatch(resetYFactorPlot())}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  );
}

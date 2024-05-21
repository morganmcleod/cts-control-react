// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Grid,
  OutlinedInput,
  Typography,
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setWarmIFSettings } from './NoiseTempSlice';

export default function WarmIFSettings(props) {
  // Input debouncing timer
  const timer = useRef(null);
  
  const disabled = props.disabled;

  // Redux store interfaces
  const settings = useSelector((state) => state.NoiseTemp.warmIFSettings);
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    axios.get('/noisetemp/wifsettings')
      .then(res => {
        dispatch(setWarmIFSettings(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch]);

  // Initial fetch of contents
  useEffect(() => {
    fetch();
  }, [fetch]);

  const validateSettings = (settings) => {
    const items = [
      settings.attenStart,
      settings.attenStop,
      settings.attenStep,
      settings.ifStart,
      settings.ifStop,
      settings.ifStep,
      settings.diodeVoltage,
      settings.diodeCurrentLimit,
      settings.diodeEnr
    ]
    for (const item of items) {
      if (isNaN(item))
        return false;
      if (item === '')
        return false;
    }
    if (settings.attenStop < settings.attenStart)
      return false;
    if (settings.ifStop < settings.ifStart)
      return false;
    console.log("warmIFSettings is valid")
    return true;
  }

  // Debounced change hadler:  Won't write to back end more often than once per second.
  const handleChangeSetting = (e) => {
    switch (e.target.name) {
      case "attenStart":
      case "attenStop":
      case "attenStep":
      case "ifStart":
      case "ifStop":
      case "ifStep":
      case "diodeVoltage":
      case "diodeCurrentLimit":
      case "diodeEnr":
        let newSettings = Object.assign({}, settings);
        newSettings[e.target.name] = e.target.value;
        // Clear any existing timer
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        // Save to the redux store:
        dispatch(setWarmIFSettings(newSettings));
        if (validateSettings(newSettings)) {
          // Set a timer to write back to the back-end
          timer.current = setTimeout(() => {        
            // Stop the timer before writing:
            clearTimeout(timer.current);
            timer.current = null;  
            axios.post('/noisetemp/wifsettings', newSettings)
              .then(res => {
                console.log(res.data);
              })
              .catch(error => {
                console.log(error);
              }); 
          }, 1000);
        }
        break;
      default:
        break;
    }
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}>
        <Typography variant="subtitle2" fontWeight="bold" paddingTop="8px">
          Warm IF Noise settings
        </Typography>
      </Grid>
      
      <Grid item xs={3}/>
      <Grid item xs={3} align="center" paddingTop="4px"><Typography variant="body2">Atten [dB]</Typography></Grid>
      <Grid item xs={3} align="center" paddingTop="4px"><Typography variant="body2">IF [GHz]</Typography></Grid>
      <Grid item xs={3}/>
  
      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Start:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="attenStart"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.attenStart}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="ifStart"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.ifStart}
        />
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Stop:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="attenStop"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.attenStop}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="ifStop"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.ifStop}
        />
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Step:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="attenStep"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.attenStep}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="ifStep"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.ifStep}
        />
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={12}>
        <Typography variant="subtitle2" fontWeight="bold" paddingTop="8px">
          Noise source diode
        </Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Voltage:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="diodeVoltage"
          disabled={true}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.diodeVoltage}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;V</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Current limit:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="diodeCurrentLimit"
          disabled={true}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.diodeCurrentLimit}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;A</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">ENR:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="diodeEnr"
          disabled={true}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.diodeEnr}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dB</Typography>
      </Grid>

    </Grid> 
  );
}

// React and Redux
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Checkbox,
  Grid,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setCommonSettings } from './NoiseTempSlice';
import store from '../../store';

const fetchCommonSettings = () => {
  axios.get('/noisetemp/settings')
  .then(res => {
    store.dispatch(setCommonSettings(res.data));    
  })
  .catch(error => {
    console.log(error);
  })
}
export { fetchCommonSettings }

export default function CommonSettings(props) {  
  // Input debouncing timer
  const timer = useRef(null);
  
  const disabled = props.disabled;

  // Redux store interfaces
  const settings = useSelector((state) => state.NoiseTemp.commonSettings);
  const dispatch = useDispatch();

  // Initial fetch of contents
  useEffect(() => {
    fetchCommonSettings();
  }, []);

  const validateSettings = (settings) => {
    const items = [
      settings.sensorAmbient,
      settings.targetPHot,
      settings.targetSidebandPower,
      settings.chopperSpeed,
      settings.powerMeterConfig.minS,
      settings.powerMeterConfig.maxS,
      settings.powerMeterConfig.stdErr,
      settings.powerMeterConfig.timeout
    ]
    for (const item of items) {
      if (isNaN(item))
        return false;
      if (item === '')
        return false;
    }
    if (settings.sensorAmbient < 1 || settings.sensorAmbient > 8)
      return false;
    if (settings.targetPHot < -100 || settings.targetPHot > 15)
      return false;
    if (settings.targetSidebandPower < -100 || settings.targetSidebandPower > 15)
      return false;
    if (settings.chopperSpeed < 0.01 || settings.chopperSpeed > 4)    
      return false;
    if (settings.powerMeterConfig.minS < 1 || settings.powerMeterConfig.maxS < settings.powerMeterConfig.minS)
      return false;
    if (settings.powerMeterConfig.stdErr <= 0)
      return false;
    if (settings.powerMeterConfig.timeout < 0)
      return false; 
    console.log("commonSettings is valid")
    return true;
  }

  // Debounced change hadler:  Won't write to back end more often than once per second.
  const handleChangeSetting = (e) => {
    let newSettings = {...settings};
    if (e.target.name.startsWith('powerMeterConfig')) {
      let newConfig = {...settings.powerMeterConfig};
      const name = e.target.name.split('.')[1];
      newConfig[name] = e.target.value;
      newSettings.powerMeterConfig = newConfig;
    } else if (e.target.name === "pauseForColdLoad") {
      newSettings[e.target.name] = e.target.checked;    
    } else if (e.target.name === "backEndMode") {
      newSettings[e.target.name] = e.target.value;
      if (e.target.value === "SPEC_AN") {
        newSettings.chopperMode = "SWITCH"
      }      
    } else {
      newSettings[e.target.name] = e.target.value;
    }
    // Clear any existing timer
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // Save to the redux store:
    dispatch(setCommonSettings(newSettings));      
    if (validateSettings(newSettings)) {
      // Set a timer to write back to the back-end
      timer.current = setTimeout(() => {        
        // Stop the timer before writing:
        clearTimeout(timer.current);
        timer.current = null;  
        axios.post('/noisetemp/settings', newSettings)
          .then(res => {
            console.log(res.data);
          })
          .catch(error => {
            console.log(error);
          }); 
      }, 1000);
    }
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={6}/>
      <Grid item xs={6} paddingTop="10px">
        <TextField
          id="backend-select"
          name="backEndMode"
          select
          label="Back end"
          size="small"
          style={{width: '95%'}}
          value={settings.backEndMode}
          disabled={disabled}
          onChange={e => {handleChangeSetting(e)}}
        >
          <MenuItem value={'IF_PLATE'}>IF Plate</MenuItem>
          <MenuItem value={'SPEC_AN'}>Spectrum Analyzer</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}/>
      <Grid item xs={6} paddingTop="10px" paddingBottom="5px">
        <TextField
          id="chopper-select"
          name="chopperMode"
          select
          label="Chopper mode"
          size="small"
          style={{width: '95%'}}
          value={settings.chopperMode}
          disabled={disabled || settings.backEndMode === "SPEC_AN"}
          onChange={e => {handleChangeSetting(e)}}
        >
          <MenuItem value={'SPIN'}>Spin</MenuItem>
          <MenuItem value={'SWITCH'}>Switch</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Target PHot:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="targetPHot"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.targetPHot}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dBm</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Target SB power for IR:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="targetSidebandPower"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.targetSidebandPower}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dBm</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Cold load Teff:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="tColdEff"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.tColdEff}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;K</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Chopper speed:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="chopperSpeed"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.chopperSpeed}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;rev/sec</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Ambient sensor num:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="sensorAmbient"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.sensorAmbient}
        />
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="9px">Pause for cold load fill:</Typography></Grid>
      <Grid item xs={6}>
        <Checkbox 
          name="pauseForColdLoad"
          disabled={disabled}
          checked={settings.pauseForColdLoad}
          onChange={e => handleChangeSetting(e)}
          size="small"
        />
      </Grid>

      <Grid item xs={12}><Typography variant="subtitle2" fontWeight="bold" paddingTop="4px">Power meter readings</Typography></Grid>
      
      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Min samples:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="powerMeterConfig.minS"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.powerMeterConfig.minS}
        />
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Max samples:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="powerMeterConfig.maxS"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.powerMeterConfig.maxS}
        />
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Target std error:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="powerMeterConfig.stdErr"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.powerMeterConfig.stdErr}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;W</Typography>
      </Grid>

      <Grid item xs={6}><Typography variant="body2" paddingTop="4px">Timeout:</Typography></Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="powerMeterConfig.timeout"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.powerMeterConfig.timeout}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;sec</Typography>
      </Grid>
    </Grid> 
  );
}

// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

// UI components and style
import { 
  Checkbox,
  FormControl,
  FormControlLabel, 
  Grid,
  OutlinedInput,
  Typography,
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setAmpStabilitySettings } from './StabilitySlice';

export default function AmpStabilitySettings(props) {
  // Input debouncing timer
  const timer = useRef(null);
  
  const disabled = props.disabled;

  // Redux store interfaces
  const settings = useSelector((state) => state.Stability.ampStabilitySettings);
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    axios.get('/ampstability/settings')
      .then(res => {
        dispatch(setAmpStabilitySettings(res.data));
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
      settings.loStart,
      settings.loStop,
      settings.loStep,
    ]
    for (const item of items) {
      if (isNaN(item))
        return false;
      if (item === '')
        return false;
    }
    if (settings.loStop < settings.loStart)
      return false;
    if (settings.ifStop < settings.ifStart)
      return false;
    console.log("ampStabilitySettings is valid")
    return true;
  }

  // Debounced change hadler:  Won't write to back end more often than once per second.
  const handleChangeSetting = (e, newValue) => {
    let newSettings = Object.assign({}, settings);
    if (newValue !== undefined && newValue !== null)
      newSettings[e.target.name] = newValue;
    else
      newSettings[e.target.name] = e.target.value;
    // Clear any existing timer
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // Save to the redux store:
    dispatch(setAmpStabilitySettings(newSettings));
    if (validateSettings(newSettings)) {
      // Set a timer to write back to the back-end
      timer.current = setTimeout(() => {        
        // Stop the timer before writing:
        clearTimeout(timer.current);
        timer.current = null;  
        axios.post('/ampstability/settings', newSettings)
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
      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">LO Start:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="loStart"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStart}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;GHz</Typography>
      </Grid>      

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">LO Stop:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="loStop"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStop}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;GHz</Typography>
      </Grid> 

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">LO Step:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="loStep"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStep}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;GHz</Typography>
      </Grid>
      
      <Grid item xs={12}><br/></Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="8px">Polarization:</Typography></Grid>
      <Grid item xs={3} textAlign="right">
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel 
            control={
              <Checkbox
                name = "measurePol0"
                checked={settings.measurePol0}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => {handleChangeSetting(e, e.target.checked)}}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                Pol 0
              </Typography>
            }
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item xs={3} textAlign="right">
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel 
            control={
              <Checkbox
                name = "measurePol1"
                checked={settings.measurePol1}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => {handleChangeSetting(e, e.target.checked)}}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                Pol 1
              </Typography>
            }
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item xs={3}/>

      <Grid item xs={3}><Typography variant="body2" paddingTop="8px">Sideband:</Typography></Grid>
      <Grid item xs={3} textAlign="right">
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel 
            control={
              <Checkbox
                name = "measureUSB"
                checked={settings.measureUSB}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => {handleChangeSetting(e, e.target.checked)}}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                USB
              </Typography>
            }
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      
      <Grid item xs={3} textAlign="right">
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel 
            control={
              <Checkbox
                name = "measureLSB"
                checked={settings.measureLSB}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => {handleChangeSetting(e, e.target.checked)}}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                LSB
              </Typography>
            }
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid item xs={3}/>


      <Grid item xs={12}><br/></Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Sample rate:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="sampleRate"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.sampleRate}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;samples/sec</Typography>
      </Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Ambient sensor num.:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="sensorAmbient"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.sensorAmbient}
        />        
      </Grid>
      
      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Delay after lock:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="delayAfterLock"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.delayAfterLock}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;minutes</Typography>
      </Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Measurement duration:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="measureDuration"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.measureDuration}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;minutes</Typography>
      </Grid>
    </Grid>
  );
}

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
import { setStabilitySettings } from './StabilitySlice';

export default function AmpStabilitySettings(props) {
  // Input debouncing timer
  const timer = useRef(null);
  const disabled = props.disabled;

  // Redux store interfaces
  const settings = useSelector((state) => state.Stability.stabilitySettings);
  const dispatch = useDispatch();

  const loSpan = Number(settings.loStop) - Number(settings.loStart);

  const fetch = useCallback(() => {
    const URL = (props.mode === 'phase') ? '/stability/phase/settings' : '/stability/amp/settings';
    axios.get(URL)
      .then(res => {
        dispatch(setStabilitySettings(res.data));        
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.mode]);

  // Initial fetch of contents
  useEffect(() => {
    fetch();
  }, [fetch]);

  const checkBoxError = (settings) => {
    if ((settings.measurePol0 === 'false' || settings.measurePol0 === false) && (settings.measurePol1 === 'false' || settings.measurePol1 === false))
      return true;
    if ((settings.measureUSB === 'false' || settings.measureUSB === false) && (settings.measureLSB === 'false' || settings.measureLSB === false))
      return true;
    return false;
  }

  const validateSettings = (settings) => {
    if (checkBoxError(settings)) {
      console.log('checkBoxError');
      return false;
    }
    const items = [
      settings.loStart,
      settings.loStop,
      settings.loStep,
      settings.attenuateIF,
      settings.sampleRate,
      settings.sensorAmbient,
      settings.delayAfterLock,
      settings.measureDuration
    ]
    for (const item of items) {
      if (isNaN(Number(item)))
        return false;
      if (Number(item) < 0)
        return false;
      if (item === '')
        return false;
    }
    if (Number(settings.loStart) === 0 || Number(settings.loStart) > 999)
      return false;
    if (Number(settings.loStop) === 0 || Number(settings.loStop) > 999)
      return false;
    if (Number(settings.loStop) < Number(settings.loStart))
      return false;
    if (Number(settings.ifStop) < Number(settings.ifStart))
      return false;
    if (loSpan > 0 && Number(settings.loStep) > loSpan)
      return false;
    if (Number(settings.attenuateIF) < 0 || Number(settings.attenuateIF) > 101)
      return false;
    if (Number(settings.sampleRate) <= 0 || Number(settings.sampleRate) > 50)
      return false;
    if (Number(settings.delayAfterLock) < 0 || Number(settings.delayAfterLock) > 300)
      return false;
    if (Number(settings.measureDuration) < 0.5 || Number(settings.measureDuration) > 300)
      return false;
    if (Number(settings.targetLevel) < -99 || Number(settings.targetLevel) > 10)
      return false;

    console.log("stabilitySettings is valid")
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
    dispatch(setStabilitySettings(newSettings));
    if (validateSettings(newSettings)) {
      // Set a timer to write back to the back-end
      timer.current = setTimeout(() => {        
        // Stop the timer before writing:
        clearTimeout(timer.current);
        timer.current = null;
        const URL = (props.mode === 'phase') ? '/stability/phase/settings' : '/stability/amp/settings';
        axios.post(URL, newSettings)
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
          type="number"
          disabled={disabled}
          error={settings.loStart <= 0 || settings.loStart >= 999 || settings.loStart > settings.loStop}
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
          type="number"
          disabled={disabled}
          error={settings.loStop <= 0 || settings.loStop >= 999 || settings.loStart > settings.loStop}
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
          type="number"
          disabled={disabled}
          error={settings.loStep < 0 || (loSpan > 0 && settings.loStep > loSpan)}
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
      <Grid item xs={3}>
        { checkBoxError(settings) &&
          <Typography variant="subtitle2" align="center" fontWeight="bold" color="error" paddingTop="14px">
            Select at least 1
          </Typography>
        }
      </Grid>

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
      <Grid item xs={3}>
        { checkBoxError(settings) &&
          <Typography variant="subtitle2" align="center" fontWeight="bold" color="error">
            from each row.
          </Typography>
        }
      </Grid>

      <Grid item xs={12}><br/></Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">IF Attenuator:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="attenuateIF"
          type="number"
          disabled={disabled}
          error={settings.attenuateIF < 0 || settings.attenuateIF > 101 || settings.attenuateIF === ''}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.attenuateIF}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dB</Typography>
      </Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Sample rate:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="sampleRate"
          type="number"
          disabled={disabled}
          error={settings.sampleRate <= 0 || settings.sampleRate > 50 || settings.sampleRate === ''}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.sampleRate}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;samp/sec</Typography>
      </Grid>

      <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Ambient sensor num.:</Typography></Grid>
      <Grid item xs={5}>
        <OutlinedInput
          name="sensorAmbient"
          type="number"
          disabled={disabled}
          error={settings.sensorAmbient < 1 || settings.sensorAmbient > 8 || settings.sensorAmbient === ''}
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
          type="number"
          disabled={disabled}
          error={settings.delayAfterLock < 0 || settings.delayAfterLock > 300 || settings.delayAfterLock === ''}
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
          type="number"
          disabled={disabled}
          error={settings.measureDuration < 0.5 || settings.measureDuration > 300 || settings.measureDuration === ''}
          size="small"
          margin="none"          
          style={{width: '50%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.measureDuration}
        />
        <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;minutes</Typography>
      </Grid>

      { props.mode === 'phase' &&
        <React.Fragment>
          <Grid item xs={5}><Typography variant="body2" paddingTop="4px">Target RF level:</Typography></Grid>
          <Grid item xs={5}>
            <OutlinedInput
              name="targetLevel"
              type="number"
              disabled={disabled}
              error={settings.targetLevel < -99 || settings.targetLevel > 10 || settings.targetLevel === ''}
              size="small"
              margin="none"          
              style={{width: '50%'}}
              className="smallinput"
              onChange={e => {handleChangeSetting(e)}}
              value = {settings.targetLevel}
            />
            <Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dBm</Typography>
          </Grid>          
        </React.Fragment>
      }

    </Grid>
  );
}

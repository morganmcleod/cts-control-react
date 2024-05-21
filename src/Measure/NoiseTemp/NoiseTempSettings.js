// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Checkbox,
  FormGroup, 
  FormControlLabel, 
  Grid,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setNoiseTempSettings, setLoWgSettings, setTestSteps } from './NoiseTempSlice';

export default function NoiseTempSettings(props) {
  // Input debouncing timer
  const timer = useRef(null);
  
  const disabled = props.disabled;

  // Redux store interfaces
  const settings = useSelector((state) => props.isLoWg ? state.NoiseTemp.loWgSettings : state.NoiseTemp.noiseTempSettings);
  const testSteps = useSelector((state) => state.NoiseTemp.testSteps);
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    axios.get('/noisetemp/teststeps')
      .then(res => {
        dispatch(setTestSteps(res.data));
      })
      .catch(error => {
        console.log(error);
      })

    axios.get(props.isLoWg ? '/noisetemp/lowgsettings' : '/noisetemp/ntsettings')
      .then(res => {
        dispatch(props.isLoWg ? setLoWgSettings(res.data) : setNoiseTempSettings(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch, props.isLoWg]);

  // Initial fetch of contents
  useEffect(() => {
    fetch();
  }, [fetch]);

  const validateSettings = (settings) => {
    const items = [
      settings.loStart,
      settings.loStop,
      settings.loStep,
      settings.ifStart,
      settings.ifStop,
      settings.ifStep,
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
    console.log("noiseTempSettings is valid")
    return true;
  }

  // Debounced change hadler:  Won't write to back end more often than once per second.
  const handleChangeSetting = (e) => {
    switch (e.target.name) {
      case "loStart":
      case "loStop":
      case "loStep":
      case "ifStart":
      case "ifStop":
      case "ifStep":
      case "polarization":
      case "sideband":
        let newSettings = {...settings};
        newSettings[e.target.name] = e.target.value;
        // Clear any existing timer
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        // Save to the redux store:
        dispatch(props.isLoWg ? setLoWgSettings(newSettings) : setNoiseTempSettings(newSettings));
        if (validateSettings(newSettings)) {
          // Set a timer to write back to the back-end
          timer.current = setTimeout(() => {        
            // Stop the timer before writing:
            clearTimeout(timer.current);
            timer.current = null;  
            axios.post(props.isLoWg ? '/noisetemp/lowgsettings' : '/noisetemp/ntsettings', newSettings)
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

  const handleChangeTestStep = (e) => {
    let newTestSteps = Object.assign({}, testSteps);
    switch (e.target.name) {
      case "zeroPM":
        newTestSteps[e.target.name] = e.target.checked;
        break;
      case "noiseTemp":
        newTestSteps[e.target.name] = e.target.checked;
        if (!e.target.checked)
          newTestSteps["imageReject"] = false;
        break;
      case "imageReject":
        newTestSteps[e.target.name] = e.target.checked;
        if (e.target.checked)
          newTestSteps["noiseTemp"] = true;
        break;
      case "warmIF":
      case "loWGIntegrity":
        newTestSteps[e.target.name] = e.target.checked;
        break;
      default:
        return;
    }
    dispatch(setTestSteps(newTestSteps));
    axios.post('/noisetemp/teststeps', newTestSteps)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      }); 
  }

  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={3}/>
      <Grid item xs={9}>
        <FormGroup>
          <FormControlLabel 
            control={
              <Checkbox
                name = "zeroPM"
                checked={testSteps.zeroPM}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => handleChangeTestStep(e)}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                Zero Power Meter
              </Typography>
            }
            labelPlacement="end"
          />          
          <FormControlLabel 
            control={
              <Checkbox
                name = {props.isLoWg ? "loWGIntegrity" : "noiseTemp"}
                checked={props.isLoWg ? testSteps.loWGIntegrity : testSteps.noiseTemp}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => handleChangeTestStep(e)}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                {props.isLoWg ? "LO WG Integrity" : "Noise Temperature"}
              </Typography>
            }
            labelPlacement="end"
          />          
          {!props.isLoWg && 
            <FormControlLabel 
              control={
                <Checkbox
                  name = "imageReject"
                  checked={testSteps.imageReject}
                  disabled={disabled}
                  style={{"paddingTop": "1"}}
                  onChange={e => handleChangeTestStep(e)}
                  size="small"                
                />
              } 
              label={
                <Typography variant="subtitle2" display="inline" fontWeight="bold">
                  Image Rejection
                </Typography>
              }
              labelPlacement="end"
            />          
          }
          <FormControlLabel 
            control={
              <Checkbox
                name = "warmIF"
                checked={testSteps.warmIF}
                disabled={disabled}
                style={{"paddingTop": "1"}}
                onChange={e => handleChangeTestStep(e)}
                size="small"                
              />
            } 
            label={
              <Typography variant="subtitle2" display="inline" fontWeight="bold">
                Warm IF Noise
              </Typography>
            }
            labelPlacement="end"
          />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>

      <Grid item xs={3}/>      
      <Grid item xs={3} align="center"><Typography variant="body2">LO [GHz]</Typography></Grid>
      <Grid item xs={3} align="center"><Typography variant="body2">IF [GHz]</Typography></Grid>
      <Grid item xs={3}/>
  
      <Grid item xs={1}/>
      <Grid item xs={2}><Typography variant="body2" paddingTop="4px">Start:</Typography></Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="loStart"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStart}
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
          name="loStop"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStop}
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
          name="loStep"
          disabled={disabled}
          error={false}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {settings.loStep}
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
      
      <Grid item xs={12}>&nbsp;</Grid>

      <Grid item xs={3}><Typography variant="body2" paddingTop="10px">Polarization:</Typography></Grid>
      <Grid item xs={3} className="summarygrid" paddingBottom={0}>
        <TextField
          id="polarization-select"
          name="polarization"
          select
          label="Select Pol"
          size="small"
          style={{width: '95%'}}
          value={settings.polarization}
          disabled={disabled}
          onChange={e => {handleChangeSetting(e)}}
        >
          <MenuItem value={'BOTH'}>Both</MenuItem>
          <MenuItem value={'POL0'}>Pol0</MenuItem>
          <MenuItem value={'POL1'}>Pol1</MenuItem>
        </TextField>
      </Grid>      
      <Grid item xs={6}/>
    </Grid> 
  );
}

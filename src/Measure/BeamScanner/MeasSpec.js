// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import { 
  Grid,
  Button,
  OutlinedInput,
  Typography,
  Checkbox
} from '@mui/material';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setMeasurementSpec } from './BeamScannerSlice';
import { setGotoPosition } from '../../Hardware/BeamScanner/MotorControlSlice';

export default function MeasSpec(props) {
  // Input debouncing timer
  const timer = useRef(null);

  // Redux store interfaces
  const disabled = useSelector((state) => state.Measure.active);
  const measSpec = useSelector((state) => state.BeamScanner.measurementSpec);
  const position = useSelector((state) => state.MotorControl.position);
  const dispatch = useDispatch();
  
  const fetch = useCallback(() => {
    axios.get('/beamscan/meas_spec')
      .then(res => {
        dispatch(setMeasurementSpec(res.data));
      })
      .catch(error => {
        console.log(error);
      })
  }, [dispatch]);

  // Initial fetch of contents
  useEffect(() => {
    fetch();
  }, [fetch]);

  const validateMeasSpec = (spec) => {
    const items = [
      spec.beamCenter.x,
      spec.beamCenter.y,
      spec.scanStart.x,
      spec.scanStart.y,
      spec.scanEnd.x,
      spec.scanEnd.y,
      spec.scanAngles[0],
      spec.scanAngles[1],
      spec.targetLevel,
      spec.resolution,
      spec.centersInterval
    ]
    for (const item of items) {
      if (isNaN(item))
        return false;
      if (item === '')
        return false;
    }
    if (spec.targetLevel < -100)
      return false;
    if (spec.targetLevel > 15)
      return false;
    if (spec.resolution <= 0)
      return false;
    if (spec.centersInterval <= 0)
      return false;
    console.log("measSpec is valid")
    return true;
  }

  // Debounced change hadler:  Won't write to back end more often than once per second.
  const handleChangeSetting = (e) => {
    let spec = null
    switch (e.target.name) {
      case "beamcenter-x":
        spec = {...measSpec, beamCenter: {x: e.target.value, y: measSpec.beamCenter.y}};
        break;
      case "beamcenter-y":
        spec = {...measSpec, beamCenter: {x: measSpec.beamCenter.x, y: e.target.value}};
        break;
      case "scanstart-x":
        spec = {...measSpec, scanStart: {x: e.target.value, y: measSpec.scanStart.y}};
        break;
      case "scanstart-y":
        spec = {...measSpec, scanStart: {x: measSpec.scanStart.x, y: e.target.value}};
        break;
      case "scanend-x":
        spec = {...measSpec, scanEnd: {x: e.target.value, y: measSpec.scanEnd.y}};
        break;
      case "scanend-y":
        spec = {...measSpec, scanEnd: {x: measSpec.scanEnd.x, y: e.target.value}};
        break;
      case "scanangle-0":
        spec = {...measSpec, scanAngles: [e.target.value, measSpec.scanAngles[1]]};
        break;
      case "scanangle-1":
        spec = {...measSpec, scanAngles: [measSpec.scanAngles[0], e.target.value]};
        break;
      case "target-level":
        spec = {...measSpec, targetLevel: e.target.value};
        break;
      case "resolution":
        spec = {...measSpec, resolution: e.target.value};
        break;
      case "centers-interval":
        spec = {...measSpec, centersInterval: e.target.value};
        break;
      case "scanBidirectional":
        spec = {...measSpec, scanBidirectional: e.target.checked};
        break;
      default:
        return;
    }
    // If a change was detected
    if (spec) {
      // Clear any existing timer
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      // Save to the redux store:
      dispatch(setMeasurementSpec(spec));      
      if (validateMeasSpec(spec)) {
        // Set a timer to write back to the back-end
        timer.current = setTimeout(() => {        
          // Stop the timer before writing:
          clearTimeout(timer.current);
          timer.current = null;  
          axios.post('/beamscan/meas_spec', spec)
            .then(res => {
              console.log(res.data);
            })
            .catch(error => {
              console.log(error);
            }); 
        }, 1000);
      }
    }
  }

  // GO button handler
  const handleGoto = (e) => {
    switch(e.target.name) {
      case "goBeamCenter":
        if (measSpec.beamCenter.x >= 0 && measSpec.beamCenter.y >= 0) {
          dispatch(setGotoPosition({
            x: measSpec.beamCenter.x, 
            y: measSpec.beamCenter.y,
            pol: position.pol
          }));
        }
        break;
      case "goScanStart":
        if (measSpec.scanStart.x >= 0 && measSpec.scanStart.y >= 0) {
          dispatch(setGotoPosition({
            x: measSpec.scanStart.x, 
            y: measSpec.scanStart.y,
            pol:position.pol
          }));
        }
        break;
      case "goScanEnd":
        if (measSpec.scanEnd.x >= 0 && measSpec.scanEnd.y >= 0) {
          dispatch(setGotoPosition({
            x: measSpec.scanEnd.x, 
            y: measSpec.scanEnd.y,
            pol: position.pol
          }));
        }
        break;
      case "goPol0":
        if (measSpec.scanAngles[0] >= -200 && measSpec.scanAngles[0] <= 180 ) {
          dispatch(setGotoPosition({
            x: position.x, 
            y: position.y, 
            pol:  measSpec.scanAngles[0]
          }));
        }
        break;
      case "goPol1":
        if (measSpec.scanAngles[1] >= -200 && measSpec.scanAngles[1] <= 180 ) {
          dispatch(setGotoPosition({
            x: position.x, 
            y: position.y, 
            pol: measSpec.scanAngles[1]
          }));
        }
        break;
      default:
        break;
    }
  }
    
  return (
    <Grid container paddingLeft="5px">
      <Grid item xs={12}><Typography variant="h6">Measurement Setup</Typography></Grid>

      <Grid item xs={4}/>
      <Grid item xs={3} align="center"><Typography variant="body2">X [mm]</Typography></Grid>
      <Grid item xs={3} align="center"><Typography variant="body2">Y [mm]</Typography></Grid>
      <Grid item xs={2}/>
      
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Scan start:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanstart-x"
          disabled={disabled}
          error={measSpec.scanStart.x < 0 || measSpec.scanStart.x === '' || isNaN(measSpec.scanStart.x)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStart.x}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanstart-y"
          disabled={disabled}
          error={measSpec.scanStart.y < 0 || measSpec.scanStart.y === '' || isNaN(measSpec.scanStart.y)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStart.y}
        />
      </Grid>
      <Grid item xs={2} align="center">
        <Button
          name="goScanStart"
          disabled={disabled || measSpec.scanStart.x < 0 || measSpec.scanStart.x === '' || isNaN(measSpec.scanStart.x)
                             || measSpec.scanStart.y < 0 || measSpec.scanStart.y === '' || isNaN(measSpec.scanStart.y)}          
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto(e)}
        >
          GO
        </Button>
      </Grid>

      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Beam center</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="beamcenter-x"
          disabled={disabled}
          error={measSpec.beamCenter.x < 0 || measSpec.beamCenter.x === '' || isNaN(measSpec.beamCenter.x)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.beamCenter.x}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="beamcenter-y"
          disabled={disabled}
          error={measSpec.beamCenter.y < 0 || measSpec.beamCenter.y === '' || isNaN(measSpec.beamCenter.y)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.beamCenter.y}
        />
      </Grid>
      <Grid item xs={2} align="center">
        <Button
          name="goBeamCenter"
          disabled={disabled || measSpec.beamCenter.x < 0 || measSpec.beamCenter.x === '' || isNaN(measSpec.beamCenter.x)
                             || measSpec.beamCenter.y < 0 || measSpec.beamCenter.y === '' || isNaN(measSpec.beamCenter.y)}
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto(e)}
        >
          GO
        </Button>
      </Grid>

      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Scan end:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanend-x"
          disabled={disabled}
          error={measSpec.scanEnd.x < 0 || measSpec.scanEnd.x === '' || isNaN(measSpec.scanEnd.x)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanEnd.x}
        />
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanend-y"
          disabled={disabled}
          error={measSpec.scanEnd.y < 0 || measSpec.scanEnd.y === '' || isNaN(measSpec.scanEnd.y)}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanEnd.y}
        />
      </Grid>
      <Grid item xs={2} align="center">
        <Button
          name="goScanEnd"
          disabled={disabled || measSpec.scanEnd.x < 0 || measSpec.scanEnd.x === '' || isNaN(measSpec.scanEnd.x)
                             || measSpec.scanEnd.y < 0 || measSpec.scanEnd.y === '' || isNaN(measSpec.scanEnd.y)}          
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto(e)}
        >
          GO
        </Button>
      </Grid>

      <Grid item xs={7}/>
      <Grid item xs={3} align="center">
        <Typography variant="body2" paddingTop="4px">[deg]</Typography>
      </Grid>
      <Grid item xs={2}/>
      
      <Grid item xs={5}>
        <Typography variant="body2" paddingTop="4px">Scan angles :</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2" paddingTop="4px" align="center">Pol 0:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanangle-0"
          disabled={disabled}
          error={measSpec.scanAngles[0] < -200 || measSpec.scanAngles[0] > 180 || measSpec.scanAngles[0] === '' || isNaN(measSpec.scanAngles[0])}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanAngles[0]}
        />
      </Grid>
      <Grid item xs={2} align="center">
        <Button
          name="goPol0"
          disabled={disabled || measSpec.scanAngles[0] === '' || isNaN(measSpec.scanAngles[0])}          
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto(e)}
        >
          GO
        </Button>
      </Grid>

      <Grid item xs={5}/>
      <Grid item xs={2}>
        <Typography variant="body2" paddingTop="4px" align="center">Pol 1:</Typography>
      </Grid>
      <Grid item xs={3}>
        <OutlinedInput
          name="scanangle-1"
          disabled={disabled}
          error={measSpec.scanAngles[1] < -200 || measSpec.scanAngles[1] > 180 || measSpec.scanAngles[1] === '' || isNaN(measSpec.scanAngles[1])}
          size="small"
          margin="none"          
          style={{width: '95%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanAngles[1]}
        />
      </Grid>
      <Grid item xs={2} align="center">
        <Button
          name="goPol1"
          disabled={disabled || measSpec.scanAngles[1] === '' || isNaN(measSpec.scanAngles[1])} 
          className="custom-btn-sm"
          variant="contained"
          size="small"
          style={{
            minWidth: '55%',
            maxWidth: '55%' 
          }}
          onClick={e => handleGoto(e)}
        >
          GO
        </Button>
      </Grid>
      <Grid item xs={12}>&nbsp;</Grid>

      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="4px">Target level:</Typography>
      </Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="target-level"
          disabled={disabled}
          error={measSpec.targetLevel < -100 || measSpec.targetLevel > 15 || measSpec.targetLevel === '' || isNaN(measSpec.targetLevel)}
          size="small"
          margin="none"          
          style={{width: '47.5%'}}
          className="smallinput"
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.targetLevel}
        /><Typography variant="body2" display="inline" paddingTop="4px">&nbsp;dB</Typography>
      </Grid>
      <Grid item xs={2}/>

      <Grid item xs={4} >
        <Typography variant="body2" paddingTop="4px">Scan Resolution:</Typography>
      </Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="resolution"
          disabled={disabled}
          error={measSpec.resolution <= 0 || measSpec.resolution === '' || isNaN(measSpec.resolution)}
          size="small"
          margin="none"          
          onChange={e => {handleChangeSetting(e)}}
          style={{width: '47.5%'}}
          className="smallinput"
          value = {measSpec.resolution}
        /><Typography variant="body2" display="inline" paddingTop="4px">&nbsp;mm</Typography>
      </Grid>
      <Grid item xs={2}/>

      <Grid item xs={4} >
        <Typography variant="body2" paddingTop="4px">Centers interval:</Typography>
      </Grid>
      <Grid item xs={6}>
        <OutlinedInput
          name="centers-interval"
          disabled={disabled}
          error={measSpec.centersInterval <= 0 || measSpec.centersInterval === '' || isNaN(measSpec.centersInterval)}
          size="small"
          margin="none"          
          onChange={e => {handleChangeSetting(e)}}
          style={{width: '47.5%'}}
          className="smallinput"
          value = {measSpec.centersInterval}
        /><Typography variant="body2" display="inline" paddingTop="4px">&nbsp;sec</Typography>
      </Grid>
      <Grid item xs={2}/>
      
      <Grid item xs={4}>
        <Typography variant="body2" paddingTop="9px">Scan Bidirectional:</Typography>
      </Grid>
      <Grid item xs={8}>
        <Checkbox 
          name="scanBidirectional"
          checked={measSpec.scanBidirectional}
          onChange={e => handleChangeSetting(e)}
          size="small"
        />
      </Grid>
    </Grid>
  );
}

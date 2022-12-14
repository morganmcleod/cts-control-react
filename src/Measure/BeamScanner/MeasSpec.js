// React and Redux
import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux'

// UI components and style
import Grid from '@mui/material/Grid'
import OutlinedInput from '@mui/material/OutlinedInput';
import '../../components.css'

// HTTP and store
import axios from "axios";
import { setMeasurementSpec } from './BeamScannerSlice';

export default function MeasSpec() {
  // Input debouncing timer
  const timer = useRef(null);

  // Redux store interfaces
  const measSpec = useSelector((state) => state.BeamScanner.measurementSpec);
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
      spec.scanStop.x,
      spec.scanStop.y,
      spec.scanAngles[0],
      spec.scanAngles[1],
      spec.levelAngles[0],
      spec.levelAngles[1],
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
    if (spec.targetLevel > 10)
      return false;
    if (spec.resolution <= 0)
      return false;
    if (spec.centersInterval < 0)
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
      case "scanstop-x":
        spec = {...measSpec, scanStop: {x: e.target.value, y: measSpec.scanStop.y}};
        break;
      case "scanstop-y":
        spec = {...measSpec, scanStop: {x: measSpec.scanStop.x, y: e.target.value}};
        break;
      case "scanangle-0":
        spec = {...measSpec, scanAngles: [e.target.value, measSpec.scanAngles[1]]};
        break;
      case "scanangle-1":
        spec = {...measSpec, scanAngles: [measSpec.scanAngles[0], e.target.value]};
        break;
      case "levelangle-0":
        spec = {...measSpec, levelAngles: [e.target.value, measSpec.levelAngles[1]]};
        break;
      case "levelangle-1":
        spec = {...measSpec, levelAngles: [measSpec.levelAngles[0], e.target.value]};
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

  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={12} className="component-header">Measurement Setup</Grid>
      <Grid item xs={4}></Grid>
      <Grid item xs={4} className="component-title">X [mm]</Grid>
      <Grid item xs={4} className="component-title">Y [mm]</Grid>

      <Grid item xs={4} className="component-title">Beam center:</Grid>
      <Grid item xs={4} className="input-grid">
        <OutlinedInput
          name="beamcenter-x"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.beamCenter.x}
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="beamcenter-y"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.beamCenter.y}
        />
      </Grid>

      <Grid item xs={4} className="component-title">Scan start:</Grid>
      <Grid item xs={4} className="input-grid">
        <OutlinedInput
          name="scanstart-x"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStart.x}
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="scanstart-y"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStart.y}
        />
      </Grid>

      <Grid item xs={4} className="component-title">Scan stop:</Grid>
      <Grid item xs={4} className="input-grid">
        <OutlinedInput
          name="scanstop-x"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStop.x}
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="scanstop-y"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanStop.y}
        />
      </Grid>

      <Grid item xs={12}>&nbsp;</Grid>

      <Grid item xs={4}></Grid>
      <Grid item xs={4} className="component-title">Pol 0</Grid>
      <Grid item xs={4} className="component-title">Pol 1</Grid>

      <Grid item xs={4} className="component-title">Scan angles [deg]:</Grid>
      <Grid item xs={4} className="input-grid">
        <OutlinedInput
          name="scanangle-0"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanAngles[0]}
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="scanangle-1"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.scanAngles[1]}
        />
      </Grid>

      <Grid item xs={4} className="component-title">Level angles [deg]:</Grid>
      <Grid item xs={4} className="input-grid">
        <OutlinedInput
          name="levelangle-0"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.levelAngles[0]}
        />
      </Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="levelangle-1"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.levelAngles[1]}
        />
      </Grid>

      <Grid item xs={12}>&nbsp;</Grid>

      <Grid item xs={4} className="component-title">Target level:</Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="target-level"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.targetLevel}
        /> &nbsp;dB
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={4} className="component-title">Scan Resolution:</Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="resolution"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.resolution}
        /> &nbsp;mm
      </Grid>
      <Grid item xs={4}/>

      <Grid item xs={4} className="component-title">Centers interval:</Grid>
      <Grid item xs={4}>
        <OutlinedInput
          name="centers-interval"
          size="small"
          margin="none"
          className="component-input"
          style={{width: '66.7%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.centersInterval}
        /> &nbsp;sec
      </Grid>
      <Grid item xs={4}/>
    </Grid>
  );
}

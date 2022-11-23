import '../components.css'
import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'
import OutlinedInput from '@mui/material/OutlinedInput';

const axios = require('axios').default

export default function MeasSpec() {
  const [timer, setTimer] = useState(null);
  const [measSpec, setMeasSpec] = useState(
    {
      beamCenter: {x:0, y:0},
      scanStart: {x:0, y:0},
      scanStop: {x:0, y:0},
      scanAngles: [0, 0],
      levelAngles: [0, 0],
      targetLevel: 0,
      resolution: 0,
      centersInterval: 0
    }
  );
  
  const fetchMeasSpec = () => {
    axios.get('/beamscan/meas_spec')
      .then(res => {
        setMeasSpec(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchMeasSpec();
  }, []);

  const validateMeasSpec = (newMeasSpec) => {
    const items = [
      newMeasSpec.beamCenter.x,
      newMeasSpec.beamCenter.y,
      newMeasSpec.scanStart.x,
      newMeasSpec.scanStart.y,
      newMeasSpec.scanStop.x,
      newMeasSpec.scanStop.y,
      newMeasSpec.scanAngles[0],
      newMeasSpec.scanAngles[1],
      newMeasSpec.levelAngles[0],
      newMeasSpec.levelAngles[1],
      newMeasSpec.targetLevel,
      newMeasSpec.resolution,
      newMeasSpec.centersInterval
    ]
    for (const item of items) {
      if (isNaN(item))
        return false;
      if (item === '')
        return false;
    }
    if (newMeasSpec.targetLevel > 10)
      return false;
    if (newMeasSpec.resolution <= 0)
      return false;
    if (newMeasSpec.centersInterval < 0)
      return false;
    console.log("measSpec is valid")
    return true;
  }

  const saveMeasSpec = (newMeasSpec) => {
    axios.post('/beamscan/meas_spec', newMeasSpec)
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    }); 
  }

  const handleChangeSetting = (e) => {
    let newMeasSpec = null
    switch (e.target.name) {
      case "beamcenter-x":
        newMeasSpec = {...measSpec, beamCenter: {x: e.target.value, y: measSpec.beamCenter.y}};
        break;
      case "beamcenter-y":
        newMeasSpec = {...measSpec, beamCenter: {x: measSpec.beamCenter.x, y: e.target.value}};
        break;
      case "scanstart-x":
        newMeasSpec = {...measSpec, scanStart: {x: e.target.value, y: measSpec.scanStart.y}};
        break;
      case "scanstart-y":
        newMeasSpec = {...measSpec, scanStart: {x: measSpec.scanStart.x, y: e.target.value}};
        break;
      case "scanstop-x":
        newMeasSpec = {...measSpec, scanStop: {x: e.target.value, y: measSpec.scanStop.y}};
        break;
      case "scanstop-y":
        newMeasSpec = {...measSpec, scanStop: {x: measSpec.scanStop.x, y: e.target.value}};
        break;
      case "scanangle-0":
        newMeasSpec = {...measSpec, scanAngles: [e.target.value, measSpec.scanAngles[1]]};
        break;
      case "scanangle-1":
        newMeasSpec = {...measSpec, scanAngles: [measSpec.scanAngles[0], e.target.value]};
        break;
      case "levelangle-0":
        newMeasSpec = {...measSpec, levelAngles: [e.target.value, measSpec.levelAngles[1]]};
        break;
      case "levelangle-1":
        newMeasSpec = {...measSpec, levelAngles: [measSpec.levelAngles[0], e.target.value]};
        break;
      case "target-level":
        newMeasSpec = {...measSpec, targetLevel: e.target.value};
        break;
      case "resolution":
        newMeasSpec = {...measSpec, resolution: e.target.value};
        break;
      case "centers-interval":
        newMeasSpec = {...measSpec, centersInterval: e.target.value};
        break;
      default:
        return;
    }
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    if (newMeasSpec) {
      setMeasSpec(newMeasSpec);
      setTimer(setTimeout(() => {        
        if (validateMeasSpec(newMeasSpec)) {
          saveMeasSpec(newMeasSpec);
        }
        setTimer(null);
      }, 1000));
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
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
          style={{width: '60%'}}
          onChange={e => {handleChangeSetting(e)}}
          value = {measSpec.centersInterval}
        /> &nbsp;sec
      </Grid>
      <Grid item xs={4}/>

    </Grid>
  );
}

import '../components.css'
import React from 'react';
import Grid from '@mui/material/Grid'

export default function ScanStatus(props) {
  const status = props.status;
  return (
    <Grid container spacing={0} className="component-data">
      <Grid item xs={4} className="component-title">CartTest key:</Grid>
      <Grid item xs={4}>{status.fkCartTest}</Grid>
      <Grid item xs={4}/>

      <Grid item xs={4} className="component-title">BeamPattern key:</Grid>
      <Grid item xs={4}>{status.fkBeamPatterns}</Grid>
      <Grid item xs={4}/>
      
      <Grid item xs={4} className="component-title">Center power:</Grid>
      <Grid item xs={4}>{status.amplitude}&nbsp;dB</Grid>
      <Grid item xs={4}/>

      <Grid item xs={4} className="component-title">Last measured:</Grid>
      <Grid item xs={8}>{status.timeStamp}</Grid>

      <Grid item xs={4} className="component-title">Scan complete:</Grid>
      <Grid item xs={8}>{status.scanComplete ? "Yes" : "No"}</Grid>

      <Grid item xs={4} className="component-title">Message:</Grid>
      <Grid item xs={8}>{status.message}</Grid>
    </Grid>
  )
}

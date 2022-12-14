// React and Redux
import React from "react";

// UI components and style
import Grid from '@mui/material/Grid'
import MotorController from '../../Hardware/BeamScanner/MotorControl';
import MeasControl from './MeasControl';
import MeasSpec from './MeasSpec';
import BeamScannerGraph from './Graph';
import ScanStatus from './ScanStatus';
import ScanList from './ScanList';
import '../../components.css'

export default function BeamScannerMain(props) {
  return (
    <Grid container>
      <Grid item xs={5}>
        <MotorController/>
        <br/>
        <BeamScannerGraph/>
      </Grid>
      <Grid item xs={3}>
        <MeasSpec/>
        <br/>
        <MeasControl/>
        <br/>
        <ScanStatus/>
      </Grid>
      <Grid item xs={4}>
        <ScanList/>
      </Grid>
    </Grid>
  )
}


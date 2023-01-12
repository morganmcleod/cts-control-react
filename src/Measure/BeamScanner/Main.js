// React and Redux
import React from "react";

// UI components and style
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import MotorController from '../../Hardware/BeamScanner/MotorControl';
import MeasSpec from './MeasSpec';
import BeamScannerGraph from './Graph';
import ScanStatus from './ScanStatus';
import ScanList from './ScanList';
import RasterGraph from "./Raster";
import '../../components.css'

export default function BeamScannerMain(props) {
  return (
    <Grid container>
      <Grid item xs={5}>
        <MotorController/>
        <Box padding="20px">
          <BeamScannerGraph/>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <MeasSpec/>
        <Box paddingTop="20px">
          <RasterGraph type="amp"/>
          <RasterGraph type="phase"/>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <ScanList/>
        <ScanStatus/>
      </Grid>
    </Grid>
  )
}


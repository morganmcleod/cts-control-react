import '../components.css'
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'

import MotorController from './MotorControl';
import MeasControl from './MeasControl';
import MeasSpec from './MeasSpec';
import BeamScannerGraph from './Graph';
import ScanStatus from './ScanStatus';
import ScanList from './ScanList';

const axios = require('axios').default

function BeamScannerMain(props) {
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState({
    key: 0,
    fkBeamPatterns: 0,
    fkCartTest: 0,
    amplitude: 0,
    phase: 0,
    timeStamp: "",
    scanComplete: false,
    measurementComplete: true,
    activeScan: null,
    activeSubScan: null,
    message: ""
  });

  const fetchScanStatus = () => {
    axios.get('/beamscan/scan_status')
    .then(res => {
      const scanStatus = res.data
      setScanStatus(scanStatus);
      if (scanStatus.measurementComplete) {
        setScanning(false);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(() => {
    const timer = setInterval(() => { fetchScanStatus() }, props.interval ?? 5000);
    return () => {
      clearInterval(timer);
    };
  });

  const startScan = (scanning) => {
    setScanning(scanning);
    setScanStatus({...scanStatus, activeScan: scanning})
  }

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
        <MeasControl
          scanning={scanning}
          startScan={startScan}
        />
        <br/>
        <ScanStatus status={scanStatus}/>
      </Grid>
      <Grid item xs={4}>
        <ScanList disabled={scanning}
          activeScan={scanStatus.activeScan}
          activeDescription={scanStatus.activeSubScan}
        />
      </Grid>
    </Grid>
  )
}
export default BeamScannerMain
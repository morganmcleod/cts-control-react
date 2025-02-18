import React from 'react';

import Grid from '@mui/material/Grid'
import Polarization from './Polarization';
import CartridgeTemps from './CartridgeTemps';
import LED from './LED';
import Heater from './Heater';
import '../../components.css'

export default function CCA(props) {  
  return (
    <Grid container>
      <Grid item xs={6} sx={{border:1, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Polarization 
          pol="0"
        />
      </Grid>
      <Grid item xs={6} sx={{border:1, borderLeft:0, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Polarization 
          pol="1"          
        />
      </Grid>
      <Grid container sx={{border:1, borderTop:0, borderColor: "rgba(0, 0, 255, 0.25)"}}>
        <Grid item xs={3}><CartridgeTemps/></Grid>
        <Grid item xs={2}><Heater pol="0"/></Grid>
        <Grid item xs={1} sx={{borderRight:1, borderColor: "rgba(0, 0, 255, 0.25)"}}><LED pol="0"/></Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2}><Heater pol="1"/></Grid>
        <Grid item xs={1}><LED pol="1"/></Grid>
      </Grid>
    </Grid>
  );
}

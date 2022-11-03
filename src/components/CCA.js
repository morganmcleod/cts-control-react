import './components.css'
import Polarization from './Polarization';
import CartridgeTemps from './CartridgeTemps';
import LED from './LED';
import Heater from './Heater';
import Grid from '@mui/material/Grid'
import React from 'react';

class CCA extends React.Component {
  render() {
    return (
      <Grid container rowSpacing={0}>
        <Grid item xs={6} sx={{border:1}}><Polarization pol="0"/></Grid>
        <Grid item xs={6} sx={{border:1, borderLeft:0}}><Polarization pol="1"/></Grid>
        <Grid container sx={{border:1, borderTop:0}}>
          <Grid item xs={3}><CartridgeTemps/></Grid>
          <Grid item xs={2}><Heater/></Grid>
          <Grid item xs={1} sx={{borderRight:1}}><LED pol="0"/></Grid>
          <Grid item xs={2}><LED pol="1"/></Grid>
        </Grid>
      </Grid>
    );
  }
}
export default CCA;

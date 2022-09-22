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
      <Grid container rowSpacing={2}>
        <Grid item xs={6}><Polarization pol="0"/></Grid>
        <Grid item xs={6}><Polarization pol="1"/></Grid>
        <Grid item xs={3}><CartridgeTemps/></Grid>
        <Grid item xs={2}><Heater/></Grid>
        <Grid item xs={2}><LED pol="0"/></Grid>
        <Grid item xs={5}><LED pol="1"/></Grid>
      </Grid>
    );
  }
}
export default CCA;

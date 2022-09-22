import './components.css'
import SIS from './SIS'
import LNA from './LNA'
import Grid from '@mui/material/Grid'
import React from "react";

class Polarization extends React.Component {
  constructor(props) {
    super(props);
    this.pol = props.pol ?? 0;
  }
  render() {
    return (
      <Grid container> 
        <Grid item xs={12} className="polarization-header">Polarization {this.pol}</Grid>
        <Grid item xs={6}><SIS pol={this.pol} sis="1"/></Grid>
        <Grid item xs={6}><SIS pol={this.pol} sis="2"/></Grid>
        <Grid item xs={6}><LNA pol={this.pol} lna="1"/></Grid>
        <Grid item xs={6}><LNA pol={this.pol} lna="2"/></Grid>
      </Grid>
    )
  }
}
export default Polarization;
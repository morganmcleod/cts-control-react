import React from "react";

import { Grid, Typography } from '@mui/material';
import SIS from './SIS'
import LNA from './LNA'
import '../../components.css'

class Polarization extends React.Component {
  constructor(props) {
    super(props);
    this.pol = props.pol ?? 0;
  }
  render() {
    return (
      <Grid container> 
        <Grid item xs={12} textAlign="center"><Typography variant="h6">Polarization {this.pol}</Typography></Grid>
        <Grid item xs={6}><SIS pol={this.pol} sis="1"/></Grid>
        <Grid item xs={6}><SIS pol={this.pol} sis="2"/></Grid>
        <Grid item xs={6}><LNA pol={this.pol} lna="1"/></Grid>
        <Grid item xs={6}><LNA pol={this.pol} lna="2"/></Grid>
      </Grid>
    )
  }
}
export default Polarization;
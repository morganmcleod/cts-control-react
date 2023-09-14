import React from "react";

import { Grid, Typography } from '@mui/material';
import SIS from './SIS'
import LNA from './LNA'
import '../../components.css'

export default function Polarization(props) {  
  return (
    <Grid container> 
      <Grid item xs={12} textAlign="center"><Typography variant="h6">Polarization {props.pol}</Typography></Grid>
      <Grid item xs={6}>
        <SIS 
          pol={props.pol} 
          sis="1"          
        />
      </Grid>
      <Grid item xs={6}>
        <SIS 
          pol={props.pol} 
          sis="2"
        />
      </Grid>
      <Grid item xs={6}><LNA pol={props.pol} lna="1"/></Grid>
      <Grid item xs={6}><LNA pol={props.pol} lna="2"/></Grid>
    </Grid>
  )
}

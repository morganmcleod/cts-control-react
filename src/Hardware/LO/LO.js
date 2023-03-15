import React from "react";

import {Grid, Typography} from '@mui/material';

import '../../components.css'
import AMC from './AMC'
import YTO from './YTO'
import PLL from './PLL'
import PA from './PA'

export default function LO(props) {
  return (
    <Grid container sx={{border:1}}>
      <Grid item xs={6} sx={{borderRight:1}} textAlign="center"><Typography variant="h6">Local Oscillator</Typography></Grid>
      <Grid item xs={6} textAlign="center"><Typography variant="h6">RF Source</Typography></Grid>
      
      <Grid item xs={3}><PLL isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1}}><YTO isRfSource={false}/></Grid>
      
      <Grid item xs={3}><PLL isRfSource={true}/></Grid>      
      <Grid item xs={3}><YTO isRfSource={true}/></Grid>
      
      <Grid item xs={6} sx={{borderRight:1}}><br/></Grid>
      <Grid item xs={6}><br/></Grid>
      <Grid item xs={3}><AMC isRfSource={false}/></Grid>
      <Grid item xs={3} sx={{borderRight:1}}><PA isRfSource={false}/></Grid>          
      
      <Grid item xs={3}><AMC isRfSource={true}/></Grid>
      <Grid item xs={3}><PA isRfSource={true}/></Grid>                
    </Grid>
  );
}
